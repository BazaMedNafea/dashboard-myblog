import React, { useState, useEffect, useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { getUserPosts, deletePost } from "../../services/post";
import { useErrorHandler } from "../../utils/ErrorHandler";
import { FaTrash, FaSpinner } from "react-icons/fa";
import ConfirmationModal from "../../components/common/ConfirmationModal";

interface Post {
  postId: number;
  title: string;
  content: string;
  createdAt: string;
  categories: { categoryId: number; name: string }[];
  tags: { tagId: number; name: string }[];
}

const Dashboard: React.FC = () => {
  const { t } = useTranslation("dashboard");
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<number | null>(null);
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

  const handleDeletePost = async (postId: number) => {
    try {
      await deletePost(postId);
      setPosts((prev) => prev.filter((post) => post.postId !== postId));
    } catch (err) {
      setError(stableHandleError(err));
    } finally {
      setIsDeleteModalOpen(false);
    }
  };

  const openDeleteModal = (postId: number) => {
    setPostToDelete(postId);
    setIsDeleteModalOpen(true);
  };

  return (
    <div className="space-y-6 p-4">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          {t("dashboardTitle")}
        </h1>
        <button
          onClick={() => navigate("/dashboard/create-post")}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 flex items-center gap-2"
        >
          <span>{t("createNewPost")}</span>
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-red-100 text-red-600 rounded-lg flex items-center gap-2">
          {error}
        </div>
      )}

      {/* Posts Section */}
      <div className="grid gap-4">
        {loading && !posts.length ? (
          <div className="flex justify-center p-8">
            <FaSpinner className="animate-spin text-gray-500" />
          </div>
        ) : posts.length > 0 ? (
          posts.map((post) => (
            <div
              key={post.postId}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
            >
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                  {post.title}
                </h3>
                <button
                  onClick={() => openDeleteModal(post.postId)}
                  className="text-red-500 hover:text-red-600 transition duration-300"
                >
                  <FaTrash />
                </button>
              </div>
              <p className="my-4 text-gray-700 dark:text-gray-300">
                {post.content}
              </p>
              <div className="flex gap-2 mb-4">
                {post.categories.map((category) => (
                  <span
                    key={category.categoryId}
                    className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {category.name}
                  </span>
                ))}
                {post.tags.map((tag) => (
                  <span
                    key={tag.tagId}
                    className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {new Date(post.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 p-8">{t("noPosts")}</div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => postToDelete && handleDeletePost(postToDelete)}
        title={t("deletePost")}
        message={t("deleteConfirmationMessage")}
      />
    </div>
  );
};

export default Dashboard;
