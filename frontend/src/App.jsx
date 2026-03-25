// src/App.jsx
import React from "react";
import Books from "./pages/Books";
import AdminUsers from "./pages/AdminUsers";
import ProtectedRoute from "./components/ProtectedRoute";


const currentUser = { id: 1, name: "Fatiha", role: "Admin" };

function App() {
  return (
    <div>
     
      <ProtectedRoute currentUser={currentUser}>
        <AdminUsers />
      </ProtectedRoute>

      <hr />

      
      <ProtectedRoute currentUser={currentUser}>
        <Books currentUser={currentUser} />
      </ProtectedRoute>
    </div>
  );
}

export default App;