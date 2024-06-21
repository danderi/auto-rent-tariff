import React from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import NotFound from "./views/NotFound";
import UsersList from "./views/UsersList";
import injectContext from './store/appContext';
import Login from './views/Login';
import Register from './views/Register';
import Navbar from './components/Navbar';

const Layout = () => {
  const basename = process.env.PUBLIC_URL || "";

  return (
    <BrowserRouter basename={basename}>
      <Navbar />
      <div>
        <Routes>
          <Route exact path="/" element={<Login />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/register" element={<Register />} />
          <Route exact path="/users" element={<UsersList />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default injectContext(Layout);
