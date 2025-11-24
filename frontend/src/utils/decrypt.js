/* // Base64 → ArrayBuffer
const base64ToArrayBuffer = (base64) => {
  const binary = atob(base64);
  const len = binary.length;
  const bytes = new Uint8Array(len);

  for (let i = 0; i < len; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
};

// Load saved AES key from chrome.storage
export const loadEncryptionKey = async () => {
  const { encryptionKey } = await chrome.storage.local.get("encryptionKey");
  if (!encryptionKey) return null;

  const rawKeyBuffer = base64ToArrayBuffer(encryptionKey);

  return await crypto.subtle.importKey(
    "raw",
    rawKeyBuffer,
    { name: "AES-GCM" },
    false,
    ["encrypt", "decrypt"]
  );
};

// Decrypt token using AES-GCM
export const decryptToken = async (encryptedBase64, ivBase64) => {
  const key = await loadEncryptionKey();
  if (!key) throw new Error("Encryption key not found");

  // Convert Base64 IV → Uint8Array
  const iv = new Uint8Array(base64ToArrayBuffer(ivBase64));

  // Convert Base64 ciphertext → ArrayBuffer
  const encryptedArrayBuffer = base64ToArrayBuffer(encryptedBase64);

  // Decrypt
  const decryptedBuffer = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    key,
    encryptedArrayBuffer
  );

  // Convert ArrayBuffer → text
  return new TextDecoder().decode(decryptedBuffer);
};
 */
