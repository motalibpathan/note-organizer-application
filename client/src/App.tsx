import Categories from "./components/Categories.tsx";
import Nav from "./components/Nav.tsx";
import NoteForm from "./components/NoteForm.tsx";
import "./index.css";

function App() {
  return (
    <>
      <div className="overflow-hidden absolute top-0 left-0 bottom-0 right-0 z-[1]">
        <div className="absolute bottom-96 -left-64 hidden h-[150px] w-[900px] -rotate-45 rounded-3xl bg-gradient-to-r from-violet-600 to-indigo-800 opacity-30 blur-3xl filter dark:block lg:bottom-24 lg:-left-20 lg:h-28 lg:w-[250px] lg:-rotate-12 lg:opacity-20 xl:h-40 xl:w-[400px]"></div>
        <div className="absolute right-[28%] top-0 hidden h-[150px] w-[200px] rotate-12 rounded-3xl bg-gradient-to-l from-blue-600 to-sky-400 opacity-20 blur-3xl filter dark:block dark:opacity-30 lg:top-44 lg:-right-20 lg:h-72 lg:w-[350px] xl:h-80 xl:w-[500px]"></div>
      </div>
      <div className="relative z-10">
        <Nav />
        <h1 className="text-center font-bold md:text-3xl text-xl">
          Note Organizer Application
        </h1>
        <p className="text-center mt-3 green_gradient w-max mx-auto">
          Organize your note - add image, categorize and more ...
        </p>
        <div className="md:container mx-auto p-5 grid md:grid-cols-3 gap-5">
          <div className="col-span-2">
            <NoteForm />
          </div>
          <Categories />
        </div>
      </div>
    </>
  );
}

export default App;
