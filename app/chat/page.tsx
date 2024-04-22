"use client"
import { useEffect, useRef, useState } from "react";
import { MessageBubble } from "./components/MessageBubble";
import { IoMdAttach } from "react-icons/io";
import { useRouter } from "next/navigation";

interface MessageData {
    sender: string;
    text: string;
    file?: File | null;
    fileRead?: string | ArrayBuffer | Uint8Array;
}

interface Key {
    n: bigint;
    e: bigint;
    d: bigint;
}

const initialMessages: MessageData[] = [
    { sender: "Alice", text: "Hi Bob!" },
    { sender: "Bob", text: "Hey Alice, how are you?" },
    { sender: "Alice", text: "I'm good, thanks! How about you?" },
    { sender: "Bob", text: "I'm doing well too, thanks!" },
];

export default function Chat() {
    const [messages, setMessages] = useState<MessageData[]>(initialMessages);
    const [inputMessageAlice, setInputMessageAlice] = useState<string>("");
    const [inputMessageBob, setInputMessageBob] = useState<string>("");
    const [fileAlice, setFileAlice] = useState<File | null>(null);
    const [fileBob, setFileBob] = useState<File | null>(null);

    const [fileReadAlice, setFileReadAlice] = useState<string | ArrayBuffer | Uint8Array>("");
    const [fileReadBob, setFileReadBob] = useState<string | ArrayBuffer | Uint8Array>("");

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const router = useRouter();

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

    const handleFileUpload = (
        event: React.ChangeEvent<HTMLInputElement>,
        type: string
    ) => {
        const file = event.target.files?.[0];
        if (file) {
            console.log(file)
            const reader = new FileReader();
            reader.onload = function () {
                const content = reader.result;

                if (file.type === "text/plain") {
                    type === "Alice" ? setFileReadAlice(content as string) : setFileReadBob(content as string);
                } else {
                    const byteArray = new Uint8Array(content as ArrayBuffer);
                    type === "Alice" ? setFileReadAlice(byteArray as Uint8Array) : setFileReadBob(byteArray as Uint8Array);
                }

                type === "Alice" ? setFileAlice(file) : setFileBob(file);
            }

            if (file.type === "text/plain") {
                reader.readAsText(file);
            } else {
                reader.readAsArrayBuffer(file);
            }
        }
    };

    useEffect(() => {
        const savedKeys = localStorage.getItem("rsaKeys");
        if (savedKeys) {
            const { aliceKey: aliceSavedKey, bobKey: bobSavedKey } = JSON.parse(savedKeys);
            setAliceKey({
                n: BigInt(aliceSavedKey.n),
                e: BigInt(aliceSavedKey.e),
                d: BigInt(aliceSavedKey.d),
            });
            setBobKey({
                n: BigInt(bobSavedKey.n),
                e: BigInt(bobSavedKey.e),
                d: BigInt(bobSavedKey.d),
            });
        } else {
            router.push("/");
        }
        setIsLoading(false);
    }, []);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleMessageSubmit = (sender: string, text: string, file: File | null, fileRead: string | ArrayBuffer | Uint8Array) => {
        if (text.trim() !== "" || file) {
            setMessages((prevMessages) => [
                ...prevMessages,
                { sender: sender, text: text, file: file, fileRead: fileRead },
            ]);
            sender === "Alice" ? setInputMessageAlice("") : setInputMessageBob("");
            sender === "Alice" ? setFileAlice(null) : setFileBob(null);
            sender === "Alice" ? setFileReadAlice("") : setFileReadBob("");
        }
    };

    const handleKeyDown = (sender: string, text: string, file: File | null, fileRead: string | ArrayBuffer | Uint8Array, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleMessageSubmit(sender, text, file, fileRead);
        }
    };

    const handleFileChange = (sender: string, file: File | null) => {
        sender === "Alice" ? setFileAlice(file) : setFileBob(file);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
            {isLoading ? (
                <div className="fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-90 flex items-center justify-center">
                    <div className="text-center">
                        <p>Loading</p>
                        <p className="text-sm text-gray-400">This may take a few seconds</p>
                    </div>
                </div>
            ) : (
                <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-[70%]">
                    <h1 className="text-4xl font-bold mb-6">Chat Room</h1>
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-2" style={{ maxHeight: "60vh", overflowY: "auto" }}>
                            {messages.map((message, index) => (
                                <MessageBubble
                                    key={index}
                                    sender={message.sender}
                                    timestamp={new Date().toLocaleTimeString()}
                                    text={message.text}
                                    file={message.file}
                                    fileRead={message.fileRead}
                                    aliceKey={aliceKey}
                                    bobKey={bobKey}
                                />
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                        <div className="flex gap-4 justify-between">
                            <div className="flex items-center gap-4 w-1/2">
                                {fileAlice ? (
                                    <div className="bg-gray-700 text-white py-2 px-4 rounded-l-md flex items-center">
                                        <span>{fileAlice.name}</span>
                                        <button
                                            onClick={() => setFileAlice(null)}
                                            className="text-red-500 ml-2"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ) : (
                                    <div className="bg-gray-700 text-white py-2 px-4 rounded-l-md w-full flex justify-between items-center">
                                        <input
                                            type="text"
                                            value={inputMessageAlice}
                                            onChange={(e) => setInputMessageAlice(e.target.value)}
                                            onKeyDown={(e) => handleKeyDown("Alice", inputMessageAlice, fileAlice, fileReadAlice, e)}
                                            placeholder="Type Alice's message..."
                                            className="bg-transparent focus:outline-none w-full"
                                        />
                                        <label htmlFor="file-upload-alice" className="cursor-pointer">
                                            <IoMdAttach className="text-gray-400 text-xl" />
                                        </label>
                                        <input
                                            id="file-upload-alice"
                                            type="file"
                                            onChange={(e) => handleFileUpload(e, "Alice")}
                                            className="hidden"
                                        />
                                    </div>
                                )}
                                <button
                                    onClick={() => handleMessageSubmit("Alice", inputMessageAlice, fileAlice, fileReadAlice)}
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-r-md focus:outline-none"
                                >
                                    Send
                                </button>
                            </div>
                            <div className="flex items-center gap-4 w-1/2">
                                {fileBob ? (
                                    <div className="bg-gray-700 text-white py-2 px-4 rounded-l-md flex items-center">
                                        <span>{fileBob.name}</span>
                                        <button
                                            onClick={() => setFileBob(null)}
                                            className="text-red-500 ml-2"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ) : (
                                    <div className="bg-gray-700 text-white py-2 px-4 rounded-l-md w-full flex justify-between items-center">
                                        <input
                                            type="text"
                                            value={inputMessageBob}
                                            onChange={(e) => setInputMessageBob(e.target.value)}
                                            onKeyDown={(e) => handleKeyDown("Bob", inputMessageBob, fileBob, fileReadBob, e)}
                                            placeholder="Type Bob's message..."
                                            className="bg-transparent focus:outline-none w-full"
                                        />
                                        <label htmlFor="file-upload-bob" className="cursor-pointer">
                                            <IoMdAttach className="text-gray-400 text-xl" />
                                        </label>
                                        <input
                                            id="file-upload-bob"
                                            type="file"
                                            onChange={(e) => handleFileUpload(e, "Bob")}
                                            className="hidden"
                                        />
                                    </div>
                                )}
                                <button
                                    onClick={() => handleMessageSubmit("Bob", inputMessageBob, fileBob, fileReadBob)}
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-r-md focus:outline-none"
                                >
                                    Send
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}