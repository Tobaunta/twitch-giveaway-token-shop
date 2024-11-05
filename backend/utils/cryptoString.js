import { publicEncrypt, createPrivateKey, privateDecrypt } from "crypto"; // Import necessary functions from the `crypto` module

export const encryptString = (publicKey, plaintext) => {
  // Encrypt the plaintext using the public key
  const encrypted = publicEncrypt(publicKey, Buffer.from(plaintext)); // Encrypt the plaintext using the public key and convert the plaintext to a Buffer

  // Return the base64-encoded ciphertext
  return encrypted.toString("base64"); // Convert the encrypted data to a base64 string and return it
};

export const decryptString = (privateKey, ciphertext) => {
  // Create a private key object from the read private key
  const privateKeyObject = createPrivateKey({
    key: privateKey, // The private key itself
    format: "pem", // The format of the private key (PEM)
    type: "pkcs8", // The type of the private key (PKCS#8)
    cipher: "aes-256-cbc", // The cipher used to encrypt the private key
    passphrase: process.env.CRYPTO_PASSPHRASE, // The passphrase to decrypt the private key
  });

  // Decrypt the base64-encoded ciphertext using the private key
  const decrypted = privateDecrypt(
    {
      key: privateKeyObject, // The private key object
    },
    Buffer.from(ciphertext, "base64") // Convert the base64-encoded ciphertext to a Buffer
  );

  // Return the decrypted plaintext
  return decrypted.toString("utf8"); // Convert the decrypted data to a UTF-8 string and return it
};
