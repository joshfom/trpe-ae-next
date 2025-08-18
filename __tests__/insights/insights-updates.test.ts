/**
 * @fileoverview Unit tests for insights update functionality
 * Tests the updateInsight server action including partial updates, image replacement,
 * content processing, validation, and error handling.
 */

import { jest } from '@jest/globals';
import { updateInsight } from '@/actions/admin/update-insight-action';
import { db } from '@/db/drizzle';
import { insightTable } from '@/db/schema/insight-table';
import { getSession } from '@/actions/auth-session';
import { processHtmlForStorage } from '@/lib/process-html-for-storage';
import { processInsightImage, ImageProcessingError, ImageFetchError } from '@/lib/insights-image-utils';
import { revalidateTag } from 'next/cache';
import { eq } from 'drizzle-orm';

// Mock external dependencies
jest.mock('@/db/drizzle', () => ({
  db: {
    query: {
      insightTable: {
        findFirst: jest.fn(),
      },
    },
    update: jest.fn(),
  },
}));

jest.mock('@/db/schema/insight-table', () => ({
  insightTable: {
    slug: 'insights.slug',
  },
}));

jest.mock('@/actions/auth-session');
jest.mock('@/lib/process-html-for-storage');
jest.mock('@/lib/insights-image-utils');
jest.mock('next/cache');
jest.mock('drizzle-orm');

// Type the mocked functions
const mockDb = db as jest.Mocked<typeof db>;
const mockGetSession = getSession as jest.MockedFunction<typeof getSession>;
const mockProcessHtmlForStorage = processHtmlForStorage as jest.MockedFunction<typeof processHtmlForStorage>;
const mockProcessInsightImage = processInsightImage as jest.MockedFunction<typeof processInsightImage>;
const mockRevalidateTag = revalidateTag as jest.MockedFunction<typeof revalidateTag>;
const mockEq = eq as jest.MockedFunction<typeof eq>;

