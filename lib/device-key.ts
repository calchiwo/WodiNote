// Device key management - generates and persists a unique device key

import { generateDeviceKey, exportKey, importKey } from "./crypto"

const DEVICE_KEY_STORAGE_KEY = "wodinote_device_key"

let cachedKey: CryptoKey | null = null

// Get or create device key
export async function getDeviceKey(): Promise<CryptoKey> {
  // Return cached key if available
  if (cachedKey) {
    return cachedKey
  }

  // Try to load from localStorage
  const storedKey = localStorage.getItem(DEVICE_KEY_STORAGE_KEY)
  if (storedKey) {
    cachedKey = await importKey(storedKey)
    return cachedKey
  }

  // Generate new key and store it
  const newKey = await generateDeviceKey()
  const exportedKey = await exportKey(newKey)
  localStorage.setItem(DEVICE_KEY_STORAGE_KEY, exportedKey)
  cachedKey = newKey
  return newKey
}

// Clear cached key (useful for testing)
export function clearCachedKey(): void {
  cachedKey = null
}
