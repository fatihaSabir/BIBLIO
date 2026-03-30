@extends('layouts.app')

@section('content')
<h1>Gestion des livres</h1>

<form method="POST" action="/admin/books">
    @csrf
    <input type="text" name="title" placeholder="Titre du livre">
    <input type="text" name="author" placeholder="Auteur">
    <button type="submit">Ajouter</button>
</form>

<h2>Liste des livres</h2>
<ul>
    @foreach($books as $book)
        <li>{{ $book->title }} - {{ $book->author }}</li>
    @endforeach
</ul>
@endsection