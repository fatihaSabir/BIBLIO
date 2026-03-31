<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\{Book, Category};
use Illuminate\Http\{Request, JsonResponse};
use Illuminate\Support\Facades\Storage;

class BookController extends Controller
{
    // LISTE LIVRES (public)
    public function index(Request $request): JsonResponse
    {
        $q = Book::with('category');
        if ($request->search) {
            $s = $request->search;
            $q->where(fn($x) => $x->where('title','like',"%$s%")
                                   ->orWhere('author','like',"%$s%")
                                   ->orWhere('isbn','like',"%$s%"));
        }
        if ($request->category_id) $q->where('category_id', $request->category_id);
        if ($request->available === 'true') $q->where('is_available', true);
        return response()->json($q->latest()->paginate($request->per_page ?? 12), 200);
    }

    // DETAIL LIVRE (public)
    public function show(Book $book): JsonResponse
    {
        return response()->json($book->load('category'), 200);
    }

    // AJOUTER LIVRE (admin)
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'title'          => 'required|string|max:255',
            'author'         => 'required|string|max:255',
            'isbn'           => 'nullable|string|unique:books,isbn',
            'description'    => 'nullable|string',
            'category_id'    => 'nullable|exists:categories,id',
            'total_copies'   => 'required|integer|min:1',
            'published_year' => 'nullable|integer|min:1900|max:2025',
            'publisher'      => 'nullable|string|max:255',
            'cover_image'    => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        $data = $request->except('cover_image');
        $data['available_copies'] = $request->total_copies;
        $data['is_available']     = true;

        if ($request->hasFile('cover_image')) {
            $data['cover_image'] = $request->file('cover_image')->store('covers','public');
        }

        $book = Book::create($data);
        return response()->json(['message'=>'Livre ajoute.','book'=>$book->load('category')], 201);
    }

    // MODIFIER LIVRE (admin)
    public function update(Request $request, Book $book): JsonResponse
    {
        $request->validate([
            'title'          => 'sometimes|string|max:255',
            'author'         => 'sometimes|string|max:255',
            'isbn'           => 'nullable|string|unique:books,isbn,'.$book->id,
            'description'    => 'nullable|string',
            'category_id'    => 'nullable|exists:categories,id',
            'total_copies'   => 'sometimes|integer|min:1',
            'published_year' => 'nullable|integer|min:1900|max:2025',
            'publisher'      => 'nullable|string|max:255',
            'cover_image'    => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        $data = $request->except('cover_image');
        if ($request->hasFile('cover_image')) {
            if ($book->cover_image) Storage::disk('public')->delete($book->cover_image);
            $data['cover_image'] = $request->file('cover_image')->store('covers','public');
        }
        $book->update($data);
        return response()->json(['message'=>'Livre modifie.','book'=>$book->load('category')], 200);
    }

    // SUPPRIMER LIVRE (admin)
    public function destroy(Book $book): JsonResponse
    {
        if ($book->emprunts()->whereIn('status',['en_attente','approuve'])->exists())
            return response()->json(['message'=>'Emprunts actifs existent.'], 422);
        if ($book->cover_image) Storage::disk('public')->delete($book->cover_image);
        $book->delete();
        return response()->json(['message'=>'Livre supprime.'], 200);
    }

    // CATEGORIES (public)
    public function categories(): JsonResponse
    {
        return response()->json(Category::withCount('books')->orderBy('name')->get(), 200);
    }

    // AJOUTER CATEGORIE (admin)
    public function storeCategory(Request $request): JsonResponse
    {
        $request->validate(['name'=>'required|string|unique:categories,name','description'=>'nullable|string']);
        return response()->json(Category::create($request->only(['name','description'])), 201);
    }

    // SUPPRIMER CATEGORIE (admin)
    public function destroyCategory(Category $category): JsonResponse
    {
        if ($category->books()->exists())
            return response()->json(['message'=>'Des livres utilisent cette categorie.'], 422);
        $category->delete();
        return response()->json(['message'=>'Categorie supprimee.'], 200);
    }
}
