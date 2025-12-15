// // backend/utils/codeGen.js
// const crypto = require('crypto');

// const CHARS = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'; // avoid ambiguous chars like I,0,O,1

// function generateReadableCode(length = 8) {
//   const bytes = crypto.randomBytes(length);
//   let out = '';
//   for (let i = 0; i < length; i++) {
//     out += CHARS[bytes[i] % CHARS.length];
//   }
//   return out;
// }

// module.exports = { generateReadableCode };


// backend/utils/codeGen.js
const ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789"; // no I,O,0,1
function generateReadableCode(length = 8) {
  let out = "";
  for (let i = 0; i < length; i++) {
    out += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  }
  return out;
}

module.exports = { generateReadableCode };
