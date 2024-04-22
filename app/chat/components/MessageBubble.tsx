import { encryptRSA, decryptRSA } from "@/crypto/RSA";
import React, { useEffect, useState } from "react";
import { FaArrowRight, FaEye, FaEyeSlash, FaDownload } from "react-icons/fa";
import { saveAs } from "file-saver";

interface MessageProps {
  sender: string;
  text: string;
  file?: File | null;
  timestamp: string;
  aliceKey: { n: bigint; e: bigint; d: bigint };
  bobKey: { n: bigint; e: bigint; d: bigint };
}

export const MessageBubble: React.FC<MessageProps> = ({
  sender,
  text,
  file,
  timestamp,
  aliceKey,
  bobKey,
}) => {
  const isSentByAlice = sender === "Alice";
  const bubbleColor = isSentByAlice ? "bg-blue-600" : "bg-green-600";
  const textColor = isSentByAlice ? "text-white" : "text-black";

  const [isEncrypted, setIsEncrypted] = useState<boolean>(true);
  const [decryptedText, setDecryptedText] = useState<string>("");

  const toggleEncryption = () => {
    if (isEncrypted) {
      setDecryptedText(decryptRSA(text, bobKey.d, bobKey.n).toString());
    } else {
      setDecryptedText(encryptRSA(decryptedText, bobKey.e, bobKey.n));
    }
    setIsEncrypted((prev) => !prev);
  };

  const handleFileDownload = () => {
    if (file) {
      saveAs(file, file.name);
    }
  };

  return (
    <div
      className={`flex justify-between mb-2 ${
        isSentByAlice ? "flex-row" : "flex-row-reverse"
      }`}
    >
      <div
        className={`flex justify-between flex-col max-w-[40%] rounded-lg p-3 ${bubbleColor} ${textColor}`}
      >
        <p className="text-sm text-wrap overflow-y-auto overflow-x-hidden max-h-14 no-scrollbar">
          {text}
        </p>
        {file && (
          <div className="flex items-center mt-2">
            <span className="mr-2">File:</span>
            <button
              className="text-xs font-semibold underline text-blue-500 cursor-pointer"
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
          className={`text-5xl ${
            isSentByAlice ? "text-blue-600" : "text-green-600 rotate-180"
          } mx-2`}
        />
      </div>
      <div className={`max-w-[40%] rounded-lg p-3 ${bubbleColor} ${textColor}`}>
        <p className="text-sm text-wrap overflow-y-auto overflow-x-hidden max-h-14 no-scrollbar">
          {text && encryptRSA(text, bobKey.e, bobKey.n)}
        </p>
        {file && (
          <p className="text-sm text-wrap overflow-y-auto overflow-x-hidden max-h-14 no-scrollbar">
            {encryptRSA(file.toString(), bobKey.e, bobKey.n)}
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
                <FaEyeSlash className="" />
              ) : (
                <FaEye className="" />
              )}
            </button>
            <button className="text-sm font-semibold">
              <FaDownload className="" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
