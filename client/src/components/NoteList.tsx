import React, { useState } from "react";
import { useNotesCategoriesContext } from "../hooks/useNotesCategoriesContext";
import NoteCard from "./NoteCard";

const NoteList: React.FC = () => {
  const { notes, fetchNoteData, noteLoading, categories, pagination } =
    useNotesCategoriesContext();

  const [searchText, setSearchText] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    const newTimeoutId = setTimeout(async () => {
      fetchNoteData({
        searchText: e.target.value,
        categoryId: selectedCategoryId,
      });
    }, 1000);

    setTimeoutId(newTimeoutId);
  };

  const handleCategoryChange = (categoryId: string) => {
    // Update the state variable for selectedCategoryId
    setSelectedCategoryId(categoryId);
    // Fetch notes for the selected category
    fetchNoteData({ categoryId });
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    // Fetch notes for the new page
    fetchNoteData({
      searchText,
      categoryId: selectedCategoryId,
      page: newPage,
    });
  };

  return (
    <div className="container mx-auto md:p-5 p-2">
      <h3 className="md:text-3xl text-xl font-bold mb-5">Notes</h3>
      {/* Search and filter UI */}

      <div className="mb-3 flex flex-wrap gap-2 justify-end">
        <input
          type="text"
          placeholder="Search..."
          value={searchText}
          onChange={handleInputChange}
          className="border border-gray-700 rounded-full py-1 px-3 bg-transparent outline-none"
        />
        <select
          value={selectedCategoryId}
          onChange={(e) => handleCategoryChange(e.target.value)}
          className="border border-gray-700 rounded-full py-1 px-3 bg-transparent outline-none text_color"
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div className="min-h-[300px]">
        {noteLoading ? (
          <div className="note-container gap-2 ">
            {[...new Array(10)].map((_, index) => (
              <div
                key={index}
                className="note-card h-52 w-full backdrop-blur-xl bg-black/30 border border-gray-900 shadow-lg rounded-md p-2 "
              >
                <p className="w-[99%] py-2 rounded-xl  bg-[#1c1c1c] skeleton-box "></p>
                <p className="h-36 w-full py-2 rounded-md bg-[#1c1c1c] skeleton-box "></p>
                <div className="flex justify-between">
                  <p className="h-2 w-14 py-2 rounded-md bg-[#1c1c1c] skeleton-box "></p>
                  <div className="flex gap-3">
                    <span className="h-4 w-4 py-2 rounded-full bg-[#1c1c1c] skeleton-box "></span>
                    <span className="h-4 w-4 py-2 rounded-full bg-[#1c1c1c] skeleton-box "></span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="note-container ">
            {notes.map((note, index) => (
              <NoteCard key={note._id} note={note} index={index} />
            ))}
          </div>
        )}

        <div className="flex gap-3 justify-end text_color mt-3 text-sm">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="py-2 px-3 border border-gray-700 rounded-md hover:bg-gray-100 cursor-pointer duration-300 disabled:cursor-not-allowed"
          >
            Prev
          </button>
          {[...new Array(pagination.totalPage)].map((_, index) => (
            <button
              onClick={() => handlePageChange(index + 1)}
              key={index}
              disabled={index + 1 === pagination.current}
              className={`py-2 px-3 border border-gray-700 rounded-md hover:bg-gray-100 cursor-pointer duration-300 ${
                index + 1 === pagination.current && "bg-gray-100"
              } disabled:cursor-not-allowed`}
            >
              {index + 1}
            </button>
          ))}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={notes.length < 10} // Adjust based on API response
            className="py-2 px-3 border rounded-md  border-gray-700 hover:bg-gray-100 cursor-pointer duration-300 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoteList;
