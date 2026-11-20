import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import Board from './pages/Board/Board';
import Home from './pages/Home/Home';
import CardModal from './features/cards/components/CardModal/CardModal';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import ProtectedRoute from './features/auth/components/ProtectedRoute/ProtectedRoute';

function App(): React.JSX.Element {
  return (
    <>
      <Router>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/board/:board_id" element={<Board />}>
              <Route path="c/:card_id" element={<CardModal />} />
            </Route>
            <Route path="/" element={<Home />} />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
      <Toaster richColors />
    </>
  );
}

export default App;
