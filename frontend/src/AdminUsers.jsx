import React, { useState } from "react";
import { usersData } from "../data/users";

const AdminUsers = () => {
  const [users, setUsers] = useState(usersData);

  
  const handleRoleChange = (id, newRole) => {
    setUsers(
      users.map(user =>
        user.id === id ? { ...user, role: newRole } : user
      )
    );
  };

  return (
    <div>
      <h1>Gestion des utilisateurs</h1>
      <table border="1" cellPadding="5">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nom</th>
            <th>Rôle</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>
                <select
                  value={user.role}
                  onChange={(e) => handleRoleChange(user.id, e.target.value)}
                >
                  <option value="Admin">Admin</option>
                  <option value="Lecteur">Lecteur</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminUsers;