import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./index.css";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Navigate to="/nyc/mta/subway/r46" replace />}
        />
        <Route path="/nyc/mta/subway/r46" element={<App />} />
        <Route path="/nyc/mta/bus" element={<App />} />
        <Route
          path="*"
          element={<Navigate to="/nyc/mta/subway/r46" replace />}
        />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
