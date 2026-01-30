"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, FileText, Calendar, Clock, Loader2, Search, Eye, EyeOff, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminSidebar } from "@/components/admin/sidebar";
import { useAdminAuth } from "@/hooks/useAdminAuth";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  featured: boolean;
  is_published: boolean;
  read_time: string;
  created_at: string;
  published_at: string | null;
  views_count: number;
}

const CATEGORIES = [
  "Parenting Tips",
  "Online Safety",
  "Research",
  "Tutorials",
  "Product Updates",
  "Company News",
];

export default function AdminBlogPage() {
  const { user, isLoading, authFetch } = useAdminAuth();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    category: "Parenting Tips",
    read_time: "5 min read",
    featured: false,
    is_published: false,
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (!isLoading) {
      fetchPosts();
    }
  }, [isLoading]);

  const fetchPosts = async () => {
    try {
      setPostsLoading(true);
      const res = await authFetch("/api/admin/blog");
      if (res.ok) {
        const data = await res.json();
        setPosts(data.posts || []);
      }
    } catch (err) {
      console.error("Failed to fetch posts:", err);
    } finally {
      setPostsLoading(false);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setFormLoading(true);

    try {
      const payload = {
        ...formData,
        slug: formData.slug || generateSlug(formData.title),
      };

      const url = editingPost
        ? `/api/admin/blog/${editingPost.id}`
        : "/api/admin/blog";
      const method = editingPost ? "PUT" : "POST";

      const res = await authFetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "Failed to save post");
      }

      await fetchPosts();
      setShowForm(false);
      setEditingPost(null);
      setFormData({
        title: "",
        slug: "",
        excerpt: "",
        content: "",
        category: "Parenting Tips",
        read_time: "5 min read",
        featured: false,
        is_published: false,
      });
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      category: post.category,
      read_time: post.read_time,
      featured: post.featured,
      is_published: post.is_published,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    try {
      const res = await authFetch(`/api/admin/blog/${id}`, { method: "DELETE" });
      if (res.ok) {
        await fetchPosts();
      }
    } catch (err) {
      console.error("Failed to delete post:", err);
    }
  };

  const handleTogglePublish = async (post: BlogPost) => {
    try {
      const res = await authFetch(`/api/admin/blog/${post.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...post, is_published: !post.is_published }),
      });
      if (res.ok) {
        await fetchPosts();
      }
    } catch (err) {
      console.error("Failed to toggle post:", err);
    }
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === "all" || post.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] dark:bg-neutral-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-neutral-900 dark:border-white border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-neutral-950">
      <AdminSidebar activePage="blog" user={user} />

      <main className="lg:ml-52 pt-14 lg:pt-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-4 md:py-6">
          {/* Editorial Page Header */}
          <header className="mb-8 pb-6 border-b border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-widest text-neutral-500 mb-2">Content Management</p>
                <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Blog Management</h1>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">Create and manage blog posts</p>
              </div>
              <Button size="sm" onClick={() => { setShowForm(true); setEditingPost(null); }}>
                <Plus className="w-4 h-4 mr-1" />
                New Post
              </Button>
            </div>
          </header>

          {/* Search & Filter */}
          <div className="flex flex-col sm:flex-row gap-3 mb-5">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search posts..."
                className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 py-2 pl-10 pr-4 text-sm text-neutral-900 dark:text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-900 dark:focus:border-white"
              />
            </div>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 py-2 px-3 text-sm text-neutral-900 dark:text-white focus:outline-none focus:border-neutral-900 dark:focus:border-white"
            >
              <option value="all">All Categories</option>
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Form Modal */}
          {showForm && (
            <motion.div
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={() => setShowForm(false)}
            >
              <motion.div
                className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                onClick={(e) => e.stopPropagation()}
              >
                <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
                  {editingPost ? "Edit Post" : "New Blog Post"}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-sm text-neutral-500 dark:text-neutral-400">Title</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({
                        ...formData,
                        title: e.target.value,
                        slug: formData.slug || generateSlug(e.target.value)
                      })}
                      className="w-full bg-[#FAFAFA] dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 py-2 px-3 text-sm text-neutral-900 dark:text-white mt-1 focus:outline-none focus:border-neutral-900 dark:focus:border-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm text-neutral-500 dark:text-neutral-400">Slug</label>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      className="w-full bg-[#FAFAFA] dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 py-2 px-3 text-sm text-neutral-900 dark:text-white mt-1 focus:outline-none focus:border-neutral-900 dark:focus:border-white"
                      placeholder="auto-generated-from-title"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-neutral-500 dark:text-neutral-400">Category</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full bg-[#FAFAFA] dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 py-2 px-3 text-sm text-neutral-900 dark:text-white mt-1 focus:outline-none focus:border-neutral-900 dark:focus:border-white"
                      >
                        {CATEGORIES.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-sm text-neutral-500 dark:text-neutral-400">Read Time</label>
                      <input
                        type="text"
                        value={formData.read_time}
                        onChange={(e) => setFormData({ ...formData, read_time: e.target.value })}
                        className="w-full bg-[#FAFAFA] dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 py-2 px-3 text-sm text-neutral-900 dark:text-white mt-1 focus:outline-none focus:border-neutral-900 dark:focus:border-white"
                        placeholder="5 min read"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-neutral-500 dark:text-neutral-400">Excerpt</label>
                    <textarea
                      value={formData.excerpt}
                      onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                      rows={2}
                      className="w-full bg-[#FAFAFA] dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 py-2 px-3 text-sm text-neutral-900 dark:text-white mt-1 focus:outline-none focus:border-neutral-900 dark:focus:border-white"
                      placeholder="Brief summary of the post..."
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm text-neutral-500 dark:text-neutral-400">Content (Markdown supported)</label>
                    <textarea
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      rows={10}
                      className="w-full bg-[#FAFAFA] dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 py-2 px-3 text-sm text-neutral-900 dark:text-white mt-1 font-mono focus:outline-none focus:border-neutral-900 dark:focus:border-white"
                      required
                    />
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="featured"
                        checked={formData.featured}
                        onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      />
                      <label htmlFor="featured" className="text-sm text-neutral-500 dark:text-neutral-400">Featured post</label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="is_published"
                        checked={formData.is_published}
                        onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                      />
                      <label htmlFor="is_published" className="text-sm text-neutral-500 dark:text-neutral-400">Publish immediately</label>
                    </div>
                  </div>
                  {formError && (
                    <p className="text-sm text-red-400">{formError}</p>
                  )}
                  <div className="flex gap-2">
                    <Button type="submit" disabled={formLoading}>
                      {formLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : editingPost ? "Update" : "Create"}
                    </Button>
                    <Button type="button" variant="secondary" onClick={() => setShowForm(false)}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mb-5">
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-4">
              <p className="text-2xl font-bold text-neutral-900 dark:text-white">{posts.length}</p>
              <p className="text-xs text-neutral-500">Total Posts</p>
            </div>
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-4">
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">{posts.filter(p => p.is_published).length}</p>
              <p className="text-xs text-neutral-500">Published</p>
            </div>
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-4">
              <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{posts.filter(p => !p.is_published).length}</p>
              <p className="text-xs text-neutral-500">Drafts</p>
            </div>
          </div>

          {/* Posts List */}
          {postsLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 text-neutral-500 animate-spin" />
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-8 text-center">
              <FileText className="w-12 h-12 text-neutral-400 dark:text-neutral-600 mx-auto mb-3" />
              <p className="text-neutral-500 dark:text-neutral-400">No blog posts yet</p>
              <Button size="sm" className="mt-4" onClick={() => setShowForm(true)}>
                Write First Post
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredPosts.map((post) => (
                <motion.div
                  key={post.id}
                  className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-4"
                  whileHover={{ borderColor: "rgba(115, 115, 115, 0.5)" }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-neutral-900 dark:text-white">{post.title}</h3>
                        {post.featured && (
                          <span className="px-2 py-0.5 text-xs bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400">Featured</span>
                        )}
                        <span className={`px-2 py-0.5 text-xs ${post.is_published ? "bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400" : "bg-neutral-100 dark:bg-neutral-500/20 text-neutral-600 dark:text-neutral-400"}`}>
                          {post.is_published ? "Published" : "Draft"}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-neutral-500 dark:text-neutral-400 mb-2">
                        <span className="flex items-center gap-1">
                          <Tag className="w-3.5 h-3.5" />
                          {post.category}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {post.read_time}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(post.created_at).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5" />
                          {post.views_count} views
                        </span>
                      </div>
                      <p className="text-sm text-neutral-500 line-clamp-2">{post.excerpt}</p>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleTogglePublish(post)}
                        title={post.is_published ? "Unpublish" : "Publish"}
                      >
                        {post.is_published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(post)}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(post.id)}>
                        <Trash2 className="w-4 h-4 text-red-500 dark:text-red-400" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
