# Insights API Documentation

## Overview

The Insights management system provides a comprehensive set of server actions for creating, reading, updating, and deleting insights. All actions are authenticated and include robust error handling, image processing, and cache management.

## Table of Contents

1. [Authentication](#authentication)
2. [API Actions](#api-actions)
   - [Add Insight](#add-insight)
   - [Get Admin Insights](#get-admin-insights)
   - [Update Insight](#update-insight)
   - [Delete Insight](#delete-insight)
3. [Data Models](#data-models)
4. [Error Handling](#error-handling)
5. [Image Processing](#image-processing)
6. [Caching Strategy](#caching-strategy)
7. [Integration Examples](#integration-examples)

---

## Authentication

All insight management operations require valid admin authentication. The system uses session-based authentication validated through the `getSession()` function.

**Authentication Requirements:**
- Valid admin session required for all CRUD operations
- Session validation occurs at the beginning of each action
- Unauthenticated requests return standardized error responses

---

## API Actions

### Add Insight

Creates a new insight with comprehensive validation and processing.

**Function:** `addInsight(data: InsightFormData)`

**Parameters:**
```typescript
interface InsightFormData {
  title: string;              // Required: Insight title
  metaTitle?: string;         // Optional: SEO meta title
  metaDescription?: string;   // Optional: SEO meta description
  publishedAt?: string;       // Optional: Publication date (ISO string)
  authorId?: string;          // Optional: Author ID
  altText?: string;           // Optional: Cover image alt text
  coverUrl?: string;          // Optional: Cover image URL
  content?: string;           // Optional: HTML content
  isLuxe?: boolean;          // Optional: Luxe status flag
}
```

**Response:**
```typescript
interface AddResponse {
  success: boolean;
  data?: {
    id: string;
    slug: string;
    title: string;
    // ... additional insight fields
  };
  error?: string;
}
```

**Example Usage:**
```typescript
import { addInsight } from '@/actions/admin/add-insight-action';

const newInsight = await addInsight({
  title: "Market Trends 2025",
  content: "<p>Comprehensive market analysis...</p>",
  coverUrl: "https://example.com/cover.jpg",
  metaTitle: "2025 Market Trends Analysis",
  metaDescription: "In-depth analysis of market trends for 2025",
  altText: "Market trend visualization chart",
  isLuxe: true
});

if (newInsight.success) {
  console.log("Insight created:", newInsight.data.slug);
} else {
  console.error("Creation failed:", newInsight.error);
}
```

**Features:**
- Automatic slug generation from title
- HTML content sanitization and processing
- Cover image optimization to WebP format
- S3 upload for processed images
- Cache invalidation upon creation

---

### Get Admin Insights

Retrieves insights with filtering, searching, and pagination for admin interfaces.

**Function:** `getAdminInsights(params?: AdminInsightsParams)`

**Parameters:**
```typescript
interface AdminInsightsParams {
  search?: string;        // Optional: Search term for title/content
  limit?: number;         // Optional: Number of results (default: 10)
  offset?: number;        // Optional: Pagination offset (default: 0)
  authorId?: string;      // Optional: Filter by author
  isLuxe?: boolean;       // Optional: Filter by luxe status
  sortBy?: 'title' | 'publishedAt' | 'createdAt';  // Optional: Sort field
  sortOrder?: 'asc' | 'desc';  // Optional: Sort direction
}
```

**Response:**
```typescript
interface AdminInsightsResponse {
  success: boolean;
  data?: {
    insights: InsightRecord[];
    totalCount: number;
    hasMore: boolean;
    pagination: {
      limit: number;
      offset: number;
      totalPages: number;
      currentPage: number;
    };
  };
  error?: string;
}
```

**Example Usage:**
```typescript
import { getAdminInsights } from '@/actions/admin/get-admin-insights-action';

// Get all insights with pagination
const allInsights = await getAdminInsights({
  limit: 20,
  offset: 0,
  sortBy: 'publishedAt',
  sortOrder: 'desc'
});

// Search insights
const searchResults = await getAdminInsights({
  search: "market trends",
  limit: 10
});

// Filter by author and luxe status
const luxeInsights = await getAdminInsights({
  authorId: "auth_123",
  isLuxe: true,
  limit: 15
});
```

**Features:**
- PostgreSQL full-text search across title and content
- Flexible filtering by multiple criteria
- Pagination with total count and hasMore indicators
- Sorting by various fields
- Author information joining
- Responsive pagination metadata

---

### Update Insight

Updates existing insights with partial or complete data modifications.

**Function:** `updateInsight(insightSlug: string, data: InsightUpdateData)`

**Parameters:**
```typescript
interface InsightUpdateData {
  title?: string;              // Optional: Updated title
  metaTitle?: string;         // Optional: Updated SEO meta title
  metaDescription?: string;   // Optional: Updated SEO meta description
  publishedAt?: string;       // Optional: Updated publication date
  authorId?: string;          // Optional: Updated author ID
  altText?: string;           // Optional: Updated cover image alt text
  coverUrl?: string;          // Optional: Updated cover image URL
  content?: string;           // Optional: Updated HTML content
  isLuxe?: boolean;          // Optional: Updated luxe status
}
```

**Response:**
```typescript
interface UpdateResponse {
  success: boolean;
  data?: InsightRecord;  // Updated insight data
  error?: string;
}
```

**Example Usage:**
```typescript
import { updateInsight } from '@/actions/admin/update-insight-action';

// Partial update - only title and content
const partialUpdate = await updateInsight("market-trends-2025", {
  title: "Updated Market Trends for 2025",
  content: "<p>New analysis shows...</p>"
});

// Update with new cover image
const imageUpdate = await updateInsight("property-insights", {
  coverUrl: "https://example.com/new-cover.jpg",
  altText: "Updated property visualization"
});

// Complete update
const fullUpdate = await updateInsight("investment-guide", {
  title: "Complete Investment Guide 2025",
  content: "<p>Comprehensive investment strategies...</p>",
  coverUrl: "https://example.com/guide-cover.jpg",
  metaTitle: "Investment Guide 2025 - Complete Analysis",
  metaDescription: "Expert investment strategies for 2025",
  isLuxe: true
});
```

**Features:**
- Partial updates (only provided fields are modified)
- Automatic HTML content processing
- Cover image optimization when URL changes
- Graceful fallback for image processing failures
- Automatic timestamp updating
- Cache invalidation for updated content

---

### Delete Insight

Safely removes insights and associated assets from the system.

**Function:** `deleteInsight(params: DeleteInsightParams)`

**Parameters:**
```typescript
interface DeleteInsightParams {
  slug: string;        // Required: Insight slug to delete
  coverUrl?: string;   // Optional: Cover image URL to clean up from S3
}
```

**Response:**
```typescript
interface DeleteResponse {
  success: boolean;
  data?: InsightRecord;  // Deleted insight data
  error?: string;
}
```

**Example Usage:**
```typescript
import { deleteInsight } from '@/actions/admin/delete-insight-action';

// Delete insight without image cleanup
const simpleDelete = await deleteInsight({ 
  slug: "old-market-analysis" 
});

// Delete insight with S3 image cleanup
const completeDelete = await deleteInsight({ 
  slug: "property-trends-2023",
  coverUrl: "https://s3-bucket.com/insights/property-cover.webp"
});

if (completeDelete.success) {
  console.log("Insight deleted:", completeDelete.data.title);
} else {
  console.error("Deletion failed:", completeDelete.error);
}
```

**Features:**
- Safe database deletion with existence verification
- Optional S3 asset cleanup
- Graceful handling of S3 cleanup failures
- Multi-level cache invalidation
- Robust error handling with fallback strategies

---

## Data Models

### InsightRecord
```typescript
interface InsightRecord {
  id: string;                    // Unique identifier
  title: string | null;          // Insight title
  coverUrl: string | null;       // Cover image URL
  authorId: string | null;       // Author ID
  aboutAuthor: string | null;    // Author information
  communityId: string | null;    // Community association
  subCommunityId: string | null; // Sub-community association
  altText: string | null;        // Cover image alt text
  metaDescription: string | null; // SEO meta description
  metaTitle: string | null;      // SEO meta title
  cityId: string | null;         // City association
  developerId: string | null;    // Developer association
  content: string | null;        // HTML content
  developmentId: string | null;  // Development association
  isPublished: string | null;    // Publication status
  isLuxe: boolean | null;        // Luxe status flag
  publishedAt: string | null;    // Publication timestamp
  agentId: string | null;        // Agent association
  slug: string;                  // URL slug (unique)
  updatedAt: string | null;      // Last update timestamp
  createdAt: string;             // Creation timestamp
}
```

---

## Error Handling

All API actions follow a consistent error handling pattern:

### Standard Error Response
```typescript
interface ErrorResponse {
  success: false;
  error: string;  // User-friendly error message
  data?: null;    // No data on error
}
```

### Common Error Types

1. **Authentication Errors**
   ```typescript
   {
     success: false,
     error: "Authentication required. Please log in to access insights."
   }
   ```

2. **Validation Errors**
   ```typescript
   {
     success: false,
     error: "Insight title is required and cannot be empty"
   }
   ```

3. **Not Found Errors**
   ```typescript
   {
     success: false,
     error: 'Insight with slug "nonexistent-slug" not found.'
   }
   ```

4. **Processing Errors**
   ```typescript
   {
     success: false,
     error: "An unexpected error occurred while processing the insight. Please try again."
   }
   ```

### Error Handling Best Practices

1. **Always check the `success` field** before accessing `data`
2. **Display user-friendly error messages** from the `error` field
3. **Implement retry logic** for transient failures
4. **Log errors** for debugging while showing safe messages to users

---

## Image Processing

The insights system includes comprehensive image processing capabilities:

### Features
- **Automatic WebP conversion** for optimal performance
- **S3 upload** for processed images
- **Error handling** with graceful fallbacks
- **Duplicate processing prevention** for existing WebP images

### Processing Flow
1. **URL validation** - Check if image URL is provided
2. **Format detection** - Skip processing if already WebP
3. **Image fetching** - Download from source URL
4. **Format conversion** - Convert to WebP with quality optimization
5. **S3 upload** - Store processed image in designated folder
6. **URL return** - Provide S3 URL for database storage

### Error Handling
- **Image fetch failures** fall back to original URL
- **Processing errors** continue with original URL
- **S3 upload failures** are logged but don't prevent insight operations

---

## Caching Strategy

The insights system implements multi-level caching for optimal performance:

### Cache Tags
- `insights` - General insights cache
- `admin-insights` - Admin dashboard cache
- `insights-list` - Public insights list cache
- `insight-{slug}` - Individual insight cache

### Cache Invalidation
Cache is automatically invalidated on:
- **Insight creation** - Invalidates `insights` tag
- **Insight updates** - Invalidates `insights` and `insight-{slug}` tags
- **Insight deletion** - Invalidates all relevant tags

### Implementation
```typescript
import { revalidateTag } from "next/cache";

// Single insight invalidation
revalidateTag(`insight-${slug}`);

// Multiple tag invalidation
revalidateTag('insights');
revalidateTag('admin-insights');
revalidateTag('insights-list');
```

---

## Integration Examples

### React Component Integration

```typescript
// components/InsightManager.tsx
import { useState } from 'react';
import { addInsight, updateInsight, deleteInsight } from '@/actions/admin';

export function InsightManager() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async (formData: InsightFormData) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await addInsight(formData);
      
      if (result.success) {
        // Handle success
        console.log('Insight created:', result.data.slug);
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (slug: string, updateData: InsightUpdateData) => {
    setLoading(true);
    
    try {
      const result = await updateInsight(slug, updateData);
      
      if (result.success) {
        console.log('Insight updated:', result.data.title);
      } else {
        setError(result.error);
      }
    } finally {
      setLoading(false);
    }
  };

  // Component JSX...
}
```

### API Route Integration

```typescript
// app/api/insights/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getAdminInsights } from '@/actions/admin/get-admin-insights-action';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  
  const params = {
    search: searchParams.get('search') || undefined,
    limit: parseInt(searchParams.get('limit') || '10'),
    offset: parseInt(searchParams.get('offset') || '0'),
    authorId: searchParams.get('authorId') || undefined,
  };

  const result = await getAdminInsights(params);

  if (result.success) {
    return NextResponse.json(result.data);
  } else {
    return NextResponse.json(
      { error: result.error },
      { status: 400 }
    );
  }
}
```

### Form Handling Example

```typescript
// hooks/useInsightForm.ts
import { useState } from 'react';
import { addInsight, updateInsight } from '@/actions/admin';

export function useInsightForm(existingInsight?: InsightRecord) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitForm = async (formData: InsightFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      let result;
      
      if (existingInsight) {
        result = await updateInsight(existingInsight.slug, formData);
      } else {
        result = await addInsight(formData);
      }

      if (result.success) {
        return result.data;
      } else {
        setError(result.error);
        return null;
      }
    } catch (error) {
      setError('An unexpected error occurred');
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    submitForm,
    isSubmitting,
    error,
    clearError: () => setError(null)
  };
}
```

---

## Performance Considerations

1. **Image Processing** - WebP conversion reduces file sizes by 25-35%
2. **Caching** - Multi-level cache strategy reduces database queries
3. **Pagination** - Efficient offset-based pagination for large datasets
4. **Search** - PostgreSQL full-text search for fast content discovery
5. **Lazy Loading** - Images are processed asynchronously without blocking

## Security Features

1. **Authentication** - All operations require valid admin sessions
2. **Input Validation** - Comprehensive validation of all input data
3. **SQL Injection Prevention** - Parameterized queries with Drizzle ORM
4. **XSS Prevention** - HTML content sanitization
5. **Error Sanitization** - Safe error messages without internal details

## Monitoring and Logging

- **Success Operations** - Logged with ✅ prefix
- **Warning Conditions** - Logged with ⚠️ prefix
- **Error Conditions** - Logged with ❌ prefix
- **Image Processing** - Detailed logging of optimization results
- **S3 Operations** - Upload and deletion operation logging
