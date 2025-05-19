// File: static/hash.js
/**
 * Simple SHA-256 hash function for client-side password hashing
 * @param {string} message - The string to hash
 * @returns {Promise<string>} - The hashed string
 */
export default async function hashPassword(message) {
  // Convert string to array buffer
  const msgBuffer = new TextEncoder().encode(message);
  
  // Hash the message
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  
  // Convert ArrayBuffer to hex string
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  return hashHex;
}
