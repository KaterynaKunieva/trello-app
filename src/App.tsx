import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
      <Toaster richColors />
    </>
  );
}

export default App;
