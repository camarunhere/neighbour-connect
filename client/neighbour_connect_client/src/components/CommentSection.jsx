import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import './CommentSection.css'

const BASE = import.meta.env.VITE_API_URL
const apiBaseMap = {
  announcement: `${BASE}/api/announcements`,
  event: `${BASE}/api/events`,
  lost_found: `${BASE}/api/lost-found`,
}

function CommentSection({ postId, category, comments: initialComments }) {
  const { token, user } = useAuth()
  const [comments, setComments] = useState(initialComments || [])
  const [text, setText] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [open, setOpen] = useState(false)

  const apiBase = apiBaseMap[category]

  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: 'numeric', month: 'short', year: 'numeric',
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!text.trim()) return
    setSubmitting(true)
    try {
      const res = await fetch(`${apiBase}/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text: text.trim(), author_name: user?.username || 'Anonymous' }),
      })
      if (res.ok) {
        const comment = await res.json()
        setComments((prev) => [...prev, comment])
        setText('')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="comment-section">
      <button className="comment-toggle" onClick={() => setOpen(!open)}>
        💬 {comments.length} {comments.length === 1 ? 'comment' : 'comments'}
        <span className="comment-chevron">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="comment-body">
          {comments.length === 0 ? (
            <p className="no-comments">No comments yet. Be the first!</p>
          ) : (
            <ul className="comment-list">
              {comments.map((c, i) => (
                <li key={c._id || i} className="comment-item">
                  <div className="comment-meta">
                    <span className="comment-author">{c.author_name}</span>
                    <span className="comment-date">{formatDate(c.created_at)}</span>
                  </div>
                  <p className="comment-text">{c.text}</p>
                </li>
              ))}
            </ul>
          )}

          <form className="comment-form" onSubmit={handleSubmit}>
            <textarea
              className="comment-input"
              placeholder="Write a comment..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={2}
            />
            <button
              type="submit"
              className="comment-submit"
              disabled={submitting || !text.trim()}
            >
              {submitting ? 'Posting…' : 'Post'}
            </button>
          </form>
        </div>
      )}
    </div>
  )
}

export default CommentSection
