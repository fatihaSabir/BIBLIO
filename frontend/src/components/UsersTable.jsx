import React, { useState } from "react";
import { usersData } from "../data/users"; // استدعاء بيانات المستخدمين

const UsersTable = () => {
  const [users, setUsers] = useState(usersData);

  return (
    <table border="1" cellPadding="5">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nom</th>
          <th>Rôle</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user.id}>
            <td>{user.id}</td>
            <td>{user.name}</td>
            <td>{user.role}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default UsersTable;