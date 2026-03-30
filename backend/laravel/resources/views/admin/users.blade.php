
    @extends('layouts.app')

@section('content')
<h1>Liste des utilisateurs</h1>

<table border="1" cellpadding="5">
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
                <form method="POST" action="/admin/users/{{ $user->id }}/role">
                    @csrf
                    <select name="role">
                        <option value="admin" @if($user->role=='admin') selected @endif>Admin</option>
                        <option value="lecteur" @if($user->role=='lecteur') selected @endif>Lecteur</option>
                    </select>
                    <button type="submit">Modifier</button>
                </form>
            </td>
        </tr>
        @endforeach
    </tbody>
</table>
@endsection