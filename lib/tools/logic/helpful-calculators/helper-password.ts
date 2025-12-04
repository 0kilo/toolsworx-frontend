/**
 * Password Generator Logic
 * Pure functions for generating secure passwords
 */

export interface PasswordOptions {
  length: number
  uppercase: boolean
  lowercase: boolean
  numbers: boolean
  symbols: boolean
}

export interface PasswordOutput {
  password: string
}

export function generatePassword(options: PasswordOptions): PasswordOutput {
  let charset = ""
  if (options.uppercase) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
  if (options.lowercase) charset += "abcdefghijklmnopqrstuvwxyz"
  if (options.numbers) charset += "0123456789"
  if (options.symbols) charset += "!@#$%^&*()_+-=[]{}|;:,.<>?"

  if (charset === "") {
    return { password: "" }
  }

  let password = ""
  for (let i = 0; i < options.length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length))
  }

  return { password }
}
