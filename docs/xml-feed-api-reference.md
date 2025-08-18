# XML Feed API Reference

## Overview

The XML Feed API provides endpoints for fetching, processing, and importing property listings from external XML feeds. This API serves as the bridge between external property data providers and the TRPE real estate platform.

## Base URL

```
https://your-domain.com/api/xml
```

## Authentication

Currently, the XML API endpoints are publicly accessible for the import process. In production environments, consider implementing appropriate authentication mechanisms.

## Endpoints

### GET /api/xml

Fetches property listings from the configured XML feed URL and returns processed JSON data.

#### Request

```http
GET /api/xml HTTP/1.1
Host: your-domain.com
Accept: application/json
```

#### Response

**Success Response (200 OK)**

```json
{
  "list": {
    "property": [
      {
        "reference_number": ["REF001"],
        "title_en": ["Luxury Villa in Downtown"],
        "description_en": ["Beautiful luxury property with stunning views"],
        "price": ["25000000"],
        "bedroom": ["4"],
        "bathroom": ["3"],
        "size": ["5000"],
        "plot_size": ["8000"],
        "community": ["Downtown"],
        "sub_community": ["Marina District"],
        "city": ["Dubai"],
        "offering_type": ["Sale"],
        "property_type": ["Villa"],
        "permit_number": ["DLD12345"],
        "last_update": ["11/20/2024 12:50:23"],
        "agent": [
          {
            "name": ["John Smith"],
            "email": ["john.smith@example.com"],
            "phone": ["+971501234567"]
          }
        ],
        "photo": [
          {
            "url": [
              {
                "_": "https://example.com/photo1.jpg",
                "$": {
                  "last_updated": "2024-11-20"
                }
              },
              {
                "_": "https://example.com/photo2.jpg",
                "$": {
                  "last_updated": "2024-11-20"
                }
              }
            ]
          }
        ],
        "private_amenities": ["Swimming Pool, Gym, Garden"],
        "description_structured": {
          "type": "doc",
          "content": [
            {
              "type": "paragraph",
              "content": [
                {
                  "type": "text",
                  "text": "Beautiful luxury property with stunning views"
                }
              ]
            }
          ]
        },
        "property_features": [
          "Swimming Pool",
          "Gym",
          "Garden"
        ],
        "connectivity_info": [
          "Close to Metro",
          "Near Highway"
        ],
        "searchable_description": "Beautiful luxury property with stunning views swimming pool gym garden",
        "description_metadata": {
          "has_features": true,
          "has_connectivity": true,
          "feature_count": 3,
          "connectivity_count": 2,
          "processed_at": "2024-12-01T10:00:00.000Z"
        }
      }
    ]
  },
  "processing_info": {
    "total_properties": 1,
    "properties_with_structured_descriptions": 1,
    "processed_at": "2024-12-01T10:00:00.000Z"
  }
}
```

**Error Response (500 Internal Server Error)**

```json
{
  "error": "Failed to fetch and parse XML"
}
```

#### Response Schema

##### Property Object

| Field | Type | Description | Required |
|-------|------|-------------|----------|
| `reference_number` | `string[]` | Unique property reference | ✅ |
| `title_en` | `string[]` | Property title in English | ✅ |
| `description_en` | `string[]` | Property description | ❌ |
| `price` | `string[]` | Property price in AED | ✅ |
| `bedroom` | `string[]` | Number of bedrooms | ✅ |
| `bathroom` | `string[]` | Number of bathrooms | ✅ |
| `size` | `string[]` | Property size in sqft | ❌ |
| `plot_size` | `string[]` | Plot size in sqft | ❌ |
| `community` | `string[]` | Community name | ❌ |
| `sub_community` | `string[]` | Sub-community name | ❌ |
| `city` | `string[]` | City name | ✅ |
| `offering_type` | `string[]` | Sale/Rent type | ✅ |
| `property_type` | `string[]` | Property type (Villa, Apartment, etc.) | ✅ |
| `permit_number` | `string[]` | DLD permit number | ❌ |
| `last_update` | `string[]` | Last update timestamp | ❌ |
| `agent` | `Agent[]` | Agent information | ✅ |
| `photo` | `Photo[]` | Property images | ❌ |
| `private_amenities` | `string[]` | Amenities list | ❌ |

##### Enhanced Fields (Added by Processing)

| Field | Type | Description |
|-------|------|-------------|
| `description_structured` | `TipTapContent` | TipTap editor format |
| `property_features` | `string[]` | Extracted features list |
| `connectivity_info` | `string[]` | Connectivity information |
| `searchable_description` | `string` | Clean searchable text |
| `description_metadata` | `DescriptionMetadata` | Processing metadata |

