<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Category;
use App\Models\Book;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // ── Utilisateurs ──────────────────────────
        User::create([
            'name'      => 'Administrateur',
            'email'     => 'admin@bibliotheque.ma',
            'password'  => Hash::make('Admin@1234'),
            'role'      => 'admin',
            'is_active' => true,
        ]);

        User::create([
            'name'      => 'Karim Benali',
            'email'     => 'karim@example.com',
            'password'  => Hash::make('password'),
            'role'      => 'lecteur',
            'is_active' => true,
            'phone'     => '0612345678',
        ]);

        // ── Catégories ────────────────────────────
        $cats = [
            ['name' => 'Litterature',  'description' => 'Romans, nouvelles, poesie'],
            ['name' => 'Informatique', 'description' => 'Programmation, reseaux'],
            ['name' => 'Sciences',     'description' => 'Physique, chimie, biologie'],
            ['name' => 'Histoire',     'description' => 'Histoire mondiale'],
            ['name' => 'Philosophie',  'description' => 'Philosophie et pensee critique'],
        ];
        foreach ($cats as $c) Category::create($c);

        // ── Livres ────────────────────────────────
        $books = [
            ['title' => 'Le Petit Prince',   'author' => 'Antoine de Saint-Exupery', 'category_id' => 1, 'total_copies' => 3, 'published_year' => 1943],
            ['title' => 'Clean Code',        'author' => 'Robert C. Martin',         'category_id' => 2, 'total_copies' => 4, 'published_year' => 2008],
            ['title' => 'Sapiens',           'author' => 'Yuval Noah Harari',         'category_id' => 4, 'total_copies' => 2, 'published_year' => 2011],
            ['title' => 'Une breve histoire','author' => 'Stephen Hawking',           'category_id' => 3, 'total_copies' => 2, 'published_year' => 1988],
            ['title' => 'Laravel Up Running','author' => 'Matt Stauffer',             'category_id' => 2, 'total_copies' => 3, 'published_year' => 2019],
        ];
        foreach ($books as $b) {
            Book::create(array_merge($b, [
                'available_copies' => $b['total_copies'],
                'is_available'     => true,
            ]));
        }
    }
}
