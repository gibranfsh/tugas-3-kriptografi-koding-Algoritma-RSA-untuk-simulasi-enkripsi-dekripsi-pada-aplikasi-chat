import React from "react";

interface MessageProps {
    sender: string;
    text: string;
    file?: File | null;
    timestamp: string;
}

export const MessageBubble: React.FC<MessageProps> = ({ sender, text, file, timestamp }) => {
    const isSentByAlice = sender === "Alice";
    const recipient = isSentByAlice ? "Bob" : "Alice";
    const alignmentClass = isSentByAlice ? "justify-start" : "justify-end";
    const bubbleColor = isSentByAlice ? "bg-blue-600" : "bg-green-600";
    const textColor = isSentByAlice ? "text-white" : "text-black";

    return (
        <div className={`flex ${alignmentClass} mb-2`}>
            <div className={`max-w-[70%] rounded-lg p-3 ${bubbleColor} ${textColor}`}>
                <p className="text-sm">{text}</p>
                {file && (
                    <div className="flex items-center mt-2">
                        <span className="mr-2">File:</span>
                        <span className="text-xs font-semibold">{file.name}</span>
                    </div>
                )}
                <p className="text-xs text-gray-300">{sender} - {timestamp}</p>
            </div>
        </div>
    );
};
