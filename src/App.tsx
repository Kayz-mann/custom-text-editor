import React, { useState } from "react";
import DraftEditor from "./DraftEditor";
import "./App.css";

function App() {
  const [content, setContent] = useState("");

  const handleContentChange = (newContent: React.SetStateAction<string>) => {
    console.log("Content in App:", newContent);
    setContent(newContent);
  };

  return (
    <div className="App">
      <DraftEditor value={content} onChange={handleContentChange} />
    </div>
  );
}

export default App;
