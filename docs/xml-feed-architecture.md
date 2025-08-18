# XML Feed Import Architecture

## System Overview

The XML Feed Import System is a comprehensive data processing pipeline that ingests property listings from external XML feeds, processes and enhances the data, and stores it in a PostgreSQL database for use in the TRPE real estate platform.

## Architecture Diagram

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  External XML   │    │   Next.js API   │    │   Processing    │
│     Feeds       │────│   /api/xml      │────│    Pipeline     │
│                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │                        │
                                │                        │
                                ▼                        ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Client Apps   │    │  Cache Layer    │    │   Database      │
│  (Frontend/API) │────│  (5min TTL)     │    │  (PostgreSQL)   │
│                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                                        │
                                                        ▼
                                               ┌─────────────────┐
                                               │   Image Store   │
                                               │   (AWS S3)      │
                                               │                 │
                                               └─────────────────┘
```

## System Components

### 1. Data Ingestion Layer

#### XML Feed API (`/app/api/xml/route.ts`)

**Purpose**: Entry point for XML feed data processing

**Key Features**:
- Fetches XML data from external feeds
- Parses XML using xml2js library
- Enhances data with structured processing
- Returns processed JSON data

**Technical Stack**:
- Next.js API Routes
- Node.js Fetch API
- xml2js parser
- TypeScript for type safety

```typescript
// Core API structure
export async function GET(request: NextRequest) {
  // 1. Fetch XML from external source
  // 2. Parse XML to JSON
  // 3. Enhance with structured data
  // 4. Return processed result
}
```

#### Data Flow

```
External XML → HTTP Fetch → XML Parser → Data Enhancement → JSON Response
    │              │           │             │               │
    └──────────────┴───────────┴─────────────┴───────────────┘
           Error Handling & Validation Applied
```

### 2. Data Processing Layer

#### Save XML Listing Action (`/actions/save-xml-listing-action.ts`)

**Purpose**: Orchestrates the complete import workflow

**Key Responsibilities**:
- Coordinate data fetching and processing
- Manage database transactions
- Handle image processing and storage
- Provide comprehensive error handling

**Processing Pipeline**:

```
XML Data → Validation → Property Processing → Image Processing → Database Storage
    │         │              │                    │                 │
    ▼         ▼              ▼                    ▼                 ▼
  Schema   Required      Feature           AWS S3           PostgreSQL
  Check    Fields       Extraction        Upload           Insertion
