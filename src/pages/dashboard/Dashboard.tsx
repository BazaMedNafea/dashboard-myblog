import React, { useState, useEffect, useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import { getUserPosts, createPost, deletePost } from "../../services/post";
import { useErrorHandler } from "../../utils/ErrorHandler";

interface Post {
  postId: number;
  title: string;
  content: string;
  createdAt: string;
}

const Dashboard: React.FC = () => {
  const { t } = useTranslation("dashboard");
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showNewPostForm, setShowNewPostForm] = useState(false);
  const [newPost, setNewPost] = useState({ title: "", content: "" });
  const { handleError } = useErrorHandler();
  const stableHandleError = useCallback(handleError, [handleError]);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    fetchPosts();
  }, [stableHandleError]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const data = await getUserPosts();
      setPosts(data);
    } catch (err) {
      setError(stableHandleError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const post = await createPost({
        ...newPost,
        published: true,
      });
      setPosts((prev) => [post, ...prev]);
      setNewPost({ title: "", content: "" });
      setShowNewPostForm(false);
    } catch (err) {
      setError(stableHandleError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async (postId: number) => {
    try {
      await deletePost(postId);
      setPosts((prev) => prev.filter((post) => post.postId !== postId));
    } catch (err) {
      setError(stableHandleError(err));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{t("dashboardTitle")}</h1>
        <button
          onClick={() => setShowNewPostForm(!showNewPostForm)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center gap-2"
        >
          <span>+</span> {t("createNewPost")}
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-red-500 p-3 bg-red-100 rounded">
          {error}
        </div>
      )}

      {showNewPostForm && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">{t("newPost")}</h2>
          <form onSubmit={handleCreatePost} className="space-y-4">
            <div>
              <input
                type="text"
                placeholder={t("postTitle")}
                value={newPost.title}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setNewPost({ ...newPost, title: e.target.value })
                }
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                required
              />
            </div>
            <div>
              <textarea
                placeholder={t("postContent")}
                value={newPost.content}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setNewPost({ ...newPost, content: e.target.value })
                }
                rows={4}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                required
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
              >
                {loading ? t("publishing") : t("publish")}
              </button>
              <button
                type="button"
                onClick={() => setShowNewPostForm(false)}
                className="px-4 py-2 border rounded hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {t("cancel")}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid gap-4">
        {loading && !posts.length ? (
          <div className="flex justify-center p-8">Loading...</div>
        ) : posts.length > 0 ? (
          posts.map((post) => (
            <div
              key={post.postId}
              className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
            >
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-bold">{post.title}</h3>
                <button
                  onClick={() => handleDeletePost(post.postId)}
                  className="text-red-500 hover:text-red-600"
                >
                  ×
                </button>
              </div>
              <p className="my-4">{post.content}</p>
              <p className="text-sm text-gray-500">
                {new Date(post.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 p-8">{t("noPosts")}</div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
