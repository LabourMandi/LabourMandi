import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Suppress Vite HMR WebSocket errors in development (doesn't affect app functionality)
window.addEventListener("unhandledrejection", (event) => {
  if (
    event.reason?.message?.includes("Failed to construct 'WebSocket'") ||
    event.reason?.message?.includes("wss://") ||
    event.reason?.message?.includes("is invalid")
  ) {
    event.preventDefault();
  }
});

// Also suppress console errors for WebSocket
const originalError = console.error;
console.error = (...args: any[]) => {
  if (
    args[0]?.includes?.("WebSocket") ||
    args[0]?.message?.includes?.("WebSocket")
  ) {
    return;
  }
  originalError.apply(console, args);
};

createRoot(document.getElementById("root")!).render(<App />);
