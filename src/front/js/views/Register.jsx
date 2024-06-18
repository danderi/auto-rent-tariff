import React, { useState, useContext } from 'react';
import { Context } from '../store/appContext';
import { Link, useNavigate } from 'react-router-dom';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';
import "../../styles/auth.css";

const Register = () => {
    const { actions } = useContext(Context);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: "",
        firstName: "",
        lastName: "",
        password: ""
    });
    const [errors, setErrors] = useState({});
    const [creatingUser, setCreatingUser] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [showPassword, setShowPassword] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    const validateForm = () => {
        const errors = {};
        if (!formData.email) {
            errors.email = 'Email is required';
        }
        if (!formData.firstName) {
            errors.firstName = 'First Name is required';
        }
        if (!formData.lastName) {
            errors.lastName = 'Last Name is required';
        }
        if (!formData.password) {
            errors.password = 'Password is required';
        }
        setErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleInputChange = e => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setErrors({ ...errors, [name]: '' });

        if (name === 'password') {
            evaluatePasswordStrength(value);
        }
    };

    const evaluatePasswordStrength = (password) => {
        let strength = 0;
        if (password.length >= 8) strength += 1;
        if (/[A-Z]/.test(password)) strength += 1;
        if (/[a-z]/.test(password)) strength += 1;
        if (/[0-9]/.test(password)) strength += 1;
        if (/[\W_]/.test(password)) strength += 1;

        setPasswordStrength(strength);
    };

    const handleSubmit = async e => {
        e.preventDefault();
        if (validateForm()) {
            setCreatingUser(true);
            try {
                const response = await actions.register(formData);
                if (response.success) {
                    setFormData({
                        email: "",
                        firstName: "",
                        lastName: "",
                        password: ""
                    });
                    setSuccessMessage("User created successfully! Redirecting to login...");
                    setTimeout(() => {
                        setCreatingUser(false);
                        navigate("/login");
                    }, 2000); // Redirigir después de 2 segundos
                } else {
                    if (response.error === 'Email already exists.') {
                        setErrors({ email: "User already exists. Please use a different email." });
                    } else {
                        setErrors({ common: response.error });
                    }
                    setCreatingUser(false);
                }
            } catch (error) {
                console.error("Error:", error);
                setErrors({ common: "An error occurred. Please try again." });
                setCreatingUser(false);
            }
        }
    };

    const getPasswordStrengthColor = (strength) => {
        switch (strength) {
            case 1:
                return "red";
            case 2:
                return "orange";
            case 3:
                return "yellow";
            case 4:
                return "lightgreen";
            case 5:
                return "green";
            default:
                return "red";
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h4 className="card-title text-center mb-4">Sign Up</h4>
                {successMessage && <div className="alert alert-success">{successMessage}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
                        <input
                            type="email"
                            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                            id="exampleInputEmail1"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            aria-describedby="emailHelp"
                        />
                        {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                    </div>
                    <div className="mb-3">
                        <label htmlFor="exampleInputFirstName" className="form-label">First Name</label>
                        <input
                            type="text"
                            className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
                            id="exampleInputFirstName"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                        />
                        {errors.firstName && <div className="invalid-feedback">{errors.firstName}</div>}
                    </div>
                    <div className="mb-3">
                        <label htmlFor="exampleInputLastName" className="form-label">Last Name</label>
                        <input
                            type="text"
                            className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
                            id="exampleInputLastName"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                        />
                        {errors.lastName && <div className="invalid-feedback">{errors.lastName}</div>}
                    </div>
                    <div className="mb-3">
                        <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
                        <div className="password-wrapper">
                            <input
                                type={showPassword ? "text" : "password"}
                                className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                id="exampleInputPassword1"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                            />
                            <span className="password-toggle-icon" onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                            </span>
                        </div>
                        {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                        <div className="password-strength">
                            <div 
                                className="password-strength-bar" 
                                style={{ 
                                    width: `${(passwordStrength / 5) * 100}%`, 
                                    backgroundColor: getPasswordStrengthColor(passwordStrength) 
                                }}
                            />
                        </div>
                        <p className="password-recommendations">
                            Password should be at least 8 characters long and include uppercase letters, lowercase letters, numbers, and symbols.
                        </p>
                    </div>
                    {errors.common && <div className="alert alert-danger">{errors.common}</div>}
                    <button type="submit" className="btn btn-primary w-100 mt-3">Submit</button>
                    {creatingUser && <p className="text-center mt-3">
                        <span className="dot-flashing-container">
                            <span className="dot-flashing"></span>
                        </span>
                    </p>}
                </form>
                <div className="auth-footer">
                    <p className="mb-0">Already have an account? <Link to="/login" className="btn btn-link">Log In</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Register;
