import { useState } from "react";
import { GoPencil } from "react-icons/go";
import { HiOutlineTrash } from "react-icons/hi";
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
  console.log("🚀 ~ file: Categories.tsx:21 ~ setCategories:", setCategories);
  console.log("🚀 ~ file: Categories.tsx:19 ~ error:", error);
  console.log("🚀 ~ file: Categories.tsx:19 ~ loading:", loading);
  const [categoryName, setCategoryName] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  // const [selectedCategory, setselectedCategory] = useState<Category>({
  //   name: "",
  // });
  // const handleClick = () => {};
  // const handleEdit = (category: Category) => {};
  // const handleDelete = (category: Category) => {};
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
                className="py-1 px-3 bg-blue-600 rounded-md"
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
                      // onClick={() => handleEdit(category)}
                      className="cursor-pointer"
                    />
                    <HiOutlineTrash
                      // onClick={() => handleDelete(category)}
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
        onClose={() => setIsModalOpen(false)}
        title="Add Category"
      >
        <form className="flex flex-col items-end gap-2 mt-3">
          <input
            type="text"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            className="w-full bg-transparent py-2 px-3 rounded-lg border border-gray-500 outline-none"
            placeholder="Category name"
          />
          <button
            // onClick={() => handleClick()}
            className="bg-yellow-200 text-black py-2 px-6 rounded-lg font-bold border border-yellow-200 hover:bg-transparent hover:text-yellow-200 duration-300"
          >
            Add
          </button>
        </form>
      </Modal>
    </>
  );
};

export default Categories;
