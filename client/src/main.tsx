import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { AuthProvider } from "./contexts/AuthContext.tsx";
import { NotesCategoriesProvider } from "./contexts/NotesCategoriesContext.tsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  // <React.StrictMode>
  <AuthProvider>
    <NotesCategoriesProvider>
      <App />
    </NotesCategoriesProvider>
  </AuthProvider>
  // </React.StrictMode>
);
