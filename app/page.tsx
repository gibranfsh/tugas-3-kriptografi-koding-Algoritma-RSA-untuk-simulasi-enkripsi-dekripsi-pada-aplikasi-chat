"use client"
import { generateKeyRSA, saveKeysToFile } from "@/crypto/RSA";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Key {
  n: bigint;
  e: bigint;
  d: bigint;
}

export default function Home() {
  const [aliceKey, setAliceKey] = useState<Key>({
    n: BigInt(0),
    e: BigInt(0),
    d: BigInt(0),
  });
  const [bobKey, setBobKey] = useState<Key>({
    n: BigInt(0),
    e: BigInt(0),
    d: BigInt(0),
  });
  const [isGenerated, setIsGenerated] = useState<boolean>(false);

  useEffect(() => {
    const savedKeys = localStorage.getItem("rsaKeys");
    if (savedKeys) {
      const { aliceKey, bobKey } = JSON.parse(savedKeys);
      setAliceKey({
        n: BigInt(aliceKey.n),
        e: BigInt(aliceKey.e),
        d: BigInt(aliceKey.d),
      });
      setBobKey({
        n: BigInt(bobKey.n),
        e: BigInt(bobKey.e),
        d: BigInt(bobKey.d),
      });
      setIsGenerated(true);
    }
  }, []);

  const handleGenerateKey = () => {
    setIsGenerated(true);

    const { publicKey: alicePublicKey, privateKey: alicePrivateKey } = generateKeyRSA();
    const { publicKey: bobPublicKey, privateKey: bobPrivateKey } = generateKeyRSA();

    setAliceKey({
      n: alicePublicKey.n,
      e: alicePublicKey.e,
      d: alicePrivateKey.d,
    });

    setBobKey({
      n: bobPublicKey.n,
      e: bobPublicKey.e,
      d: bobPrivateKey.d,
    });
  };

  const handleJumpToChat = () => {
    localStorage.setItem(
      "rsaKeys",
      JSON.stringify({
        aliceKey: {
          n: aliceKey.n.toString(),
          e: aliceKey.e.toString(),
          d: aliceKey.d.toString(),
        },
        bobKey: {
          n: bobKey.n.toString(),
          e: bobKey.e.toString(),
          d: bobKey.d.toString(),
        },
      })
    );
  };

  const handleSaveKeysToFile = (sender: string) => {
    const { n, e, d } = sender === "Alice" ? aliceKey : bobKey;
    saveKeysToFile({ n, e }, { d, n }, sender);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-[40%]">
        <h1 className="text-4xl font-bold mb-6">RSA Messaging</h1>
        <div className="flex items-center mb-6">
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow-md"
            onClick={handleGenerateKey}
          >
            {isGenerated ? "Regenerate Key" : "Generate Key"}
          </button>
        </div>
        {isGenerated && (
          <div className="grid grid-cols-2 gap-2">
            <div>
              <h2 className="text-lg font-bold mb-4">Alice</h2>
              <div className="flex flex-col gap-2">
                <KeyDetail label="N" value={aliceKey.n.toString()} />
                <KeyDetail label="E" value={aliceKey.e.toString()} />
                <KeyDetail label="D" value={aliceKey.d.toString()} />
                <div className="flex justify-start">
                  <button
                    onClick={() => handleSaveKeysToFile("Alice")}
                    className="text-white underline underline-offset-2 font-bold mt-2 w-3/4 text-left"
                  >
                    Save Alice's Keys
                  </button>
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-lg font-bold mb-4">Bob</h2>
              <div className="flex flex-col gap-2">
                <KeyDetail label="N" value={bobKey.n.toString()} />
                <KeyDetail label="E" value={bobKey.e.toString()} />
                <KeyDetail label="D" value={bobKey.d.toString()} />
                <div className="flex justify-end">
                  <button
                    onClick={() => handleSaveKeysToFile("Bob")}
                    className="text-white underline underline-offset-2 font-bold mt-2 w-3/4 text-right"
                  >
                    Save Bob's Keys
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {isGenerated && (
          <Link
            href="/chat"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow-md mt-6 inline-block w-full text-center"
            onClick={handleJumpToChat}
          >
            Start Chat
          </Link>
        )}
      </div>
    </div>
  );
}

interface KeyDetailProps {
  label: string;
  value: string;
}

const KeyDetail: React.FC<KeyDetailProps> = ({ label, value }) => (
  <div className="flex gap-5">
    <p className="text-sm font-semibold">{label}</p>
    <p className="text-sm overflow-x-auto">{value}</p>
  </div>
);
