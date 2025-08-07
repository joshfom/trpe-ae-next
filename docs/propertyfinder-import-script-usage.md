# PropertyFinder JSON Import Script Usage

## Overview

The PropertyFinder JSON import script allows you to import property listings from PropertyFinder JSON format into the TRPE database. The script is available as a package.json script for easy execution.

## Script Configuration

The script is configured in `package.json` with the following entry:

```json
{
  "scripts": {
    "import:propertyfinder": "NODE_OPTIONS='--max-old-space-size=4096' bun run scripts/import-propertyfinder.ts"
  }
}
```

### Script Options Explained

- **NODE_OPTIONS='--max-old-space-size=4096'**: Increases Node.js memory limit to 4GB to handle large JSON files and image processing
- **bun run**: Uses Bun runtime for faster execution (can also use `node` if Bun is not available)
- **scripts/import-propertyfinder.ts**: The main import script file

## Usage

### Prerequisites

1. Ensure the JSON file exists at `scripts/listings.json`
2. Configure environment variables in `.env.local`:
   - `DATABASE_URL` - Database connection string
   - `ES_AWS_ACCESS_KEY_ID` - AWS S3 access key
   - `ES_AWS_SECRET_ACCESS_KEY` - AWS S3 secret key
   - `ES_AWS_REGION` - AWS S3 region
   - `ES_AWS_BUCKET_NAME` - AWS S3 bucket name

### Running the Script

Execute the import using npm/bun:

```bash
# Using npm
npm run import:propertyfinder

# Using bun (recommended)
bun run import:propertyfinder

# Direct execution
bun run scripts/import-propertyfinder.ts
```

### Script Output

The script provides comprehensive console output including:

- **Progress tracking**: Real-time progress with percentage completion
- **Property processing**: Details for each property being processed
- **Image processing**: Status of image downloads and conversions
- **Error handling**: Detailed error messages with recovery attempts
- **Final statistics**: Complete summary of import results

### Exit Codes

- **0**: Success - Import completed successfully
- **1**: Failure - Import failed due to critical error

## Features

### Luxury Property Detection

All PropertyFinder listings are automatically treated as luxury properties since PropertyFinder specializes in high-end real estate. This means:

- All properties have `isLuxe = true`
- All property images are downloaded and processed
- Images are converted to WebP format for optimization
- Images are uploaded to S3 with proper naming conventions

### Error Recovery

The script includes robust error handling:

- **Validation errors**: Properties with missing required fields are skipped
- **Database errors**: Automatic retry with fallback to "Unknown Agent"
- **Image processing errors**: Individual image failures don't stop the entire process
- **Network errors**: Timeout handling and retry mechanisms

### Performance Optimization

- **Concurrent processing**: Multiple images processed simultaneously
- **Memory management**: Automatic garbage collection and cleanup
- **Progress reporting**: Real-time status updates
- **Batch processing**: Properties processed in optimized batches

## Troubleshooting

### Common Issues

1. **JSON file not found**
   - Ensure `scripts/listings.json` exists
   - Check file permissions

2. **Environment variables missing**
   - Verify `.env.local` contains all required variables
   - Check variable names match exactly

3. **Memory issues**
   - The script uses 4GB memory limit by default
   - Increase if processing very large files

4. **Database connection errors**
   - Verify `DATABASE_URL` is correct
   - Ensure database is accessible

### Log Analysis

The script provides detailed logging for debugging:

- **Validation errors**: Shows which fields are missing
- **Database errors**: Includes SQL constraint violations
- **Image processing errors**: Network timeouts and conversion failures
- **Performance metrics**: Processing speed and success rates

## Related Files

- `scripts/import-propertyfinder.ts` - Main script file
- `actions/import-propertyfinder-json-action.ts` - Core import logic
- `scripts/listings.json` - Input JSON file
- `.env.local` - Environment configuration
- `docs/propertyfinder-import-guide.md` - Detailed implementation guide

## Requirements Satisfied

This script implementation satisfies the following requirements:

- **6.1**: Script available in package.json as "import:propertyfinder"
- **6.2**: Script executes PropertyFinder import with proper Node.js options
- **6.3**: Script exits with appropriate status codes (0 for success, 1 for failure)
- **6.4**: Script provides comprehensive console output showing progress and results