##### Agent Object

| Field | Type | Description | Required |
|-------|------|-------------|----------|
| `name` | `string[]` | Agent name | ✅ |
| `email` | `string[]` | Agent email | ✅ |
| `phone` | `string[]` | Agent phone | ✅ |

##### Photo Object

| Field | Type | Description |
|-------|------|-------------|
| `url` | `PhotoUrl[]` | Array of photo URLs |

##### PhotoUrl Object

| Field | Type | Description |
|-------|------|-------------|
| `_` | `string` | Image URL |
| `$` | `PhotoMetadata` | Image metadata |

##### PhotoMetadata Object

| Field | Type | Description |
|-------|------|-------------|
| `last_updated` | `string` | Last update date |

##### ProcessingInfo Object

| Field | Type | Description |
|-------|------|-------------|
| `total_properties` | `number` | Total properties processed |
| `properties_with_structured_descriptions` | `number` | Properties with enhanced descriptions |
| `processed_at` | `string` | Processing timestamp |

#### Example Usage

##### JavaScript/TypeScript

```typescript
// Fetch XML feed data
async function fetchPropertyFeed() {
  try {
    const response = await fetch('/api/xml');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    console.log(`Found ${data.list.property.length} properties`);
    console.log(`Processing info:`, data.processing_info);
    
    return data;
  } catch (error) {
    console.error('Failed to fetch property feed:', error);
    throw error;
  }
}

// Use the data
fetchPropertyFeed().then(data => {
  data.list.property.forEach(property => {
    console.log(`Property: ${property.reference_number[0]}`);
    console.log(`Price: ${property.price[0]} AED`);
    console.log(`Features: ${property.property_features?.join(', ')}`);
  });
});
```

##### curl

```bash
# Basic request
curl -X GET \
  https://your-domain.com/api/xml \
  -H "Accept: application/json"

# With error handling
curl -X GET \
  https://your-domain.com/api/xml \
  -H "Accept: application/json" \
  -w "HTTP Status: %{http_code}\n" \
  -s --fail
```

##### Python

```python
import requests
import json

def fetch_property_feed():
    try:
        response = requests.get('https://your-domain.com/api/xml')
        response.raise_for_status()
        
        data = response.json()
        
        print(f"Found {len(data['list']['property'])} properties")
        print(f"Processing info: {data['processing_info']}")
        
        return data
    except requests.exceptions.RequestException as e:
        print(f"Failed to fetch property feed: {e}")
        raise

# Use the data
data = fetch_property_feed()
for property in data['list']['property']:
    print(f"Property: {property['reference_number'][0]}")
    print(f"Price: {property['price'][0]} AED")
    if 'property_features' in property:
        print(f"Features: {', '.join(property['property_features'])}")
```

## Import Workflow Integration

The XML API is typically used as part of a larger import workflow:

### 1. Data Fetching

```typescript
// Step 1: Fetch processed XML data
const xmlData = await fetch('/api/xml').then(res => res.json());
```

### 2. Import Processing

```typescript
// Step 2: Import into database
import { saveXmlListing } from '@/actions/save-xml-listing-action';

const result = await saveXmlListing('https://feed.example.com/properties.xml');

if (result.success) {
  console.log('Import completed:', result.stats);
} else {
  console.error('Import failed:', result.error);
}
```

## Error Handling

### Common Error Scenarios

#### Network Errors

```json
{
  "error": "Failed to fetch and parse XML",
  "details": "Network timeout after 30 seconds"
}
```

**Causes:**
- Feed provider downtime
- Network connectivity issues
- Timeout due to large feed size

**Solutions:**
- Implement retry logic with exponential backoff
- Monitor feed provider status
- Increase timeout settings for large feeds

#### XML Parsing Errors

```json
{
  "error": "Failed to fetch and parse XML",
  "details": "XML parsing error: unexpected token"
}
```

**Causes:**
- Malformed XML structure
- Encoding issues
- Incomplete feed transmission

**Solutions:**
- Validate XML structure before processing
- Handle encoding detection automatically
- Implement feed validation

#### Processing Errors

```json
{
  "error": "Failed to fetch and parse XML",
  "details": "Property processing failed: missing required fields"
}
```

**Causes:**
- Invalid property data structure
- Missing required fields
- Data type mismatches

**Solutions:**
- Implement comprehensive data validation
- Provide default values for optional fields
- Log detailed error information for debugging

