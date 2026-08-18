import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import Board from './pages/Board/Board';
import Home from './pages/Home/Home';

function App(): React.JSX.Element {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/board/:board_id" element={<Board />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </Router>
      <Toaster />
    </>
  );
}

export default App;
