/* export const generateEncryptionKey = async () => {
  const key = await crypto.subtle.generateKey(
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );
  const rawKey = await crypto.subtle.exportKey("raw", key);
  const based64 = btoa(String.fromCharCode(...new Uint8Array(rawKey)));
  await chrome.storage.local.set({ encryptionKey: based64 });
};
chrome.runtime.onInstalled.addListener(() => {
  generateEncryptionKey();
});
 */
