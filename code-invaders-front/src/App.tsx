import React from 'react';
import './App.css';
import {Game} from "./pages/Game";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Phaser from "phaser";
import {Admin} from "./pages/Admin";
import {TournamentDetails} from "./pages/TournamentDetails";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Game />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/tournament/:tournamentId" element={<TournamentDetails />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
