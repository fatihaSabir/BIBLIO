import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../../services/api'
import { Plus, Pencil, Trash2, Search, BookOpen, X, Upload } from 'lucide-react'
import toast from 'react-hot-toast'

// ─────────────────────────────────────────────
// MODAL AJOUTER / MODIFIER LIVRE
// ─────────────────────────────────────────────
function BookModal({ book, categories, onClose, onSaved }) {
  const isEdit = !!book?.id

  const [form, setForm] = useState({
    title:          book?.title          ?? '',
    author:         book?.author         ?? '',
    isbn:           book?.isbn           ?? '',
    description:    book?.description    ?? '',
    category_id:    book?.category_id    ?? '',
    total_copies:   book?.total_copies   ?? 1,
    published_year: book?.published_year ?? '',
    publisher:      book?.publisher      ?? '',
  })
  const [coverImage, setCoverImage] = useState(null)
  const [preview, setPreview]       = useState(null)
  const [errors, setErrors]         = useState({})

  // Mettre à jour un champ
  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  // Gérer l'image de couverture
  const handleImage = (e) => {
    const file = e.target.files[0]
    if (file) {
      setCoverImage(file)
      setPreview(URL.createObjectURL(file))
    }
  }

  // Mutation pour ajouter ou modifier
  const mutation = useMutation({
    mutationFn: (data) => {
      // Utiliser FormData pour envoyer l'image
      const formData = new FormData()
      Object.entries(data).forEach(([key, value]) => {
        if (value !== '' && value !== null && value !== undefined) {
          formData.append(key, value)
        }
      })
      if (coverImage) {
        formData.append('cover_image', coverImage)
      }

      if (isEdit) {
        // Pour modifier avec FormData on utilise POST + _method
        formData.append('_method', 'PUT')
        return api.post(`/books/${book.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
      } else {
        return api.post('/books', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
      }
    },
    onSuccess: (res) => {
      toast.success(res.data.message)
      onSaved()
    },
    onError: (error) => {
      const laravelErrors = error.response?.data?.errors
      if (laravelErrors) {
        const formatted = {}
        Object.entries(laravelErrors).forEach(([key, messages]) => {
          formatted[key] = messages[0]
        })
        setErrors(formatted)
      }
    },
  })

  const handleSubmit = () => {
    // Validation côté client
    const newErrors = {}
    if (!form.title)        newErrors.title        = 'Le titre est obligatoire.'
    if (!form.author)       newErrors.author       = 'L\'auteur est obligatoire.'
    if (!form.total_copies) newErrors.total_copies = 'Le nombre d\'exemplaires est obligatoire.'
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    mutation.mutate(form)
  }

  return (
    <div
      style={{ background: 'rgba(0,0,0,0.5)' }}
      className="fixed inset-0 flex items-center justify-center z-50 p-4"
    >
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">

        {/* En-tête */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">
            {isEdit ? 'Modifier le livre' : 'Ajouter un nouveau livre'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulaire */}
        <div className="p-5 space-y-4">

          {/* Titre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Titre <span className="text-red-500">*</span>
            </label>
            <input
              className={`input ${errors.title ? 'border-red-500' : ''}`}
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Titre du livre"
            />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
          </div>

          {/* Auteur */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Auteur <span className="text-red-500">*</span>
            </label>
            <input
              className={`input ${errors.author ? 'border-red-500' : ''}`}
              name="author"
              value={form.author}
              onChange={handleChange}
              placeholder="Nom de l'auteur"
            />
            {errors.author && <p className="text-red-500 text-xs mt-1">{errors.author}</p>}
          </div>

          {/* ISBN + Catégorie */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ISBN</label>
              <input
                className={`input ${errors.isbn ? 'border-red-500' : ''}`}
                name="isbn"
                value={form.isbn}
                onChange={handleChange}
                placeholder="978-..."
              />
              {errors.isbn && <p className="text-red-500 text-xs mt-1">{errors.isbn}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
              <select
                className="input"
                name="category_id"
                value={form.category_id}
                onChange={handleChange}
              >
                <option value="">— Sélectionner —</option>
                {categories?.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Exemplaires + Année */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Exemplaires <span className="text-red-500">*</span>
              </label>
              <input
                className={`input ${errors.total_copies ? 'border-red-500' : ''}`}
                type="number"
                name="total_copies"
                value={form.total_copies}
                onChange={handleChange}
                min="1"
                max="100"
              />
              {errors.total_copies && (
                <p className="text-red-500 text-xs mt-1">{errors.total_copies}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Année de publication
              </label>
              <input
                className="input"
                type="number"
                name="published_year"
                value={form.published_year}
                onChange={handleChange}
                placeholder="ex: 2020"
                min="1000"
                max="2025"
              />
            </div>
          </div>

          {/* Éditeur */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Éditeur</label>
            <input
              className="input"
              name="publisher"
              value={form.publisher}
              onChange={handleChange}
              placeholder="Nom de l'éditeur"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              className="input resize-none"
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              placeholder="Résumé du livre..."
            />
          </div>

          {/* Image de couverture */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Image de couverture
            </label>
            <div className="flex items-center gap-3">
              <label className="btn-secondary flex items-center gap-2 cursor-pointer text-sm">
                <Upload className="w-4 h-4" />
                Choisir une image
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/jpg"
                  onChange={handleImage}
                  className="hidden"
                />
              </label>
              {preview && (
                <img src={preview} alt="preview" className="w-12 h-16 object-cover rounded" />
              )}
              {!preview && book?.cover_image && (
                <img
                  src={`/storage/${book.cover_image}`}
                  alt="cover"
                  className="w-12 h-16 object-cover rounded"
                />
              )}
            </div>
            <p className="text-gray-400 text-xs mt-1">JPG ou PNG, max 2MB</p>
          </div>

        </div>

        {/* Boutons */}
        <div className="p-5 border-t border-gray-100 flex justify-end gap-3">
          <button className="btn-secondary" onClick={onClose}>
            Annuler
          </button>
          <button
            className="btn-primary"
            onClick={handleSubmit}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? (
              <span className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                Enregistrement...
              </span>
            ) : (
              isEdit ? 'Modifier le livre' : 'Ajouter le livre'
            )}
          </button>
        </div>

      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// PAGE PRINCIPALE — GESTION DES LIVRES
// ─────────────────────────────────────────────
export default function AdminBooks() {
  const qc = useQueryClient()

  const [search, setSearch] = useState('')
  const [page, setPage]     = useState(1)
  const [modal, setModal]   = useState(null) // null | 'add' | book object

  // Charger les catégories
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn:  () => api.get('/categories').then(r => r.data),
  })

  // Charger les livres
  const { data, isLoading } = useQuery({
    queryKey: ['admin-books', search, page],
    queryFn:  () => api.get('/books', {
      params: { search, page, per_page: 15 },
    }).then(r => r.data),
    keepPreviousData: true,
  })

  // Supprimer un livre
  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/books/${id}`),
    onSuccess:  (res) => {
      toast.success(res.data.message)
      qc.invalidateQueries(['admin-books'])
    },
  })

  const handleDelete = (book) => {
    if (window.confirm(`Supprimer le livre "${book.title}" ?`)) {
      deleteMutation.mutate(book.id)
    }
  }

  const handleSaved = () => {
    setModal(null)
    qc.invalidateQueries(['admin-books'])
    qc.invalidateQueries(['categories'])
  }

  return (
    <div>
      {/* En-tête */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des livres</h1>
          <p className="text-gray-500 text-sm mt-1">
            {data?.total ?? 0} livre(s) au total
          </p>
        </div>
        <button
          className="btn-primary flex items-center gap-2"
          onClick={() => setModal('add')}
        >
          <Plus className="w-4 h-4" />
          Ajouter un livre
        </button>
      </div>

      {/* Barre de recherche */}
      <div className="card mb-4 p-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            className="input pl-9"
            placeholder="Rechercher par titre, auteur ou ISBN..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          />
        </div>
      </div>

      {/* Tableau des livres */}
      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Livre</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Catégorie</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Exemplaires</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Statut</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr>
                  <td colSpan={5} className="py-10 text-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600 mx-auto" />
                  </td>
                </tr>
              )}
              {data?.data?.map(book => (
                <tr key={book.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-10 bg-indigo-50 rounded flex items-center justify-center flex-shrink-0">
                        {book.cover_image ? (
                          <img
                            src={`/storage/${book.cover_image}`}
                            alt={book.title}
                            className="w-full h-full object-cover rounded"
                          />
                        ) : (
                          <BookOpen className="w-4 h-4 text-indigo-400" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 max-w-[180px] truncate">
                          {book.title}
                        </p>
                        <p className="text-xs text-gray-400">{book.author}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    {book.category?.name ?? '—'}
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-medium text-gray-900">{book.available_copies}</span>
                    <span className="text-gray-400"> / {book.total_copies}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={book.is_available ? 'badge-success' : 'badge-danger'}>
                      {book.is_available ? 'Disponible' : 'Indisponible'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setModal(book)}
                        className="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded"
                        title="Modifier"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(book)}
                        className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!isLoading && !data?.data?.length && (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-gray-400">
                    Aucun livre trouvé.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {data?.last_page > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 text-sm text-gray-500">
            <span>{data.total} livre(s)</span>
            <div className="flex gap-2">
              <button
                className="btn-secondary py-1 px-3 text-xs"
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
              >
                Précédent
              </button>
              <span className="px-2 py-1">Page {page} / {data.last_page}</span>
              <button
                className="btn-secondary py-1 px-3 text-xs"
                disabled={page === data.last_page}
                onClick={() => setPage(p => p + 1)}
              >
                Suivant
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {modal && (
        <BookModal
          book={modal === 'add' ? null : modal}
          categories={categories}
          onClose={() => setModal(null)}
          onSaved={handleSaved}
        />
      )}
    </div>
  )
}
