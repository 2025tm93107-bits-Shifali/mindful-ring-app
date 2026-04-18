import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Apply saved theme before render to avoid flash
if (localStorage.getItem('habit-tracker-theme') === 'light') {
  document.documentElement.classList.add('light');
}

// Guard service worker registration: never run inside Lovable preview iframe.
const isInIframe = (() => {
  try {
    return window.self !== window.top;
  } catch {
    return true;
  }
})();

const isPreviewHost =
  window.location.hostname.includes("id-preview--") ||
  window.location.hostname.includes("lovableproject.com") ||
  window.location.hostname.includes("lovable.app") && window.location.hostname.includes("id-preview");

if (isPreviewHost || isInIframe) {
  // Strip out any previously registered service workers in preview/iframe.
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.getRegistrations().then((regs) => {
      regs.forEach((r) => r.unregister());
    });
  }
} else if ("serviceWorker" in navigator) {
  // Lazy-load the auto-generated registration only in production / standalone.
  import("virtual:pwa-register").then(({ registerSW }) => {
    registerSW({ immediate: true });
  }).catch(() => {
    // virtual module not available in dev — safe to ignore.
  });
}

createRoot(document.getElementById("root")!).render(<App />);
