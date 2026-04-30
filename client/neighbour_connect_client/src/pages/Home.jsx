import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import PostCard from '../components/PostCard'
import './Home.css'

const API = `${import.meta.env.VITE_API_URL}/api`

function Home() {
  const { token } = useAuth()
  const [posts, setPosts] = useState({ announcements: [], lostFound: [], events: [] })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` }
        const [ann, lf, ev] = await Promise.all([
          fetch(`${API}/announcements`, { headers }).then((r) => r.json()),
          fetch(`${API}/lost-found`, { headers }).then((r) => r.json()),
          fetch(`${API}/events`, { headers }).then((r) => r.json()),
        ])
        setPosts({
          announcements: ann.slice(0, 3),
          lostFound: lf.slice(0, 3),
          events: ev.slice(0, 3),
        })
      } catch (err) {
        console.error('Failed to fetch posts:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [token])

  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-overlay">
          <h1 className="hero-title">Discover your neighbourhood</h1>
          <p className="hero-subtitle">
            Connecting local communities. Share updates, find lost items, and stay informed.
          </p>
          <div className="hero-links">
            <Link to="/announcements" className="hero-btn hero-btn--primary">Announcements</Link>
            <Link to="/lost-found" className="hero-btn hero-btn--outline">Lost &amp; Found</Link>
            <Link to="/events" className="hero-btn hero-btn--outline">Events</Link>
          </div>
        </div>
      </section>

      <div className="home-content">
        {loading ? (
          <p className="loading-text">Loading recent posts...</p>
        ) : (
          <>
            <section className="home-section">
              <div className="section-header">
                <h2>Recent Announcements</h2>
                <Link to="/announcements">View all</Link>
              </div>
              {posts.announcements.length === 0 ? (
                <p className="empty-text">No announcements yet.</p>
              ) : (
                <div className="cards-grid">
                  {posts.announcements.map((p) => <PostCard key={p.id} post={p} />)}
                </div>
              )}
            </section>

            <section className="home-section">
              <div className="section-header">
                <h2>Recent Lost &amp; Found</h2>
                <Link to="/lost-found">View all</Link>
              </div>
              {posts.lostFound.length === 0 ? (
                <p className="empty-text">No lost &amp; found posts yet.</p>
              ) : (
                <div className="cards-grid">
                  {posts.lostFound.map((p) => <PostCard key={p.id} post={p} />)}
                </div>
              )}
            </section>

            <section className="home-section">
              <div className="section-header">
                <h2>Upcoming Events</h2>
                <Link to="/events">View all</Link>
              </div>
              {posts.events.length === 0 ? (
                <p className="empty-text">No events yet.</p>
              ) : (
                <div className="cards-grid">
                  {posts.events.map((p) => <PostCard key={p.id} post={p} />)}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </div>
  )
}

export default Home
