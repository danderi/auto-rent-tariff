import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Context } from '../store/appContext';
import "../../styles/navbar.css"; // Asegúrate de tener este archivo CSS

const Navbar = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();

    const handleLogout = () => {
        actions.logout();
        navigate('/login');
    };

    const isAuthenticated = () => !!localStorage.getItem('token');

    return (
        <nav className="navbar">
            <div className="navbar-links">
                {isAuthenticated() && (
                    <>
                        <Link to="/users">Users</Link>
                        <button onClick={handleLogout}>Logout</button>
                    </>
                )}
            </div>
            <div className="navbar-toggle">
                <button onClick={actions.toggleDarkMode}>
                    {store.darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
