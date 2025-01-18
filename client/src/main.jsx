import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AppContentProvider } from "./context/AppContext";
import { BrowserRouter } from "react-router-dom";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppContentProvider>
        <App />
      </AppContentProvider>
    </BrowserRouter>
  </React.StrictMode>
);
