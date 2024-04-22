import React from "react";
import { IoMdClose } from "react-icons/io";

interface ModalProps {
  closeModal: () => void;
  children: React.ReactNode
}

const DownloadModal: React.FC<ModalProps> = ({ closeModal, children }) => {
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-end">
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={closeModal}
          >
            <IoMdClose className="text-xl" />
          </button>
        </div>
        <div className="">{children}</div>
      </div>
    </div>
  );
};

export default DownloadModal;
