import React, { useContext, useState } from "react";
import { Context } from "../store/appContext";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/auth.css";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa"; // Importación de los iconos

const Login = () => {
    const { actions } = useContext(Context);
    const navigate = useNavigate();
    const [loginData, setLoginData] = useState({
        email: "",
        password: ""
    });
    const [errors, setErrors] = useState({});
    const [loggingIn, setLoggingIn] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleInputChange = e => {
        const { name, value } = e.target;
        setLoginData({ ...loginData, [name]: value });
        setErrors({ ...errors, [name]: '' }); // Clear error message when user starts typing
    };

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            setLoggingIn(true);
            console.log('Login data:', loginData); // Verificar los datos de login
            const response = await actions.submitLoginForm(loginData);
            console.log('Login response:', response); // Verificar la respuesta de submitLoginForm
            if (response.success) {
                setLoginData({ email: "", password: "" });
                setLoggingIn(false);
                navigate("/users");
            } else {
                if (response.error === "User not found.") {
                    setErrors({ email: "User not found. Please check your email." });
                    setLoggingIn(false);
                } else if (response.error === "Invalid password.") {
                    setErrors({ password: "Invalid password. Please try again." });
                    setLoggingIn(false);
                } else if (response.error === "Email and password are required.") {
                    setErrors({ common: response.error });
                    setLoggingIn(false);
                } else {
                    setErrors({ common: response.error });
                    setLoggingIn(false);
                }
            }
        } catch (error) {
            console.error("Error:", error);
            setErrors({ common: "An error occurred. Please try again." });
            setLoggingIn(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h4 className="card-title mb-4">Log In</h4>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
                        <input
                            type="email"
                            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                            id="exampleInputEmail1"
                            name="email"
                            value={loginData.email}
                            onChange={handleInputChange}
                            aria-describedby="emailHelp"
                        />
                        {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                    </div>
                    <div className="mb-3 password-container">
                        <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
                        <div className="password-wrapper">
                            <input
                                type={showPassword ? "text" : "password"}
                                className={`form-control ${errors.password || (errors.common && !loginData.password) ? 'is-invalid' : ''}`}
                                id="exampleInputPassword1"
                                name="password"
                                value={loginData.password}
                                onChange={handleInputChange}
                            />
                            <span className="password-toggle-icon" onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                            </span>
                            {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                        </div>
                    </div>
                    {errors.common && !errors.password && <div className="alert alert-danger">{errors.common}</div>}
                    <button type="submit" className="btn btn-primary w-100 mt-3">Login</button>
                    {loggingIn && <p className="text-center mt-3">
                        <span className="dot-flashing-container">
                            <span className="dot-flashing"></span>
                        </span>
                    </p>
                    }
                </form>
                <div className="auth-footer">
                    <p className="mb-0">Don't have an account? <Link to="/register" className="btn btn-link">Register</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Login;
