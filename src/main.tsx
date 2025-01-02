import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./global.css";
import AppRoutes from "./AppRoutes";
import "./i18n";
import { DarkModeProvider } from "./contexts/DarkModeContext";
import { LanguageProvider } from "./contexts/LanguageContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <LanguageProvider>
      <DarkModeProvider>
        <AppRoutes />
      </DarkModeProvider>
    </LanguageProvider>
  </StrictMode>
);
