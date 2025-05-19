// File: scripts/hashPassword.js
import { createHash } from 'crypto';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Function to hash password using SHA-256
function hashPassword(password) {
  return createHash('sha256').update(password).digest('hex');
}

// Prompt user for password
rl.question('Enter password to hash: ', (password) => {
  const hashedPassword = hashPassword(password);
  console.log('\nHashed password (add this to your frontmatter):');
  console.log(`password: ${hashedPassword}`);
  rl.close();
});
