/**
 * Email Extractor Logic
 * Pure function for extracting email addresses from text
 */

export interface EmailExtractInput {
  text: string
}

export interface EmailExtractOutput {
  emails: string[]
}

export function extractEmails(input: EmailExtractInput): EmailExtractOutput {
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g
  const emails = input.text.match(emailRegex)
  
  if (emails && emails.length > 0) {
    const uniqueEmails = [...new Set(emails)].sort()
    return { emails: uniqueEmails }
  }
  
  return { emails: [] }
}
