# PropertyFinder JSON Import - Performance Guide

## Overview

The PropertyFinder JSON Import system is designed to efficiently process large datasets of property listings from PropertyFinder's JSON format. This guide covers performance optimization, memory management, and best practices for running the import script.

## Performance Features

### 1. Batch Processing
- **Default Batch Size**: 15 properties per batch
- **Configurable**: Set via `PF_BATCH_SIZE` environment variable
- **Memory Management**: Automatic garbage collection between batches
- **Parallel Processing**: Optional parallel processing within batches

### 2. Memory Monitoring
- **Real-time Monitoring**: Memory usage checked every 20 properties (configurable)
- **Automatic Optimization**: Garbage collection triggered at memory thresholds
- **Adaptive Delays**: Processing delays adjust based on memory pressure
- **Heap Usage Tracking**: Detailed heap utilization reporting

### 3. Image Processing Optimization
- **Concurrent Limits**: Maximum 5 concurrent image downloads (configurable)
- **Luxury-only Processing**: Images only processed for properties > 20M AED
- **Error Recovery**: Failed image downloads don't stop property processing
- **WebP Conversion**: Automatic image optimization for storage efficiency

## Configuration Options

### Environment Variables

```bash
# Batch processing configuration
PF_BATCH_SIZE=15                    # Properties per batch (default: 15)
PF_ENABLE_PARALLEL=true            # Enable parallel processing (default: false)

# Memory management
PF_MEMORY_WARNING_MB=1024          # Memory warning threshold in MB (default: 1024)
PF_MEMORY_CRITICAL_MB=2048         # Memory critical threshold in MB (default: 2048)
PF_MEMORY_CHECK_INTERVAL=20        # Check memory every N properties (default: 20)

# Image processing
PF_MAX_CONCURRENT_IMAGES=5         # Max concurrent image downloads (default: 5)

# Node.js optimization
NODE_OPTIONS='--max-old-space-size=4096 --expose-gc'
```

### Recommended Settings by Dataset Size

#### Small Dataset (< 100 properties)
```bash
PF_BATCH_SIZE=25
PF_ENABLE_PARALLEL=false
PF_MAX_CONCURRENT_IMAGES=3
NODE_OPTIONS='--max-old-space-size=2048'
```

#### Medium Dataset (100-500 properties)
```bash
PF_BATCH_SIZE=15
PF_ENABLE_PARALLEL=true
PF_MAX_CONCURRENT_IMAGES=5
NODE_OPTIONS='--max-old-space-size=4096 --expose-gc'
```

#### Large Dataset (500+ properties)
```bash
PF_BATCH_SIZE=10
PF_ENABLE_PARALLEL=true
PF_MAX_CONCURRENT_IMAGES=3
PF_MEMORY_CHECK_INTERVAL=15
NODE_OPTIONS='--max-old-space-size=6144 --expose-gc'
```

## Usage Instructions

### Basic Usage
```bash
# Using npm script (recommended)
npm run import:propertyfinder

# Direct execution
bun run scripts/import-propertyfinder.ts

# With custom configuration
PF_BATCH_SIZE=20 PF_ENABLE_PARALLEL=true npm run import:propertyfinder
```

### Advanced Usage with Performance Monitoring
```bash
# Enable all performance features
NODE_OPTIONS='--max-old-space-size=4096 --expose-gc' \
PF_BATCH_SIZE=15 \
PF_ENABLE_PARALLEL=true \
PF_MAX_CONCURRENT_IMAGES=5 \
PF_MEMORY_CHECK_INTERVAL=20 \
npm run import:propertyfinder
```

### Development and Testing
```bash
# Test with smaller batches for debugging
PF_BATCH_SIZE=5 PF_ENABLE_PARALLEL=false npm run import:propertyfinder

# Memory-constrained environments
NODE_OPTIONS='--max-old-space-size=2048' \
PF_BATCH_SIZE=10 \
PF_MAX_CONCURRENT_IMAGES=2 \
npm run import:propertyfinder
```

## Performance Monitoring

### Real-time Statistics
The import script provides comprehensive real-time monitoring:

- **Progress Tracking**: Current property, batch progress, estimated completion time
- **Memory Usage**: RSS, heap usage, external memory, array buffers
- **Processing Speed**: Properties per second, average processing time
- **Success Rates**: Created, updated, skipped, and failed properties
- **Image Processing**: Luxury properties with/without images, processing rates

### Memory Monitoring Output
```
💾 Memory Usage Check (45.2% complete):
📊 RSS: 1247MB | Heap Used: 892MB/2048MB
🔗 External: 156MB | ArrayBuffers: 23MB
📈 Heap Usage: 43.6% of allocated heap
✅ Memory usage within normal limits (43.6% heap usage)
```

