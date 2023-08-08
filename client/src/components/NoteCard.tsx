import { BiEdit } from "react-icons/bi";
import { Note } from "./NoteList";

const NoteCard: React.FC<{
  note: Note;
  handleEditClick: (note: Note) => void;
}> = ({ note, handleEditClick }) => {
  return (
    <div className="rounded-xl backdrop-blur-lg bg-white/5 p-3 min-h-56 max-h-96 relative">
      <div className="h-full overflow-y-auto ">
        <h2 className="font-bold">{note.title}</h2>
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
          #{note.category ? note.category : "Categorized"}
        </p>
        <button
          onClick={() => handleEditClick(note)}
          className=" text-white text-2xl"
        >
          <BiEdit />
        </button>
      </div>
    </div>
  );
};

export default NoteCard;
