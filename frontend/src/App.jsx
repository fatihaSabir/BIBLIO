import React from "react";
import AdminUsers from "./components/AdminUsers";
import AdminBooks from "./components/AdminBooks";

function App() {
  return (
    <div>
      <h1>Dashboard Admin</h1>
      <AdminUsers />
      <hr />
      <AdminBooks />
    </div>
  );
}

export default App;