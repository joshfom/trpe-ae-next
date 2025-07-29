# Homepage Search GTM Tracking Events

This document outlines all the Google Tag Manager (GTM) data layer events that are tracked for the homepage search functionality.

## Search Component Loading Events

### 1. `search_component_loaded`
- **Triggered when**: MainSearch component mounts on homepage
- **Data**:
  - `component_type`: 'main_search'
  - `page_location`: 'homepage'
  - `search_mode`: Mode of search (general, rental, sale, off-plan)
  - `timestamp`: ISO timestamp

### 2. `search_enhancement_activated`
- **Triggered when**: SearchEnhancement component activates
- **Data**:
  - `search_mode`: Mode of search
  - `page_location`: 'homepage'
  - `timestamp`: ISO timestamp

### 3. `search_component_switched`
- **Triggered when**: Successfully switches from server to client search
- **Data**:
  - `from`: 'server'
  - `to`: 'client'
  - `page_location`: 'homepage'
  - `timestamp`: ISO timestamp

### 4. `search_component_error`
- **Triggered when**: Error switching search components
- **Data**:
  - `error_type`: 'elements_not_found'
  - `page_location`: 'homepage'
  - `timestamp`: ISO timestamp

## User Interaction Events

### 5. `search_input_focused`
- **Triggered when**: User focuses on search input
- **Data**:
  - `search_location`: 'homepage'
  - `search_mode`: Mode of search
  - `component`: 'server_search' or 'interactive_search'
  - `timestamp`: ISO timestamp

### 6. `search_input_changed`
- **Triggered when**: User types in search input (interactive version)
- **Data**:
  - `search_query_length`: Length of search query
  - `search_location`: 'homepage'
  - `search_mode`: Mode of search
  - `component`: 'interactive_search'
  - `timestamp`: ISO timestamp

### 7. `search_input_typing`
- **Triggered when**: User stops typing for 1 second (server version)
- **Data**:
  - `search_query_length`: Length of search query
  - `search_location`: 'homepage'
  - `search_mode`: Mode of search
  - `component`: 'server_search'
  - `timestamp`: ISO timestamp

### 8. `search_filter_changed`
- **Triggered when**: User changes offering type (For Sale, For Rent, etc.)
- **Data**:
  - `filter_type`: 'offering_type'
  - `filter_value`: Selected offering type slug
  - `search_location`: 'homepage'
  - `search_mode`: Mode of search
  - `timestamp`: ISO timestamp

### 9. `search_community_selected`
- **Triggered when**: User selects a community from dropdown
- **Data**:
  - `community_name`: Name of selected community
  - `community_slug`: Slug of selected community
  - `search_location`: 'homepage'
  - `offering_type`: Current offering type
  - `timestamp`: ISO timestamp

### 10. `search_community_removed`
- **Triggered when**: User removes a selected community
- **Data**:
  - `community_name`: Name of removed community
  - `community_slug`: Slug of removed community
  - `search_location`: 'homepage'
  - `search_mode`: Mode of search
  - `timestamp`: ISO timestamp

### 11. `search_dropdown_opened`
- **Triggered when**: Search dropdown opens
- **Data**:
  - `search_location`: 'homepage'
  - `search_mode`: Mode of search
  - `timestamp`: ISO timestamp

### 12. `mobile_search_opened`
- **Triggered when**: Mobile search modal opens
- **Data**:
  - `search_location`: 'homepage'
  - `search_mode`: Mode of search
  - `timestamp`: ISO timestamp

### 13. `popular_search_clicked`
- **Triggered when**: User clicks on popular search links
- **Data**:
  - `search_term`: The clicked search term
  - `destination_url`: URL user is navigating to
  - `page_location`: 'homepage'
  - `component`: 'server_search'
  - `timestamp`: ISO timestamp

## Search Submission Events

### 14. `search_submitted`
- **Triggered when**: User submits search form
- **Data**:
  - `search_location`: 'homepage'
  - `search_mode`: Mode of search
  - `search_type`: Type of search (for-sale, for-rent, etc.)
  - `search_query`: User's search query
  - `selected_communities`: Array of selected community names
  - `selected_communities_count`: Number of selected communities
  - `form_data`: Object containing all form data (unit_type, min_price, max_price, etc.)
  - `timestamp`: ISO timestamp

## Usage in GTM

These events can be used in GTM to:
- Track user engagement with search functionality
- Create conversion funnels for property searches
- Monitor search behavior and optimize UX
- Set up goals and audiences based on search interactions
- A/B test different search interfaces

## Example GTM Trigger Setup

```javascript
// Trigger for search submissions
trigger_name: "Homepage Search Submitted"
trigger_type: "Custom Event"
event_name: "search_submitted"

// Trigger for community selections
trigger_name: "Community Selected"
trigger_type: "Custom Event" 
event_name: "search_community_selected"
```
