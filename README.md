# Implementasi Algoritma RSA pada Aplikasi Percakapan

## Tugas Kecil 3 - II4031 Kriptografi dan Koding

## Instalasi

1. Clone repository

```bash
git clone https://github.com/gibranfsh/tugas-3-kriptografi-koding-Algoritma-RSA-untuk-simulasi-enkripsi-dekripsi-pada-aplikasi-chat
```

2. Move on to the project directory

```bash
cd tugas-3-kriptografi-koding-Algoritma-RSA-untuk-simulasi-enkripsi-dekripsi-pada-aplikasi-chat
```

3. Open the project with your favorite IDE (for me it's VSCode)

```bash
code .
```

4. Open a terminal and install the dependencies

```bash
npm install
```

5. Run the project in development mode (Make sure you have Node.js installed)

```bash
npm run dev
```

## Makalah dari Aplikasi

Link : https://docs.google.com/document/d/1Vmlusf-UDRAuDsCunP0-fodMsgI-Y4katEQ_fO3KlAI/edit?usp=sharing

## Kontributor

- 18221069 - Gibran Fasha Ghazanfar
- 18221123 - Abraham Megantoro Samudra

## Tabel Fitur

| No  | Feature                                                                                                       | Success (✔) | Fail (❌) | Details                                                                                                                                             |
| :-: | ------------------------------------------------------------------------------------------------------------- | :---------- | :-------- | :-------------------------------------------------------------------------------------------------------------------------------------------------- |
|  1  | Program dapat men-generate public key dan private key menggunakan algoritma RSA                             | ✔           |           | Program men-generate kunci dengan panjang kunci 1024 bit |
|  2  | Program dapat menyimpan public key dan private key dalam file terpisah dengan format nama <nama_orang>_public_key.pub.txt dan <nama_orang>_private_key.pri.txt | ✔           |           | 
|  3  | Program dapat menerima pesan input dari pengguna berupa file sembarang (file text ataupun file biner) ataupun pesan yang diketikkan dari papan-ketik.          | ✔           |           | Pesan yang dimasukkan pengguna dibatasi isinya hanya berupa karakter ASCII (namun, asumsi tidak ada karakter Unicode seperti emoji, huruf Jepang, dan seterusnya) |
|  4  | Program dapat mengenkripsi plaintext dan mendekripsi ciphertext menjadi plaintext semula dengan algoritma RSA.                                                             | ✔           |           |
|  5  | Program menampilkan teks plaintext dan ciphertext di layar percakapan. Khusus untuk ciphertext ditampilkan dalam notasi base64.                                   | ✔           |           |
|  6  | Program dapat menyimpan ciphertext ke dalam file.                                                          | ✔           |           |
|  7  | Program dapat mendekripsi file ciphertext menjadi file plaintext.                                          | ✔           |           |
