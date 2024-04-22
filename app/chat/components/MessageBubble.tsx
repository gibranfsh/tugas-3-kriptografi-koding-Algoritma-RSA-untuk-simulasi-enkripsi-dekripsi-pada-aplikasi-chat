import { encryptRSA } from "@/crypto/RSA";
import React, { useEffect, useState } from "react";

interface MessageProps {
    sender: string;
    text: string;
    file?: File | null;
    timestamp: string;
    aliceKey: { n: bigint; e: bigint; d: bigint };
    bobKey: { n: bigint; e: bigint; d: bigint };
}

export const MessageBubble: React.FC<MessageProps> = ({ sender, text, file, timestamp, aliceKey, bobKey }) => {
    const isSentByAlice = sender === "Alice";
    const bubbleColor = isSentByAlice ? "bg-blue-600" : "bg-green-600";
    const textColor = isSentByAlice ? "text-white" : "text-black";

    return (
        <div className={`flex justify-between mb-2 ${isSentByAlice ? "flex-row" : "flex-row-reverse"}`}>
            <div className={`flex justify-between flex-col max-w-[40%] rounded-lg p-3 ${bubbleColor} ${textColor}`}>
                <p className="text-sm text-wrap">{text}</p>
                {file && (
                    <div className="flex items-center mt-2">
                        <span className="mr-2">File:</span>
                        <span className="text-xs font-semibold">{file.name}</span>
                    </div>
                )}
                <p className="text-xs text-gray-300 mt-1">{sender} - {timestamp}</p>
            </div>
            <div className={`max-w-[40%] rounded-lg p-3 ${bubbleColor} ${textColor}`}>
                <p className="text-sm text-wrap overflow-y-auto max-h-14 no-scrollbar">{encryptRSA(text, bobKey.e, bobKey.n)}</p>
                {file && (
                    <div className="flex items-center mt-2">
                        <span className="mr-2">File:</span>
                        <span className="text-xs font-semibold">{file.name}</span>
                    </div>
                )}
                <p className="text-xs text-gray-300 mt-1">{sender} - {timestamp}</p>
            </div>
        </div>
    );
};
