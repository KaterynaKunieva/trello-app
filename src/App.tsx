import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Board from './pages/Board/Board';
import Default from './pages/Default/Default';

function App(): React.JSX.Element {
  return (
    <Router>
      <Routes>
        <Route path="/board" element={<Board />} />
        <Route path="/" element={<Default />} />
      </Routes>
    </Router>
  );
}

export default App;
