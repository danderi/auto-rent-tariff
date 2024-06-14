import React from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./views/Home.jsx";
import Contact from "./views/Contact.jsx";
import NotFound from "./views/NotFound.jsx";
import injectContext from './js/store/appContext.js';
import Login from './views/Login.jsx';       // Importar el componente Login
import Register from './views/Register.jsx'; // Importar el componente Register

const Layout = () => {
  const basename = process.env.BASENAME || "";
  return (
    <div>
      <BrowserRouter basename={basename}>
        <Routes>
          <Route exact path="/" element={<Login />} />
          <Route exact path="/register" element={<Register />} />
          <Route exact path="/home" element={<Home />} />
          <Route exact path="/contact" element={<Contact />} />
          <Route exact path="/*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default injectContext(Layout);
