/**
 * XML Formatter Logic
 * Pure functions for XML formatting and minification
 */

export interface XMLFormatInput {
  xml: string
}

export interface XMLFormatOutput {
  formatted: string
}

export interface XMLMinifyOutput {
  minified: string
}

export function formatXML(input: XMLFormatInput): XMLFormatOutput {
  const PADDING = '  '
  const reg = /(>)(<)(\/*)/g
  let formatted = input.xml.replace(reg, '$1\r\n$2$3')
  
  let pad = 0
  const result = formatted.split('\r\n').map((node) => {
    let indent = 0
    if (node.match(/.+<\/\w[^>]*>$/)) {
      indent = 0
    } else if (node.match(/^<\/\w/) && pad > 0) {
      pad -= 1
    } else if (node.match(/^<\w[^>]*[^\/]>.*$/)) {
      indent = 1
    } else {
      indent = 0
    }
    
    const padding = PADDING.repeat(pad)
    pad += indent
    return padding + node
  }).join('\r\n')

  return { formatted: result }
}

export function minifyXML(input: XMLFormatInput): XMLMinifyOutput {
  const minified = input.xml.trim()
    .replace(/>\s+</g, '><')
    .replace(/\s+/g, ' ')
    .trim()
  
  return { minified }
}

export function validateXML(input: XMLFormatInput): void {
  if (typeof DOMParser === 'undefined') {
    throw new Error('DOMParser not available')
  }
  
  const parser = new DOMParser()
  const xmlDoc = parser.parseFromString(input.xml.trim(), "text/xml")
  
  const parserError = xmlDoc.getElementsByTagName("parsererror")
  if (parserError.length > 0) {
    throw new Error('Invalid XML: ' + parserError[0].textContent)
  }
}
