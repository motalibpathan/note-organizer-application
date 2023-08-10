import React from "react";
import { useNotesCategoriesContext } from "../hooks/useNotesCategoriesContext";
import NoteCard from "./NoteCard";

const NoteList: React.FC = () => {
  const { notes } = useNotesCategoriesContext();

  return (
    <>
      <div className="container mx-auto md:p-5 p-2">
        <h3 className="md:text-3xl text-xl font-bold mb-5">Notes</h3>
        <div className="note-container">
          {notes.map((note, index) => (
            <NoteCard key={note._id} note={note} index={index} />
          ))}
        </div>
      </div>
    </>
  );
};

export default NoteList;
