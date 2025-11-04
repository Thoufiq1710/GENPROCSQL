import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LanguagePage from "./pages/LanguagePage/LanguagePage.jsx";
import ProjectPage from "./pages/ProjectPage/ProjectPage.jsx";
import ModulePage from "./pages/ModulePage/ModulePage.jsx";
import DbConnectionPage from "./pages/DbConnectionPage/DbConnectionPage.jsx";
import LovPage from "./pages/LOVPage/LOVPage.jsx";
import LovDetailsPage from "./pages/LovDetailsPage/LovDetailsPage.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/language" replace />} />
        <Route path="/language" element={<LanguagePage />} />
        <Route path="/project" element={<ProjectPage />} />
        <Route path="/module" element={<ModulePage />} />
        <Route path="/dbconnect" element={<DbConnectionPage />} />
        <Route path="/lov" element={<LovPage />} />
        <Route path="/lov-det" element={<LovDetailsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
