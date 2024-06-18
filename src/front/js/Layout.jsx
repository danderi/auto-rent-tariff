import React, { useContext, useEffect } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import NotFound from "./views/NotFound";
import UsersList from "./views/UsersList";
import injectContext, { Context } from './store/appContext';
import Login from './views/Login';
import Register from './views/Register';
import Navbar from './components/Navbar';

const Layout = () => {
  const { store, actions } = useContext(Context);

  useEffect(() => {
    const savedMode = localStorage.getItem('dark-mode') === 'true';
    if (savedMode !== store.darkMode) {
      actions.toggleDarkMode();
    }
  }, []);

  const isAuthenticated = () => !!localStorage.getItem('token');

  return (
    <BrowserRouter>
      <Navbar />
      <div>
        <Routes>
          <Route exact path="/" element={isAuthenticated() ? <Navigate to="/users" /> : <Login />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/register" element={<Register />} />
          <Route exact path="/users" element={isAuthenticated() ? <UsersList /> : <Navigate to="/login" />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default injectContext(Layout);
