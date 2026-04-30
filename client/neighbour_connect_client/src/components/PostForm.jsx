import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import './PostForm.css'

const UPLOAD_API = `${import.meta.env.VITE_API_URL}/api/upload`

function PostForm({ category, onSubmit }) {
  const { token } = useAuth()
  const [form, setForm] = useState({
    title: '',
    description: '',
    author_name: '',
    status: 'lost',
    event_date: '',
  })
  const [imageFile, setImageFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      let image_url = null
      if (imageFile) {
        const data = new FormData()
        data.append('image', imageFile)
        const res = await fetch(UPLOAD_API, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: data,
        })
        if (!res.ok) throw new Error('Image upload failed')
        const json = await res.json()
        image_url = json.url
      }
      await onSubmit({ ...form, image_url })
      setForm({ title: '', description: '', author_name: '', status: 'lost', event_date: '' })
      setImageFile(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="post-form" onSubmit={handleSubmit}>
      <h3 className="post-form-title">
        {category === 'announcement' && 'New Announcement'}
        {category === 'lost_found' && 'New Lost & Found Post'}
        {category === 'event' && 'New Event'}
      </h3>

      {error && <p className="post-form-error">{error}</p>}

      <div className="post-form-field">
        <label>Title *</label>
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Enter title"
          required
        />
      </div>

      <div className="post-form-field">
        <label>Description *</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Enter description"
          rows={3}
          required
        />
      </div>

      <div className="post-form-field">
        <label>Your Name</label>
        <input
          type="text"
          name="author_name"
          value={form.author_name}
          onChange={handleChange}
          placeholder="Anonymous"
        />
      </div>

      {category === 'lost_found' && (
        <div className="post-form-field">
          <label>Status</label>
          <select name="status" value={form.status} onChange={handleChange}>
            <option value="lost">Lost</option>
            <option value="found">Found</option>
            <option value="claimed">Claimed</option>
          </select>
        </div>
      )}

      {category === 'event' && (
        <div className="post-form-field">
          <label>Event Date</label>
          <input
            type="date"
            name="event_date"
            value={form.event_date}
            onChange={handleChange}
          />
        </div>
      )}

      <div className="post-form-field">
        <label>Image (optional)</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files[0] || null)}
        />
      </div>

      <button type="submit" className="post-form-submit" disabled={loading}>
        {loading ? 'Posting...' : 'Post'}
      </button>
    </form>
  )
}

export default PostForm
