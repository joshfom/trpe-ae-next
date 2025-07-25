# GTM Form Event Migration Guide

This document outlines the changes made to update search form events from `form_submit` to `form_search` and enhance contact form tracking in your Google Tag Manager implementation.

## Summary of Changes

### 1. Updated GTM Events Library (`lib/gtm-events.ts`)

#### Search Form Tracking
Added a new function `trackSearchFormSubmit()` that sends `form_search` events instead of `form_submit` for search forms:

```typescript
trackSearchFormSubmit({
  form_id: "property-search-form",
  form_name: "Property Search Form", 
  form_destination: "https://trpe.ae/",
  form_length: 7,
  search_term: "dubai marina",
  filters: { community: "Dubai Marina", minPrice: 1000000 },
  send_to: "AW-11470392777"
});
```

This generates a dataLayer event like:
```javascript
dataLayer.push({
  event: "form_search", // Changed from form_submit
  eventModel: {
    form_id: "property-search-form",
    form_name: "Property Search Form",
    form_destination: "https://trpe.ae/",
    form_length: 7,
    event_callback: "Function",
    send_to: "AW-11470392777"
  },
  eventCallback: "Function",
  search_term: "dubai marina",
  filters: { community: "Dubai Marina", minPrice: 1000000 },
  gtm: {
    uniqueEventId: 123456,
    priorityId: 8
  }
});
```

#### Enhanced Contact Form Tracking
Added a new function `trackContactFormSubmit()` that provides detailed form data for contact forms:

```typescript
trackContactFormSubmit({
  form_id: "general-contact-form",
  form_name: "General Contact Form",
  form_type: "general_contact",
  form_destination: "https://trpe.ae/",
  form_length: 5,
  user_data: {
    name: "John Doe",
    email: "john@example.com",
    phone: "+971501234567",
    message: "I'm interested in properties"
  }
});
```

This generates a detailed contact form event:
```javascript
dataLayer.push({
  event: "contact_form_submit",
  eventModel: {
    form_id: "general-contact-form",
    form_name: "General Contact Form",
    form_destination: "https://trpe.ae/",
    form_length: 5,
    form_type: "general_contact",
    property_id: null,
    event_callback: "Function",
    send_to: "AW-11470392777"
  },
  eventCallback: "Function",
  user_data: {
    name: "John Doe",
    email: "john@example.com",
    phone: "+971501234567",
    message: "I'm interested in properties"
  },
  gtm: {
    uniqueEventId: 123456,
    priorityId: 8
  }
});
```

### 2. Updated Search Form Components

#### PropertyPageSearchFilterOptimized.tsx
- Added import for `trackSearchFormSubmit`
- Updated `handleFormSubmit` to track search form submissions with detailed filter data

#### PropertyPageSearchFilterClient.tsx  
- Added import for `trackSearchFormSubmit`
- Updated `handleSubmit` to track simple search form submissions

### 3. Updated Contact Form Components

#### features/site/components/ContactForm.tsx
- Added enhanced GTM tracking with `trackContactFormSubmit`
- Tracks form type: `general_contact`
- Includes user data: name, email, phone, message, subject

#### components/SellerContactForm.tsx
- Added enhanced GTM tracking with `trackContactFormSubmit`
- Tracks form type: `seller_contact`
- Includes user data: name, email, phone, city, property type, message

#### components/EnhancedContactForm.tsx
- Added enhanced GTM tracking with `trackContactFormSubmit`
- Tracks form type: `enhanced_contact`
- Includes user data: first name, last name, email, phone, city, budget, currency, request type, message

#### features/properties/components/ListPropertyForm.tsx
- Added enhanced GTM tracking with `trackContactFormSubmit`
- Tracks form type: `property_listing`
- Includes user data: first name, last name, email, phone, offering type, property type, address, message

### 4. Migration Utilities (`lib/gtm-migration-utils.ts`)

Created utilities to help with the migration:

- `interceptFormSubmitEvents()` - Automatically converts `form_submit` to `form_search` for search-related forms
- `addSearchFormTracking()` - Scans page for search forms and adds proper tracking
- `auditFormSubmitEvents()` - Finds existing `form_submit` events in dataLayer
- `initializeGTMMigration()` - Initializes all migration utilities

### 5. Audit Script (`scripts/find-form-submit-events.js`)

Created a Node.js script to scan the codebase for any hardcoded `form_submit` events that need to be updated.

## Form Types and Their GTM Events

### Search Forms → `form_search` event
- PropertyPageSearchFilterOptimized
- PropertyPageSearchFilterClient

### Contact Forms → `contact_form_submit` event
- General Contact Form (`general_contact`)
- Seller Contact Form (`seller_contact`)
- Enhanced Contact Form (`enhanced_contact`)
- Property Listing Form (`property_listing`)

## Data Structure Comparison

