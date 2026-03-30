import React, { useState, useEffect } from "react";
import axios from "axios";

function AdminUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8000/admin/users") // backend Laravel
      .then(res => setUsers(res.data))
      .catch(err => console.log(err));
  }, []);

  const updateRole = (id, role) => {
    axios.post(`http://localhost:8000/admin/users/${id}/role`, { role })
      .then(() => {
        setUsers(users.map(u => u.id === id ? { ...u, role } : u));
      })
      .catch(err => console.log(err));
  };

  return (
    <div>
      <h2>Gestion des utilisateurs</h2>
      <table>
        <thead>
          <tr>
            <th>Nom</th>
            <th>Email</th>
            <th>Role</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <button onClick={() => updateRole(user.id, user.role === "admin" ? "lecteur" : "admin")}>
                  Changer rôle
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminUsers;