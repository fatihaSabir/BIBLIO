<?php
namespace App\Models;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, Notifiable;

    protected $fillable = ['name','email','password','role','is_active','phone','address'];
    protected $hidden   = ['password','remember_token'];
    protected $casts    = ['is_active'=>'boolean','email_verified_at'=>'datetime','password'=>'hashed'];

    public function emprunts() { return $this->hasMany(Emprunt::class); }
    public function isAdmin(): bool { return $this->role === 'admin'; }
}
