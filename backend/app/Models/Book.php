<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Book extends Model
{
    protected $fillable = [
        'title','author','isbn','description','category_id',
        'total_copies','available_copies','cover_image',
        'published_year','publisher','is_available',
    ];
    protected $casts = ['is_available'=>'boolean'];

    public function category() { return $this->belongsTo(Category::class); }
    public function emprunts() { return $this->hasMany(Emprunt::class); }

    public function updateAvailability(): void
    {
        $this->is_available = $this->available_copies > 0;
        $this->save();
    }
}
