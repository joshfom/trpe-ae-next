import '@testing-library/jest-dom'

// Polyfills for Node.js environment
const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Mock fetch for tests
global.fetch = jest.fn();

// Mock crypto for Node.js environment
Object.defineProperty(global, 'crypto', {
  value: {
    randomUUID: () => 'test-uuid-123',
    getRandomValues: (arr) => arr.map(() => Math.floor(Math.random() * 256))
  }
});

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
    }
  },
  usePathname() {
    return '/'
  },
  useSearchParams() {
    return new URLSearchParams()
  },
}));

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
}

// Mock URL APIs for browser environment
global.URL = global.URL || {
  createObjectURL: jest.fn(() => 'mock-object-url'),
  revokeObjectURL: jest.fn(),
};

// Mock File and FileReader APIs
global.File = global.File || class File {
  constructor(bits, name, options) {
    this.bits = bits;
    this.name = name;
    this.size = options?.size || 1024;
    this.type = options?.type || 'text/plain';
    this.lastModified = Date.now();
  }
};

global.FileReader = global.FileReader || class FileReader {
  constructor() {
    this.readyState = 0;
    this.result = null;
    this.error = null;
  }
  readAsDataURL() {
    this.onload?.({ target: { result: 'data:image/jpeg;base64,mock' } });
  }
  readAsText() {
    this.onload?.({ target: { result: 'mock text' } });
  }
};

// Mock server-only modules
jest.mock('@/db/drizzle', () => ({
  db: {
    select: jest.fn(),
    insert: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    query: {
      propertyTable: {
        findMany: jest.fn(),
        findFirst: jest.fn(),
      },
      insightsTable: {
        findMany: jest.fn(),
        findFirst: jest.fn(),
      },
    },
  },
}));

jest.mock('@/actions/auth-session', () => ({
  getCurrentUser: jest.fn(() => Promise.resolve({ id: 'test-user', role: 'admin' })),
  getSession: jest.fn(() => Promise.resolve({ user: { id: 'test-user' } })),
}));

jest.mock('@/lib/auth', () => ({
  auth: jest.fn(() => Promise.resolve({ user: { id: 'test-user' } })),
}));

jest.mock('next/cache', () => ({
  unstable_cache: jest.fn((fn) => fn),
  revalidateTag: jest.fn(),
  revalidatePath: jest.fn(),
}));

// Mock AWS SDK
jest.mock('@aws-sdk/client-s3', () => ({
  S3Client: jest.fn(() => ({
    send: jest.fn(),
  })),
  PutObjectCommand: jest.fn(),
  DeleteObjectCommand: jest.fn(),
  GetObjectCommand: jest.fn(),
}));

// Mock drizzle-orm functions
jest.mock('drizzle-orm', () => ({
  and: jest.fn(),
  or: jest.fn(),
  eq: jest.fn(),
  ne: jest.fn(),
  gt: jest.fn(),
  gte: jest.fn(),
  lt: jest.fn(),
  lte: jest.fn(),
  like: jest.fn(),
  ilike: jest.fn(),
  count: jest.fn(),
  desc: jest.fn(),
  asc: jest.fn(),
  sql: jest.fn(),
  relations: jest.fn(),
  createUpdateSchema: jest.fn(() => ({})),
}));

jest.mock('drizzle-zod', () => ({
  createInsertSchema: jest.fn(() => ({})),
  createSelectSchema: jest.fn(() => ({})),
  createUpdateSchema: jest.fn(() => ({})),
}));

// Mock file system operations
jest.mock('fs/promises', () => ({
  readFile: jest.fn(),
  writeFile: jest.fn(),
  mkdir: jest.fn(),
  access: jest.fn(),
  unlink: jest.fn(),
}));

// Mock slugify
jest.mock('slugify', () => jest.fn((text) => 
  text.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')
));

// Mock uuid
jest.mock('uuid', () => ({
  v4: jest.fn(() => '123e4567-e89b-12d3-a456-426614174000'),
}));

// Mock AWS S3 service
jest.mock('@/lib/s3Service', () => ({
  s3Service: {
    uploadFile: jest.fn(),
    deleteFile: jest.fn(),
    getSignedUrl: jest.fn(),
  },
}));

// Mock image processing utilities
jest.mock('@/lib/insights-image-utils', () => ({
  processInsightImage: jest.fn(),
  ImageProcessingError: class ImageProcessingError extends Error {},
  ImageFetchError: class ImageFetchError extends Error {},
}));

// Mock HTML processing utilities
jest.mock('@/lib/process-html-for-storage', () => ({
  processHtmlForStorage: jest.fn(),
}));

// Mock createId utility
jest.mock('@paralleldrive/cuid2', () => ({
  createId: jest.fn(),
}));