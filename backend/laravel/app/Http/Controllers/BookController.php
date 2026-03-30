<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Book;

class BookController extends Controller
{
    public function index()
    {
        $books = Book::all();
        return view('admin.books.index', compact('books'));
    }

    public function store(Request $request)
    {
        $request->validate(['title'=>'required','author'=>'required']);
        Book::create($request->only(['title','author']));
        return redirect()->back()->with('success', 'Livre ajouté !');
    }

    public function update(Request $request, $id)
    {
        $book = Book::findOrFail($id);
        $book->update($request->only(['title','author']));
        return redirect()->back()->with('success', 'Livre modifié !');
    }

    public function destroy($id)
    {
        $book = Book::findOrFail($id);
        $book->delete();
        return redirect()->back()->with('success', 'Livre supprimé !');
    }
}