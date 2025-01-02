import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { FaSpinner } from "react-icons/fa";
import { createPost } from "../../services/post";
import { getCategories } from "../../services/category";
import { getTags } from "../../services/tag";
import { useErrorHandler } from "../../utils/ErrorHandler";

interface Category {
  categoryId: number;
  name: string;
}

interface Tag {
  tagId: number;
  name: string;
}

const CreatePost: React.FC = () => {
  const { t } = useTranslation("dashboard");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    categoryIds: [] as number[],
    tagIds: [] as number[],
  });
  const { handleError } = useErrorHandler();
  const hasFetched = useRef(false); // Track whether the data has been fetched

  // Fetch categories and tags on component mount
  useEffect(() => {
    if (hasFetched.current) return; // Skip if already fetched
    hasFetched.current = true; // Mark as fetched

    const fetchData = async () => {
      try {
        const [categoriesData, tagsData] = await Promise.all([
          getCategories(),
          getTags(),
        ]);
        setCategories(categoriesData);
        setTags(tagsData);
      } catch (err) {
        setError(handleError(err));
      }
    };
    fetchData();
  }, [handleError]);

  const handleCreatePost = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createPost({
        ...newPost,
        published: true,
      });
      navigate("/dashboard"); // Redirect to the dashboard after successful creation
    } catch (err) {
      setError(handleError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-4">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
        {t("createNewPost")}
      </h1>

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-red-100 text-red-600 rounded-lg flex items-center gap-2">
          {error}
        </div>
      )}

      {/* Post Creation Form */}
      <form onSubmit={handleCreatePost} className="space-y-4">
        <div>
          <input
            type="text"
            placeholder={t("postTitle")}
            value={newPost.title}
            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
            className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            required
          />
        </div>
        <div>
          <textarea
            placeholder={t("postContent")}
            value={newPost.content}
            onChange={(e) =>
              setNewPost({ ...newPost, content: e.target.value })
            }
            rows={4}
            className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 dark:text-gray-300 mb-2">
            {t("categories")}
          </label>
          <select
            multiple
            value={newPost.categoryIds.map(String)}
            onChange={(e) =>
              setNewPost({
                ...newPost,
                categoryIds: Array.from(e.target.selectedOptions, (option) =>
                  parseInt(option.value)
                ),
              })
            }
            className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            {categories.map((category) => (
              <option key={category.categoryId} value={category.categoryId}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-gray-700 dark:text-gray-300 mb-2">
            {t("tags")}
          </label>
          <select
            multiple
            value={newPost.tagIds.map(String)}
            onChange={(e) =>
              setNewPost({
                ...newPost,
                tagIds: Array.from(e.target.selectedOptions, (option) =>
                  parseInt(option.value)
                ),
              })
            }
            className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            {tags.map((tag) => (
              <option key={tag.tagId} value={tag.tagId}>
                {tag.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? <FaSpinner className="animate-spin" /> : null}
            <span>{loading ? t("publishing") : t("publish")}</span>
          </button>
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="px-4 py-2 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-300"
          >
            {t("cancel")}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;
