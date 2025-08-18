/**
 * @fileoverview Unit tests for insights creation functionality
 * Tests the addInsight server action including validation, slug generation,
 * image processing, and database operations.
 */

import { jest } from '@jest/globals';
import { addInsight } from '@/actions/admin/add-insight-action';
import { db } from '@/db/drizzle';
import { insightTable } from '@/db/schema/insight-table';
import { getSession } from '@/actions/auth-session';
import { processHtmlForStorage } from '@/lib/process-html-for-storage';
import { processInsightImage } from '@/lib/insights-image-utils';
import { revalidateTag } from 'next/cache';
import { createId } from '@paralleldrive/cuid2';
import slugify from 'slugify';

// Mock external dependencies
jest.mock('@/db/drizzle', () => ({
  db: {
    insert: jest.fn(),
  },
}));

jest.mock('@/db/schema/insight-table', () => ({
  insightTable: {
    values: jest.fn(),
  },
}));

jest.mock('@/actions/auth-session');
jest.mock('@/lib/process-html-for-storage');
jest.mock('@/lib/insights-image-utils');
jest.mock('next/cache');
jest.mock('@paralleldrive/cuid2');
jest.mock('slugify');

// Type the mocked functions
const mockDb = db as jest.Mocked<typeof db>;
const mockGetSession = getSession as jest.MockedFunction<typeof getSession>;
const mockProcessHtmlForStorage = processHtmlForStorage as jest.MockedFunction<typeof processHtmlForStorage>;
const mockProcessInsightImage = processInsightImage as jest.MockedFunction<typeof processInsightImage>;
const mockRevalidateTag = revalidateTag as jest.MockedFunction<typeof revalidateTag>;
const mockCreateId = createId as jest.MockedFunction<typeof createId>;
const mockSlugify = slugify as jest.MockedFunction<typeof slugify>;

