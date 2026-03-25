import { createRoot } from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import App from "./App.tsx";
import "./index.css";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "541974040667-9njaj0qlh7g8k5p994rqr1rikdj26hbn.apps.googleusercontent.com";

createRoot(document.getElementById("root")!).render(
  <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
    <App />
  </GoogleOAuthProvider>
);
