import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { TfiClose } from "react-icons/tfi";

interface ModelProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal = ({ isOpen, onClose, title, children }: ModelProps) => {
  const [modalRoot, setModalRoot] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setModalRoot(document.getElementById("modal-root"));
  }, []);

  if (!modalRoot) {
    return null; // Handle the case when the modal root element is not found
  }

  return ReactDOM.createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          id="modal"
          className={`fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center h-screen ${
            isOpen ? " z-[999999] " : " z-50 "
          } backdrop-blur-sm `}
        >
          <motion.div
            initial={{ y: 20 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-black/80 w-full md:w-2/3 lg:w-1/2 xl:w-1/3 2xl:w-1/4 md:p-4 p-2 rounded-lg shadow-lg relative z-10 mx-3"
          >
            <div className="flex justify-between">
              <div>
                <div className="w-9 h-1 bg-green-500 rounded mb-2"></div>
                <h3 className="mb-3 text-lg">{title}</h3>
              </div>
              <div className="relative">
                <div className="flex gap-2 mb-2">
                  <div className="w-4 h-4 bg-green-500 rounded-full mx-auto"></div>
                  <div className="w-4 h-4 bg-yellow-500 rounded-full mx-auto"></div>
                  <div
                    onClick={onClose}
                    className="w-4 h-4 bg-red-500 rounded-full mx-auto text-xs flex items-center justify-center cursor-pointer text-black"
                  >
                    <TfiClose />
                  </div>
                </div>
              </div>
            </div>
            <div>{children}</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="fixed inset-0 bg-black"
            onClick={onClose}
          ></motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    modalRoot
  );
};

export default Modal;
