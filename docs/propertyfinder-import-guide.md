# PropertyFinder JSON Import Guide

## Overview

The PropertyFinder JSON Import system allows you to import property listings from PropertyFinder's JSON format into the TRPE database. This system is optimized for performance with batch processing, memory monitoring, and concurrent image processing.

## Features

- **Batch Processing**: Properties are processed in configurable batches to manage memory usage
- **Memory Monitoring**: Automatic memory usage tracking with garbage collection optimization
- **Concurrent Image Processing**: Luxury property images are processed with controlled concurrency
- **Comprehensive Error Handling**: Detailed error logging and recovery mechanisms
- **Performance Optimization**: Optimized for large datasets with progress tracking
- **Luxury Property Detection**: Automatic detection and enhanced processing for luxury properties (>20M AED)

## Prerequisites

### Environment Setup

1. **Environment Variables**: Ensure your `.env.local` file contains:
   ```env
   DATABASE_URL=your_database_connection_string
   ES_AWS_ACCESS_KEY_ID=your_aws_access_key
   ES_AWS_SECRET_ACCESS_KEY=your_aws_secret_key
   ES_AWS_REGION=your_aws_region
   ES_AWS_BUCKET_NAME=your_s3_bucket_name
   ```

2. **JSON Data File**: Place your PropertyFinder JSON data at:
   ```
   scripts/listings.json
   ```

3. **Node.js Memory**: For large datasets, run with increased memory:
   ```bash
   NODE_OPTIONS='--max-old-space-size=4096 --expose-gc'
   ```

### JSON Data Format

The system expects a JSON file with the following structure:

```json
{
  "metadata": {
    "scrapedAt": "2025-08-05T12:59:15.328Z",
    "totalProperties": 20,
    "successfulScrapes": 20,
    "failedScrapes": 0
  },
  "properties": [
    {
      "url": "https://www.propertyfinder.ae/...",
      "title": "Property Title",
      "price": "37,009,800",
      "description": "Property description...",
      "propertyDetails": {
        "propertyType": "Apartment",
        "propertySize": "6,381 sqft / 593 sqm",
        "bedrooms": "4",
        "bathrooms": "4",
        "reference": "LUXE-0017",
        "zoneName": "Business Bay",
        "dldPermitNumber": "71498625382"
      },
      "agentName": "Agent Name",
      "images": ["url1", "url2", "..."],
      "scrapedAt": "2025-08-05T12:58:33.989Z"
    }
  ]
}
```

## Usage

### Method 1: Package.json Script (Recommended)

```bash
# Run the import using the configured npm script
npm run import:propertyfinder

# Or using bun
bun run import:propertyfinder
```

### Method 2: Direct Script Execution

```bash
# Run directly with bun
bun run scripts/import-propertyfinder.ts

# Run with Node.js (with memory optimization)
NODE_OPTIONS='--max-old-space-size=4096 --expose-gc' node scripts/import-propertyfinder.ts
```

### Method 3: Programmatic Usage

```typescript
import { importPropertyFinderJson } from '@/actions/import-propertyfinder-json-action';

const result = await importPropertyFinderJson();
if (result.success) {
  console.log('Import completed successfully:', result.stats);
} else {
  console.error('Import failed:', result.error);
}
```

## Configuration Options

### Performance Tuning

The system includes several configurable parameters for optimization:

```typescript
// In actions/import-propertyfinder-json-action.ts
const BATCH_SIZE = 10; // Properties per batch
const MAX_CONCURRENT_IMAGES = 3; // Concurrent image downloads
const MEMORY_CHECK_INTERVAL = 25; // Memory check frequency
```

### Memory Thresholds

```typescript
const HEAP_WARNING_THRESHOLD = 1024; // 1GB warning
const HEAP_CRITICAL_THRESHOLD = 2048; // 2GB critical
```

## Processing Flow

### 1. Data Validation
- JSON structure validation
- Required field checking
- Property data validation

### 2. Property Processing
- Price parsing and luxury detection (>20M AED threshold)
- Slug generation with uniqueness checking
- Database entity processing (agents, communities, property types)

### 3. Image Processing (Luxury Properties Only)
- Concurrent image downloading with rate limiting
- WebP conversion for optimization
- S3 upload with retry logic
- Database record creation

### 4. Statistics and Reporting
- Comprehensive processing statistics
- Error logging and categorization
- Performance metrics calculation

## Output and Statistics

