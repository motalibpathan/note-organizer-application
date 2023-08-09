import React, { createContext, useState } from "react";

// Define the types for notes and categories
export interface Note {
  _id?: string;
  title: string;
  description: string;
  category: string;
  images: File[] | null;
}

export interface Category {
  _id?: string;
  name: string;
}

// Create the context
interface NotesCategoriesContextType {
  notes: Note[];
  categories: Category[];
  addNote: (note: Note) => void;
  editNote: (note: Note) => void;
  deleteNote: (noteId: string) => void;
  addCategory: (category: Category) => void;
  editCategory: (category: Category) => void;
  deleteCategory: (categoryId: string) => void;
}

export const NotesCategoriesContext = createContext<
  NotesCategoriesContextType | undefined
>(undefined);

// Create a provider component
export const NotesCategoriesProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  // Add, edit, and delete functions for notes and categories
  const addNote = (note: Note) => {
    setNotes([...notes, note]);
  };

  const editNote = (editedNote: Note) => {
    const updatedNotes = notes.map((note) =>
      note._id === editedNote._id ? editedNote : note
    );
    setNotes(updatedNotes);
  };

  const deleteNote = (noteId: string) => {
    const updatedNotes = notes.filter((note) => note._id !== noteId);
    setNotes(updatedNotes);
  };

  const addCategory = (category: Category) => {
    setCategories([...categories, category]);
  };

  const editCategory = (editedCategory: Category) => {
    const updatedCategories = categories.map((category) =>
      category._id === editedCategory._id ? editedCategory : category
    );
    setCategories(updatedCategories);
  };

  const deleteCategory = (categoryId: string) => {
    const updatedCategories = categories.filter(
      (category) => category._id !== categoryId
    );
    setCategories(updatedCategories);
  };

  // You can fetch initial notes and categories using useEffect here

  return (
    <NotesCategoriesContext.Provider
      value={{
        notes,
        categories,
        addNote,
        editNote,
        deleteNote,
        addCategory,
        editCategory,
        deleteCategory,
      }}
    >
      {children}
    </NotesCategoriesContext.Provider>
  );
};
