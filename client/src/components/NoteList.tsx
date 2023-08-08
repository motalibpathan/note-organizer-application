import { useEffect, useState } from "react";
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

const NoteList = () => {
  const [noteList, setNoteList] = useState<Note[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(true);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  const fetchNoteList = async () => {
    try {
      const response = await fetch("/api/notes");
      const data = await response.json();
      if (data.success) {
        setNoteList(data.data);
      }
    } catch (error) {
      console.error("Error fetching Note list:", error);
    }
  };

  useEffect(() => {
    fetchNoteList();
  }, []);

  const handleEditClick = (note: Note) => {
    setSelectedNote(note);
    setIsModalOpen(true);
  };

  return (
    <div className="container mx-auto p-5">
      <h3 className="text-3xl font-bold mb-5">Notes</h3>
      <div className="grid md:grid-cols-3 grid-cols-1 gap-5">
        {noteList.map((Note) => (
          <NoteCard note={Note} handleEditClick={handleEditClick} />
        ))}
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Edit Note"
      >
        <NoteForm noteData={selectedNote} />
      </Modal>
    </div>
  );
};

export default NoteList;