### Console Output

The system provides detailed console output including:

- **Progress Tracking**: Real-time progress with percentages
- **Memory Monitoring**: Memory usage statistics and optimization
- **Batch Processing**: Batch completion status
- **Error Reporting**: Detailed error messages with context
- **Final Statistics**: Comprehensive summary report

### Statistics Tracked

```typescript
interface ImportStats {
  totalProcessed: number;
  created: number;
  updated: number;
  skipped: number;
  failed: number;
  luxeProperties: number;
  luxePropertiesWithImages: number;
  luxePropertiesWithoutImages: number;
  imagesProcessed: number;
  imagesSkipped: number;
  imagesFailed: number;
  processingTime: number;
  averageProcessingTimePerProperty: number;
  propertiesPerSecond: number;
  successRate: number;
  failureRate: number;
  skipRate: number;
}
```

## Error Handling

### Error Categories

1. **Validation Errors**: Missing or invalid required fields
2. **Database Errors**: Connection issues, constraint violations
3. **Image Processing Errors**: Download failures, conversion issues
4. **Network Errors**: Timeout, connectivity issues
5. **Memory Errors**: Out of memory conditions

### Recovery Mechanisms

- **Non-Critical Failures**: Continue processing remaining properties
- **Image Processing**: Retry with exponential backoff
- **Memory Management**: Automatic garbage collection
- **Database Transactions**: Rollback on failure, continue with next property

## Performance Optimization

### For Large Datasets

1. **Increase Memory Allocation**:
   ```bash
   NODE_OPTIONS='--max-old-space-size=8192 --expose-gc'
   ```

2. **Adjust Batch Size**:
   ```typescript
   const BATCH_SIZE = 5; // Smaller batches for very large datasets
   ```

3. **Reduce Concurrent Images**:
   ```typescript
   const MAX_CONCURRENT_IMAGES = 2; // Lower concurrency for stability
   ```

### Memory Management

- **Automatic Monitoring**: Memory usage checked every 25 properties
- **Garbage Collection**: Forced GC between batches and on high usage
- **Batch Processing**: Prevents memory accumulation
- **Resource Cleanup**: Proper cleanup on errors and completion

## Troubleshooting

### Common Issues

1. **Out of Memory**:
   - Increase Node.js memory limit
   - Reduce batch size
   - Enable garbage collection

2. **Image Processing Failures**:
   - Check network connectivity
   - Verify S3 credentials
   - Review image URL validity

3. **Database Connection Issues**:
   - Verify DATABASE_URL
   - Check database connectivity
   - Review connection pool settings

4. **JSON Parsing Errors**:
   - Validate JSON structure
   - Check file encoding
   - Verify file path

### Debug Mode

Enable detailed logging by setting:
```bash
DEBUG=true npm run import:propertyfinder
```

## Best Practices

### Before Running

1. **Backup Database**: Always backup before large imports
2. **Test with Sample**: Test with a small subset first
3. **Monitor Resources**: Ensure adequate system resources
4. **Verify Credentials**: Check all AWS and database credentials

### During Processing

1. **Monitor Memory**: Watch memory usage in console output
2. **Check Progress**: Monitor processing statistics
3. **Review Errors**: Address any recurring error patterns
4. **System Resources**: Ensure system stability

### After Completion

1. **Review Statistics**: Analyze final import report
2. **Verify Data**: Spot-check imported properties
3. **Check Images**: Verify luxury property images
4. **Clean Up**: Remove temporary files if any

## Related Documentation

- [PropertyFinder Import Performance Guide](./propertyfinder-import-performance-guide.md) - Detailed performance optimization and configuration
- [PropertyFinder Import Script Usage](./propertyfinder-import-script-usage.md) - Script execution and command-line options
- [Integration Testing Report](../actions/__tests__/INTEGRATION_TESTING_REPORT.md) - Test results and validation

## Support

For issues or questions:

1. **Check Logs**: Review console output for error details
2. **Verify Configuration**: Ensure all environment variables are set
3. **Test Components**: Test individual components (database, S3, etc.)
4. **Performance Tuning**: Adjust configuration for your system

## Version History

- **v1.0.0**: Initial implementation with basic import functionality
- **v1.1.0**: Added batch processing and memory monitoring
- **v1.2.0**: Implemented concurrent image processing
- **v1.3.0**: Enhanced error handling and recovery
- **v1.4.0**: Performance optimizations and final polish