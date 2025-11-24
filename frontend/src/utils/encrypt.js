/* // Convert Base64 → ArrayBuffer
const base64ToArrayBuffer = (base64) => {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
};

// Convert ArrayBuffer → Base64
const arrayBufferToBase64 = (buffer) => {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)));
};

// Load encryption key
export const loadEncryptionKey = async () => {
  const { encryptionKey } = await chrome.storage.local.get("encryptionKey");
  if (!encryptionKey) return null;

  const rawKey = base64ToArrayBuffer(encryptionKey);

  return await crypto.subtle.importKey(
    "raw",
    rawKey,
    { name: "AES-GCM" },
    false,
    ["encrypt", "decrypt"]
  );
};

// Encrypt
export async function encryptToken(text) {
  const key = await loadEncryptionKey();
  if (!key) throw new Error("Encryption key not found");

  const iv = crypto.getRandomValues(new Uint8Array(12)); // required for AES-GCM

  const encodedText = new TextEncoder().encode(text);

  const encryptedBuffer = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    encodedText
  );

  return {
    encrypted: arrayBufferToBase64(encryptedBuffer),
    iv: arrayBufferToBase64(iv.buffer),
  };
}
 */
