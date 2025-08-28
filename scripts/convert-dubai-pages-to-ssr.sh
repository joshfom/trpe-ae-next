#!/bin/bash

# Dubai Property Pages SSR Conversion Script
# This script converts remaining Dubai property pages to use Server-Side Rendering

echo "🔄 Converting Dubai property pages to SSR..."

# Array of remaining files to update
declare -a files=(
    "/Users/joshua/Dev/trpe-ae-next/app/(site)/dubai/properties/commercial/for-sale/[search]/page.tsx"
    "/Users/joshua/Dev/trpe-ae-next/app/(site)/dubai/properties/commercial/for-rent/[search]/page.tsx"
    "/Users/joshua/Dev/trpe-ae-next/app/(site)/dubai/properties/residential/for-rent/[search]/[searchLevel2]/page.tsx"
    "/Users/joshua/Dev/trpe-ae-next/app/(site)/dubai/properties/residential/for-sale/[search]/[searchLevel2]/page.tsx"
    "/Users/joshua/Dev/trpe-ae-next/app/(site)/dubai/properties/commercial/for-sale/[search]/[searchLevel2]/page.tsx"
    "/Users/joshua/Dev/trpe-ae-next/app/(site)/dubai/properties/commercial/for-rent/[search]/[searchLevel2]/page.tsx"
)

# Function to update imports in a file
update_imports() {
    local file="$1"
    echo "  📝 Updating imports in $(basename "$file")"
    
    # Update the imports from client to server components
    sed -i '' 's|import Listings from "@/features/properties/components/Listings";|import ListingsServer from "@/features/properties/components/ListingsServer";|g' "$file"
    sed -i '' 's|import PropertyPageSearchFilter from '\''@/features/search/PropertyPageSearchFilter'\'';|import PropertyPageSearchFilterServer from '\''@/features/search/components/PropertyPageSearchFilterServer'\'';|g' "$file"
}

# Function to update component usage in a file
update_components() {
    local file="$1"
    echo "  🔧 Updating component usage in $(basename "$file")"
    
    # Create a temporary file for complex replacements
    local temp_file=$(mktemp)
    
    # Process the file line by line to handle multi-line component replacements
    while IFS= read -r line; do
        if [[ "$line" =~ ^[[:space:]]*\<PropertyPageSearchFilter ]]; then
            # Replace PropertyPageSearchFilter with server version
            echo "            <PropertyPageSearchFilterServer " >> "$temp_file"
            # Read the next lines to get the complete component
            while IFS= read -r next_line; do
                if [[ "$next_line" =~ /\> ]]; then
                    echo "                searchParams={new URLSearchParams(resolvedSearchParams as Record<string, string>)}" >> "$temp_file"
                    echo "                pathname={pathname}" >> "$temp_file"
                    echo "            />" >> "$temp_file"
                    break
                else
                    # Keep other props but modify offeringType if needed
                    echo "$next_line" | sed 's/PropertyPageSearchFilter/PropertyPageSearchFilterServer/g' >> "$temp_file"
                fi
            done
        elif [[ "$line" =~ ^[[:space:]]*\<Listings ]]; then
            # Replace Listings with ListingsServer
            echo "            <ListingsServer " >> "$temp_file"
            # Read the next lines to get the complete component
            while IFS= read -r next_line; do
                if [[ "$next_line" =~ /\> ]]; then
                    echo "                propertyType=\"residential\"" >> "$temp_file"
                    echo "            />" >> "$temp_file"
                    break
                else
                    echo "$next_line" >> "$temp_file"
                fi
            done
        else
            echo "$line" >> "$temp_file"
        fi
    done < "$file"
    
    # Replace the original file with the updated version
    mv "$temp_file" "$file"
}

# Process each file
for file in "${files[@]}"; do
    if [[ -f "$file" ]]; then
        echo "🔄 Processing: $(basename "$file")"
        update_imports "$file"
        update_components "$file"
        echo "✅ Completed: $(basename "$file")"
    else
        echo "⚠️  File not found: $file"
    fi
done

echo "🎉 Dubai property pages SSR conversion completed!"
echo ""
echo "📋 Summary of changes:"
echo "  • Replaced Listings → ListingsServer"
echo "  • Replaced PropertyPageSearchFilter → PropertyPageSearchFilterServer"
echo "  • Added searchParams and pathname props to search filters"
echo "  • Added propertyType prop to listings components"
echo ""
echo "🧪 Next steps:"
echo "  1. Test the pages to ensure they render correctly"
echo "  2. Verify progressive enhancement works"
echo "  3. Check that search functionality works without JavaScript"
