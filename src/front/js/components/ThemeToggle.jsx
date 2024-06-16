// src/front/js/components/ThemeToggle.jsx

import React, { useContext } from 'react';
import { Context } from '../store/appContext';

const ThemeToggle = () => {
    const { store, actions } = useContext(Context);

    const handleToggle = () => {
        actions.toggleDarkMode();
    };

    return (
        <button onClick={handleToggle}>
            {store.darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        </button>
    );
};

export default ThemeToggle;
