"use client"

export function useLocalPreset<T>(key: string) {
  const savePreset = (value: T): boolean => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
      return true
    } catch {
      return false
    }
  }

  const loadPreset = (): T | null => {
    try {
      const raw = localStorage.getItem(key)
      if (!raw) return null
      return JSON.parse(raw) as T
    } catch {
      return null
    }
  }

  const clearPreset = (): boolean => {
    try {
      localStorage.removeItem(key)
      return true
    } catch {
      return false
    }
  }

  return { savePreset, loadPreset, clearPreset }
}
