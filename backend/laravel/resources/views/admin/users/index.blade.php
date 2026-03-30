@extends('layouts.app')

@section('content')
<h1>Gestion des rôles</h1>

@if(session('success'))
    <div style="color: green;">{{ session('success') }}</div>
@endif

<table border="1" cellpadding="10">
    <thead>
        <tr>
            <th>ID</th>
            <th>Nom</th>
            <th>Email</th>
            <th>Rôle</th>
            <th>Action</th>
        </tr>
    </thead>
    <tbody>
        @foreach($users as $user)
        <tr>
            <td>{{ $user->id }}</td>
            <td>{{ $user->name }}</td>
            <td>{{ $user->email }}</td>
            <td>{{ $user->role }}</td>
            <td>
                <form action="{{ url('/admin/users/'.$user->id.'/role') }}" method="POST">
                    @csrf
                    <select name="role">
                        <option value="lecteur" {{ $user->role == 'lecteur' ? 'selected' : '' }}>Lecteur</option>
                        <option value="admin" {{ $user->role == 'admin' ? 'selected' : '' }}>Admin</option>
                    </select>
                    <button type="submit">Modifier</button>
                </form>
            </td>
        </tr>
        @endforeach
    </tbody>
</table>
@endsection