import { useState } from "react";
import { BiEdit } from "react-icons/bi";
import { GoTrash } from "react-icons/go";
import { Note } from "../contexts/NotesCategoriesContext";
import { useNotesCategoriesContext } from "../hooks/useNotesCategoriesContext";
import Modal from "./Model";
import NoteForm from "./NoteForm";

interface NoteCardProps {
  note: Note;
}

const NoteCard: React.FC<NoteCardProps> = ({ note }) => {
  const { categories, deleteNote } = useNotesCategoriesContext();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const category = categories.find((c) => c._id === note.category);

  const handleModalClose = () => {
    setIsModalOpen(false);
  };
  return (
    <>
      <div className="rounded-xl backdrop-blur-lg bg-white/5 md:p-5 p-3 relative ">
        <div
          onClick={() => setIsModalOpen(true)}
          className="h-72 overflow-y-auto cursor-pointer"
        >
          <h2 className="text-xl mb-3">{note.title}</h2>
          <p className="text_color ">{note.content}</p>
          <div className="pb-5">
            {note.photos.map((photo, index) => (
              <img
                key={index}
                src={`/api/uploads/${photo.filename}`}
                alt={photo.originalName}
                className="w-full my-2"
              />
            ))}
          </div>
        </div>
        <div className="fixed bottom-0 left-0 flex justify-between w-full px-2 bg-black/80 backdrop-blur-xl">
          <p className="underline blue_gradient cursor-pointer py-1">
            #{note.category ? category?.name || "no category" : "no category"}
          </p>
          <div className="flex gap-2 items-center">
            <button
              onClick={() => setIsModalOpen(true)}
              className=" text-gray-400 text-xl hover:bg-gray-800 rounded-full duration-300 p-1"
            >
              <BiEdit />
            </button>
            <button
              onClick={() => setIsDeleteModalOpen(true)}
              className=" text-gray-400 text-xl hover:bg-gray-800 rounded-full duration-300 p-1 hover:text-red-500"
            >
              <GoTrash className="text-[18px]" />
            </button>
          </div>
        </div>
      </div>
      <Modal isOpen={isModalOpen} onClose={handleModalClose} title="Edit Note">
        <NoteForm
          noteData={note}
          editMode={true}
          handleModalClose={handleModalClose}
        />
      </Modal>
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
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
            onClick={() => {
              note?._id && deleteNote(note?._id);
            }}
            className="bg-green-500 text-black py-2 px-6 rounded-lg font-bold border border-green-500 hover:bg-transparent hover:text-green-200 duration-300"
          >
            Confirm
          </button>
        </div>
      </Modal>
    </>
  );
};

export default NoteCard;
