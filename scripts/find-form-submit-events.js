#!/usr/bin/env node

/**
 * Script to find and report all form_submit events in the codebase
 * that should be updated to form_search for search forms
 */

const fs = require('fs');
const path = require('path');

const searchPatterns = [
  /event:\s*['"`]form_submit['"`]/g,
  /['"`]form_submit['"`]/g,
  /dataLayer\.push\([^)]*form_submit[^)]*\)/g
];

const searchDirectories = [
  'app',
  'components', 
  'features',
  'lib',
  'actions',
  'hooks'
];

const fileExtensions = ['.ts', '.tsx', '.js', '.jsx'];

function scanFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const matches = [];
    
    searchPatterns.forEach((pattern, patternIndex) => {
      const patternMatches = [...content.matchAll(pattern)];
      patternMatches.forEach(match => {
        const lines = content.substring(0, match.index).split('\n');
        const lineNumber = lines.length;
        const line = lines[lines.length - 1] + match[0];
        
        matches.push({
          pattern: patternIndex,
          line: lineNumber,
          content: line.trim(),
          fullMatch: match[0]
        });
      });
    });
    
    return matches;
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error.message);
    return [];
  }
}

function scanDirectory(dirPath) {
  const results = [];
  
  try {
    const items = fs.readdirSync(dirPath);
    
    for (const item of items) {
      const fullPath = path.join(dirPath, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
        results.push(...scanDirectory(fullPath));
      } else if (stat.isFile() && fileExtensions.some(ext => item.endsWith(ext))) {
        const matches = scanFile(fullPath);
        if (matches.length > 0) {
          results.push({
            file: fullPath,
            matches
          });
        }
      }
    }
  } catch (error) {
    console.error(`Error scanning directory ${dirPath}:`, error.message);
  }
  
  return results;
}

function main() {
  console.log('🔍 Scanning for form_submit events in the codebase...\n');
  
  const allResults = [];
  
  for (const dir of searchDirectories) {
    if (fs.existsSync(dir)) {
      console.log(`Scanning ${dir}/...`);
      const results = scanDirectory(dir);
      allResults.push(...results);
    }
  }
  
  if (allResults.length === 0) {
    console.log('✅ No form_submit events found in the codebase.');
    console.log('\nThis is good! It means you either:');
    console.log('1. Don\'t have any form_submit events to migrate');
    console.log('2. Have already migrated them');
    console.log('3. Are using GTM auto-event tracking');
    return;
  }
  
  console.log(`\n📋 Found ${allResults.length} files with form_submit events:\n`);
  
  allResults.forEach(result => {
    console.log(`📄 ${result.file}`);
    result.matches.forEach(match => {
      console.log(`   Line ${match.line}: ${match.content}`);
    });
    console.log('');
  });
  
  console.log('🔧 Recommended actions:');
  console.log('1. Review each file to determine if the form_submit event is for a search form');
  console.log('2. For search forms, change "form_submit" to "form_search"');
  console.log('3. Use the trackSearchFormSubmit() function from lib/gtm-events.ts for new search forms');
  console.log('4. Consider using the migration utilities in lib/gtm-migration-utils.ts');
}

if (require.main === module) {
  main();
}
