import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { AuthProvider } from "./context/AuthContext";
import { Provider } from "./components/ui/provider";

// Get the root element
const rootElement = document.getElementById("root");

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <Provider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </Provider>
    </React.StrictMode>
  );
} else {
  console.error("Root element not found");
}
