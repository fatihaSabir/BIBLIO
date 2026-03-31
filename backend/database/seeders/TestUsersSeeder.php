<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class TestUsersSeeder extends Seeder
{
    public function run()
    {
        User::updateOrCreate(
            ['email' => 'admin@bibliotheque.com'],
            [
                'name' => 'Admin Test',
                'password' => Hash::make('Admin@1234'),
                'role' => 'admin'
            ]
        );

        User::updateOrCreate(
            ['email' => 'karim@example.com'],
            [
                'name' => 'karim',
                'password' => Hash::make('password'),
                'role' => 'lecteur'
            ]
        );
    }
}