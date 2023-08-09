import { useState } from "react";
import { ImSpinner6 } from "react-icons/im";
import { Category } from "../contexts/NotesCategoriesContext";
import { useNotesCategoriesContext } from "../hooks/useNotesCategoriesContext";
import AddCategoryModal from "./AddCategoryModal";
import CategoryItem from "./CategoryItem";
import Modal from "./Model";

const Categories: React.FC = () => {
  const { categories, error, deleting, deleteCategory } =
    useNotesCategoriesContext();

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);

  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsDeleteModalOpen(false);
    setSelectedCategory(null);
  };

  const manageCategory = (category: Category, flag: string) => {
    setSelectedCategory(category);
    if (flag === "edit") {
      setIsModalOpen(true);
    } else {
      setIsDeleteModalOpen(true);
    }
  };

  const handleAddCategory = () => {
    setSelectedCategory(null);
    setIsModalOpen(true);
  };

  const handleDeleteCategory = async () => {
    if (selectedCategory?._id) {
      const result = await deleteCategory(selectedCategory._id);
      if (result?.success) {
        handleCloseModal();
      }
    }
  };

  return (
    <>
      <div className="w-full rounded-2xl backdrop-blur-3xl bg-opacity-5 bg-white ">
        <div className="p-5">
          <div className="p-5 rounded-2xl backdrop-blur-3xl bg-opacity-5 bg-blue-200">
            <div className="flex justify-between items-center ">
              <div>
                <div className="w-9 h-1 bg-yellow-500 rounded mb-2"></div>
                <h3 className="mb-3 text-lg">Categories</h3>
              </div>
              <button
                onClick={handleAddCategory}
                className="py-1 px-3 bg-yellow-300 text-black font-bold rounded-md"
              >
                Add
              </button>
            </div>
            <div className="flex flex-col gap-2 text-gray-500 overflow-y-auto">
              {categories.map((category) => (
                <CategoryItem
                  key={category._id}
                  category={category}
                  manageCategory={manageCategory}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <AddCategoryModal
        handleCloseModal={handleCloseModal}
        isModalOpen={isModalOpen}
        category={selectedCategory}
      />

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseModal}
        title="Delete Category"
      >
        {error && <p className="text-red-500">{error}</p>}
        <p>
          Are you sure want to delete{" "}
          <span className="text-red-500 font-bold">
            {selectedCategory?.name}
          </span>
        </p>
        <div className="flex justify-end gap-2 mt-3">
          <button
            onClick={() => setIsDeleteModalOpen(false)}
            disabled={deleting}
            className="bg-red-500 text-black py-2 px-6 rounded-lg font-bold border border-red-500 hover:bg-transparent hover:text-red-500 duration-300 disabled:bg-opacity-70"
          >
            Cancel
          </button>
          <button
            onClick={handleDeleteCategory}
            disabled={deleting}
            className="bg-green-500 text-black py-2 px-6 rounded-lg font-bold border border-green-500 hover:bg-transparent hover:text-green-200 duration-300 disabled:bg-opacity-70 flex items-center gap-2"
          >
            {deleting && <ImSpinner6 className="animate-spin" />} Confirm
          </button>
        </div>
      </Modal>
    </>
  );
};

export default Categories;
