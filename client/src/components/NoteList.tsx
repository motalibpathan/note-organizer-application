import React from "react";
import { useNotesCategoriesContext } from "../hooks/useNotesCategoriesContext";
import NoteCard from "./NoteCard";

const NoteList: React.FC = () => {
  const { notes } = useNotesCategoriesContext();

  return (
    <>
      <div className="container mx-auto p-5">
        <h3 className="text-3xl font-bold mb-5">Notes</h3>
        <div className="grid md:grid-cols-3 grid-cols-1 gap-5">
          {notes.map((note) => (
            <NoteCard key={note._id} note={note} />
          ))}
        </div>
      </div>
    </>
  );
};

export default NoteList;
