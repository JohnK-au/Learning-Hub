import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "@/App.tsx";
import { ErrorBoundary } from "@/components/ErrorBoundary.tsx";
import { ProgressProvider } from "@/store/ProgressContext.tsx";
import "@/index.css";

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element #root not found");

createRoot(rootElement).render(
  <StrictMode>
    {/* Outermost circuit breaker: a render error anywhere shows a friendly
        card instead of a blank white page. */}
    <ErrorBoundary>
      <ProgressProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ProgressProvider>
    </ErrorBoundary>
  </StrictMode>,
);
