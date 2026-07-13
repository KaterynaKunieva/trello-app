import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Board from './pages/Board/Board';
import Default from './pages/Default/Default';

function App(): React.JSX.Element {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/board" element={<Board />} />
        <Route path="/" element={<Default />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
