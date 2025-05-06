import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Phonebook from "./Phonebook.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Phonebook />
  </StrictMode>,
);
