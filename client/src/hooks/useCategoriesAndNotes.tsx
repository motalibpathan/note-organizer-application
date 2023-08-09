import { useEffect, useState } from "react";
import { Category } from "../components/Categories";
import { Note } from "../components/NoteList";
import { useAuthContext } from "./useAuthContext";

const useCategoriesAndNotes = () => {
  const { user } = useAuthContext();
  const [categories, setCategories] = useState<Category[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch categories and notes here
    if (!user) return;
    const fetchCategoriesAndNotes = async () => {
      try {
        // Fetch categories
        const categoriesResponse = await fetch("/api/categories");
        const categoriesData = await categoriesResponse.json();

        if (categoriesData.success === false) return;
        setCategories(categoriesData.data);

        // Fetch notes
        const notesResponse = await fetch("/api/notes");
        const notesData = await notesResponse.json();

        if (notesData.success === false) return;
        setNotes(notesData.data);

        setLoading(false);
      } catch (error) {
        setError("Error fetching categories and notes.");
        setLoading(false);
      }
    };

    fetchCategoriesAndNotes();
  }, [user]);

  return { categories, notes, loading, error };
};

export default useCategoriesAndNotes;
