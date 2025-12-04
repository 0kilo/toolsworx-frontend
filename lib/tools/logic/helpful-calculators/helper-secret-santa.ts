/**
 * Secret Santa Generator Logic
 * Pure functions for generating Secret Santa assignments
 */

export interface Participant {
  id: number
  name: string
  email: string
}

export interface Assignment {
  giver: Participant
  receiver: Participant
}

export interface SecretSantaInput {
  participants: Participant[]
}

export interface SecretSantaOutput {
  assignments: Assignment[]
}

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export function generateSecretSanta(input: SecretSantaInput): SecretSantaOutput {
  const validParticipants = input.participants.filter(p => p.name.trim() && p.email.trim())

  if (validParticipants.length < 3) {
    throw new Error('You need at least 3 participants with names and emails')
  }

  const shuffled = shuffleArray(validParticipants)
  const assignments: Assignment[] = shuffled.map((giver, index) => ({
    giver,
    receiver: shuffled[(index + 1) % shuffled.length]
  }))

  return { assignments }
}
