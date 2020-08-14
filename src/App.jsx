import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useParams,
} from "react-router-dom";
import "./App.css";

import Home from "./Components/Projects/Home";
import Projects from "./Components/Projects/Projects";
import Board from "./Components/Projects/Board";
import Authentication from "./Components/Auth/Authentication";

const BoardP = () => {
  const { projectId } = useParams();

  return <Board projectId={projectId} />;
};

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/p" element={<Projects />} />
          <Route path="/p:projectId" element={<BoardP />} />
          <Route path="/a/*" element={<Authentication />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
