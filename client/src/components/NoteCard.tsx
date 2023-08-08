import { Note } from "./NoteList";

const NoteCard: React.FC<{
  note: Note;
  handleEditClick: (note: Note) => void;
}> = ({ note, handleEditClick }) => {
  return (
    <div className="rounded-xl backdrop-blur-lg bg-white/5 p-3 min-h-56 max-h-96 relative">
      <h2 className="font-bold">{note.title}</h2>
      <p className="text_color ">{note.content}</p>
      <div>
        {note.photos.map((photo, index) => (
          <img
            key={index}
            src={`/api/uploads/${photo.filename}`}
            alt={photo.originalName}
            className="w-full my-2"
          />
        ))}
      </div>
      <p className="underline blue_gradient cursor-pointer w-max">
        #{note.category ? note.category : "Categorized"}
      </p>
      <button
        onClick={() => handleEditClick(note)}
        className="absolute top-2 right-2 text-white"
      >
        Edit
      </button>
    </div>
  );
};

export default NoteCard;
