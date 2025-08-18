#!/bin/bash

echo "Checking for any remaining references to lucia..."
grep -r "lucia" --include="*.ts" --include="*.tsx" /Users/joshua/Code/trpe-next

echo "Checking for any remaining imports from @/lib/auth..."
grep -r "import.*from \"@/lib/auth\"" --include="*.ts" --include="*.tsx" /Users/joshua/Code/trpe-next

echo "Done!"
