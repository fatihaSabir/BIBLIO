<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Emprunt extends Model
{
    protected $fillable = [
        'user_id','book_id','status',
        'date_demande','date_emprunt',
        'date_retour_prevue','date_retour_reelle','notes',
    ];
    protected $casts = [
        'date_demande'       => 'date',
        'date_emprunt'       => 'date',
        'date_retour_prevue' => 'date',
        'date_retour_reelle' => 'date',
    ];
    public function user() { return $this->belongsTo(User::class); }
    public function book() { return $this->belongsTo(Book::class); }
}
