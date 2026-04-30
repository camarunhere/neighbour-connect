import { useAuth } from '../context/AuthContext'
import CommentSection from './CommentSection'
import './PostCard.css'

function PostCard({ post, onDelete, onVote }) {
  const { user } = useAuth()

  const formatDate = (dateStr) => {
    if (!dateStr) return null
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: 'numeric', month: 'short', year: 'numeric',
    })
  }

  const statusColors = { lost: '#e74c3c', found: '#27ae60', claimed: '#7f8c8d' }
  const hasVoted = post.voted_by?.some((id) => String(id) === String(user?.id))

  return (
    <div className="post-card">
      {post.image_url && (
        <img
          src={
            post.image_url.startsWith('http')
              ? post.image_url
              : `${import.meta.env.VITE_API_URL}${post.image_url}`
          }
          alt={post.title}
          className="post-card-image"
        />
      )}
      <div className="post-card-body">
        <div className="post-card-header">
          <h3 className="post-card-title">{post.title}</h3>
          {post.status && (
            <span
              className="post-status-badge"
              style={{ backgroundColor: statusColors[post.status] }}
            >
              {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
            </span>
          )}
        </div>
        <p className="post-card-description">{post.description}</p>
        <div className="post-card-footer">
          <span className="post-card-author">By {post.author_name}</span>
          <div className="post-card-meta">
            {post.event_date && (
              <span className="post-card-event-date">
                Event: {formatDate(post.event_date)}
              </span>
            )}
            <span className="post-card-date">{formatDate(post.created_at)}</span>
          </div>
        </div>

        {onVote && (
          <button
            className={`vote-btn${hasVoted ? ' voted' : ''}`}
            onClick={() => onVote(post.id)}
          >
            <span className="vote-icon">👍</span>
            {post.vote_count || 0} {post.vote_count === 1 ? 'vote' : 'votes'}
          </button>
        )}

        <CommentSection
          postId={post.id}
          category={post.category}
          comments={post.comments || []}
        />

        {onDelete && (
          <button className="post-card-delete" onClick={() => onDelete(post.id)}>
            Delete
          </button>
        )}
      </div>
    </div>
  )
}

export default PostCard
