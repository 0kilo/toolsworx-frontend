/**
 * Text Case Converter Logic
 * Pure functions for converting text between different case formats
 */

export interface TextCaseInput {
  text: string
}

export interface TextCaseOutput {
  uppercase: string
  lowercase: string
  titlecase: string
  camelcase: string
  pascalcase: string
  snakecase: string
  kebabcase: string
  constantcase: string
}

export function convertTextCase(input: TextCaseInput): TextCaseOutput {
  const text = input.text.trim()
  
  return {
    uppercase: text.toUpperCase(),
    lowercase: text.toLowerCase(),
    titlecase: text.replace(/\w\S*/g, (txt) => 
      txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    ),
    camelcase: text
      .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => 
        index === 0 ? word.toLowerCase() : word.toUpperCase()
      )
      .replace(/\s+/g, ''),
    pascalcase: text
      .replace(/(?:^\w|[A-Z]|\b\w)/g, (word) => word.toUpperCase())
      .replace(/\s+/g, ''),
    snakecase: text
      .toLowerCase()
      .replace(/\s+/g, '_')
      .replace(/[^\w_]/g, ''),
    kebabcase: text
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]/g, ''),
    constantcase: text
      .toUpperCase()
      .replace(/\s+/g, '_')
      .replace(/[^\w_]/g, '')
  }
}
