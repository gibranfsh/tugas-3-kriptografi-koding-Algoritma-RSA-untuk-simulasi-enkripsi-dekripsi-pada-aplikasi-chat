import { encryptRSA, decryptRSA } from "@/crypto/RSA";
import React, { useState } from "react";
import { FaArrowRight, FaEye, FaEyeSlash, FaDownload } from "react-icons/fa";
import { saveAs } from "file-saver";
import DownloadModal from "./DownloadModal";

interface MessageProps {
  sender: string;
  text: string;
  file?: File | null;
  fileRead?: string | ArrayBuffer | Uint8Array;
  timestamp: string;
  aliceKey: { n: bigint; e: bigint; d: bigint };
  bobKey: { n: bigint; e: bigint; d: bigint };
}

export const MessageBubble: React.FC<MessageProps> = ({
  sender,
  text,
  file,
  fileRead,
  timestamp,
  aliceKey,
  bobKey,
}) => {
  const isSentByAlice = sender === "Alice";
  const bubbleColor = isSentByAlice ? "bg-blue-600" : "bg-green-600";
  const textColor = isSentByAlice ? "text-white" : "text-black";

  const [isEncrypted, setIsEncrypted] = useState<boolean>(true);
  const [showModal, setShowModal] = useState<boolean>(false);

  const toggleEncryption = () => {
    setIsEncrypted((prev) => !prev);
  };

  const handleTextDownload = () => {
    const data = isEncrypted ? encryptRSA(text, isSentByAlice ? aliceKey.e : bobKey.e, isSentByAlice ? aliceKey.n : bobKey.n) : decryptRSA(encryptRSA(text, isSentByAlice ? aliceKey.e : bobKey.e, isSentByAlice ? aliceKey.n : bobKey.n), isSentByAlice ? aliceKey.d : bobKey.d, isSentByAlice ? aliceKey.n : bobKey.n).toString()
    const blob = new Blob([data], { type: "text/plain;charset=utf-8" });
    saveAs(blob, `${isEncrypted ? "encrypted" : "decrypted"}_message_${new Date().toLocaleTimeString()}.txt`);
  }

  const handleFileDownload = () => {
    if (file) {
      saveAs(file, file.name);
    }
  };

  const handleSentFileDownload = (downloadAs: string) => {
    if (file) {
      const data = downloadAs === "ciphertext" ? encryptRSA(fileRead as Uint8Array, isSentByAlice ? aliceKey.e : bobKey.e, isSentByAlice ? aliceKey.n : bobKey.n) : decryptRSA(encryptRSA(fileRead as Uint8Array, bobKey.e, bobKey.n), isSentByAlice ? aliceKey.d : bobKey.d, isSentByAlice ? aliceKey.n : bobKey.n)
      const blob = new Blob([data], { type: file.type });
      saveAs(blob, file.name);
    }
  }

  return (
    <div
      className={`flex justify-between mb-2 ${isSentByAlice ? "flex-row" : "flex-row-reverse"
        }`}
    >
      <div
        className={`flex justify-between flex-col max-w-[40%] rounded-lg p-3 ${bubbleColor} ${textColor}`}
      >
        <p className="text-sm text-wrap overflow-y-auto max-h-14 no-scrollbar">
          {text}
        </p>
        {file && (
          <div className="flex items-center mt-2 text-sm">
            <span className="mr-2">File:</span>
            <button
              className="font-semibold underline text-blue-500 cursor-pointer"
              onClick={handleFileDownload}
            >
              {file.name}
            </button>
          </div>
        )}
        <p className="text-xs text-gray-300 mt-1">
          {sender} - {timestamp}
        </p>
      </div>
      <div className="w-full max-w-[20%] flex items-center justify-center">
        <FaArrowRight
          className={`text-5xl ${isSentByAlice ? "text-blue-600" : "text-green-600 rotate-180"
            } mx-2`}
        />
      </div>
      <div className={`max-w-[40%] rounded-lg p-3 ${bubbleColor} ${textColor}`}>
        <p className="text-sm overflow-y-auto max-h-14 no-scrollbar">
          {isEncrypted ? encryptRSA(text, isSentByAlice ? aliceKey.e : bobKey.e, isSentByAlice ? aliceKey.n : bobKey.n) : decryptRSA(encryptRSA(text, isSentByAlice ? aliceKey.e : bobKey.e, isSentByAlice ? aliceKey.n : bobKey.n), isSentByAlice ? aliceKey.d : bobKey.d, isSentByAlice ? aliceKey.n : bobKey.n).toString()}
        </p>
        {file && (
          <p className="text-sm text-wrap overflow-y-auto max-h-14 no-scrollbar">
            {encryptRSA(file.toString(), isSentByAlice ? aliceKey.e : bobKey.e, isSentByAlice ? aliceKey.n : bobKey.n)}
          </p>
        )}
        <div className="flex justify-between text-gray-300 mt-1">
          <p className="text-xs">
            {sender} - {timestamp}
          </p>
          <div className="flex items-center gap-2.5">
            <button
              className="text-sm font-semibold"
              onClick={toggleEncryption}
            >
              {isEncrypted ? (
                <FaEye className="" />
              ) : (
                <FaEyeSlash className="" />
              )}
            </button>
            <button className="text-sm font-semibold" onClick={() => file ? setShowModal(true) : handleTextDownload()}>
              <FaDownload className="" />
            </button>
          </div>
        </div>
      </div>
      {showModal && (
        <DownloadModal closeModal={() => setShowModal(false)}>
          <div className="flex flex-col items-center gap-4">
            <h2 className="text-lg font-semibold text-black">Download Options</h2>
            <div className="flex gap-2">
              <button
                className={`text-sm font-semibold cursor-pointer p-3 rounded-lg bg-green-600
                  }`}
                onClick={() => handleSentFileDownload("ciphertext")}
              >
                Download as Ciphertext File
              </button>
              <button
                className={`text-sm font-semibold cursor-pointer p-3 rounded-lg bg-blue-500
                  }`}
                onClick={() => handleSentFileDownload("plaintext")}
              >
                Download as Decrypted File
              </button>
            </div>
          </div>
        </DownloadModal>
      )}
    </div>
  );
};
