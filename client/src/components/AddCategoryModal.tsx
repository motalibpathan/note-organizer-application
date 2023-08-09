import { useEffect, useState } from "react";
import { ImSpinner6 } from "react-icons/im";
import { Category } from "../contexts/NotesCategoriesContext";
import { useNotesCategoriesContext } from "../hooks/useNotesCategoriesContext";
import Modal from "./Model";

interface ModalProps {
  isModalOpen: boolean;
  handleCloseModal: () => void;
  category?: Category | null;
}

const AddCategoryModal: React.FC<ModalProps> = ({
  isModalOpen,
  handleCloseModal,
  category,
}) => {
  const [input, setInput] = useState<string>("");
  const { error, updating, uploading, addCategory, editCategory } =
    useNotesCategoriesContext();

  useEffect(() => {
    if (category) {
      setInput(category?.name);
    } else {
      setInput("");
    }
  }, [category]);

  const handleClick = async () => {
    if (category) {
      const result = await editCategory({ _id: category._id, name: input });
      if (result?.success) {
        handleCloseModal();
      }
    } else {
      const result = await addCategory({ name: input });
      if (result?.success) {
        handleCloseModal();
      }
    }
    setInput("");
  };

  return (
    <Modal
      isOpen={isModalOpen}
      onClose={handleCloseModal}
      title={`${category ? "Edit " : "Add "}Category`}
    >
      {error && <p className="text-red-500">{error}</p>}
      <div className="flex flex-col items-end gap-2 mt-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full bg-transparent py-2 px-3 rounded-lg border border-gray-500 outline-none"
          placeholder="Category name"
        />
        <button
          onClick={handleClick}
          disabled={updating || uploading}
          className="bg-yellow-200 text-black py-2 px-6 rounded-lg font-bold border border-yellow-200 hover:bg-transparent hover:text-yellow-200 duration-300 disabled:bg-opacity-70 flex items-center gap-2"
        >
          {(updating || uploading) && <ImSpinner6 className="animate-spin" />}
          {category?._id ? "Update" : "Add"}
        </button>
      </div>
    </Modal>
  );
};

export default AddCategoryModal;
