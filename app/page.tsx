"use client";
import React from "react";
import { generateKeyRSA, encryptRSA, decryptRSA } from "./RSA";

const Page = () => {
  // Generate RSA key pair
  const { publicKey, privateKey } = generateKeyRSA();

  // Test encryption and decryption
  const message =
    "the curly haired man like to drink coffee everyday at 07.00 AM #%$^&*(@!"; // Contoh pesan yang akan dienkripsi
  console.log("Original Message:", message);

  const ciphertext = encryptRSA(message, publicKey.e, publicKey.n);
  console.log("Encrypted Message:", ciphertext);

  const decryptedMessage = decryptRSA(ciphertext, privateKey.d, privateKey.n);
  console.log("Decrypted Message:", decryptedMessage);

  // Save keys to files
  // saveKeysToFile(publicKey, privateKey);

  return (
    <div>
      <h1>RSA Encryption and Decryption</h1>
      <h1>Message : {message}</h1>
      <h1>Encrypted Message : {ciphertext}</h1>
      <h1>Decrypted Message : {decryptedMessage}</h1>
    </div>
  );
};

export default Page;
