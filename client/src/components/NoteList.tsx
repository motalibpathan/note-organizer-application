import React, { useState } from "react";
import Modal from "./Model";
import NoteCard from "./NoteCard";
import NoteForm from "./NoteForm";

export interface Note {
  _id: string;
  title: string;
  content: string;
  category: string;
  photos: Array<{ filename: string; originalName: string }> | [];
}

interface NoteListProps {
  notes: Note[];
  setNotes: React.Dispatch<React.SetStateAction<Note[]>>;
  loading: boolean;
  error: string | null;
}

const NoteList: React.FC<NoteListProps> = ({ notes, setNotes }) => {
  console.log("🚀 ~ file: NoteList.tsx:20 ~ NoteList ~ setNotes:", setNotes);
  console.log("🚀 ~ file: NoteList.tsx:20 ~ NoteList ~ notes:", notes);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  const handleEditClick = (note: Note) => {
    setSelectedNote(note);
    setIsModalOpen(true);
  };

  const handleOnSave = () => {};

  return (
    <div className="container mx-auto p-5">
      <h3 className="text-3xl font-bold mb-5">Notes</h3>
      <div className="grid md:grid-cols-3 grid-cols-1 gap-5">
        {notes.map((note) => (
          <NoteCard
            key={note._id}
            note={note}
            handleEditClick={handleEditClick}
          />
        ))}
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Edit Note"
      >
        <NoteForm
          noteData={selectedNote}
          editMode={true}
          handleOnSave={handleOnSave}
        />
      </Modal>
    </div>
  );
};

export default NoteList;
