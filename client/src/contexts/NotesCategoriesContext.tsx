import React, { createContext, useCallback, useEffect, useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";

export interface Note {
  _id?: string;
  title: string;
  content: string;
  category: string;
  photos: Array<{ filename: string; originalName: string }> | [];
}

export interface Category {
  _id?: string;
  name: string;
}

interface NotesCategoriesContextType {
  notes: Note[];
  categories: Category[];
  noteLoading: boolean;
  categoryLoading: boolean;
  error: string | null;
  uploading: boolean;
  updating: boolean;
  deleting: boolean;
  pagination: Pagination;
  addNote: (note: Note, stateUpdate: boolean) => Promise<Note>;
  editNote: (note: Note, stateUpdate: boolean) => void;
  deleteNote: (noteId: string) => Promise<{ success: boolean } | undefined>;
  addCategory: (
    category: Category
  ) => Promise<{ success: boolean } | undefined>;
  editCategory: (
    category: Category
  ) => Promise<{ success: boolean } | undefined>;
  deleteCategory: (
    categoryId: string
  ) => Promise<{ success: boolean } | undefined>;
  fetchNoteData: ({
    searchText,
    categoryId,
    page,
  }: FetchNoteDataOptions) => Promise<void>;
}

interface Pagination {
  total: number;
  current: number;
  perPage: number;
  totalPage: number;
}

interface FetchNoteDataOptions {
  searchText?: string;
  categoryId?: string | null;
  page?: number;
}

export const NotesCategoriesContext = createContext<
  NotesCategoriesContextType | undefined
>(undefined);

export const NotesCategoriesProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [noteLoading, setNoteLoading] = useState<boolean>(true);
  const [categoryLoading, setCategoryLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [updating, setUpdating] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<boolean>(false);

  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    current: 0,
    perPage: 10, // Adjust this as needed
    totalPage: 10,
  });

  const { user, setToast } = useAuthContext();

  const fetchNoteData = useCallback(
    async ({
      searchText = "",
      categoryId = null,
      page = 1,
    }: FetchNoteDataOptions) => {
      setNoteLoading(true);
      setError(null);

      const queryParams = new URLSearchParams({
        searchText,
        categoryId: categoryId || "",
        page: page.toString(),
      });

      try {
        const notesResponse = await fetch(`/api/notes?${queryParams}`);
        const notesData = await notesResponse.json();

        if (notesData.success) {
          setNotes(notesData.data);
          setPagination({
            total: notesData.pagination.total,
            current: notesData.pagination.current,
            perPage: pagination.perPage,
            totalPage: Math.ceil(
              notesData.pagination.total / pagination.perPage
            ),
          });
        }
      } catch (error) {
        setError("Error fetching notes and categories.");
      } finally {
        setNoteLoading(false);
      }
    },
    [pagination.perPage] // Add any other dependencies if needed
  );

  useEffect(() => {
    fetchNoteData({});
    fetchCategoryData();
  }, [user, fetchNoteData]);

  const fetchCategoryData = async () => {
    setCategoryLoading(true);
    setError(null);
    try {
      const categoriesResponse = await fetch("/api/categories");
      const categoriesData = await categoriesResponse.json();
      if (categoriesData.success) {
        setCategories(categoriesData.data);
      }
    } catch (error) {
      setError("Error fetching notes and categories.");
    } finally {
      setCategoryLoading(false);
    }
  };

  const addNote = async (note: Note, stateUpdate: boolean) => {
    setUploading(true);
    setError(null);

    try {
      const response = await fetch("/api/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(note),
      });

      const data = await response.json();

      if (data.success) {
        if (stateUpdate) setNotes((prev) => [data.data, ...prev]);
        return data.data;
      } else {
        setError(data.message || "Failed to add note.");
      }
    } catch (error) {
      setError("Error adding note.");
    } finally {
      setUploading(false);
    }
  };

  const editNote = async (editedNote: Note, stateUpdate: boolean) => {
    setUpdating(true);
    setError(null);

    try {
      const response = await fetch(`/api/notes/${editedNote._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editedNote),
      });

      const data = await response.json();

      if (data.success) {
        if (stateUpdate) {
          const exitsIndex = notes.findIndex((n) => n._id === editedNote._id);
          if (exitsIndex !== -1) {
            setNotes((prev) =>
              prev.map((note) =>
                note._id === editedNote._id ? editedNote : note
              )
            );
          } else {
            setNotes((prev) => [editedNote, ...prev]);
          }
        }
        return data.data;
      } else {
        setError(data.message || "Failed to edit note.");
      }
    } catch (error) {
      setError("Error editing note.");
    } finally {
      setUpdating(false);
    }
  };

  const deleteNote = async (noteId: string) => {
    setDeleting(true);
    setError(null);

    try {
      const response = await fetch(`/api/notes/${noteId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        const updatedNotes = notes.filter((note) => note._id !== noteId);
        setNotes(updatedNotes);
        setToast((p) => ({
          ...p,
          message: "Note deleted successfully",
          active: true,
        }));
        return { success: true };
      } else {
        setError(data.message || "Failed to delete note.");
      }
    } catch (error) {
      setError("Error deleting note.");
    } finally {
      setDeleting(false);
    }
  };

  const addCategory = async (category: Category) => {
    setUploading(true);
    setError(null);

    try {
      const response = await fetch("/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(category),
      });

      const data = await response.json();

      if (data.success) {
        setCategories([...categories, data.data]);
        setToast((p) => ({
          ...p,
          message: "Category added successfully",
          active: true,
        }));
        return { success: true };
      } else {
        setError(data.message || "Failed to add category.");
      }
    } catch (error) {
      setError("Error adding category.");
    } finally {
      setUploading(false);
    }
  };

  const editCategory = async (editedCategory: Category) => {
    setUpdating(true);
    setError(null);

    try {
      const response = await fetch(`/api/categories/${editedCategory._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editedCategory),
      });

      const data = await response.json();

      if (data.success) {
        const updatedCategories = categories.map((category) =>
          category._id === editedCategory._id ? editedCategory : category
        );
        setCategories(updatedCategories);
        setToast((p) => ({
          ...p,
          message: "Category updated successfully",
          active: true,
        }));
        return { success: true };
      } else {
        setError(data.message || "Failed to edit category.");
      }
    } catch (error) {
      setError("Error editing category.");
    } finally {
      setUpdating(false);
    }
  };

  const deleteCategory = async (categoryId: string) => {
    setDeleting(true);
    setError(null);

    try {
      const response = await fetch(`/api/categories/${categoryId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        const updatedCategories = categories.filter(
          (category) => category._id !== categoryId
        );
        setCategories(updatedCategories);
        setToast((p) => ({
          ...p,
          message: "Category deleted successfully",
          active: true,
        }));
        return { success: true };
      } else {
        setError(data.message || "Failed to delete category.");
      }
    } catch (error) {
      setError("Error deleting category.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <NotesCategoriesContext.Provider
      value={{
        notes,
        categories,
        noteLoading,
        categoryLoading,
        error,
        uploading,
        updating,
        deleting,
        addNote,
        editNote,
        deleteNote,
        addCategory,
        editCategory,
        deleteCategory,
        pagination, // Include pagination data in the context
        fetchNoteData,
      }}
    >
      {children}
    </NotesCategoriesContext.Provider>
  );
};
