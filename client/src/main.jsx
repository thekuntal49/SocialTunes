import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { MusicProvider } from "./context/MusicContext";
import { UserProvider } from "./context/userContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <MusicProvider>
      <UserProvider>
        <App />
      </UserProvider>
    </MusicProvider>
  </StrictMode>
);