### Search Forms
```javascript
// Search form events now use form_search instead of form_submit
{
  event: "form_search",
  eventModel: { /* form metadata */ },
  search_term: "search query",
  filters: { /* detailed filter data */ }
}
```

### Contact Forms
```javascript
// Contact form events with enhanced data structure
{
  event: "contact_form_submit",
  eventModel: { 
    form_type: "general_contact",
    /* other form metadata */ 
  },
  user_data: { /* detailed user input data */ }
}
```

## How to Use

### For New Search Forms

Use the new `trackSearchFormSubmit()` function:

```typescript
import { trackSearchFormSubmit } from "@/lib/gtm-events";

const handleSearchSubmit = (formData) => {
  trackSearchFormSubmit({
    form_id: "your-search-form-id",
    form_name: "Your Search Form",
    search_term: formData.query,
    filters: {
      location: formData.location,
      priceRange: formData.priceRange
    }
  });
  
  // Handle form submission...
};
```

### For New Contact Forms

Use the enhanced `trackContactFormSubmit()` function:

```typescript
import { trackContactFormSubmit } from "@/lib/gtm-events";

const handleContactSubmit = (formData) => {
  trackContactFormSubmit({
    form_id: "contact-form-id",
    form_name: "Contact Form",
    form_type: "general_contact",
    user_data: {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      message: formData.message
    }
  });
  
  // Handle form submission...
};
```

### For Existing Forms (Migration)

If you have existing forms that might be using `form_submit` events:

1. **Automatic Migration (Temporary)**:
   ```typescript
   import { initializeGTMMigration } from "@/lib/gtm-migration-utils";
   
   // In your app initialization
   initializeGTMMigration();
   ```

2. **Manual Migration**:
   - Find forms using the audit script: `node scripts/find-form-submit-events.js`
   - Replace `form_submit` with `form_search` for search-related forms
   - Use the appropriate tracking functions

## Google Tag Manager Configuration

Update your GTM triggers and tags to handle the new event structure:

### 1. Search Form Triggers
- Change trigger condition from `Event equals form_submit` to `Event equals form_search`
- Add conditions to filter search-related forms
- Access search data via `{{search_term}}` and `{{filters}}` variables

### 2. Contact Form Triggers
- Keep existing `Event equals contact_form_submit` triggers
- Access enhanced data via `{{user_data}}` and `{{eventModel.form_type}}` variables
- Use form_type to differentiate between different contact forms

### 3. Variable Configuration
Create new GTM variables to access the enhanced data:
- `search_term` → `{{search_term}}`
- `search_filters` → `{{filters}}`
- `form_type` → `{{eventModel.form_type}}`
- `user_name` → `{{user_data.name}}`
- `user_email` → `{{user_data.email}}`
- etc.

## Testing

### 1. Development Testing
The migration utilities include development-only auditing that will log:
- Found `form_submit` events
- Automatic conversions to `form_search`
- Form submissions with detailed data

### 2. GTM Preview Mode
Use GTM's preview mode to verify:
- `form_search` events are firing for search forms
- `contact_form_submit` events are firing for contact forms
- All expected data is being passed correctly
- Events are triggering the correct tags

### 3. Browser Console
Check the browser console for detailed event data and any migration logs.

## Current Status

✅ **Implemented**:
- New `trackSearchFormSubmit()` function with `form_search` event
- Enhanced `trackContactFormSubmit()` function with detailed data
- Updated all main search form components
- Updated all main contact form components
- Migration utilities for automatic detection and conversion
- Audit script for finding existing events

✅ **No Migration Needed**:
- Audit scan found no existing `form_submit` events in the codebase
- Only existing search tracking uses `property_search` event (can remain)

## Next Steps

1. **Test all updated forms** to ensure events are firing correctly
2. **Update GTM configuration** to use new event structure and variables
3. **Monitor for any missed forms** using the migration utilities
4. **Set up conversion tracking** based on the new event data
5. **Remove migration utilities** once you're confident the migration is complete

## Files Modified

### Core Libraries
- `lib/gtm-events.ts` - Added enhanced tracking functions

### Search Forms  
- `features/search/PropertyPageSearchFilterOptimized.tsx` - Added `form_search` tracking
- `features/search/PropertyPageSearchFilterClient.tsx` - Added `form_search` tracking  

### Contact Forms
- `features/site/components/ContactForm.tsx` - Added enhanced contact form tracking
- `components/SellerContactForm.tsx` - Added enhanced contact form tracking
- `components/EnhancedContactForm.tsx` - Added enhanced contact form tracking
- `features/properties/components/ListPropertyForm.tsx` - Added enhanced contact form tracking

### Migration Tools
- `lib/gtm-migration-utils.ts` - Migration utilities (NEW)
- `scripts/find-form-submit-events.js` - Audit script (NEW)
