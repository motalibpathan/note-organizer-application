import { useState } from "react";
import { GoPencil } from "react-icons/go";
import { HiOutlineTrash } from "react-icons/hi";
import { useAuthContext } from "../hooks/useAuthContext";
import Modal from "./Model";

export interface Category {
  _id?: string;
  name: string;
}

interface CategoriesPageProps {
  categories: Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  loading: boolean;
  error: string | null;
}

const Categories: React.FC<CategoriesPageProps> = ({
  categories,
  setCategories,
  loading,
  error,
}) => {
  console.log("🚀 ~ file: Categories.tsx:19 ~ error:", error);
  console.log("🚀 ~ file: Categories.tsx:19 ~ loading:", loading);

  const { setToast } = useAuthContext();

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<Category>({
    name: "",
  });
  const [handlingClick, setHandlingClick] = useState<boolean>(false);
  const [categoryError, setCategoryError] = useState<string>("");

  const handleClick = async () => {
    setHandlingClick(true);
    if (selectedCategory._id) {
      const response = await fetch(`/api/categories/${selectedCategory._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: selectedCategory.name }),
      });

      const result = await response.json();
      if (!result.success) {
        setCategoryError("Update error");
        setHandlingClick(false);
        return;
      }

      setCategories((prev) =>
        prev.map((cat) => {
          if (cat._id === selectedCategory._id) {
            return { ...cat, name: result.data.name };
          }
          return cat;
        })
      );
      setIsModalOpen(false);
    } else {
      const response = await fetch("/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: selectedCategory.name }),
      });

      const result = await response.json();
      if (!result.success) {
        setCategoryError("Something went wrong");
        setHandlingClick(false);
        return;
      }

      setCategories((prev) => [
        ...prev,
        { name: result.data.name, _id: result.data._id },
      ]);
      setIsModalOpen(false);
    }
    setHandlingClick(false);
    setToast((p) => ({
      ...p,
      message: selectedCategory._id ? "Update Successful " : "Add Successful ",
      active: true,
    }));
    setSelectedCategory({ name: "", _id: "" });
  };
  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };
  const handleDelete = (category: Category) => {
    setSelectedCategory(category);
    setIsDeleteModalOpen(true);
  };
  const handleDeleteConfirm = async () => {
    setHandlingClick(true);
    const response = await fetch(`/api/categories/${selectedCategory._id}`, {
      method: "DELETE",
    });

    const result = await response.json();
    if (!result.success) {
      setCategoryError("Delete error");
      setHandlingClick(false);
      return;
    }

    setHandlingClick(false);
    setCategories((prev) => prev.filter((c) => c._id !== selectedCategory._id));
    setIsDeleteModalOpen(false);
    setSelectedCategory({ name: "", _id: "" });
    setToast((p) => ({
      ...p,
      message: "Delete Successful ",
      active: true,
    }));
  };
  const handleCloseModal = () => {
    setIsDeleteModalOpen(false);
    setIsModalOpen(false);
    setSelectedCategory({ name: "", _id: "" });
    setCategoryError("");
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
                onClick={() => setIsModalOpen(true)}
                className="py-1 px-3 bg-yellow-300 text-black font-bold rounded-md"
              >
                Add
              </button>
            </div>
            <div className="flex flex-col gap-2 text-gray-500 overflow-y-auto">
              {categories.map((category, index, arr) => (
                <div
                  key={index}
                  className={`${
                    arr.length === index + 1 ? "" : "border-b-2"
                  } border-gray-600 pb-2 flex justify-between items-center`}
                >
                  <span>{category.name}</span>
                  <div className="flex gap-2">
                    <GoPencil
                      onClick={() => handleEdit(category)}
                      className="cursor-pointer"
                    />
                    <HiOutlineTrash
                      onClick={() => handleDelete(category)}
                      className="cursor-pointer"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Add Category"
      >
        {categoryError && <p className="text-red-500">{categoryError}</p>}
        <div className="flex flex-col items-end gap-2 mt-3">
          <input
            type="text"
            value={selectedCategory.name}
            onChange={(e) =>
              setSelectedCategory((prev) => ({ ...prev, name: e.target.value }))
            }
            className="w-full bg-transparent py-2 px-3 rounded-lg border border-gray-500 outline-none"
            placeholder="Category name"
          />
          <button
            onClick={() => handleClick()}
            disabled={handlingClick}
            className="bg-yellow-200 text-black py-2 px-6 rounded-lg font-bold border border-yellow-200 hover:bg-transparent hover:text-yellow-200 duration-300 disabled:bg-opacity-70"
          >
            {selectedCategory._id ? "Update" : "Add"}
          </button>
        </div>
      </Modal>
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseModal}
        title="Delete Category"
      >
        {categoryError && <p className="text-red-500">{categoryError}</p>}
        <p>
          Are you sure want to delete{" "}
          <span className="text-red-500 font-bold">
            {selectedCategory.name}
          </span>
        </p>
        <div className="flex justify-end gap-2 mt-3">
          <button
            onClick={() => setIsDeleteModalOpen(false)}
            disabled={handlingClick}
            className="bg-red-500 text-black py-2 px-6 rounded-lg font-bold border border-red-500 hover:bg-transparent hover:text-red-500 duration-300 disabled:bg-opacity-70"
          >
            Cancel
          </button>
          <button
            onClick={() => handleDeleteConfirm()}
            disabled={handlingClick}
            className="bg-green-500 text-black py-2 px-6 rounded-lg font-bold border border-green-500 hover:bg-transparent hover:text-green-200 duration-300 disabled:bg-opacity-70"
          >
            Confirm
          </button>
        </div>
      </Modal>
    </>
  );
};

export default Categories;
