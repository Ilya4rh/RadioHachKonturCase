import React from 'react';
import './App.css';
import {Game} from "./pages/Game";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Phaser from "phaser";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Game />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
