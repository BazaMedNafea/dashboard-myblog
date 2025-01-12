import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { FaSpinner, FaTimes } from "react-icons/fa";
import RichTextEditor from "../../components/dashboard/RichTextEditor";
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

const CreatePost = () => {
  const { t } = useTranslation("dashboard");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    categoryIds: [] as number[],
    tagIds: [] as number[],
  });

  const { handleError } = useErrorHandler();
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

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
        categoryIds: selectedCategories.map((c) => c.categoryId),
        tagIds: selectedTags.map((t) => t.tagId),
        published: true,
      });
      navigate("/dashboard");
    } catch (err) {
      setError(handleError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleCategorySelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const category = categories.find(
      (c) => c.categoryId === parseInt(e.target.value)
    );
    if (
      category &&
      !selectedCategories.some((c) => c.categoryId === category.categoryId)
    ) {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const handleTagSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const tag = tags.find((t) => t.tagId === parseInt(e.target.value));
    if (tag && !selectedTags.some((t) => t.tagId === tag.tagId)) {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const removeCategory = (categoryId: number) => {
    setSelectedCategories(
      selectedCategories.filter((c) => c.categoryId !== categoryId)
    );
  };

  const removeTag = (tagId: number) => {
    setSelectedTags(selectedTags.filter((t) => t.tagId !== tagId));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-4">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
        {t("createNewPost")}
      </h1>

      {error && (
        <div className="p-3 bg-red-100 text-red-600 rounded-lg flex items-center gap-2">
          {error}
        </div>
      )}

      <form onSubmit={handleCreatePost} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t("postTitle")}
          </label>
          <input
            type="text"
            value={newPost.title}
            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            required
            placeholder={t("postTitle")}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t("postContent")}
          </label>
          <RichTextEditor
            value={newPost.content}
            onChange={(content) => setNewPost((prev) => ({ ...prev, content }))}
            placeholder={t("postContent")}
          />
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t("categories")}
            </label>
            <select
              onChange={handleCategorySelect}
              value=""
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="" disabled>
                {t("addCategory")}
              </option>
              {categories.map((category) => (
                <option key={category.categoryId} value={category.categoryId}>
                  {category.name}
                </option>
              ))}
            </select>
            <div className="flex flex-wrap gap-3 mt-3">
              {selectedCategories.map((category) => (
                <span
                  key={category.categoryId}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                >
                  <span>{category.name}</span>
                  <button
                    type="button"
                    onClick={() => removeCategory(category.categoryId)}
                    className="p-0.5 hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label={t("deletePost")}
                  >
                    <FaTimes className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t("tags")}
            </label>
            <select
              onChange={handleTagSelect}
              value=""
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="" disabled>
                {t("addTag")}
              </option>
              {tags.map((tag) => (
                <option key={tag.tagId} value={tag.tagId}>
                  {tag.name}
                </option>
              ))}
            </select>
            <div className="flex flex-wrap gap-3 mt-3">
              {selectedTags.map((tag) => (
                <span
                  key={tag.tagId}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                >
                  <span>{tag.name}</span>
                  <button
                    type="button"
                    onClick={() => removeTag(tag.tagId)}
                    className="p-0.5 hover:bg-green-200 dark:hover:bg-green-800 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500"
                    aria-label={t("deletePost")}
                  >
                    <FaTimes className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading && <FaSpinner className="animate-spin" />}
            <span>{loading ? t("publishing") : t("publish")}</span>
          </button>
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="px-6 py-3 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-300"
          >
            {t("cancel")}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;
