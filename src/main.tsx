import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Apply saved theme before render to avoid flash
if (localStorage.getItem('habit-tracker-theme') === 'light') {
  document.documentElement.classList.add('light');
}

createRoot(document.getElementById("root")!).render(<App />);
