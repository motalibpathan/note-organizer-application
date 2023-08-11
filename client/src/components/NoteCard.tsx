import { useEffect, useRef, useState } from "react";
import { BiEdit } from "react-icons/bi";
import { GoTrash } from "react-icons/go";
import { Note } from "../contexts/NotesCategoriesContext";
import { useNotesCategoriesContext } from "../hooks/useNotesCategoriesContext";
import Modal from "./Model";
import NoteForm from "./NoteForm";

interface NoteCardProps {
  note: Note;
  index: number;
}

const NoteCard: React.FC<NoteCardProps> = ({ note }) => {
  const { categories, deleteNote } = useNotesCategoriesContext();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const category = categories.find((c) => c._id === note.category);

  const containerCardRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (cardRef.current?.clientHeight) {
      console.log(
        "🚀 ~ file: NoteCard.tsx:25 ~ useEffect ~ cardRef.current?.clientHeight:",
        cardRef.current?.clientHeight
      );
      if (cardRef.current?.clientHeight > 150) {
        containerCardRef.current?.classList.add("vertical");
      } else {
        containerCardRef.current?.classList.add("horizontal");
      }
    }
  }, [cardRef]);

  const handleModalClose = () => {
    setIsModalOpen(false);
  };
  return (
    <>
      <div
        ref={containerCardRef}
        className={`rounded-xl backdrop-blur-lg bg-white/5 relative note-card w-full h-full group`}
      >
        <div className=" h-full max-h-96 overflow-y-auto p-2 ">
          <div
            onClick={() => setIsModalOpen(true)}
            ref={cardRef}
            className="cursor-pointer "
          >
            <h2 className="md:text-xl text-[1rem] mb-3 text-[#aaaaaa]">
              {note.title}
            </h2>
            <p className="text_color md:text-base text-sm">{note.content}</p>
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
          <div className="md:hidden group-hover:flex duration-300 fixed bottom-0 left-0 justify-between w-full px-2 bg-black backdrop-blur-xl">
            <p className="underline blue_gradient cursor-pointer py-1 text-xs">
              #{note.category ? category?.name || "no category" : "no category"}
            </p>
            <div className="flex gap-2 items-center">
              <button
                onClick={() => setIsModalOpen(true)}
                className=" text-gray-400 text-xl hover:bg-gray-800 rounded-full duration-300 p-1"
              >
                <BiEdit className="md:text-[18px] text-[14px]" />
              </button>
              <button
                onClick={() => setIsDeleteModalOpen(true)}
                className=" text-gray-400 text-xl hover:bg-gray-800 rounded-full duration-300 p-1 hover:text-red-500"
              >
                <GoTrash className="md:text-[18px] text-[14px]" />
              </button>
            </div>
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
