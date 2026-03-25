import React from "react";
const booksData = [
  { id: 1, title: "Livre 1", author: "Auteur 1" },
  { id: 2, title: "Livre 2", author: "Auteur 2" },
];

const Books = ({ currentUser }) => {
  return (
    <div>
      <h1>Liste des livres</h1>
      {currentUser.role === "Admin" && <button>Ajouter un livre</button>}
      <table border="1" cellPadding="5">
        <thead>
          <tr>
            <th>ID</th>
            <th>Titre</th>
            <th>Auteur</th>
            {currentUser.role === "Admin" && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {booksData.map((book) => (
            <tr key={book.id}>
              <td>{book.id}</td>
              <td>{book.title}</td>
              <td>{book.author}</td>
              {currentUser.role === "Admin" && (
                <td>
                  <button>Modifier</button>
                  <button>Supprimer</button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Books;