describe('Insights Update Tests', () => {
  // Test data
  const mockSession = {
    user: { id: 'user-123', email: 'test@example.com' },
  };

  const existingInsight = {
    id: 'insight-123',
    slug: 'existing-insight',
    title: 'Existing Insight Title',
    metaTitle: 'Existing Meta Title',
    metaDescription: 'Existing meta description',
    publishedAt: '2025-08-17T10:00:00.000Z',
    authorId: 'author-123',
    altText: 'Existing alt text',
    coverUrl: 'https://example.com/existing-image.jpg',
    content: '<p>Existing insight content</p>',
    isLuxe: false,
    createdAt: '2025-08-17T10:00:00.000Z',
    updatedAt: '2025-08-17T10:00:00.000Z',
  };

  const updateData = {
    title: 'Updated Insight Title',
    metaTitle: 'Updated Meta Title',
    metaDescription: 'Updated meta description',
    publishedAt: '2025-08-18T10:00:00.000Z',
    authorId: 'author-456',
    altText: 'Updated alt text',
    coverUrl: 'https://example.com/new-image.jpg',
    content: '<p>Updated insight content with <strong>formatting</strong></p>',
    isLuxe: true,
  };

  const updatedInsight = {
    ...existingInsight,
    ...updateData,
    updatedAt: '2025-08-18T10:00:00.000Z',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Initialize mockDb.query structure if not exists
    if (!mockDb.query) {
      mockDb.query = {};
    }
    if (!mockDb.query.insightTable) {
      mockDb.query.insightTable = {
        findMany: jest.fn(),
        findFirst: jest.fn(),
      };
    }
    
    // Initialize mocks if needed
    if (!mockProcessHtmlForStorage.mockResolvedValue) {
      Object.assign(mockProcessHtmlForStorage, jest.fn());
    }
    if (!mockProcessInsightImage.mockResolvedValue) {
      Object.assign(mockProcessInsightImage, jest.fn());
    }
    if (!mockEq.mockReturnValue) {
      Object.assign(mockEq, jest.fn());
    }
    
    // Default mock implementations
    mockGetSession.mockResolvedValue(mockSession);
    mockDb.query.insightTable.findFirst.mockResolvedValue(existingInsight);
    mockProcessHtmlForStorage.mockResolvedValue('<p>Processed updated content</p>');
    mockProcessInsightImage.mockResolvedValue('https://cdn.example.com/processed-new-image.webp');
    mockEq.mockReturnValue('EQ_CONDITION' as any);
    
    // Mock database update operations
    const mockUpdate = jest.fn().mockReturnValue({
      set: jest.fn().mockReturnValue({
        where: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValue([updatedInsight]),
        }),
      }),
    });
    mockDb.update.mockReturnValue(mockUpdate as any);

    // Mock Date constructor for consistent timestamps
    jest.spyOn(global.Date.prototype, 'toISOString').mockReturnValue('2025-08-18T10:00:00.000Z');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Authentication and Authorization', () => {
    test('should fail when user is not authenticated', async () => {
      mockGetSession.mockResolvedValue(null);

      const result = await updateInsight('existing-insight', updateData);

      expect(result).toEqual({
        success: false,
        error: 'Please log in or your session to access resource.',
        data: null,
      });
      expect(mockDb.query.insightTable.findFirst).not.toHaveBeenCalled();
    });

    test('should proceed when user is authenticated', async () => {
      const result = await updateInsight('existing-insight', updateData);

      expect(result.success).toBe(true);
      expect(mockGetSession).toHaveBeenCalledTimes(1);
    });
  });

  describe('Input Validation', () => {
    test('should fail when insight slug is missing', async () => {
      const result = await updateInsight('', updateData);

      expect(result).toEqual({
        success: false,
        error: 'Insight slug is required',
      });
    });

    test('should fail when insight does not exist', async () => {
      mockDb.query.insightTable.findFirst.mockResolvedValue(null);

      const result = await updateInsight('non-existent-slug', updateData);

      expect(result).toEqual({
        success: false,
        error: 'Insight not found',
        data: null,
      });
    });

    test('should verify insight exists before updating', async () => {
      await updateInsight('existing-insight', updateData);

      expect(mockDb.query.insightTable.findFirst).toHaveBeenCalledWith({
        where: 'EQ_CONDITION',
      });
      expect(mockEq).toHaveBeenCalledWith(insightTable.slug, 'existing-insight');
    });
  });

  describe('Partial Updates', () => {
    test('should update only title', async () => {
      const partialUpdate = { title: 'New Title Only' };

      const result = await updateInsight('existing-insight', partialUpdate);

      expect(result.success).toBe(true);
      
      const updateCall = mockDb.update().set.mock.calls[0][0];
      expect(updateCall.title).toBe('New Title Only');
      expect(updateCall.metaTitle).toBe(existingInsight.metaTitle); // Should keep existing
      expect(updateCall.content).toBe(existingInsight.content); // Should keep existing
    });

    test('should update only meta fields', async () => {
      const partialUpdate = { 
        metaTitle: 'New Meta Title',
        metaDescription: 'New Meta Description',
      };

      const result = await updateInsight('existing-insight', partialUpdate);

      expect(result.success).toBe(true);
      
      const updateCall = mockDb.update().set.mock.calls[0][0];
      expect(updateCall.metaTitle).toBe('New Meta Title');
      expect(updateCall.metaDescription).toBe('New Meta Description');
      expect(updateCall.title).toBe(existingInsight.title); // Should keep existing
    });

    test('should update only content', async () => {
      const partialUpdate = { content: '<p>New content only</p>' };
      mockProcessHtmlForStorage.mockResolvedValue('<p>Processed new content</p>');

      const result = await updateInsight('existing-insight', partialUpdate);

      expect(result.success).toBe(true);
      expect(mockProcessHtmlForStorage).toHaveBeenCalledWith('<p>New content only</p>');
      
      const updateCall = mockDb.update().set.mock.calls[0][0];
      expect(updateCall.content).toBe('<p>Processed new content</p>');
      expect(updateCall.title).toBe(existingInsight.title); // Should keep existing
    });

    test('should handle undefined values gracefully', async () => {
      const partialUpdate = { 
        title: 'New Title',
        metaTitle: undefined,
        content: undefined,
      };

      const result = await updateInsight('existing-insight', partialUpdate);

      expect(result.success).toBe(true);
      
      const updateCall = mockDb.update().set.mock.calls[0][0];
      expect(updateCall.title).toBe('New Title');
      expect(updateCall.metaTitle).toBe(existingInsight.metaTitle); // Should keep existing
      expect(updateCall.content).toBe(existingInsight.content); // Should keep existing
    });
  });

  describe('Content Processing', () => {
    test('should process HTML content when provided', async () => {
      const contentUpdate = { content: '<p>New <strong>formatted</strong> content</p>' };

      await updateInsight('existing-insight', contentUpdate);

      expect(mockProcessHtmlForStorage).toHaveBeenCalledWith(
        '<p>New <strong>formatted</strong> content</p>'
      );
    });

    test('should skip content processing when not provided', async () => {
      const nonContentUpdate = { title: 'Just title update' };

      await updateInsight('existing-insight', nonContentUpdate);

      expect(mockProcessHtmlForStorage).not.toHaveBeenCalled();
    });

    test('should use processed content in database update', async () => {
      const processedContent = '<p>Sanitized and processed content</p>';
      mockProcessHtmlForStorage.mockResolvedValue(processedContent);
      
      const contentUpdate = { content: '<p>Raw content</p>' };

      await updateInsight('existing-insight', contentUpdate);

      const updateCall = mockDb.update().set.mock.calls[0][0];
      expect(updateCall.content).toBe(processedContent);
    });

    test('should handle content processing errors', async () => {
      const processingError = new Error('Content processing failed');
      mockProcessHtmlForStorage.mockRejectedValue(processingError);
      
      const contentUpdate = { content: '<p>Content that fails processing</p>' };

      const result = await updateInsight('existing-insight', contentUpdate);

      expect(result).toEqual({
        success: false,
        error: 'Content processing failed',
      });
    });
  });

  describe('Image Processing', () => {
    test('should process new cover image', async () => {
      const imageUpdate = { coverUrl: 'https://example.com/new-image.jpg' };

      await updateInsight('existing-insight', imageUpdate);

      expect(mockProcessInsightImage).toHaveBeenCalledWith(
        'https://example.com/new-image.jpg',
        { quality: 80 }
      );
    });

    test('should skip image processing when URL unchanged', async () => {
      const sameImageUpdate = { coverUrl: existingInsight.coverUrl };

      await updateInsight('existing-insight', sameImageUpdate);

      expect(mockProcessInsightImage).not.toHaveBeenCalled();
    });

    test('should skip image processing when no coverUrl provided', async () => {
      const noImageUpdate = { title: 'No image update' };

      await updateInsight('existing-insight', noImageUpdate);

      expect(mockProcessInsightImage).not.toHaveBeenCalled();
    });

    test('should use processed image URL in database update', async () => {
      const processedImageUrl = 'https://cdn.example.com/optimized-new-image.webp';
      mockProcessInsightImage.mockResolvedValue(processedImageUrl);
      
      const imageUpdate = { coverUrl: 'https://example.com/new-image.jpg' };

      await updateInsight('existing-insight', imageUpdate);

      const updateCall = mockDb.update().set.mock.calls[0][0];
      expect(updateCall.coverUrl).toBe(processedImageUrl);
    });

    test('should fallback to original URL when image processing fails', async () => {
      const processingError = new ImageProcessingError('Image processing failed');
      mockProcessInsightImage.mockRejectedValue(processingError);
      
      const imageUpdate = { coverUrl: 'https://example.com/new-image.jpg' };

      const result = await updateInsight('existing-insight', imageUpdate);

      expect(result.success).toBe(true);
      
      const updateCall = mockDb.update().set.mock.calls[0][0];
      expect(updateCall.coverUrl).toBe('https://example.com/new-image.jpg'); // Original URL
    });

    test('should handle image fetch errors gracefully', async () => {
      const fetchError = new ImageFetchError('Failed to fetch image');
      mockProcessInsightImage.mockRejectedValue(fetchError);
      
      const imageUpdate = { coverUrl: 'https://example.com/unreachable-image.jpg' };

      const result = await updateInsight('existing-insight', imageUpdate);

      expect(result.success).toBe(true);
      
      const updateCall = mockDb.update().set.mock.calls[0][0];
      expect(updateCall.coverUrl).toBe('https://example.com/unreachable-image.jpg');
    });

    test('should rethrow non-image processing errors', async () => {
      const systemError = new Error('System error');
      mockProcessInsightImage.mockRejectedValue(systemError);
      
      const imageUpdate = { coverUrl: 'https://example.com/new-image.jpg' };

      const result = await updateInsight('existing-insight', imageUpdate);

      expect(result).toEqual({
        success: false,
        error: 'System error',
      });
    });
  });

  describe('Database Operations', () => {
    test('should update insight with correct data structure', async () => {
      await updateInsight('existing-insight', updateData);

      expect(mockDb.update).toHaveBeenCalledWith(insightTable);
      
      const updateCall = mockDb.update().set.mock.calls[0][0];
      expect(updateCall).toMatchObject({
        title: updateData.title,
        metaTitle: updateData.metaTitle,
        metaDescription: updateData.metaDescription,
        publishedAt: updateData.publishedAt,
        authorId: updateData.authorId,
        altText: updateData.altText,
        isLuxe: updateData.isLuxe,
        updatedAt: '2025-08-18T10:00:00.000Z',
      });
    });

    test('should use correct where condition', async () => {
      await updateInsight('existing-insight', updateData);

      const whereCall = mockDb.update().set().where.mock.calls[0][0];
      expect(whereCall).toBe('EQ_CONDITION');
      expect(mockEq).toHaveBeenCalledWith(insightTable.slug, 'existing-insight');
    });

    test('should return updated insight data', async () => {
      const result = await updateInsight('existing-insight', updateData);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(updatedInsight);
    });

    test('should handle database update errors', async () => {
      const dbError = new Error('Database update failed');
      const mockUpdate = jest.fn().mockReturnValue({
        set: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            returning: jest.fn().mockRejectedValue(dbError),
          }),
        }),
      });
      mockDb.update.mockReturnValue(mockUpdate as any);

      const result = await updateInsight('existing-insight', updateData);

      expect(result).toEqual({
        success: false,
        error: 'Database update failed',
      });
    });

    test('should update timestamp automatically', async () => {
      await updateInsight('existing-insight', updateData);

      const updateCall = mockDb.update().set.mock.calls[0][0];
      expect(updateCall.updatedAt).toBe('2025-08-18T10:00:00.000Z');
    });
  });

  describe('Cache Invalidation', () => {
    test('should revalidate all relevant cache tags', async () => {
      await updateInsight('existing-insight', updateData);

      expect(mockRevalidateTag).toHaveBeenCalledWith('admin-insights');
      expect(mockRevalidateTag).toHaveBeenCalledWith('insights');
      expect(mockRevalidateTag).toHaveBeenCalledWith('insights-list');
      expect(mockRevalidateTag).toHaveBeenCalledTimes(3);
    });

    test('should revalidate cache even on partial updates', async () => {
      const partialUpdate = { title: 'Partial update' };

      await updateInsight('existing-insight', partialUpdate);

      expect(mockRevalidateTag).toHaveBeenCalledWith('admin-insights');
      expect(mockRevalidateTag).toHaveBeenCalledWith('insights');
      expect(mockRevalidateTag).toHaveBeenCalledWith('insights-list');
    });
  });

  describe('Boolean Field Updates', () => {
    test('should update isLuxe to true', async () => {
      const luxeUpdate = { isLuxe: true };

      await updateInsight('existing-insight', luxeUpdate);

      const updateCall = mockDb.update().set.mock.calls[0][0];
      expect(updateCall.isLuxe).toBe(true);
    });

    test('should update isLuxe to false', async () => {
      const existingLuxeInsight = { ...existingInsight, isLuxe: true };
      mockDb.query.insightTable.findFirst.mockResolvedValue(existingLuxeInsight);
      
      const nonLuxeUpdate = { isLuxe: false };

      await updateInsight('existing-insight', nonLuxeUpdate);

      const updateCall = mockDb.update().set.mock.calls[0][0];
      expect(updateCall.isLuxe).toBe(false);
    });

    test('should handle undefined isLuxe field', async () => {
      const updateWithoutLuxe = { title: 'No luxe field' };

      await updateInsight('existing-insight', updateWithoutLuxe);

      const updateCall = mockDb.update().set.mock.calls[0][0];
      expect(updateCall.isLuxe).toBe(existingInsight.isLuxe); // Should keep existing
    });
  });

  describe('Error Handling', () => {
    test('should handle unexpected errors gracefully', async () => {
      const unexpectedError = new Error('Unexpected system error');
      mockDb.query.insightTable.findFirst.mockRejectedValue(unexpectedError);

      const result = await updateInsight('existing-insight', updateData);

      expect(result).toEqual({
        success: false,
        error: 'Unexpected system error',
      });
    });

    test('should log errors for debugging', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      const testError = new Error('Test error for logging');
      mockDb.query.insightTable.findFirst.mockRejectedValue(testError);

      await updateInsight('existing-insight', updateData);

      expect(consoleSpy).toHaveBeenCalledWith('Error updating insight:', testError);
      
      consoleSpy.mockRestore();
    });

    test('should handle non-Error objects thrown', async () => {
      mockDb.query.insightTable.findFirst.mockRejectedValue('String error');

      const result = await updateInsight('existing-insight', updateData);

      expect(result).toEqual({
        success: false,
        error: 'An unknown error occurred',
      });
    });
  });

  describe('Edge Cases', () => {
    test('should handle empty update data', async () => {
      const result = await updateInsight('existing-insight', {});

      expect(result.success).toBe(true);
      
      const updateCall = mockDb.update().set.mock.calls[0][0];
      expect(updateCall.title).toBe(existingInsight.title);
      expect(updateCall.content).toBe(existingInsight.content);
      expect(updateCall.updatedAt).toBe('2025-08-18T10:00:00.000Z'); // Should still update timestamp
    });

    test('should handle null values in update data', async () => {
      const nullUpdate = { 
        title: 'New Title',
        metaTitle: null as any,
        altText: null as any,
      };

      const result = await updateInsight('existing-insight', nullUpdate);

      expect(result.success).toBe(true);
      
      const updateCall = mockDb.update().set.mock.calls[0][0];
      expect(updateCall.title).toBe('New Title');
      expect(updateCall.metaTitle).toBe(existingInsight.metaTitle); // Should keep existing for null
      expect(updateCall.altText).toBe(existingInsight.altText); // Should keep existing for null
    });

    test('should handle very long field values', async () => {
      const longUpdate = {
        title: 'A'.repeat(1000),
        content: '<p>' + 'B'.repeat(10000) + '</p>',
        metaDescription: 'C'.repeat(500),
      };

      mockProcessHtmlForStorage.mockResolvedValue(longUpdate.content);

      const result = await updateInsight('existing-insight', longUpdate);

      expect(result.success).toBe(true);
      expect(mockProcessHtmlForStorage).toHaveBeenCalledWith(longUpdate.content);
    });

    test('should handle special characters in all fields', async () => {
      const specialCharsUpdate = {
        title: 'Title with émojis 🚀 and spëcial chars',
        metaTitle: 'Meta with "quotes" & ampersands',
        metaDescription: 'Description with <tags> and symbols @#$%',
        content: '<p>Content with émojis 🎉 and special chars</p>',
        altText: 'Alt text with quotes "and" apostrophes\'',
      };

      const result = await updateInsight('existing-insight', specialCharsUpdate);

      expect(result.success).toBe(true);
      expect(mockProcessHtmlForStorage).toHaveBeenCalledWith(specialCharsUpdate.content);
    });
  });

  describe('Full Update Scenarios', () => {
    test('should handle complete insight update', async () => {
      const result = await updateInsight('existing-insight', updateData);

      expect(result.success).toBe(true);
      expect(result.data).toMatchObject({
        ...updateData,
        id: existingInsight.id,
        slug: existingInsight.slug,
        updatedAt: '2025-08-18T10:00:00.000Z',
      });
    });

    test('should preserve fields not in update data', async () => {
      const partialUpdate = { 
        title: 'New Title',
        content: '<p>New content</p>',
      };

      await updateInsight('existing-insight', partialUpdate);

      const updateCall = mockDb.update().set.mock.calls[0][0];
      expect(updateCall.title).toBe('New Title');
      expect(updateCall.authorId).toBe(existingInsight.authorId); // Should preserve
      expect(updateCall.publishedAt).toBe(existingInsight.publishedAt); // Should preserve
      expect(updateCall.isLuxe).toBe(existingInsight.isLuxe); // Should preserve
    });
  });
});
