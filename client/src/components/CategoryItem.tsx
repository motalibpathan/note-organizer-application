import { GoPencil } from "react-icons/go";
import { HiOutlineTrash } from "react-icons/hi";
import { Category } from "../contexts/NotesCategoriesContext";

interface ComponentProps {
  category: Category;
  manageCategory: (category: Category, flag: string) => void;
}

const CategoryItem: React.FC<ComponentProps> = ({
  category,
  manageCategory,
}) => {
  return (
    <>
      <div
        className={` border-gray-600 pb-2 flex justify-between items-center`}
      >
        <span>{category.name}</span>
        <div className="flex gap-2">
          <GoPencil
            onClick={() => manageCategory(category, "edit")}
            className="cursor-pointer"
          />
          <HiOutlineTrash
            onClick={() => manageCategory(category, "delete")}
            className="cursor-pointer"
          />
        </div>
      </div>
    </>
  );
};

export default CategoryItem;
