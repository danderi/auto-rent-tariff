import React, { useState, useContext } from 'react';
import { Context } from '../js/store/appContext.js';

const Login = () => {
    const { store, actions } = useContext(Context);

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleLogin = () => {
        const { email, password } = formData;
        actions.login(email, password);
    };

    return (
        <div>
            <h2>Login</h2>
            <form>
                <div>
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label htmlFor="password">Contraseña:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                    />
                </div>
            </form>
            <button onClick={handleLogin}>Login</button>
        </div>
    );
};

export default Login;