```

#### Core Functions

1. **`saveXmlListing(feedUrl: string)`**
   - Main orchestration function
   - Handles complete import workflow
   - Returns success/failure statistics

2. **`processListings(listings: any[])`**
   - Processes array of property listings
   - Validates and transforms data
   - Handles batch operations

3. **`processPropertyImages(images: any[])`**
   - Downloads and processes property images
   - Converts to WebP format
   - Uploads to AWS S3

### 3. Data Storage Layer

#### Database Schema

**Primary Tables**:

```sql
-- Properties table (simplified schema)
CREATE TABLE properties (
  id SERIAL PRIMARY KEY,
  reference_number VARCHAR(255) UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(15,2),
  bedrooms INTEGER,
  bathrooms INTEGER,
  size_sqft INTEGER,
  plot_size_sqft INTEGER,
  community VARCHAR(255),
  sub_community VARCHAR(255),
  city VARCHAR(255) NOT NULL,
  offering_type VARCHAR(50) NOT NULL,
  property_type VARCHAR(100) NOT NULL,
  permit_number VARCHAR(255),
  description_structured JSONB,
  property_features TEXT[],
  connectivity_info TEXT[],
  searchable_description TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Agents table
CREATE TABLE agents (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Property Images table
CREATE TABLE property_images (
  id SERIAL PRIMARY KEY,
  property_id INTEGER REFERENCES properties(id),
  original_url TEXT NOT NULL,
  s3_url TEXT,
  s3_key VARCHAR(255),
  file_size INTEGER,
  width INTEGER,
  height INTEGER,
  format VARCHAR(10),
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### Indexing Strategy

```sql
-- Performance indexes
CREATE INDEX idx_properties_reference ON properties(reference_number);
CREATE INDEX idx_properties_city ON properties(city);
CREATE INDEX idx_properties_type ON properties(property_type);
CREATE INDEX idx_properties_price ON properties(price);
CREATE INDEX idx_properties_updated ON properties(updated_at);
CREATE INDEX idx_property_images_property ON property_images(property_id);

-- Full-text search index
CREATE INDEX idx_properties_search ON properties 
USING gin(to_tsvector('english', searchable_description));
```

### 4. Image Processing System

#### Image Pipeline Architecture

```
Original Image → Download → Validation → WebP Conversion → S3 Upload → DB Record
      │            │          │            │               │          │
      ▼            ▼          ▼            ▼               ▼          ▼
   External     Temporary   Size/Type   Sharp Library   AWS SDK   PostgreSQL
   Feed URL     Storage     Check       Processing      Upload     Metadata
```

#### Image Processing Workflow

1. **Download Phase**
   ```typescript
   // Download image from external URL
   const response = await fetch(imageUrl);
   const buffer = await response.arrayBuffer();
   ```

2. **Validation Phase**
   ```typescript
   // Validate image type and size
   const metadata = await sharp(buffer).metadata();
   if (metadata.size > MAX_FILE_SIZE) throw new Error('File too large');
   ```

3. **Conversion Phase**
   ```typescript
   // Convert to WebP format
   const webpBuffer = await sharp(buffer)
     .webp({ quality: 85 })
     .toBuffer();
   ```

4. **Storage Phase**
   ```typescript
   // Upload to S3
   const s3Result = await s3Client.upload({
     Bucket: process.env.S3_BUCKET_NAME,
     Key: `properties/${propertyId}/${filename}.webp`,
     Body: webpBuffer,
     ContentType: 'image/webp'
   }).promise();
   ```

### 5. Caching Layer

#### Cache Strategy

**Multi-Level Caching**:
1. **HTTP Cache**: Browser/CDN caching with ETag headers
2. **API Cache**: In-memory caching of processed XML data
3. **Database Cache**: PostgreSQL query result caching

#### Cache Configuration

```typescript
// API-level caching
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
const cache = new Map<string, CacheEntry>();

interface CacheEntry {
  data: any;
  timestamp: number;
  etag: string;
}
```

#### Cache Headers

```http
Cache-Control: public, max-age=300
ETag: "hash-of-content"
Last-Modified: Mon, 01 Dec 2024 10:00:00 GMT
```

## Data Flow Architecture

### 1. Complete Import Workflow

```
┌─────────────┐
│ User/Cron   │
│ Triggers    │
│ Import      │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ API Route   │
│ /api/xml    │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Fetch XML   │
│ From Feed   │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Parse XML   │
│ to JSON     │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Enhance     │
│ Data        │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Save Action │
│ Called      │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Process     │
│ Listings    │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Download &  │
│ Process     │
│ Images      │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Store in    │
│ Database    │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Return      │
│ Results     │
└─────────────┘
```

### 2. Error Handling Flow

```
Error Occurs
     │
     ▼
Error Classification
     │
     ├─ Network Error ──────┐
     ├─ Parsing Error ──────┤
     ├─ Validation Error ────┤──▶ Log Error Details
     ├─ Database Error ──────┤
     └─ Processing Error ────┘
     │
     ▼
Retry Logic (if applicable)
     │
     ▼
Graceful Degradation
     │
     ▼
User Notification
```

## Performance Architecture

### 1. Scalability Considerations

#### Horizontal Scaling

```
Load Balancer
     │
     ├─ App Instance 1 ──┐
     ├─ App Instance 2 ──┼──▶ Shared Database
     └─ App Instance 3 ──┘    (PostgreSQL)
                              │
                              ▼
                         Shared Storage
                         (AWS S3)
```

#### Vertical Scaling

- **CPU**: Image processing is CPU-intensive
- **Memory**: Large XML feeds require sufficient RAM
- **Storage**: Database storage scales with property count
- **Network**: External feed bandwidth considerations

### 2. Performance Optimization

#### Database Optimization

```sql
-- Partition large tables by date
CREATE TABLE properties_2024 PARTITION OF properties
FOR VALUES FROM ('2024-01-01') TO ('2025-01-01');

-- Use connection pooling
-- Configure in database connection
{
  "pool": {
    "min": 2,
    "max": 10,
    "acquireTimeoutMillis": 60000,
    "createTimeoutMillis": 30000,
    "destroyTimeoutMillis": 5000,
    "idleTimeoutMillis": 30000
  }
}
```

#### Image Processing Optimization

```typescript
// Parallel image processing
const imagePromises = images.map(async (image) => {
  return processImage(image);
});

// Process in batches to control memory usage
const batchSize = 10;
for (let i = 0; i < imagePromises.length; i += batchSize) {
  const batch = imagePromises.slice(i, i + batchSize);
  await Promise.all(batch);
}
```

### 3. Resource Management

#### Memory Management

```typescript
// Monitor memory usage
const memoryUsage = process.memoryUsage();
if (memoryUsage.heapUsed > MAX_HEAP_SIZE) {
  // Trigger garbage collection or reduce batch size
  global.gc?.();
}
```

#### Connection Management

```typescript
// Database connection pooling
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20, // Maximum connections
  min: 5,  // Minimum connections
  acquireTimeoutMillis: 60000
});
```

## Security Architecture

### 1. Data Security

#### Input Validation

```typescript
// Schema validation for all incoming data
const propertySchema = z.object({
  reference_number: z.string().min(1).max(255),
  title: z.string().min(1).max(1000),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/),
  // ... other validations
});
```

#### SQL Injection Prevention

```typescript
// Use parameterized queries with Drizzle ORM
await db.insert(properties).values({
  referenceNumber: property.reference_number,
  title: property.title,
  price: parseFloat(property.price)
});
```

### 2. Access Control

#### API Security

```typescript
// Rate limiting middleware
const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
```

#### Environment Security

```typescript
// Environment variable validation
const requiredEnvVars = [
  'DATABASE_URL',
  'AWS_ACCESS_KEY_ID',
  'AWS_SECRET_ACCESS_KEY',
  'S3_BUCKET_NAME'
];

requiredEnvVars.forEach(varName => {
  if (!process.env[varName]) {
    throw new Error(`Missing required environment variable: ${varName}`);
  }
});
```

### 3. Data Privacy

#### Personal Data Handling

```typescript
// Sanitize agent contact information
const sanitizeAgentData = (agent: any) => ({
  name: agent.name?.replace(/[<>]/g, ''), // Remove potential XSS
  email: validator.isEmail(agent.email) ? agent.email : null,
  phone: agent.phone?.replace(/[^\d+\-\s()]/g, '') // Keep only valid phone chars
});
```

## Monitoring and Observability

### 1. Logging Architecture

#### Structured Logging

```typescript
// Use structured logging format
const logger = {
  info: (message: string, metadata: any) => {
    console.log(JSON.stringify({
      level: 'info',
      timestamp: new Date().toISOString(),
      message,
      metadata
    }));
  },
  error: (message: string, error: Error, metadata?: any) => {
    console.error(JSON.stringify({
      level: 'error',
      timestamp: new Date().toISOString(),
      message,
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack
      },
      metadata
    }));
  }
};
```

#### Log Aggregation

```
Application Logs → CloudWatch → Log Aggregation → Monitoring Dashboard
     │               │            │                      │
     └─ Error Logs ──┼────────────┼──────────────────────┼─▶ Alerts
     └─ Access Logs ─┼────────────┼──────────────────────┘
     └─ Perf Logs ───┘            │
                                  ▼
                             Log Analysis
                             (Elasticsearch/
                              CloudWatch Insights)
```

### 2. Metrics Collection

#### Key Performance Indicators

```typescript
// Custom metrics tracking
const metrics = {
  importDuration: new Histogram('xml_import_duration_seconds'),
  importCount: new Counter('xml_import_total'),
  importErrors: new Counter('xml_import_errors_total'),
  propertiesProcessed: new Counter('properties_processed_total'),
  imagesProcessed: new Counter('images_processed_total')
};
```

#### Health Checks

```typescript
// Health check endpoint
export async function GET() {
  const checks = {
    database: await checkDatabaseConnection(),
    externalFeed: await checkFeedAvailability(),
    s3Storage: await checkS3Connection(),
    memoryUsage: process.memoryUsage()
  };
  
  const isHealthy = Object.values(checks).every(check => 
    typeof check === 'object' ? check.status === 'ok' : check
  );
  
  return Response.json({
    status: isHealthy ? 'healthy' : 'unhealthy',
    checks,
    timestamp: new Date().toISOString()
  });
}
```

### 3. Alerting System

#### Alert Configuration

```yaml
# Example alert configuration
alerts:
  - name: "High Error Rate"
    condition: "error_rate > 5%"
    duration: "5m"
    channels: ["email", "slack"]
    
  - name: "Long Response Time"
    condition: "response_time > 30s"
    duration: "2m"
    channels: ["email"]
    
  - name: "Feed Unavailable"
    condition: "feed_check_failed"
    duration: "1m"
    channels: ["email", "slack", "pagerduty"]
```

## Deployment Architecture

### 1. Infrastructure Components

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Client    │    │  Load       │    │  App        │
│ (Browser/   │────│ Balancer    │────│ Servers     │
│  Mobile)    │    │ (ALB)       │    │ (ECS/EC2)   │
└─────────────┘    └─────────────┘    └─────────────┘
                                               │
                           ┌───────────────────┼───────────────────┐
                           │                   │                   │
                           ▼                   ▼                   ▼
                  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
                  │  Database   │    │   Redis     │    │  S3 Bucket  │
                  │(PostgreSQL) │    │   Cache     │    │  (Images)   │
                  └─────────────┘    └─────────────┘    └─────────────┘
```

### 2. Environment Configuration

#### Development Environment

```typescript
// Development configuration
const devConfig = {
  database: {
    host: 'localhost',
    port: 5432,
    ssl: false
  },
  aws: {
    region: 'us-east-1',
    s3Bucket: 'dev-trpe-images'
  },
  cache: {
    ttl: 60, // 1 minute for development
    enabled: true
  }
};
```

#### Production Environment

```typescript
// Production configuration
const prodConfig = {
  database: {
    host: process.env.RDS_HOSTNAME,
    port: 5432,
    ssl: true,
    pool: {
      min: 10,
      max: 50
    }
  },
  aws: {
    region: 'us-west-2',
    s3Bucket: 'prod-trpe-images'
  },
  cache: {
    ttl: 300, // 5 minutes for production
    enabled: true
  }
};
```

### 3. CI/CD Pipeline

```
Code Commit → Build → Test → Security Scan → Deploy
     │         │      │         │            │
     ▼         ▼      ▼         ▼            ▼
  GitHub   Docker   Jest   Snyk/SonarQube   AWS
  Actions   Build   Tests   Vulnerability   ECS
                           Scanning
```

#### Pipeline Configuration

```yaml
# Example GitHub Actions workflow
name: Deploy XML Feed System
on:
  push:
    branches: [main]
    paths: ['actions/save-xml-listing-action.ts', 'app/api/xml/**']

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Run Tests
        run: |
          npm ci
          npm run test:xml-import
  
  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to Production
        run: |
          aws ecs update-service --cluster prod --service xml-import
```

## Future Architecture Considerations

### 1. Microservices Migration

```
Current Monolith → Microservices Architecture

┌─────────────────────┐     ┌─────────────────┐
│   XML Feed Import   │     │  Feed Service   │
│    (Monolith)       │ ──▶ │                 │
│                     │     └─────────────────┘
│ - API Endpoint      │     ┌─────────────────┐
│ - Processing        │ ──▶ │ Processing      │
│ - Image Handling    │     │ Service         │
│ - Database Storage  │     └─────────────────┘
└─────────────────────┘     ┌─────────────────┐
                        ──▶ │ Image Service   │
                            └─────────────────┘
                            ┌─────────────────┐
                        ──▶ │ Storage Service │
                            └─────────────────┘
```

### 2. Event-Driven Architecture

```
Event Bus (EventBridge/Kafka)
         │
         ├─ Property Created Event ──▶ Image Processing Service
         ├─ Import Started Event ───▶ Monitoring Service
         ├─ Import Completed Event ─▶ Notification Service
         └─ Error Event ────────────▶ Alert Service
```

### 3. Scalability Enhancements

#### Auto-scaling Configuration

```typescript
// Auto-scaling based on metrics
const autoScalingConfig = {
  targetCpuUtilization: 70,
  minInstances: 2,
  maxInstances: 20,
  scaleUpCooldown: 300,
  scaleDownCooldown: 600
};
```

#### Database Sharding Strategy

```sql
-- Shard by geographic region
CREATE TABLE properties_dubai PARTITION OF properties
FOR VALUES IN ('Dubai');

CREATE TABLE properties_abudhabi PARTITION OF properties
FOR VALUES IN ('Abu Dhabi');
```

---

## Technical Specifications

### System Requirements

- **Node.js**: v18.0.0 or higher
- **PostgreSQL**: v14.0 or higher
- **Redis**: v6.0 or higher (for caching)
- **AWS S3**: For image storage
- **Memory**: Minimum 2GB RAM per instance
- **Storage**: SSD recommended for database

### Dependencies

```json
{
  "dependencies": {
    "xml2js": "^0.6.0",
    "sharp": "^0.32.0",
    "aws-sdk": "^2.1400.0",
    "drizzle-orm": "^0.28.0",
    "zod": "^3.22.0"
  },
  "devDependencies": {
    "jest": "^29.0.0",
    "@types/xml2js": "^0.4.11"
  }
}
```

### Performance Benchmarks

- **Small Feed** (< 100 properties): < 5 seconds
- **Medium Feed** (100-1000 properties): < 30 seconds  
- **Large Feed** (1000+ properties): < 5 minutes
- **Image Processing**: 2-5 seconds per image
- **Database Insertion**: 1000 properties/minute

---

*Last updated: December 2024*
