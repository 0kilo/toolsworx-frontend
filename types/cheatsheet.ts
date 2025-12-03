/**
 * Cheatsheet Builder Types
 */

export type CheatsheetLayout = 'single' | 'double';
export type CheatsheetFontSize = 'small' | 'medium' | 'large';
export type CheatsheetColorScheme = 'default' | 'blue' | 'green' | 'purple' | 'red';
export type CheatsheetItemType = 'text' | 'formula' | 'code' | 'list';
export type CheatsheetImportance = 'normal' | 'high';

export interface CheatsheetItem {
  id: string;
  subtitle: string;
  description: string;
  type?: CheatsheetItemType;
  importance?: CheatsheetImportance;
}

export interface CheatsheetData {
  // Core metadata
  title: string;
  date: string; // ISO 8601 format (YYYY-MM-DD)
  subject: string;

  // Optional metadata
  author?: string;
  category?: string;
  tags?: string[];
  version?: string;

  // Styling options
  layout?: CheatsheetLayout;
  fontSize?: CheatsheetFontSize;
  colorScheme?: CheatsheetColorScheme;

  // Content items
  items: CheatsheetItem[];
}

export interface CheatsheetTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  data: CheatsheetData;
}
