import { useContext } from "react";
import { NotesCategoriesContext } from "../contexts/NotesCategoriesContext";

export const useNotesCategoriesContext = () => {
  const context = useContext(NotesCategoriesContext);
  if (!context) {
    throw new Error(
      "useNotesCategoriesContext must be used within a NotesCategoriesProvider"
    );
  }
  return context;
};
