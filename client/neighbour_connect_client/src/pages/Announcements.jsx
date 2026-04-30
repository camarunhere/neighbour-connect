import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import PostCard from '../components/PostCard'
import PostForm from '../components/PostForm'
import './PageLayout.css'

const API = `${import.meta.env.VITE_API_URL}/api/announcements`

function Announcements() {
  const { token, user } = useAuth()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)

  const authHeaders = { Authorization: `Bearer ${token}` }

  const fetchPosts = async () => {
    try {
      const res = await fetch(API, { headers: authHeaders })
      const data = await res.json()
      setPosts(data)
    } catch (err) {
      console.error('Failed to fetch announcements:', err)
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
    if (!confirm('Delete this announcement?')) return
    await fetch(`${API}/${id}`, { method: 'DELETE', headers: authHeaders })
    fetchPosts()
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Announcements</h1>
          <p>Important updates and notices for the community.</p>
        </div>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ New Announcement'}
        </button>
      </div>

      {showForm && (
        <div className="form-wrapper">
          <PostForm category="announcement" onSubmit={handleCreate} />
        </div>
      )}

      {loading ? (
        <p className="loading-text">Loading announcements...</p>
      ) : posts.length === 0 ? (
        <p className="empty-text">No announcements yet. Be the first to post!</p>
      ) : (
        <div className="cards-grid">
          {posts.map((p) => (
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

export default Announcements
