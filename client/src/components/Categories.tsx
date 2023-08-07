import { GoPencil } from "react-icons/go";
import { HiOutlineTrash } from "react-icons/hi";

const Categories = () => {
  return (
    <div className="w-full rounded-2xl backdrop-blur-3xl bg-opacity-5 bg-white ">
      <div className="p-5">
        <div className="p-5 rounded-2xl backdrop-blur-3xl bg-opacity-5 bg-blue-200">
          <div>
            <div className="w-9 h-1 bg-yellow-500 rounded mb-2"></div>
            <h3 className="mb-3 text-lg">Categories</h3>
          </div>
          <div className="flex flex-col gap-2 text-gray-500 overflow-y-auto">
            {[
              "Sports",
              "Education",
              "Movies",
              "Travel",
              "Cooking",
              "Learning",
            ].map((category, index, arr) => (
              <div
                key={index}
                className={`${
                  arr.length === index + 1 ? "" : "border-b-2"
                } border-gray-600 pb-2 flex justify-between items-center`}
              >
                <span>{category}</span>
                <div className="flex gap-2">
                  <GoPencil className="cursor-pointer" />
                  <HiOutlineTrash className="cursor-pointer" />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex gap-2 mt-3">
          <input
            type="text"
            name=""
            id=""
            className="w-full bg-transparent py-2 px-3 rounded-lg border border-gray-500 outline-none"
            placeholder="Category name"
          />
          <button className="bg-yellow-200 text-black py-2 px-6 rounded-lg font-bold border border-yellow-200 hover:bg-transparent hover:text-yellow-200">
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default Categories;
