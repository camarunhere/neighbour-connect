import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import PostCard from '../components/PostCard'
import PostForm from '../components/PostForm'
import './PageLayout.css'

const API = `${import.meta.env.VITE_API_URL}/api/events`

function Events() {
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
      console.error('Failed to fetch events:', err)
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
      throw new Error(err.error || 'Failed to create event')
    }
    setShowForm(false)
    fetchPosts()
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this event?')) return
    await fetch(`${API}/${id}`, { method: 'DELETE', headers: authHeaders })
    fetchPosts()
  }

  const handleVote = async (id) => {
    await fetch(`${API}/${id}/vote`, { method: 'POST', headers: authHeaders })
    fetchPosts()
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Events</h1>
          <p>Upcoming community events, meetings, and celebrations.</p>
        </div>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ New Event'}
        </button>
      </div>

      {showForm && (
        <div className="form-wrapper">
          <PostForm category="event" onSubmit={handleCreate} />
        </div>
      )}

      {loading ? (
        <p className="loading-text">Loading events...</p>
      ) : posts.length === 0 ? (
        <p className="empty-text">No events yet. Share one with your community!</p>
      ) : (
        <div className="cards-grid">
          {posts.map((p) => (
            <PostCard
              key={p.id}
              post={p}
              onDelete={user?.role === 'admin' ? handleDelete : null}
              onVote={handleVote}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default Events
