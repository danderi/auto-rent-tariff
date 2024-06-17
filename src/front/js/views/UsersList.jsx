import React, { useEffect, useContext, useState } from 'react';
import { Context } from '../store/appContext';
import "../../styles/usersList.css";

const UsersList = () => {
    const { store, actions } = useContext(Context);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            const response = await actions.getUsers();
            console.log('Users in component:', response); // Añadir esta línea para verificar los datos en el componente
            setUsers(response);
        };

        fetchUsers();
    }, [actions]);

    return (
        <div className="users-list">
            <h2>Users List</h2>
            {users.length > 0 ? (
                <ul>
                    {users.map(user => (
                        <li key={user.id}>
                            <p><strong>Name:</strong> {user.name}</p>
                            <p><strong>Last Name:</strong> {user.last_name}</p>
                            <p><strong>Email:</strong> {user.email}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No users found.</p>
            )}
        </div>
    );
};

export default UsersList;