describe('Insights Creation Tests', () => {
  // Test data
  const mockSession = {
    user: { id: 'user-123', email: 'test@example.com' },
  };

  const mockInsightId = 'insight-123';
  const mockSlug = 'test-insight-title';

  const validInsightData = {
    title: 'Test Insight Title',
    metaTitle: 'Test Meta Title',
    metaDescription: 'Test meta description for SEO',
    publishedAt: '2025-08-18T10:00:00.000Z',
    authorId: 'author-123',
    altText: 'Test image alt text',
    coverUrl: 'https://example.com/test-image.jpg',
    content: '<p>This is test insight content with <strong>formatting</strong>.</p>',
  };

  const mockDbResult = [{
    id: mockInsightId,
    slug: mockSlug,
    ...validInsightData,
    createdAt: '2025-08-18T10:00:00.000Z',
    updatedAt: '2025-08-18T10:00:00.000Z',
  }];

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Initialize mocks if needed
    if (!mockCreateId.mockReturnValue) {
      Object.assign(mockCreateId, jest.fn());
    }
    if (!mockSlugify.mockReturnValue) {
      Object.assign(mockSlugify, jest.fn());
    }
    if (!mockProcessHtmlForStorage.mockResolvedValue) {
      Object.assign(mockProcessHtmlForStorage, jest.fn());
    }
    if (!mockProcessInsightImage.mockResolvedValue) {
      Object.assign(mockProcessInsightImage, jest.fn());
    }
    
    // Default mock implementations
    mockGetSession.mockResolvedValue(mockSession);
    mockCreateId.mockReturnValue(mockInsightId);
    mockSlugify.mockReturnValue(mockSlug);
    mockProcessHtmlForStorage.mockResolvedValue('<p>Processed HTML content</p>');
    mockProcessInsightImage.mockResolvedValue('https://cdn.example.com/processed-image.webp');
    
    // Mock database operations
    const mockInsert = jest.fn().mockReturnValue({
      values: jest.fn().mockReturnValue({
        returning: jest.fn().mockResolvedValue(mockDbResult),
      }),
    });
    mockDb.insert.mockReturnValue(mockInsert as any);
  });

  describe('Authentication and Authorization', () => {
    test('should fail when user is not authenticated', async () => {
      mockGetSession.mockResolvedValue(null);

      const result = await addInsight(validInsightData);

      expect(result).toEqual({
        success: false,
        error: 'Please log in or your session to access resource.',
        data: null,
      });
      expect(mockDb.insert).not.toHaveBeenCalled();
    });

    test('should proceed when user is authenticated', async () => {
      const result = await addInsight(validInsightData);

      expect(result.success).toBe(true);
      expect(mockGetSession).toHaveBeenCalledTimes(1);
    });
  });

  describe('Input Validation', () => {
    test('should fail when title is missing', async () => {
      const invalidData = { ...validInsightData, title: '' };

      const result = await addInsight(invalidData);

      expect(result).toEqual({
        success: false,
        error: 'Please provide title and content.',
        data: null,
      });
    });

    test('should fail when content is missing', async () => {
      const invalidData = { ...validInsightData, content: '' };

      const result = await addInsight(invalidData);

      expect(result).toEqual({
        success: false,
        error: 'Please provide title and content.',
        data: null,
      });
    });

    test('should fail when cover URL is missing', async () => {
      const invalidData = { ...validInsightData, coverUrl: undefined };

      const result = await addInsight(invalidData);

      expect(result).toEqual({
        success: false,
        error: 'Please provide a cover image.',
        data: null,
      });
    });

    test('should accept valid input data', async () => {
      const result = await addInsight(validInsightData);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockDbResult[0]);
    });
  });

  describe('Slug Generation', () => {
    test('should generate slug from title', async () => {
      await addInsight(validInsightData);

      expect(mockSlugify).toHaveBeenCalledWith('Test Insight Title', {
        lower: true,
        strict: true,
      });
    });

    test('should use generated slug in database insertion', async () => {
      await addInsight(validInsightData);

      const insertCall = mockDb.insert.mock.calls[0];
      expect(insertCall[0]).toBe(insightTable);
      
      const valuesCall = mockDb.insert().values.mock.calls[0][0];
      expect(valuesCall.slug).toBe(mockSlug);
    });

    test('should handle special characters in title', async () => {
      const specialTitleData = {
        ...validInsightData,
        title: 'Test Insight with "Special" Characters & Symbols!',
      };

      mockSlugify.mockReturnValue('test-insight-with-special-characters-symbols');
      
      await addInsight(specialTitleData);

      expect(mockSlugify).toHaveBeenCalledWith(
        'Test Insight with "Special" Characters & Symbols!',
        { lower: true, strict: true }
      );
    });
  });

  describe('Content Processing', () => {
    test('should process HTML content for storage', async () => {
      await addInsight(validInsightData);

      expect(mockProcessHtmlForStorage).toHaveBeenCalledWith(
        '<p>This is test insight content with <strong>formatting</strong>.</p>'
      );
    });

    test('should use processed content in database insertion', async () => {
      const processedContent = '<p>Sanitized and processed content</p>';
      mockProcessHtmlForStorage.mockResolvedValue(processedContent);

      await addInsight(validInsightData);

      const valuesCall = mockDb.insert().values.mock.calls[0][0];
      expect(valuesCall.content).toBe(processedContent);
    });

    test('should handle empty content processing', async () => {
      const dataWithoutContent = { ...validInsightData, content: '' };
      mockProcessHtmlForStorage.mockResolvedValue('');

      const result = await addInsight(dataWithoutContent);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Please provide title and content.');
    });
  });

  describe('Image Processing', () => {
    test('should process cover image', async () => {
      await addInsight(validInsightData);

      expect(mockProcessInsightImage).toHaveBeenCalledWith(
        'https://example.com/test-image.jpg',
        { quality: 80 }
      );
    });

    test('should use processed image URL in database insertion', async () => {
      const processedImageUrl = 'https://cdn.example.com/optimized-image.webp';
      mockProcessInsightImage.mockResolvedValue(processedImageUrl);

      await addInsight(validInsightData);

      const valuesCall = mockDb.insert().values.mock.calls[0][0];
      expect(valuesCall.coverUrl).toBe(processedImageUrl);
    });

    test('should fallback to original URL when image processing fails', async () => {
      const mockError = new Error('Image processing failed');
      mockProcessInsightImage.mockRejectedValue(mockError);

      // Mock fallback database insertion
      const fallbackResult = [{
        ...mockDbResult[0],
        coverUrl: validInsightData.coverUrl, // Original URL
      }];
      
      const mockInsert = jest.fn().mockReturnValue({
        values: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValue(fallbackResult),
        }),
      });
      mockDb.insert.mockReturnValue(mockInsert as any);

      const result = await addInsight(validInsightData);

      expect(result.success).toBe(true);
      expect(result.data?.coverUrl).toBe(validInsightData.coverUrl);
    });

    test('should handle specific image processing errors', async () => {
      const { ImageProcessingError } = await import('@/lib/insights-image-utils');
      const mockError = new ImageProcessingError('Invalid image format');
      mockProcessInsightImage.mockRejectedValue(mockError);

      const result = await addInsight(validInsightData);

      expect(result).toEqual({
        success: false,
        error: 'Image processing failed: Invalid image format',
        data: null,
      });
    });
  });

  describe('Database Operations', () => {
    test('should insert insight with correct data structure', async () => {
      await addInsight(validInsightData);

      expect(mockDb.insert).toHaveBeenCalledWith(insightTable);
      
      const valuesCall = mockDb.insert().values.mock.calls[0][0];
      expect(valuesCall).toMatchObject({
        id: mockInsightId,
        slug: mockSlug,
        title: validInsightData.title,
        metaTitle: validInsightData.metaTitle,
        authorId: validInsightData.authorId,
        publishedAt: validInsightData.publishedAt,
        metaDescription: validInsightData.metaDescription,
        altText: validInsightData.altText,
      });
    });

    test('should generate unique ID for each insight', async () => {
      await addInsight(validInsightData);

      expect(mockCreateId).toHaveBeenCalledTimes(1);
      
      const valuesCall = mockDb.insert().values.mock.calls[0][0];
      expect(valuesCall.id).toBe(mockInsightId);
    });

    test('should return the inserted insight data', async () => {
      const result = await addInsight(validInsightData);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockDbResult[0]);
    });

    test('should handle database insertion errors', async () => {
      const dbError = new Error('Database connection failed');
      const mockInsert = jest.fn().mockReturnValue({
        values: jest.fn().mockReturnValue({
          returning: jest.fn().mockRejectedValue(dbError),
        }),
      });
      mockDb.insert.mockReturnValue(mockInsert as any);

      const result = await addInsight(validInsightData);

      expect(result).toEqual({
        success: false,
        error: 'Database connection failed',
        data: null,
      });
    });
  });

  describe('Cache Invalidation', () => {
    test('should revalidate all relevant cache tags', async () => {
      await addInsight(validInsightData);

      expect(mockRevalidateTag).toHaveBeenCalledWith('admin-insights');
      expect(mockRevalidateTag).toHaveBeenCalledWith('insights');
      expect(mockRevalidateTag).toHaveBeenCalledWith('insights-list');
      expect(mockRevalidateTag).toHaveBeenCalledTimes(3);
    });

    test('should revalidate cache even when image processing fails but insight is saved', async () => {
      const mockError = new Error('Image processing failed');
      mockProcessInsightImage.mockRejectedValue(mockError);

      // Mock fallback database insertion
      const mockInsert = jest.fn().mockReturnValue({
        values: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValue(mockDbResult),
        }),
      });
      mockDb.insert.mockReturnValue(mockInsert as any);

      await addInsight(validInsightData);

      expect(mockRevalidateTag).toHaveBeenCalledWith('admin-insights');
      expect(mockRevalidateTag).toHaveBeenCalledWith('insights');
      expect(mockRevalidateTag).toHaveBeenCalledWith('insights-list');
    });
  });

  describe('Error Handling', () => {
    test('should handle unexpected errors gracefully', async () => {
      const unexpectedError = new Error('Unexpected system error');
      mockProcessHtmlForStorage.mockRejectedValue(unexpectedError);

      const result = await addInsight(validInsightData);

      expect(result).toEqual({
        success: false,
        error: 'Unexpected system error',
        data: null,
      });
    });

    test('should log errors for debugging', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      const testError = new Error('Test error for logging');
      mockProcessHtmlForStorage.mockRejectedValue(testError);

      await addInsight(validInsightData);

      expect(consoleSpy).toHaveBeenCalledWith('Error adding insight:', testError);
      
      consoleSpy.mockRestore();
    });

    test('should handle non-Error objects thrown', async () => {
      mockProcessHtmlForStorage.mockRejectedValue('String error');

      const result = await addInsight(validInsightData);

      expect(result).toEqual({
        success: false,
        error: 'An unknown error occurred',
        data: null,
      });
    });
  });

  describe('Optional Fields', () => {
    test('should handle insight creation with minimal required fields', async () => {
      const minimalData = {
        title: 'Minimal Insight',
        content: '<p>Minimal content</p>',
        coverUrl: 'https://example.com/image.jpg',
      };

      const result = await addInsight(minimalData);

      expect(result.success).toBe(true);
      
      const valuesCall = mockDb.insert().values.mock.calls[0][0];
      expect(valuesCall.title).toBe('Minimal Insight');
      expect(valuesCall.metaTitle).toBeUndefined();
      expect(valuesCall.authorId).toBeUndefined();
    });

    test('should handle all optional fields when provided', async () => {
      const result = await addInsight(validInsightData);

      expect(result.success).toBe(true);
      
      const valuesCall = mockDb.insert().values.mock.calls[0][0];
      expect(valuesCall.metaTitle).toBe(validInsightData.metaTitle);
      expect(valuesCall.metaDescription).toBe(validInsightData.metaDescription);
      expect(valuesCall.authorId).toBe(validInsightData.authorId);
      expect(valuesCall.altText).toBe(validInsightData.altText);
    });
  });

  describe('Data Types and Formats', () => {
    test('should handle date string for publishedAt', async () => {
      const isoDateString = '2025-08-18T14:30:00.000Z';
      const dataWithDate = { ...validInsightData, publishedAt: isoDateString };

      await addInsight(dataWithDate);

      const valuesCall = mockDb.insert().values.mock.calls[0][0];
      expect(valuesCall.publishedAt).toBe(isoDateString);
    });

    test('should handle undefined publishedAt', async () => {
      const dataWithoutDate = { ...validInsightData, publishedAt: undefined };

      await addInsight(dataWithoutDate);

      const valuesCall = mockDb.insert().values.mock.calls[0][0];
      expect(valuesCall.publishedAt).toBeUndefined();
    });

    test('should handle long content', async () => {
      const longContent = '<p>' + 'A'.repeat(10000) + '</p>';
      const dataWithLongContent = { ...validInsightData, content: longContent };

      mockProcessHtmlForStorage.mockResolvedValue(longContent);

      const result = await addInsight(dataWithLongContent);

      expect(result.success).toBe(true);
      expect(mockProcessHtmlForStorage).toHaveBeenCalledWith(longContent);
    });
  });

  describe('Edge Cases', () => {
    test('should handle empty string for optional fields', async () => {
      const dataWithEmptyStrings = {
        ...validInsightData,
        metaTitle: '',
        metaDescription: '',
        altText: '',
      };

      await addInsight(dataWithEmptyStrings);

      const valuesCall = mockDb.insert().values.mock.calls[0][0];
      expect(valuesCall.metaTitle).toBe('');
      expect(valuesCall.metaDescription).toBe('');
      expect(valuesCall.altText).toBe('');
    });

    test('should handle special characters in all text fields', async () => {
      const specialCharsData = {
        title: 'Title with émojis 🚀 and spëcial chars',
        metaTitle: 'Meta with "quotes" & ampersands',
        metaDescription: 'Description with <tags> and symbols @#$%',
        content: '<p>Content with <script>alert("xss")</script> and émojis 🎉</p>',
        altText: 'Alt text with quotes "and" apostrophes\'',
        coverUrl: 'https://example.com/image-with-special-chars.jpg',
      };

      mockSlugify.mockReturnValue('title-with-emojis-and-special-chars');

      const result = await addInsight(specialCharsData);

      expect(result.success).toBe(true);
      expect(mockProcessHtmlForStorage).toHaveBeenCalledWith(specialCharsData.content);
    });
  });
});
