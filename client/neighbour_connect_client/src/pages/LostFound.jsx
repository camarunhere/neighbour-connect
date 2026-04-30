import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import PostCard from '../components/PostCard'
import PostForm from '../components/PostForm'
import './PageLayout.css'

const API = `${import.meta.env.VITE_API_URL}/api/lost-found`

function LostFound() {
  const { token, user } = useAuth()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [filter, setFilter] = useState('all')

  const authHeaders = { Authorization: `Bearer ${token}` }

  const fetchPosts = async () => {
    try {
      const res = await fetch(API, { headers: authHeaders })
      const data = await res.json()
      setPosts(data)
    } catch (err) {
      console.error('Failed to fetch lost & found posts:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchPosts() }, [token])

  const handleCreate = async (form) => {
    const res = await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeaders },
      body: JSON.stringify(form),
    })
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.error || 'Failed to create post')
    }
    setShowForm(false)
    fetchPosts()
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this post?')) return
    await fetch(`${API}/${id}`, { method: 'DELETE', headers: authHeaders })
    fetchPosts()
  }

  const filtered = filter === 'all' ? posts : posts.filter((p) => p.status === filter)

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Lost &amp; Found</h1>
          <p>Report lost items or pets, or post what you have found.</p>
        </div>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ New Post'}
        </button>
      </div>

      {showForm && (
        <div className="form-wrapper">
          <PostForm category="lost_found" onSubmit={handleCreate} />
        </div>
      )}

      <div className="filter-bar">
        {['all', 'lost', 'found', 'claimed'].map((f) => (
          <button
            key={f}
            className={`filter-btn ${filter === f ? 'active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="loading-text">Loading posts...</p>
      ) : filtered.length === 0 ? (
        <p className="empty-text">No posts found.</p>
      ) : (
        <div className="cards-grid">
          {filtered.map((p) => (
            <PostCard
              key={p.id}
              post={p}
              onDelete={user?.role === 'admin' ? handleDelete : null}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default LostFound
