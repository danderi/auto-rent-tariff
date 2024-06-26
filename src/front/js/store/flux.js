const getState = ({ getStore, getActions, setStore }) => {
    return {
        store: {
            personas: ["Pedro", "Maria"],
            registerStatus: false,
            loginStatus: false,
            darkMode: localStorage.getItem('dark-mode') === 'true'
        },
        actions: {
            exampleFunction: () => {
                console.log("hola");
                return;
            },

            register: async (formData) => {
                try {
                    const response = await fetch("https://auto-rent-tariff-back.onrender.com/admin/users", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(formData)
                    });

                    const statusCode = response.status;
                    const responseData = await response.json();

                    if (statusCode === 201) {
                        setStore({ ...getStore(), registerStatus: true });
                        return { success: true };
                    } else if (statusCode === 409) {
                        return { success: false, error: 'Email already exists.' };
                    } else {
                        return { success: false, error: responseData.error };
                    }
                } catch (error) {
                    console.error("Error:", error);
                    return { success: false, error: "An error occurred. Please try again." };
                }
            },

            submitLoginForm: async (loginData) => {
                try {
                    const response = await fetch("https://auto-rent-tariff-back.onrender.com/admin/token", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(loginData)
                    });

                    const statusCode = response.status;
                    const responseData = await response.json();

                    if (statusCode === 200) {
                        localStorage.setItem('token', responseData.access_token); // Guardar el token en localStorage
                        console.log("Token stored:", responseData.access_token); // Added log to check the stored token
                        return { success: true };
                    } else if (statusCode === 400) {
                        return { success: false, error: responseData.error };
                    } else if (statusCode === 401) {
                        return { success: false, error: "Invalid password." };
                    } else {
                        return { success: false, error: responseData.error };
                    }
                } catch (error) {
                    console.error("Error:", error);
                    return { success: false, error: "An error occurred. Please try again." };
                }
            },

            toggleDarkMode: () => {
                const store = getStore();
                const newMode = !store.darkMode;
                setStore({ darkMode: newMode });
                localStorage.setItem('dark-mode', newMode);
                document.documentElement.classList.toggle('dark', newMode);
            },

            logout: () => {
                localStorage.removeItem('token');
            },

            getUsers: async () => {
                try {
                    const token = localStorage.getItem('token');
                    const response = await fetch("https://auto-rent-tariff-back.onrender.com/admin/users", {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });

                    const data = await response.json();
                    if (response.ok) {
                        return data;
                    } else {
                        console.error("Error fetching users:", data.error || data.message);
                        return [];
                    }
                } catch (error) {
                    console.error("Error:", error);
                    return [];
                }
            }
        }
    };
};

export default getState;
