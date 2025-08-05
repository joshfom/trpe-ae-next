import React from 'react';
import { StructuredDataSchema } from '@/lib/seo/structured-data-generator';

export interface StructuredDataScriptProps {
  data: StructuredDataSchema | StructuredDataSchema[];
  id?: string;
}

/**
 * Component for injecting structured data (JSON-LD) into the page head
 * Handles both single schema objects and arrays of schemas
 */
export function StructuredDataScript({ data, id }: StructuredDataScriptProps) {
  // Handle both single schema and array of schemas
  const schemaData = Array.isArray(data) ? data : [data];
  
  // If multiple schemas, wrap them in a graph
  const jsonLd = schemaData.length === 1 
    ? schemaData[0]
    : {
        '@context': 'https://schema.org',
        '@graph': schemaData
      };

  return (
    <script
      id={id}
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(jsonLd, null, 0)
      }}
    />
  );
}

/**
 * Hook to validate structured data in development
 */
export function useStructuredDataValidation(data: StructuredDataSchema | StructuredDataSchema[]) {
  React.useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      const schemas = Array.isArray(data) ? data : [data];
      
      schemas.forEach((schema, index) => {
        // Basic validation
        if (!schema['@context']) {
          console.warn(`Structured data schema ${index} missing @context`);
        }
        
        if (!schema['@type']) {
          console.warn(`Structured data schema ${index} missing @type`);
        }
        
        // Validate required properties based on type
        validateSchemaType(schema, index);
      });
    }
  }, [data]);
}

/**
 * Validate schema based on its type
 */
function validateSchemaType(schema: StructuredDataSchema, index: number) {
  const type = Array.isArray(schema['@type']) ? schema['@type'][0] : schema['@type'];
  
  switch (type) {
    case 'Product':
      if (!schema.name) console.warn(`Product schema ${index} missing required 'name' property`);
      if (!schema.description) console.warn(`Product schema ${index} missing recommended 'description' property`);
      if (!schema.image) console.warn(`Product schema ${index} missing recommended 'image' property`);
      break;
      
    case 'Organization':
    case 'RealEstateAgent':
      if (!schema.name) console.warn(`Organization schema ${index} missing required 'name' property`);
      if (!schema.url) console.warn(`Organization schema ${index} missing recommended 'url' property`);
      break;
      
    case 'BreadcrumbList':
      if (!schema.itemListElement || !Array.isArray(schema.itemListElement)) {
        console.warn(`BreadcrumbList schema ${index} missing required 'itemListElement' array`);
      }
      break;
      
    case 'Article':
      if (!schema.headline) console.warn(`Article schema ${index} missing required 'headline' property`);
      if (!schema.author) console.warn(`Article schema ${index} missing recommended 'author' property`);
      if (!schema.datePublished) console.warn(`Article schema ${index} missing recommended 'datePublished' property`);
      break;
      
    case 'LocalBusiness':
      if (!schema.name) console.warn(`LocalBusiness schema ${index} missing required 'name' property`);
      if (!schema.address) console.warn(`LocalBusiness schema ${index} missing recommended 'address' property`);
      break;
      
    case 'FAQPage':
      if (!schema.mainEntity || !Array.isArray(schema.mainEntity)) {
        console.warn(`FAQPage schema ${index} missing required 'mainEntity' array`);
      }
      break;
  }
}

/**
 * Component for multiple structured data scripts with validation
 */
export function StructuredDataScripts({ 
  schemas, 
  validate = false 
}: { 
  schemas: StructuredDataSchema[]; 
  validate?: boolean;
}) {
  // Always call the hook, but conditionally use its functionality
  useStructuredDataValidation(validate ? schemas : []);

  return (
    <>
      {schemas.map((schema, index) => (
        <StructuredDataScript 
          key={index} 
          data={schema} 
          id={`structured-data-${index}`}
        />
      ))}
    </>
  );
}