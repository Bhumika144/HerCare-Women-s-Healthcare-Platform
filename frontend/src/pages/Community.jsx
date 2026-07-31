import { useEffect, useState } from "react";
import "../styles/community.css";

export default function Community() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");
  const [activePost, setActivePost] = useState(null);
  const [comments, setComments] = useState({});
  const [newComment, setNewComment] = useState("");
  const [tab, setTab] = useState("all");

  const API = "http://localhost:5000";

  const loadPosts = async () => {
    try {
      const res = await fetch(
        `${API}/community/posts?email=${user?.email}`
      );
      const data = await res.json();

      // ✅ ensure it's always array
      setPosts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setPosts([]);
    }
  };

  useEffect(() => {
    if (user?.email) {
      loadPosts();
    }
  }, []);

  const createPost = async () => {
    if (!newPost.trim()) return;

    await fetch(`${API}/community/post`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: user?.email,
        content: newPost
      })
    });

    setNewPost("");
    loadPosts();
  };

  const toggleLike = async (postId) => {
    await fetch(`${API}/community/like`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        post_id: postId,
        email: user?.email
      })
    });
    loadPosts();
  };

  const toggleSave = async (postId) => {
    await fetch(`${API}/community/save`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        post_id: postId,
        email: user?.email
      })
    });
    loadPosts();
  };

  const loadComments = async (postId) => {
    if (activePost === postId) {
      setActivePost(null);
      return;
    }

    const res = await fetch(`${API}/community/comments/${postId}`);
    const data = await res.json();

    setComments({
      ...comments,
      [postId]: Array.isArray(data) ? data : []
    });

    setActivePost(postId);
  };

  const addComment = async (postId) => {
    if (!newComment.trim()) return;

    await fetch(`${API}/community/comment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        post_id: postId,
        email: user?.email,
        comment: newComment
      })
    });

    setNewComment("");
    loadComments(postId);
  };

  const deletePost = async (postId) => {
    await fetch(`${API}/community/post/${postId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: user?.email })
    });
    loadPosts();
  };

  const visiblePosts =
    tab === "saved"
      ? posts.filter((p) => p?.saved_by_me)
      : posts;

  // ✅ prevent crash if user not loaded
  if (!user) return <div>Loading...</div>;

  return (
    <div className="community-container">
      <h2 className="community-title">Community</h2>

      {/* Tabs */}
      <div className="community-tabs">
        <button
          className={tab === "all" ? "active" : ""}
          onClick={() => setTab("all")}
        >
          All Posts
        </button>
        <button
          className={tab === "saved" ? "active" : ""}
          onClick={() => setTab("saved")}
        >
          Saved
        </button>
      </div>

      {/* Create Post */}
      <div className="create-post">
        <div className="avatar">
          {user?.name?.[0] || "U"}
        </div>

        <input
          placeholder="What's on your mind?"
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
        />

        <button onClick={createPost}>+</button>
      </div>

      {/* Posts */}
      {Array.isArray(visiblePosts) &&
        visiblePosts.map((post) => (
          <div className="post-card" key={post?.id}>
            <div className="post-header">
              <div className="avatar">
                {post?.user?.[0] || "U"}
              </div>

              <div className="post-user">
                <h4>{post?.user}</h4>
                <span>
                  {post?.created_at
                    ? new Date(post.created_at).toLocaleString()
                    : ""}
                </span>
              </div>

              {post?.email === user?.email && (
                <button
                  className="delete-btn"
                  onClick={() => deletePost(post.id)}
                >
                  ⋮ Delete
                </button>
              )}
            </div>

            <p className="post-content">{post?.content}</p>

            <div className="post-actions">
              <button
                className={post?.liked_by_me ? "active" : ""}
                onClick={() => toggleLike(post.id)}
              >
                ❤️ {post?.likes || 0}
              </button>

              <button onClick={() => loadComments(post.id)}>
                💬
              </button>

              <button
                className={post?.saved_by_me ? "active" : ""}
                onClick={() => toggleSave(post.id)}
              >
                🔖
              </button>
            </div>

            {activePost === post.id && (
              <div className="comments-section">
                {comments[post.id]?.map((c, i) => (
                  <div key={i} className="comment">
                    <strong>{c?.user}</strong>
                    <span>{c?.comment}</span>
                  </div>
                ))}

                <div className="add-comment">
                  <input
                    placeholder="Write a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                  />
                  <button onClick={() => addComment(post.id)}>
                    ➤
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
    </div>
  );
}