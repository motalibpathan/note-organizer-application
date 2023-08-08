import { useEffect, useState } from "react";
import { Category } from "../components/Categories";
import { Note } from "../components/NoteList";

const useCategoriesAndNotes = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch categories and notes here
    const fetchCategoriesAndNotes = async () => {
      try {
        // Fetch categories
        const categoriesResponse = await fetch("/api/categories");
        const categoriesData = await categoriesResponse.json();
        console.log(
          "🚀 ~ file: useCategoriesAndNotes.tsx:18 ~ fetchCategoriesAndNotes ~ categoriesData:",
          categoriesData
        );
        setCategories(categoriesData.data);

        // Fetch notes
        const notesResponse = await fetch("/api/notes");
        const notesData = await notesResponse.json();
        console.log(
          "🚀 ~ file: useCategoriesAndNotes.tsx:23 ~ fetchCategoriesAndNotes ~ notesData:",
          notesData
        );
        setNotes(notesData.data);

        setLoading(false);
      } catch (error) {
        setError("Error fetching categories and notes.");
        setLoading(false);
      }
    };

    fetchCategoriesAndNotes();
  }, []);

  return { categories, notes, loading, error };
};

export default useCategoriesAndNotes;
