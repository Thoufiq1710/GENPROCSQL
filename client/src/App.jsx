import React, { Suspense, lazy } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

const LanguagePage = lazy(() =>
  import("./pages/commonPage/LanguagePage/LanguagePage.jsx")
);
const ProjectPage = lazy(() =>
  import("./pages/commonPage/ProjectPage/ProjectPage.jsx")
);
const ModulePage = lazy(() =>
  import("./pages/commonPage/ModulePage/ModulePage.jsx")
);
const DbConnectionPage = lazy(() =>
  import("./pages/commonPage/DbConnectionPage/DbConnectionPage.jsx")
);
const LovPage = lazy(() => import("./pages/commonPage/LovPage/LovPage.jsx"));
const LovDetailsPage = lazy(() =>
  import("./pages/commonPage/LovDetailsPage/LovDetailsPage.jsx")
);
const ErrorMsgPage = lazy(() =>
  import("./pages/commonPage/ErrorMsg/ErrorMsgPage.jsx")
);
const ProductPage = lazy(() =>
  import("./pages/commonPage/ProductPage/ProductPage.jsx")
);
const GenPage = lazy(() => import("./pages/mySQLTool/GenPage/GenPage.jsx"));

const FieldTypePage = lazy(() =>
  import("./pages/codegentool/FieldTypePage/FieldTypePage.jsx")
);

const SnippetPage = lazy(() =>
  import("./pages/codegentool/SnippetPage/SnippetPage.jsx")
);

function App() {
  return (
    <Router>
      <Suspense
        fallback={
          <div style={{ textAlign: "center", marginTop: "50px" }}>
            Loading...
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<Navigate to="/language" replace />} />
          <Route path="/language" element={<LanguagePage />} />
          <Route path="/project" element={<ProjectPage />} />
          <Route path="/module" element={<ModulePage />} />
          <Route path="/dbconnect" element={<DbConnectionPage />} />
          <Route path="/lov" element={<LovPage />} />
          <Route path="/lov-det" element={<LovDetailsPage />} />
          <Route path="/err-msg" element={<ErrorMsgPage />} />
          <Route path="/product" element={<ProductPage />} />
          <Route path="/gen-page" element={<GenPage />} />
          <Route path="/project/field-type" element={<FieldTypePage />} />
          <Route path="/project/snippet" element={<SnippetPage />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
