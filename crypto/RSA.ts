import { randomBytes } from "crypto";

/* Fungsi-fungsi utama */

// Pembangkitan kunci publik dan privat RSA
const generateKeyRSA = (): {
  publicKey: { e: bigint; n: bigint };
  privateKey: { d: bigint; n: bigint };
} => {
  const bitLength = 1024; // Panjang bit kunci RSA yang aman

  // Pembangkitan bilangan prima p dan q yang tidak sama
  const [p, q] = generateDistinctPrimes(bitLength);

  // Menghitung n dan phi(n)
  const n = p * q;
  const phi = (p - BigInt(1)) * (q - BigInt(1));

  // Memilih bilangan e yang memenuhi syarat gcd(e, phi(n)) = 1
  const e = choosePublicExponent(phi);

  // Menghitung d dengan invers modulo
  const d = modInverse(e, phi);

  return {
    publicKey: { e, n },
    privateKey: { d, n },
  };
};

// Fungsi untuk mengenkripsi pesan teks ASCII menjadi bilangan bigint
const encryptRSA = (text: string, e: bigint, n: bigint): string => {
  let encryptedMessage = "";
  for (let i = 0; i < text.length; i++) {
    const charCode = BigInt(text.charCodeAt(i));
    const encryptedChar = modPow(charCode, e, n);
    encryptedMessage += encryptedChar.toString() + " "; // Add a space delimiter between encrypted characters
  }
  return encryptedMessage.trim(); // Remove trailing space
};

// Fungsi untuk mendekripsi pesan terenkripsi menjadi teks ASCII
const decryptRSA = (encryptedMessage: string, d: bigint, n: bigint): string => {
  const encryptedChars = encryptedMessage.trim().split(" "); // Split the encrypted message by space delimiter
  let decryptedText = "";
  for (let i = 0; i < encryptedChars.length; i++) {
    const encryptedChar = BigInt(encryptedChars[i]);
    const decryptedChar = modPow(encryptedChar, d, n);
    decryptedText += String.fromCharCode(Number(decryptedChar));
  }
  return decryptedText;
};

/* Fungsi-fungsi helper */

// Fungsi untuk pembangkitan nilai p dan q yang tidak sama
const generateDistinctPrimes = (bitLength: number): [bigint, bigint] => {
  let p, q;
  do {
    p = generatePrimeNumber(bitLength / 2);
    q = generatePrimeNumber(bitLength / 2);
  } while (p === q); // Memastikan p dan q tidak sama
  return [p, q];
};

// Fungsi untuk memilih bilangan e yang memenuhi syarat gcd(e, phi(n)) = 1
const choosePublicExponent = (phi: bigint): bigint => {
  let e = BigInt(65537); // Memulai dengan nilai e yang lebih kecil
  while (true) {
    if (gcd(e, phi) === BigInt(1)) {
      return e;
    }
    e++;
  }
};

// Fungsi untuk menghitung FPB (Faktor Persekutuan Terbesar) dari dua bilangan
const gcd = (a: bigint, b: bigint): bigint => {
  if (b === BigInt(0)) return a;
  return gcd(b, a % b);
};

// Fungsi untuk menghasilkan bilangan prima dengan algoritma Miller-Rabin
const generatePrimeNumber = (bitLength: number): bigint => {
  let primeCandidate;
  do {
    primeCandidate = generateRandomOddBigInt(bitLength);
  } while (!isPrime(primeCandidate));
  return primeCandidate;
};

// Fungsi untuk menghitung invers modulo dengan algoritma Extended Euclidean
const modInverse = (a: bigint, m: bigint): bigint => {
  let [m0, x0, x1] = [m, BigInt(0), BigInt(1)];
  while (a > BigInt(1)) {
    const q = a / m;
    [a, m] = [m, a % m];
    [x0, x1] = [x1 - q * x0, x0];
  }
  return x1 < BigInt(0) ? x1 + m0 : x1;
};

// Fungsi untuk menghitung eksponensiasi modular dengan algoritma Square-and-Multiply
const modPow = (base: bigint, exp: bigint, mod: bigint): bigint => {
  let result = BigInt(1);
  base %= mod;
  while (exp > BigInt(0)) {
    if (exp & BigInt(1)) result = (result * base) % mod;
    exp >>= BigInt(1);
    base = (base * base) % mod;
  }
  return result;
};

// Fungsi untuk mengecek apakah suatu bilangan prima dengan algoritma Miller-Rabin
const isPrime = (n: bigint): boolean => {
  if (n <= BigInt(1)) return false;
  if (n <= BigInt(3)) return true;
  if (n % BigInt(2) === BigInt(0)) return false;
  let d = n - BigInt(1);
  while (d % BigInt(2) === BigInt(0)) d >>= BigInt(1);
  for (let i = 0; i < 40; i++) {
    // Mengurangi jumlah iterasi
    if (!millerRabinTest(n, d)) return false;
  }
  return true;
};

// Fungsi untuk menguji bilangan prima menggunakan algoritma Miller-Rabin
const millerRabinTest = (n: bigint, d: bigint): boolean => {
  const a = BigInt(2) + BigInt(randomNumberInRange(BigInt(2), n - BigInt(4)));
  let x = modPow(a, d, n);
  if (x === BigInt(1) || x === n - BigInt(1)) return true;
  while (d !== n - BigInt(1)) {
    x = (x * x) % n;
    d <<= BigInt(1);
    if (x === BigInt(1)) return false;
    if (x === n - BigInt(1)) return true;
  }
  return false;
};

// Fungsi untuk menghasilkan bilangan bulat acak dengan panjang bit tertentu
const generateRandomOddBigInt = (bitLength: number): bigint => {
  const numBytes = Math.ceil(bitLength / 8);
  let randomNum;
  do {
    randomNum = BigInt(`0x${randomBytes(numBytes).toString("hex")}`);
  } while (
    randomNum >= BigInt(1) << BigInt(bitLength - 1) ||
    randomNum % BigInt(2) === BigInt(0)
  );
  return randomNum;
};

// Fungsi untuk menghasilkan bilangan bulat acak di antara dua batasan
const randomNumberInRange = (min: bigint, max: bigint): bigint => {
  const range = max - min;
  const numBytes = Math.ceil(range.toString(16).length / 2);
  let randomNum;
  do {
    randomNum = BigInt(`0x${randomBytes(numBytes).toString("hex")}`);
  } while (randomNum > range);
  return randomNum + min;
};

export { generateKeyRSA, encryptRSA, decryptRSA };
