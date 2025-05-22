/**
 * Json type definition
 * 
 * This type represents JSON data that can be stored in a database
 * It supports all valid JSON value types: null, boolean, number, string, arrays, and objects
 */
export type Json =
  | null
  | boolean
  | number
  | string
  | Json[]
  | { [key: string]: Json };