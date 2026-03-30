import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminBooks = () => {
  const [books, setBooks] = useState([]);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");

  // Récupérer la liste des livres
  useEffect(() => {
    axios.get("http://localhost:8000/admin/books")
      .then(res => setBooks(res.data))
      .catch(err => console.error(err));
  }, []);

  // Ajouter un livre
  const handleAddBook = () => {
    axios.post("http://localhost:8000/admin/books", { title, author })
      .then(res => {
        setBooks([...books, res.data]);
        setTitle("");
        setAuthor("");
        alert("Livre ajouté !");
      })
      .catch(err => console.error(err));
  };

  // Supprimer un livre
  const handleDeleteBook = (id) => {
    axios.delete(`http://localhost:8000/admin/books/${id}`)
      .then(() => setBooks(books.filter(b => b.id !== id)))
      .catch(err => console.error(err));
  };

  return (
    <div>
      <h2>Gestion des livres</h2>

      <div>
        <input 
          placeholder="Titre" 
          value={title} 
          onChange={e => setTitle(e.target.value)} 
        />
        <input 
          placeholder="Auteur" 
          value={author} 
          onChange={e => setAuthor(e.target.value)} 
        />
        <button onClick={handleAddBook}>Ajouter Livre</button>
      </div>

      <table border="1" cellPadding="10" style={{marginTop: "20px"}}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Titre</th>
            <th>Auteur</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.map(book => (
            <tr key={book.id}>
              <td>{book.id}</td>
              <td>{book.title}</td>
              <td>{book.author}</td>
              <td>
                <button onClick={() => handleDeleteBook(book.id)}>Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminBooks;