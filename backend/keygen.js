import "dotenv/config"; // Loads environment variables from .env file
import { generateKeyPair } from "crypto"; // Import the `generateKeyPair` function from the `crypto` module for asymmetric key generation
import * as fs from "fs"; // Import the `fs` module for file system operations

// Define file paths for the public and private keys
const publicKeyPem = "./public.pem"; // Path to the public key file
const privateKeyPem = "./private.pem"; // Path to the private key file

// Function to generate and save the key pair
function generateKeyFiles() {
  // Generate a new RSA key pair
  generateKeyPair(
    "rsa", // Specify the algorithm (RSA)
    {
      modulusLength: 2048, // Key length in bits (consider increasing for stronger security)
      publicKeyEncoding: {
        type: "spki", // Public key format (Subject Public Key Info)
        format: "pem", // Format as PEM (Privacy-Enhanced Mail)
      },
      privateKeyEncoding: {
        type: "pkcs8", // Private key format (PKCS#8)
        format: "pem", // Format as PEM
        cipher: "aes-256-cbc", // Encryption cipher for the private key
        passphrase: process.env.CRYPTO_PASSPHRASE, // Passphrase to protect the private key
      },
    },
    (err, publicKey, privateKey) => {
      if (err) {
        console.error("Error generating key pair:", err);
        // Consider implementing more robust error handling, such as retrying or alerting
        return;
      }

      // Write the public key to a file
      fs.writeFileSync(publicKeyPem, publicKey);

      // Write the private key to a file
      fs.writeFileSync(privateKeyPem, privateKey);
    }
  );
}

// Call the function to generate the key pair
generateKeyFiles();
