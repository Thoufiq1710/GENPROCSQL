import React from "react";
import LeftTabMenu from "../../../components/LeftTabMenu/LeftTabMenu";
import SnippetForm from "../../../components/SnippetForm/SnippetForm";

function SnippetPage() {
  return (
    <div className="master-page">
      {/* Sidebar */}
      <aside className="sidebar">
        <LeftTabMenu />
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <SnippetForm />
      </main>
    </div>
  );
}

export default SnippetPage;
