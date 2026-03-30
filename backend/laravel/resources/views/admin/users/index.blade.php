@extends('layouts.app')

@section('content')
<h1>Gestion des utilisateurs</h1>

@if(session('success'))
    <div>{{ session('success') }}</div>
@endif

<table>
    <thead>
        <tr>
            <th>Nom</th>
            <th>Email</th>
            <th>Rôle</th>
            <th>Action</th>
        </tr>
    </thead>
    <tbody>
    @foreach($users as $user)
        <tr>
            <td>{{ $user->name }}</td>
            <td>{{ $user->email }}</td>
            <td>{{ $user->role }}</td>
            <td>
                <form method="POST" action="{{ url('/admin/users/'.$user->id.'/role') }}">
                    @csrf
                    <select name="role">
                        <option value="lecteur" {{ $user->role === 'lecteur' ? 'selected' : '' }}>Lecteur</option>
                        <option value="admin" {{ $user->role === 'admin' ? 'selected' : '' }}>Admin</option>
                    </select>
                    <button type="submit">Modifier</button>
                </form>
            </td>
        </tr>
    @endforeach
    </tbody>
</table>
@endsection