#!/bin/bash

# This script updates import statements from the old auth library to the new one
# Find all files containing the old import pattern and update them

find /Users/joshua/Code/trpe-next -type f -name "*.tsx" -exec grep -l "import {validateRequest} from \"@/lib/auth\"" {} \; | while read file; do
  echo "Updating $file"
  sed -i '' 's/import {validateRequest} from "@\/lib\/auth";/import {validateRequest} from "@\/actions\/auth-session";/' "$file"
done

echo "Update complete!"