### Error Response Format

All error responses follow this format:

```json
{
  "error": "Brief error description",
  "details": "Detailed error information (optional)",
  "timestamp": "2024-12-01T10:00:00.000Z",
  "endpoint": "/api/xml"
}
```

## Rate Limiting

### Current Limits

- **Requests per minute**: 60
- **Requests per hour**: 1000
- **Concurrent requests**: 10

### Rate Limit Headers

```http
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 59
X-RateLimit-Reset: 1640995200
```

### Rate Limit Exceeded Response

```json
{
  "error": "Rate limit exceeded",
  "message": "Too many requests. Try again in 60 seconds.",
  "retry_after": 60
}
```

## Caching

### Cache Strategy

- **Cache Duration**: 5 minutes for successful responses
- **Cache Key**: Based on feed URL and timestamp
- **Cache Headers**: Includes ETag and Last-Modified

### Cache Headers

```http
Cache-Control: public, max-age=300
ETag: "abc123def456"
Last-Modified: Mon, 01 Dec 2024 10:00:00 GMT
```

### Conditional Requests

```http
GET /api/xml HTTP/1.1
If-None-Match: "abc123def456"
If-Modified-Since: Mon, 01 Dec 2024 10:00:00 GMT
```

**304 Not Modified Response:**

```http
HTTP/1.1 304 Not Modified
Cache-Control: public, max-age=300
ETag: "abc123def456"
```

## Performance Considerations

### Response Size

- **Typical Response**: 50KB - 5MB depending on property count
- **Large Feeds**: Can exceed 50MB for 10,000+ properties
- **Compression**: Gzip compression enabled automatically

### Processing Time

- **Small Feeds** (<100 properties): 1-3 seconds
- **Medium Feeds** (100-1000 properties): 3-15 seconds
- **Large Feeds** (1000+ properties): 15-60 seconds

### Optimization Tips

1. **Use Conditional Requests**: Leverage ETag and Last-Modified headers
2. **Implement Client Caching**: Cache responses for 5 minutes
3. **Process Incrementally**: For large feeds, consider pagination
4. **Monitor Performance**: Track response times and adjust timeouts

## Testing

### Unit Tests

```bash
# Run XML API tests
npm test -- __tests__/xml-feed-import-unit.test.ts
```

### Integration Tests

```bash
# Run integration tests
npm test -- __tests__/xml-feed-import-integration.test.ts
```

### Performance Tests

```bash
# Run performance benchmarks
npm test -- __tests__/xml-feed-import-performance.test.ts
```

### Manual Testing

```bash
# Test API endpoint directly
curl -X GET http://localhost:3000/api/xml | jq .

# Test with timing
time curl -X GET http://localhost:3000/api/xml > /dev/null
```

## Monitoring

### Health Checks

```typescript
// Health check endpoint
GET /api/xml/health

// Response
{
  "status": "healthy",
  "feed_accessible": true,
  "last_successful_fetch": "2024-12-01T10:00:00.000Z",
  "response_time_ms": 1234
}
```

### Metrics

Key metrics to monitor:

- **Response Time**: Average API response time
- **Success Rate**: Percentage of successful requests
- **Error Rate**: Percentage of failed requests
- **Feed Availability**: Uptime of external XML feed
- **Data Quality**: Percentage of valid properties

### Alerts

Set up alerts for:

- Response time > 30 seconds
- Error rate > 5%
- Feed unavailable for > 5 minutes
- Data quality issues

## Security

### Input Validation

- All XML data is validated before processing
- SQL injection prevention through parameterized queries
- XSS prevention through data sanitization

### Access Control

- Consider implementing API authentication for production
- Rate limiting to prevent abuse
- CORS configuration for cross-origin requests

### Data Privacy

- No sensitive personal data is logged
- Property data is public information
- Agent contact information is handled securely

## Changelog

### v2.0.0 (Current)
- Added description enhancement processing
- Improved error handling and logging
- Enhanced performance monitoring
- Added structured data extraction

### v1.5.0
- Added caching layer
- Implemented rate limiting
- Enhanced error responses

### v1.0.0
- Initial XML API implementation
- Basic feed fetching and parsing
- JSON transformation

---

## Support

For API-related issues:

1. **Check Error Logs**: Review detailed error messages
2. **Test Connectivity**: Verify feed URL accessibility
3. **Monitor Performance**: Check response times and error rates
4. **Review Documentation**: Ensure proper API usage

---

*Last updated: December 2024*
