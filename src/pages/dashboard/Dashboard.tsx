import React, { useState, useEffect, useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { getUserPosts, deletePost } from "../../services/post";
import { useErrorHandler } from "../../utils/ErrorHandler";
import { Pencil, Trash2, Plus, Loader2, Tag, FolderOpen } from "lucide-react";
import ConfirmationModal from "../../components/common/ConfirmationModal";
import DOMPurify from "dompurify";

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

  const sanitizeHTML = (html: string) => {
    return DOMPurify.sanitize(html);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {t("dashboardTitle")}
              </h1>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                {t("managePosts")}
              </p>
            </div>
            <button
              onClick={() => navigate("/dashboard/create-post")}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 ease-in-out shadow-sm"
            >
              <Plus className="w-5 h-5 mr-2" />
              <span>{t("createNewPost")}</span>
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center">
            <div className="flex-shrink-0 mr-3">
              <svg
                className="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            {error}
          </div>
        )}

        {/* Posts Grid */}
        {loading && !posts.length ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : posts.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <div
                key={post.postId}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white line-clamp-2">
                      {post.title}
                    </h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          navigate(`/dashboard/edit-post/${post.postId}`)
                        }
                        className="p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openDeleteModal(post.postId)}
                        className="p-2 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div
                    className="prose prose-sm dark:prose-invert max-w-none mb-4 line-clamp-3"
                    dangerouslySetInnerHTML={{
                      __html: sanitizeHTML(post.content),
                    }}
                  />

                  <div className="space-y-3">
                    {post.categories.length > 0 && (
                      <div className="flex items-center gap-2">
                        <FolderOpen className="w-4 h-4 text-gray-400" />
                        <div className="flex flex-wrap gap-2">
                          {post.categories.map((category) => (
                            <span
                              key={category.categoryId}
                              className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-full"
                            >
                              {category.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {post.tags.length > 0 && (
                      <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4 text-gray-400" />
                        <div className="flex flex-wrap gap-2">
                          {post.tags.map((tag) => (
                            <span
                              key={tag.tagId}
                              className="px-2 py-1 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs rounded-full"
                            >
                              {tag.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                    <time className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(post.createdAt).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </time>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <div className="text-gray-500 dark:text-gray-400">
              <svg
                className="mx-auto h-12 w-12 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
              <p className="text-xl font-medium">{t("noPosts")}</p>
              <p className="mt-2 text-sm">{t("createFirstPost")}</p>
            </div>
          </div>
        )}
      </div>

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
