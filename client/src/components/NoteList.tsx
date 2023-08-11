import React, { useState } from "react";
import { useNotesCategoriesContext } from "../hooks/useNotesCategoriesContext";
import NoteCard from "./NoteCard";

const NoteList: React.FC = () => {
  const { notes, fetchNoteData, noteLoading, categories } =
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

      <div className="mb-3 flex gap-2 justify-end">
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

      <div className="min-h-screen">
        {noteLoading && <p>Loading</p>}
        {/* Note cards */}
        {!noteLoading && (
          <div className="note-container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {notes.map((note, index) => (
              <NoteCard key={note._id} note={note} index={index} />
            ))}
          </div>
        )}

        <div className="flex gap-3 justify-end text_color">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="py-2 px-3 border border-gray-700 rounded-md "
          >
            Previous
          </button>
          <span className="py-2 px-3 border border-gray-700 rounded-md ">
            {" "}
            {currentPage}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={notes.length < 10} // Adjust based on API response
            className="py-2 px-3 border rounded-md  border-gray-700"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoteList;
