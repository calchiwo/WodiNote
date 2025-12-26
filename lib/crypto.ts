// AES-256-GCM encryption utilities for offline note encryption

const ALGORITHM = "AES-GCM"
const KEY_LENGTH = 256
const IV_LENGTH = 12 // 96 bits for GCM
const TAG_LENGTH = 128 // 128 bits for authentication tag
const SALT_LENGTH = 16 // 128 bits for key derivation

interface EncryptedData {
  ciphertext: string
  iv: string
  salt: string
}

// Generate a random device key on first load
export async function generateDeviceKey(): Promise<CryptoKey> {
  return await window.crypto.subtle.generateKey(
    {
      name: ALGORITHM,
      length: KEY_LENGTH,
    },
    true, // extractable
    ["encrypt", "decrypt"],
  )
}

// Export key to string for storage
export async function exportKey(key: CryptoKey): Promise<string> {
  const exported = await window.crypto.subtle.exportKey("raw", key)
  return btoa(String.fromCharCode(...new Uint8Array(exported)))
}

// Import key from string
export async function importKey(keyString: string): Promise<CryptoKey> {
  const binaryString = atob(keyString)
  const bytes = new Uint8Array(binaryString.length)
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i)
  }
  return await window.crypto.subtle.importKey("raw", bytes, ALGORITHM, true, ["encrypt", "decrypt"])
}

// Encrypt text using AES-256-GCM
export async function encryptText(text: string, key: CryptoKey): Promise<EncryptedData> {
  const encoder = new TextEncoder()
  const data = encoder.encode(text)

  // Generate random IV and salt
  const iv = window.crypto.getRandomValues(new Uint8Array(IV_LENGTH))
  const salt = window.crypto.getRandomValues(new Uint8Array(SALT_LENGTH))

  // Encrypt
  const ciphertext = await window.crypto.subtle.encrypt(
    {
      name: ALGORITHM,
      iv: iv,
      tagLength: TAG_LENGTH,
    },
    key,
    data,
  )

  // Convert to base64 for storage
  return {
    ciphertext: btoa(String.fromCharCode(...new Uint8Array(ciphertext))),
    iv: btoa(String.fromCharCode(...iv)),
    salt: btoa(String.fromCharCode(...salt)),
  }
}

// Decrypt text using AES-256-GCM
export async function decryptText(encrypted: EncryptedData, key: CryptoKey): Promise<string> {
  // Convert from base64
  const ciphertext = new Uint8Array(
    atob(encrypted.ciphertext)
      .split("")
      .map((c) => c.charCodeAt(0)),
  )
  const iv = new Uint8Array(
    atob(encrypted.iv)
      .split("")
      .map((c) => c.charCodeAt(0)),
  )

  // Decrypt
  const decrypted = await window.crypto.subtle.decrypt(
    {
      name: ALGORITHM,
      iv: iv,
      tagLength: TAG_LENGTH,
    },
    key,
    ciphertext,
  )

  const decoder = new TextDecoder()
  return decoder.decode(decrypted)
}
