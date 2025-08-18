/**
 * @fileoverview Unit tests for insights deletion functionality
 * Tests the deleteInsight server action including cascade operations,
 * image cleanup from S3, validation, and error handling.
 */

import { jest } from '@jest/globals';
import { deleteInsight } from '@/actions/admin/delete-insight-action';
import { db } from '@/db/drizzle';
import { insightTable } from '@/db/schema/insight-table';
import { getSession } from '@/actions/auth-session';
import { s3Service } from '@/lib/s3Service';
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
    delete: jest.fn(),
  },
}));

jest.mock('@/db/schema/insight-table', () => ({
  insightTable: {
    slug: 'insights.slug',
  },
}));

jest.mock('@/actions/auth-session');
jest.mock('@/lib/s3Service', () => ({
  s3Service: {
    deleteFile: jest.fn(),
  },
}));
jest.mock('next/cache');
jest.mock('drizzle-orm');

// Type the mocked functions
const mockDb = db as jest.Mocked<typeof db>;
const mockGetSession = getSession as jest.MockedFunction<typeof getSession>;
const mockS3Service = s3Service as jest.Mocked<typeof s3Service>;
const mockRevalidateTag = revalidateTag as jest.MockedFunction<typeof revalidateTag>;
const mockEq = eq as jest.MockedFunction<typeof eq>;