### Performance Metrics
```
📊 FINAL EXECUTION SUMMARY
✅ Import Status: SUCCESS
⏱️ Total Execution Time: 127.45 seconds
📋 Properties Processed: 250
✅ Created: 198
🔄 Updated: 42
⏭️ Skipped: 8
❌ Failed: 2
💎 Luxury Properties: 45
🖼️ Images Processed: 234
📈 Success Rate: 96.0%
⚡ Processing Speed: 1.96 properties/second
```

## Troubleshooting

### Memory Issues

#### Out of Memory Errors
```bash
# Increase heap size
NODE_OPTIONS='--max-old-space-size=6144' npm run import:propertyfinder

# Reduce batch size
PF_BATCH_SIZE=5 npm run import:propertyfinder

# Disable parallel processing
PF_ENABLE_PARALLEL=false npm run import:propertyfinder
```

#### High Memory Usage
```bash
# Enable garbage collection
NODE_OPTIONS='--expose-gc' npm run import:propertyfinder

# Increase memory check frequency
PF_MEMORY_CHECK_INTERVAL=10 npm run import:propertyfinder

# Reduce concurrent image processing
PF_MAX_CONCURRENT_IMAGES=2 npm run import:propertyfinder
```

### Performance Issues

#### Slow Processing
```bash
# Enable parallel processing
PF_ENABLE_PARALLEL=true npm run import:propertyfinder

# Increase batch size (if memory allows)
PF_BATCH_SIZE=25 npm run import:propertyfinder

# Increase concurrent image downloads
PF_MAX_CONCURRENT_IMAGES=8 npm run import:propertyfinder
```

#### Network Timeouts
```bash
# Reduce concurrent image downloads
PF_MAX_CONCURRENT_IMAGES=2 npm run import:propertyfinder

# Increase batch processing delays
PF_BATCH_DELAY_MS=1000 npm run import:propertyfinder
```

### Database Issues

#### Connection Pool Exhaustion
- Reduce batch size to limit concurrent database operations
- Ensure database connection pool is properly configured
- Monitor database performance during import

#### Transaction Timeouts
- Process smaller batches to reduce transaction duration
- Ensure database has sufficient resources
- Consider running during off-peak hours

## Best Practices

### 1. Pre-Import Preparation
- Verify JSON file integrity and structure
- Ensure sufficient disk space for images
- Check database connectivity and performance
- Review environment variable configuration

### 2. During Import
- Monitor memory usage and system resources
- Watch for error patterns in console output
- Keep database and S3 credentials secure
- Avoid running other resource-intensive processes

### 3. Post-Import Validation
- Review final statistics and error reports
- Verify property counts in database
- Check image upload success rates
- Validate luxury property detection accuracy

### 4. Production Considerations
- Run during off-peak hours to minimize system impact
- Use staging environment for testing configuration
- Implement monitoring and alerting for production runs
- Keep backups of database before large imports

## Error Recovery

### Automatic Recovery Features
- **Non-critical Failures**: Image processing failures don't stop property processing
- **Database Retries**: Automatic retry with exponential backoff for connection issues
- **Memory Management**: Automatic garbage collection prevents out-of-memory crashes
- **Batch Isolation**: Failures in one batch don't affect subsequent batches

### Manual Recovery
```bash
# Resume from specific batch (if supported)
PF_START_FROM_BATCH=5 npm run import:propertyfinder

# Skip image processing for faster recovery
PF_SKIP_IMAGES=true npm run import:propertyfinder

# Process only failed properties (if supported)
PF_RETRY_FAILED_ONLY=true npm run import:propertyfinder
```

## Monitoring and Logging

### Log Levels
- **INFO**: General progress and statistics
- **WARN**: Memory warnings and recoverable errors
- **ERROR**: Failed properties and critical issues
- **DEBUG**: Detailed processing information (if enabled)

### Log File Management
```bash
# Redirect output to log file
npm run import:propertyfinder > import-$(date +%Y%m%d-%H%M%S).log 2>&1

# Monitor log in real-time
tail -f import-*.log

# Search for specific issues
grep "ERROR\|FAILED" import-*.log
```

## Performance Benchmarks

### Typical Performance Metrics
- **Small Dataset (< 100 properties)**: 2-3 properties/second
- **Medium Dataset (100-500 properties)**: 1.5-2.5 properties/second
- **Large Dataset (500+ properties)**: 1-2 properties/second

### Factors Affecting Performance
- **Network Speed**: Image download speeds
- **Database Performance**: Query and insert speeds
- **System Resources**: Available memory and CPU
- **Concurrent Processing**: Parallel vs sequential processing
- **Image Processing**: WebP conversion and S3 upload speeds

## Support and Maintenance

### Regular Maintenance
- Monitor import job success rates
- Review error logs for patterns
- Update configuration based on dataset changes
- Optimize database indexes for import queries

### Performance Tuning
- Adjust batch sizes based on system performance
- Monitor memory usage patterns over time
- Optimize image processing concurrency
- Fine-tune database connection pool settings

For additional support or questions about performance optimization, consult the development team or review the import action source code for detailed implementation information.