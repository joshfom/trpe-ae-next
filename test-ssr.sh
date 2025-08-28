#!/bin/bash

# Test SSR functionality for TRPE homepage
echo "Testing SSR functionality..."

# Test 1: Check if homepage loads without JavaScript
echo "1. Testing homepage SSR..."
curl -s http://localhost:3000 | grep -q "Featured Properties" && echo "✅ Featured Properties section found in SSR" || echo "❌ Featured Properties section not found"

# Test 2: Check if search form is present
echo "2. Testing search form SSR..."
curl -s http://localhost:3000 | grep -q 'placeholder="Search properties' && echo "✅ Search form found in SSR" || echo "❌ Search form not found"

# Test 3: Check if property cards are rendered
echo "3. Testing property cards SSR..."
curl -s http://localhost:3000 | grep -q 'class.*property' && echo "✅ Property cards found in SSR" || echo "❌ Property cards not found"

# Test 4: Check if images are loaded
echo "4. Testing images SSR..."
curl -s http://localhost:3000 | grep -q '<img' && echo "✅ Images found in SSR" || echo "❌ Images not found"

# Test 5: Check if form action attributes are present
echo "5. Testing form functionality SSR..."
curl -s http://localhost:3000 | grep -q 'action="/properties' && echo "✅ Form actions found in SSR" || echo "❌ Form actions not found"

echo ""
echo "SSR Test Complete!"