describe('Insights Deletion Tests', () => {
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

  const existingInsightWithoutImage = {
    ...existingInsight,
    coverUrl: null,
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
    if (!mockS3Service.deleteFile) {
      mockS3Service.deleteFile = jest.fn();
    }
    if (!mockEq.mockReturnValue) {
      Object.assign(mockEq, jest.fn());
    }
    
    // Default mock implementations
    mockGetSession.mockResolvedValue(mockSession);
    mockDb.query.insightTable.findFirst.mockResolvedValue(existingInsight);
    mockS3Service.deleteFile.mockResolvedValue(undefined);
    mockEq.mockReturnValue('EQ_CONDITION' as any);
    
    // Mock database delete operations
    const mockDelete = jest.fn().mockReturnValue({
      where: jest.fn().mockReturnValue({
        returning: jest.fn().mockResolvedValue([existingInsight]),
      }),
    });
    mockDb.delete.mockReturnValue(mockDelete as any);
  });

  describe('Authentication and Authorization', () => {
    test('should fail when user is not authenticated', async () => {
      mockGetSession.mockResolvedValue(null);

      const result = await deleteInsight({ slug: 'existing-insight' });

      expect(result).toEqual({
        success: false,
        error: 'Please log in or your session to access resource.',
        data: null,
      });
      expect(mockDb.query.insightTable.findFirst).not.toHaveBeenCalled();
    });

    test('should proceed when user is authenticated', async () => {
      const result = await deleteInsight({ slug: 'existing-insight' });

      expect(result.success).toBe(true);
      expect(mockGetSession).toHaveBeenCalledTimes(1);
    });
  });

  describe('Input Validation', () => {
    test('should fail when slug is missing', async () => {
      const result = await deleteInsight({ slug: '' });

      expect(result).toEqual({
        success: false,
        error: 'Insight slug is required',
      });
    });

    test('should fail when slug is null', async () => {
      const result = await deleteInsight({ slug: null as any });

      expect(result).toEqual({
        success: false,
        error: 'Insight slug is required',
      });
    });

    test('should fail when slug is undefined', async () => {
      const result = await deleteInsight({ slug: undefined as any });

      expect(result).toEqual({
        success: false,
        error: 'Insight slug is required',
      });
    });

    test('should accept valid slug', async () => {
      const result = await deleteInsight({ slug: 'existing-insight' });

      expect(result.success).toBe(true);
    });
  });

  describe('Insight Existence Validation', () => {
    test('should fail when insight does not exist', async () => {
      mockDb.query.insightTable.findFirst.mockResolvedValue(null);

      const result = await deleteInsight({ slug: 'non-existent-insight' });

      expect(result).toEqual({
        success: false,
        error: 'Insight not found',
        data: null,
      });
    });

    test('should verify insight exists before deletion', async () => {
      await deleteInsight({ slug: 'existing-insight' });

      expect(mockDb.query.insightTable.findFirst).toHaveBeenCalledWith({
        where: 'EQ_CONDITION',
      });
      expect(mockEq).toHaveBeenCalledWith(insightTable.slug, 'existing-insight');
    });

    test('should proceed when insight exists', async () => {
      const result = await deleteInsight({ slug: 'existing-insight' });

      expect(result.success).toBe(true);
      expect(result.data).toEqual(existingInsight);
    });
  });

  describe('Image Deletion from S3', () => {
    test('should delete image from S3 when coverUrl exists', async () => {
      await deleteInsight({ 
        slug: 'existing-insight', 
        coverUrl: 'https://example.com/image.jpg' 
      });

      expect(mockS3Service.deleteFile).toHaveBeenCalledWith('https://example.com/image.jpg');
    });

    test('should use insight coverUrl when provided in params', async () => {
      const customCoverUrl = 'https://example.com/custom-image.jpg';
      
      await deleteInsight({ 
        slug: 'existing-insight', 
        coverUrl: customCoverUrl 
      });

      expect(mockS3Service.deleteFile).toHaveBeenCalledWith(customCoverUrl);
    });

    test('should use insight coverUrl from database when not provided in params', async () => {
      await deleteInsight({ slug: 'existing-insight' });

      expect(mockS3Service.deleteFile).toHaveBeenCalledWith(existingInsight.coverUrl);
    });

    test('should skip image deletion when no coverUrl', async () => {
      mockDb.query.insightTable.findFirst.mockResolvedValue(existingInsightWithoutImage);

      await deleteInsight({ slug: 'existing-insight' });

      expect(mockS3Service.deleteFile).not.toHaveBeenCalled();
    });

    test('should continue deletion when S3 image deletion fails', async () => {
      const s3Error = new Error('S3 deletion failed');
      mockS3Service.deleteFile.mockRejectedValue(s3Error);

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      const result = await deleteInsight({ 
        slug: 'existing-insight', 
        coverUrl: 'https://example.com/image.jpg' 
      });

      expect(result.success).toBe(true);
      expect(result.data).toEqual(existingInsight);
      expect(consoleSpy).toHaveBeenCalledWith('Error deleting image from S3:', s3Error);
      
      consoleSpy.mockRestore();
    });

    test('should log S3 errors but not fail entire operation', async () => {
      const s3Error = new Error('S3 service unavailable');
      mockS3Service.deleteFile.mockRejectedValue(s3Error);

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      const result = await deleteInsight({ 
        slug: 'existing-insight', 
        coverUrl: 'https://example.com/image.jpg' 
      });

      expect(result.success).toBe(true);
      expect(mockDb.delete).toHaveBeenCalled(); // Database deletion should still proceed
      expect(consoleSpy).toHaveBeenCalledWith('Error deleting image from S3:', s3Error);
      
      consoleSpy.mockRestore();
    });
  });

  describe('Database Deletion', () => {
    test('should delete insight from database', async () => {
      await deleteInsight({ slug: 'existing-insight' });

      expect(mockDb.delete).toHaveBeenCalledWith(insightTable);
    });

    test('should use correct where condition for deletion', async () => {
      await deleteInsight({ slug: 'existing-insight' });

      const deleteCall = mockDb.delete().where.mock.calls[0][0];
      expect(deleteCall).toBe('EQ_CONDITION');
      expect(mockEq).toHaveBeenCalledWith(insightTable.slug, 'existing-insight');
    });

    test('should return deleted insight data', async () => {
      const result = await deleteInsight({ slug: 'existing-insight' });

      expect(result.success).toBe(true);
      expect(result.data).toEqual(existingInsight);
    });

    test('should handle database deletion errors', async () => {
      const dbError = new Error('Database deletion failed');
      const mockDelete = jest.fn().mockReturnValue({
        where: jest.fn().mockReturnValue({
          returning: jest.fn().mockRejectedValue(dbError),
        }),
      });
      mockDb.delete.mockReturnValue(mockDelete as any);

      const result = await deleteInsight({ slug: 'existing-insight' });

      expect(result).toEqual({
        success: false,
        error: 'Database deletion failed',
      });
    });

    test('should delete from database even if S3 deletion fails', async () => {
      const s3Error = new Error('S3 deletion failed');
      mockS3Service.deleteFile.mockRejectedValue(s3Error);

      const result = await deleteInsight({ 
        slug: 'existing-insight', 
        coverUrl: 'https://example.com/image.jpg' 
      });

      expect(result.success).toBe(true);
      expect(mockDb.delete).toHaveBeenCalledWith(insightTable);
    });
  });

  describe('Cache Invalidation', () => {
    test('should revalidate all relevant cache tags', async () => {
      await deleteInsight({ slug: 'existing-insight' });

      expect(mockRevalidateTag).toHaveBeenCalledWith('admin-insights');
      expect(mockRevalidateTag).toHaveBeenCalledWith('insights');
      expect(mockRevalidateTag).toHaveBeenCalledWith('insights-list');
      expect(mockRevalidateTag).toHaveBeenCalledTimes(3);
    });

    test('should revalidate cache even when S3 deletion fails', async () => {
      const s3Error = new Error('S3 deletion failed');
      mockS3Service.deleteFile.mockRejectedValue(s3Error);

      await deleteInsight({ 
        slug: 'existing-insight', 
        coverUrl: 'https://example.com/image.jpg' 
      });

      expect(mockRevalidateTag).toHaveBeenCalledWith('admin-insights');
      expect(mockRevalidateTag).toHaveBeenCalledWith('insights');
      expect(mockRevalidateTag).toHaveBeenCalledWith('insights-list');
    });

    test('should not revalidate cache if database deletion fails', async () => {
      const dbError = new Error('Database deletion failed');
      const mockDelete = jest.fn().mockReturnValue({
        where: jest.fn().mockReturnValue({
          returning: jest.fn().mockRejectedValue(dbError),
        }),
      });
      mockDb.delete.mockReturnValue(mockDelete as any);

      await deleteInsight({ slug: 'existing-insight' });

      expect(mockRevalidateTag).not.toHaveBeenCalled();
    });
  });

  describe('Complete Deletion Workflow', () => {
    test('should execute full deletion workflow successfully', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      const result = await deleteInsight({ 
        slug: 'existing-insight',
        coverUrl: 'https://example.com/image.jpg'
      });

      // Verify the workflow order
      expect(mockGetSession).toHaveBeenCalledTimes(1);
      expect(mockDb.query.insightTable.findFirst).toHaveBeenCalledTimes(1);
      expect(mockS3Service.deleteFile).toHaveBeenCalledWith('https://example.com/image.jpg');
      expect(mockDb.delete).toHaveBeenCalledWith(insightTable);
      expect(mockRevalidateTag).toHaveBeenCalledTimes(3);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(existingInsight);
      expect(consoleSpy).not.toHaveBeenCalled();

      consoleSpy.mockRestore();
    });

    test('should handle workflow with S3 error gracefully', async () => {
      const s3Error = new Error('S3 deletion failed');
      mockS3Service.deleteFile.mockRejectedValue(s3Error);

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      const result = await deleteInsight({ 
        slug: 'existing-insight',
        coverUrl: 'https://example.com/image.jpg'
      });

      expect(result.success).toBe(true);
      expect(result.data).toEqual(existingInsight);
      expect(consoleSpy).toHaveBeenCalledWith('Error deleting image from S3:', s3Error);

      consoleSpy.mockRestore();
    });

    test('should handle workflow without image', async () => {
      mockDb.query.insightTable.findFirst.mockResolvedValue(existingInsightWithoutImage);

      const result = await deleteInsight({ slug: 'existing-insight' });

      expect(mockS3Service.deleteFile).not.toHaveBeenCalled();
      expect(mockDb.delete).toHaveBeenCalledWith(insightTable);
      expect(mockRevalidateTag).toHaveBeenCalledTimes(3);
      
      expect(result.success).toBe(true);
    });
  });

  describe('Error Handling', () => {
    test('should handle unexpected errors gracefully', async () => {
      const unexpectedError = new Error('Unexpected system error');
      mockDb.query.insightTable.findFirst.mockRejectedValue(unexpectedError);

      const result = await deleteInsight({ slug: 'existing-insight' });

      expect(result).toEqual({
        success: false,
        error: 'Unexpected system error',
      });
    });

    test('should log errors for debugging', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      const testError = new Error('Test error for logging');
      mockDb.query.insightTable.findFirst.mockRejectedValue(testError);

      await deleteInsight({ slug: 'existing-insight' });

      expect(consoleSpy).toHaveBeenCalledWith('Error deleting insight:', testError);
      
      consoleSpy.mockRestore();
    });

    test('should handle non-Error objects thrown', async () => {
      mockDb.query.insightTable.findFirst.mockRejectedValue('String error');

      const result = await deleteInsight({ slug: 'existing-insight' });

      expect(result).toEqual({
        success: false,
        error: 'An unknown error occurred',
      });
    });

    test('should prioritize database errors over S3 errors', async () => {
      const s3Error = new Error('S3 deletion failed');
      const dbError = new Error('Database deletion failed');
      
      mockS3Service.deleteFile.mockRejectedValue(s3Error);
      const mockDelete = jest.fn().mockReturnValue({
        where: jest.fn().mockReturnValue({
          returning: jest.fn().mockRejectedValue(dbError),
        }),
      });
      mockDb.delete.mockReturnValue(mockDelete as any);

      const result = await deleteInsight({ 
        slug: 'existing-insight',
        coverUrl: 'https://example.com/image.jpg'
      });

      // Should return database error, not S3 error
      expect(result).toEqual({
        success: false,
        error: 'Database deletion failed',
      });
    });
  });

  describe('Edge Cases', () => {
    test('should handle very long slug', async () => {
      const longSlug = 'a'.repeat(500);
      
      const result = await deleteInsight({ slug: longSlug });

      expect(mockEq).toHaveBeenCalledWith(insightTable.slug, longSlug);
    });

    test('should handle slug with special characters', async () => {
      const specialSlug = 'insight-with-special-chars-émojis-🚀-and-symbols-@#$%';
      
      const result = await deleteInsight({ slug: specialSlug });

      expect(mockEq).toHaveBeenCalledWith(insightTable.slug, specialSlug);
    });

    test('should handle coverUrl with special characters', async () => {
      const specialCoverUrl = 'https://example.com/image-with-special-chars-émojis-🚀.jpg';
      
      await deleteInsight({ 
        slug: 'existing-insight',
        coverUrl: specialCoverUrl
      });

      expect(mockS3Service.deleteFile).toHaveBeenCalledWith(specialCoverUrl);
    });

    test('should handle empty coverUrl parameter', async () => {
      await deleteInsight({ 
        slug: 'existing-insight',
        coverUrl: ''
      });

      // Should not call S3 service for empty URL
      expect(mockS3Service.deleteFile).not.toHaveBeenCalled();
    });

    test('should handle null coverUrl parameter', async () => {
      await deleteInsight({ 
        slug: 'existing-insight',
        coverUrl: null as any
      });

      // Should not call S3 service for null URL
      expect(mockS3Service.deleteFile).not.toHaveBeenCalled();
    });
  });

  describe('Security and Data Integrity', () => {
    test('should only delete the specific insight', async () => {
      await deleteInsight({ slug: 'specific-insight' });

      expect(mockEq).toHaveBeenCalledWith(insightTable.slug, 'specific-insight');
      expect(mockEq).toHaveBeenCalledTimes(2); // Once for findFirst, once for delete
    });

    test('should require authentication for each deletion', async () => {
      await deleteInsight({ slug: 'insight-1' });
      jest.clearAllMocks();
      mockGetSession.mockResolvedValue(mockSession);
      mockDb.query.insightTable.findFirst.mockResolvedValue(existingInsight);

      await deleteInsight({ slug: 'insight-2' });

      expect(mockGetSession).toHaveBeenCalledTimes(1); // Should check auth for each call
    });

    test('should not delete if session check fails mid-operation', async () => {
      // Simulate session expiring during operation
      mockGetSession.mockResolvedValueOnce(mockSession).mockResolvedValueOnce(null);

      const result1 = await deleteInsight({ slug: 'insight-1' });
      const result2 = await deleteInsight({ slug: 'insight-2' });

      expect(result1.success).toBe(true);
      expect(result2.success).toBe(false);
      expect(result2.error).toBe('Please log in or your session to access resource.');
    });
  });

  describe('Concurrent Deletion Scenarios', () => {
    test('should handle concurrent deletion attempts', async () => {
      const promise1 = deleteInsight({ slug: 'existing-insight' });
      const promise2 = deleteInsight({ slug: 'existing-insight' });

      const [result1, result2] = await Promise.all([promise1, promise2]);

      // At least one should succeed
      expect(result1.success || result2.success).toBe(true);
    });

    test('should handle insight deleted by another process', async () => {
      // First call finds the insight
      mockDb.query.insightTable.findFirst.mockResolvedValueOnce(existingInsight);
      
      // Second call (simulating concurrent deletion) finds nothing
      mockDb.query.insightTable.findFirst.mockResolvedValueOnce(null);

      const result1 = await deleteInsight({ slug: 'existing-insight' });
      const result2 = await deleteInsight({ slug: 'existing-insight' });

      expect(result1.success).toBe(true);
      expect(result2.success).toBe(false);
      expect(result2.error).toBe('Insight not found');
    });
  });
});
