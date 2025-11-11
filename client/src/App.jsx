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
import LovPage from "./pages/LovPage/LovPage.jsx";
import LovDetailsPage from "./pages/LovDetailsPage/LovDetailsPage.jsx";
import ErrorMsgPage from "./pages/ErrorMsg/ErrorMsgPage.jsx";

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
        <Route path="/err-msg" element={<ErrorMsgPage />} />
      </Routes>
    </Router>
  );
}

export default App;
