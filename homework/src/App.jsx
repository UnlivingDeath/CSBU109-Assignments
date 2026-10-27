import { useState, useEffect } from 'react';
import { getPosts, searchPosts, getPostComments, addPost, deletePost } from './services/postApi';
import { useDebounce } from './hooks/useDebounce';

export default function App() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 400);

  const [newTitle, setNewTitle] = useState('');
  const [newBody, setNewBody] = useState('');

  const [selectedPost, setSelectedPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    if (debouncedSearch) {
      searchPosts(debouncedSearch, controller.signal)
        .then(data => {
          setPosts(data.posts);
          setTotal(data.total);
          setPage(1);
          setLoading(false);
        })
        .catch(err => {
          if (err.name !== 'AbortError') {
            setError(err.message);
            setLoading(false);
          }
        });
    } else {
      const skip = (page - 1) * 10;
      getPosts(10, skip, controller.signal)
        .then(data => {
          setPosts(data.posts);
          setTotal(data.total);
          setLoading(false);
        })
        .catch(err => {
          if (err.name !== 'AbortError') {
            setError(err.message);
            setLoading(false);
          }
        });
    }

    return () => controller.abort();
  }, [page, debouncedSearch]);

  const handleAddPost = async (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newBody.trim()) return;

    try {
      const createdPost = await addPost({
        title: newTitle,
        body: newBody,
        userId: 1,
      });
      setPosts([createdPost, ...posts]);
      setNewTitle('');
      setNewBody('');
    } catch (err) {
      alert(`Failed to add post: ${err.message}`);
    }
  };

  const handleDeletePost = async (id) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      await deletePost(id);
      setPosts(posts.filter(post => post.id !== id));
    } catch (err) {
      alert(`Failed to delete post: ${err.message}`);
    }
  };

  const handleViewPost = async (post) => {
    setSelectedPost(post);
    setCommentsLoading(true);
    try {
      const data = await getPostComments(post.id);
      setComments(data.comments);
    } catch (err) {
      setComments([]);
    } finally {
      setCommentsLoading(false);
    }
  };

  return (
    <div className="app-container">
      <h1 className="main-title">Mini Blog Manager</h1>

      <form className="add-post-form" onSubmit={handleAddPost}>
        <h3>New post</h3>
        <input
          type="text"
          placeholder="Title"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Body"
          value={newBody}
          onChange={(e) => setNewBody(e.target.value)}
          rows="3"
          required
        ></textarea>
        <button type="submit" className="btn-primary">Add post</button>
      </form>

      <input
        type="text"
        className="search-input"
        placeholder="Search posts..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {loading && <p>Loading posts...</p>}
      {error && <p className="error-text">Error: {error}</p>}

      <div className="post-list">
        {!loading && !error && posts.map(post => (
          <div key={post.id} className="post-card">
            <h4>{post.title}</h4>
            <div className="tags">
              {post.tags && post.tags.map(tag => (
                <span key={tag} className="tag">#{tag}</span>
              ))}
            </div>
            <div className="reactions">
              👍 {post.reactions?.likes || 0} &nbsp;&nbsp; 👎 {post.reactions?.dislikes || 0}
            </div>
            <div className="actions">
              <button className="btn-secondary" onClick={() => handleViewPost(post)}>View</button>
              <button className="btn-danger" onClick={() => handleDeletePost(post.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      {!debouncedSearch && !loading && total > 10 && (
        <div className="pagination">
          <button onClick={() => setPage(p => p - 1)} disabled={page === 1} className="btn-secondary">
            Previous
          </button>
          <span>Page {page}</span>
          <button onClick={() => setPage(p => p + 1)} disabled={page * 10 >= total} className="btn-secondary">
            Next
          </button>
        </div>
      )}

      {selectedPost && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>{selectedPost.title}</h2>
            <p className="post-body">{selectedPost.body}</p>
            
            <div className="comments-section">
              <h3>Comments</h3>
              {commentsLoading ? (
                <p>Loading comments...</p>
              ) : comments.length > 0 ? (
                comments.map(comment => (
                  <div key={comment.id} className="comment">
                    <strong>{comment.user.username}</strong>: {comment.body}
                  </div>
                ))
              ) : (
                <p>No comments yet.</p>
              )}
            </div>

            <button className="btn-secondary close-modal" onClick={() => setSelectedPost(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}