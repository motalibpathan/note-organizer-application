import React, { useState } from "react";
import { Category } from "./Categories";
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
  categories: Category[];
}

const NoteList: React.FC<NoteListProps> = ({ notes, setNotes, categories }) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleEditClick = (note: Note) => {
    setSelectedNote(note);
    setIsModalOpen(true);
  };
  const handleDeleteClick = (note: Note) => {
    setSelectedNote(note);
    setIsDeleteModalOpen(true);
  };

  const handleOnSave = (updatedNote: Note) => {
    setNotes((prev) =>
      prev.map((note: Note) => {
        if (note._id === updatedNote._id) {
          return updatedNote;
        }
        return note;
      })
    );
    setIsModalOpen(false);
  };

  const onDeleteSuccess = (note: Note) => {
    setNotes((prev) => prev.filter((n) => n._id !== note._id));
    setIsDeleteModalOpen(false);
  };

  return (
    <div className="container mx-auto p-5">
      <h3 className="text-3xl font-bold mb-5">Notes</h3>
      <div className="grid md:grid-cols-3 grid-cols-1 gap-5">
        {notes.map((note) => (
          <NoteCard
            key={note._id}
            note={note}
            handleEditClick={handleEditClick}
            handleDeleteClick={handleDeleteClick}
            categories={categories}
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
          categories={categories}
        />
      </Modal>
      {selectedNote && (
        <DeleteNoteModal
          note={selectedNote}
          onDeleteSuccess={onDeleteSuccess}
          isDeleteModalOpen={isDeleteModalOpen}
          setIsDeleteModalOpen={setIsDeleteModalOpen}
        />
      )}
    </div>
  );
};

export default NoteList;

interface DeleteModalProps {
  note: Note;
  isDeleteModalOpen: boolean;
  onDeleteSuccess: (note: Note) => void;
  setIsDeleteModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
const DeleteNoteModal: React.FC<DeleteModalProps> = ({
  note,
  onDeleteSuccess,
  isDeleteModalOpen,
  setIsDeleteModalOpen,
}) => {
  const handleCloseModal = () => {
    setIsDeleteModalOpen(false);
  };

  const handleDeleteNote = async () => {
    const response = await fetch(`/api/notes/${note._id}`, {
      method: "DELETE",
    });

    const result = await response.json();
    console.log(
      "🚀 ~ file: Categories.tsx:87 ~ handleDeleteConfirm ~ result:",
      result
    );
    onDeleteSuccess(note);
  };
  return (
    <Modal
      isOpen={isDeleteModalOpen}
      onClose={handleCloseModal}
      title="Delete Note"
    >
      <p>
        Are you sure want to delete{" "}
        <span className="text-red-500 font-bold">{note.title}</span>
      </p>
      <div className="flex justify-end gap-2 mt-3">
        <button
          onClick={() => setIsDeleteModalOpen(false)}
          className="bg-red-500 text-black py-2 px-6 rounded-lg font-bold border border-red-500 hover:bg-transparent hover:text-red-500 duration-300"
        >
          Cancel
        </button>
        <button
          onClick={() => handleDeleteNote()}
          className="bg-green-500 text-black py-2 px-6 rounded-lg font-bold border border-green-500 hover:bg-transparent hover:text-green-200 duration-300"
        >
          Confirm
        </button>
      </div>
    </Modal>
  );
};
