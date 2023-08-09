import { useEffect, useState } from "react";
import Categories, { Category } from "./components/Categories.tsx";
import Nav from "./components/Nav.tsx";
import NoteForm from "./components/NoteForm.tsx";
import NoteList, { Note } from "./components/NoteList.tsx";
import Preloader from "./components/Preloader.tsx";
import Toast from "./components/Toast.tsx";
import { useAuthContext } from "./hooks/useAuthContext.tsx";
import useCategoriesAndNotes from "./hooks/useCategoriesAndNotes.tsx";
import "./index.css";

function App() {
  const { toast, setToast } = useAuthContext();
  const { categories, notes, loading, error } = useCategoriesAndNotes();
  const [optimisticNotes, setOptimisticNotes] = useState<Note[]>(notes);
  const [optimisticCategories, setOptimisticCategories] =
    useState<Category[]>(categories);

  useEffect(() => {
    if (!loading && !error) {
      setOptimisticNotes(notes);
      setOptimisticCategories(categories);
    }
  }, [loading, error, notes, categories]);

  const handleOnSave = (note: Note) => {
    setOptimisticNotes((prev) => [note, ...prev]);
  };

  console.log("app rerendered");
  return (
    <>
      <Preloader />
      <div className="overflow-hidden absolute top-0 left-0 bottom-0 right-0 z-[1]">
        <div className="absolute bottom-96 -left-64 hidden h-[150px] w-[900px] -rotate-45 rounded-3xl bg-gradient-to-r from-violet-600 to-indigo-800 opacity-30 blur-3xl filter dark:block lg:bottom-24 lg:-left-20 lg:h-28 lg:w-[250px] lg:-rotate-12 lg:opacity-20 xl:h-40 xl:w-[400px]"></div>
        <div className="absolute right-[28%] top-0 hidden h-[150px] w-[200px] rotate-12 rounded-3xl bg-gradient-to-l from-blue-600 to-sky-400 opacity-20 blur-3xl filter dark:block dark:opacity-30 lg:top-44 lg:-right-20 lg:h-72 lg:w-[350px] xl:h-80 xl:w-[500px]"></div>
      </div>
      <div id="app-content" className="relative z-10 mb-32">
        <Nav />
        <h1 className="text-center font-bold md:text-3xl text-xl md:mt-0 mt-5">
          Note Organizer Application
        </h1>
        <p className="text-center mt-3 green_gradient md:w-max mx-auto px-3">
          Organize your note - add image, categorize and more ...
        </p>
        <div className="md:container mx-auto p-5 md:grid md:grid-cols-3 gap-5">
          <div className="col-span-2 md:mb-0 mb-3">
            <NoteForm
              handleOnSave={handleOnSave}
              categories={optimisticCategories}
            />
          </div>
          <Categories
            categories={optimisticCategories}
            setCategories={setOptimisticCategories}
            loading={loading}
            error={error}
          />
        </div>
        <NoteList
          notes={optimisticNotes}
          setNotes={setOptimisticNotes}
          loading={loading}
          error={error}
          categories={optimisticCategories}
        />
      </div>
      <div className="text-center py-3">
        © All rights reserved by{" "}
        <a
          className="blue_gradient text-center"
          target="_blank"
          href="https://motalibpathan.vercel.app"
        >
          Motalib Pathan
        </a>
      </div>
      <Toast
        handleClose={() => setToast((p) => ({ ...p, active: false }))}
        message={toast.message}
        isOpen={toast.active}
        className={toast.className}
      />
    </>
  );
}

export default App;
