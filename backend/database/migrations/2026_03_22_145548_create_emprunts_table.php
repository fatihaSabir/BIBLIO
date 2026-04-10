<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('emprunts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('book_id')->constrained()->cascadeOnDelete();
            $table->enum('status', ['en_attente','approuve','retourne','refuse','en_retard'])->default('en_attente');
            $table->date('date_demande');
            $table->date('date_emprunt')->nullable();
            $table->date('date_retour_prevue')->nullable();
            $table->date('date_retour_reelle')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void { Schema::dropIfExists('emprunts'); }
};
