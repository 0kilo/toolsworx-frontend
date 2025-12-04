/**
 * Regex Tester Logic
 * Pure functions for testing regular expressions
 */

export interface RegexMatch {
  match: string
  index: number
  groups?: string[]
}

export interface RegexTestInput {
  pattern: string
  flags: string
  testString: string
}

export interface RegexTestOutput {
  matches: RegexMatch[]
}

export function testRegex(input: RegexTestInput): RegexTestOutput {
  const regex = new RegExp(input.pattern, input.flags)
  const matches: RegexMatch[] = []
  
  if (input.flags.includes('g')) {
    let match
    while ((match = regex.exec(input.testString)) !== null) {
      matches.push({
        match: match[0],
        index: match.index,
        groups: match.slice(1)
      })
      if (match.index === regex.lastIndex) break
    }
  } else {
    const match = regex.exec(input.testString)
    if (match) {
      matches.push({
        match: match[0],
        index: match.index,
        groups: match.slice(1)
      })
    }
  }

  return { matches }
}

export function highlightMatches(text: string, matches: RegexMatch[]): string {
  if (matches.length === 0) return text

  let result = ""
  let lastIndex = 0

  matches.forEach((match) => {
    result += text.slice(lastIndex, match.index)
    result += `<mark class="bg-yellow-200 px-1 rounded">${match.match}</mark>`
    lastIndex = match.index + match.match.length
  })
  result += text.slice(lastIndex)

  return result
}
