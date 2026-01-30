"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, Briefcase, MapPin, Clock, Loader2, Search, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminSidebar } from "@/components/admin/sidebar";
import { useAdminAuth } from "@/hooks/useAdminAuth";

interface JobPosting {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
  requirements: string[];
  is_active: boolean;
  created_at: string;
  applications_count: number;
}

export default function AdminCareersPage() {
  const { user, isLoading, authFetch } = useAdminAuth();
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [jobsLoading, setJobsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingJob, setEditingJob] = useState<JobPosting | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    department: "",
    location: "",
    type: "Full-time",
    description: "",
    requirements: "",
    is_active: true,
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (!isLoading) {
      fetchJobs();
    }
  }, [isLoading]);

  const fetchJobs = async () => {
    try {
      setJobsLoading(true);
      const res = await authFetch("/api/admin/careers");
      if (res.ok) {
        const data = await res.json();
        setJobs(data.jobs || []);
      }
    } catch (err) {
      console.error("Failed to fetch jobs:", err);
    } finally {
      setJobsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setFormLoading(true);

    try {
      const payload = {
        ...formData,
        requirements: formData.requirements.split("\n").filter(r => r.trim()),
      };

      const url = editingJob
        ? `/api/admin/careers/${editingJob.id}`
        : "/api/admin/careers";
      const method = editingJob ? "PUT" : "POST";

      const res = await authFetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "Failed to save job posting");
      }

      await fetchJobs();
      setShowForm(false);
      setEditingJob(null);
      setFormData({
        title: "",
        department: "",
        location: "",
        type: "Full-time",
        description: "",
        requirements: "",
        is_active: true,
      });
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = (job: JobPosting) => {
    setEditingJob(job);
    setFormData({
      title: job.title,
      department: job.department,
      location: job.location,
      type: job.type,
      description: job.description,
      requirements: job.requirements.join("\n"),
      is_active: job.is_active,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this job posting?")) return;

    try {
      const res = await authFetch(`/api/admin/careers/${id}`, { method: "DELETE" });
      if (res.ok) {
        await fetchJobs();
      }
    } catch (err) {
      console.error("Failed to delete job:", err);
    }
  };

  const handleToggleActive = async (job: JobPosting) => {
    try {
      const res = await authFetch(`/api/admin/careers/${job.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...job, is_active: !job.is_active }),
      });
      if (res.ok) {
        await fetchJobs();
      }
    } catch (err) {
      console.error("Failed to toggle job:", err);
    }
  };

  const filteredJobs = jobs.filter(job =>
    job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] dark:bg-neutral-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-neutral-900 dark:border-white border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-neutral-950">
      <AdminSidebar activePage="careers" user={user} />

      <main className="lg:ml-52 pt-14 lg:pt-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-4 md:py-6">
          {/* Editorial Page Header */}
          <header className="mb-8 border-b border-neutral-200 dark:border-neutral-800 pb-6">
            <p className="text-xs uppercase tracking-widest text-neutral-500 mb-2">Administration</p>
            <h1 className="text-2xl md:text-3xl font-bold text-neutral-900 dark:text-white mb-2">Careers Management</h1>
            <p className="text-neutral-500 dark:text-neutral-400">Manage job postings on the careers page</p>
          </header>

          {/* Actions Bar */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex-1" />
            <Button size="sm" onClick={() => { setShowForm(true); setEditingJob(null); }}>
              <Plus className="w-4 h-4 mr-1" />
              Add Job
            </Button>
          </div>

          {/* Search */}
          <div className="relative mb-5">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search job postings..."
              className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 py-2 pl-10 pr-4 text-sm text-neutral-900 dark:text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-900 dark:focus:border-white"
            />
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
                className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto"
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                onClick={(e) => e.stopPropagation()}
              >
                <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
                  {editingJob ? "Edit Job Posting" : "New Job Posting"}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-sm text-neutral-500 dark:text-neutral-400">Job Title</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full bg-[#FAFAFA] dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 py-2 px-3 text-sm text-neutral-900 dark:text-white mt-1"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-neutral-500 dark:text-neutral-400">Department</label>
                      <input
                        type="text"
                        value={formData.department}
                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                        className="w-full bg-[#FAFAFA] dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 py-2 px-3 text-sm text-neutral-900 dark:text-white mt-1"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm text-neutral-500 dark:text-neutral-400">Location</label>
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        className="w-full bg-[#FAFAFA] dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 py-2 px-3 text-sm text-neutral-900 dark:text-white mt-1"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-neutral-500 dark:text-neutral-400">Type</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="w-full bg-[#FAFAFA] dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 py-2 px-3 text-sm text-neutral-900 dark:text-white mt-1"
                    >
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Contract">Contract</option>
                      <option value="Internship">Internship</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm text-neutral-500 dark:text-neutral-400">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                      className="w-full bg-[#FAFAFA] dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 py-2 px-3 text-sm text-neutral-900 dark:text-white mt-1"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm text-neutral-500 dark:text-neutral-400">Requirements (one per line)</label>
                    <textarea
                      value={formData.requirements}
                      onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                      rows={4}
                      className="w-full bg-[#FAFAFA] dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 py-2 px-3 text-sm text-neutral-900 dark:text-white mt-1"
                      placeholder="5+ years experience&#10;Strong communication skills&#10;..."
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="is_active"
                      checked={formData.is_active}
                      onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    />
                    <label htmlFor="is_active" className="text-sm text-neutral-500 dark:text-neutral-400">Active (visible on website)</label>
                  </div>
                  {formError && (
                    <p className="text-sm text-red-400">{formError}</p>
                  )}
                  <div className="flex gap-2">
                    <Button type="submit" disabled={formLoading}>
                      {formLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : editingJob ? "Update" : "Create"}
                    </Button>
                    <Button type="button" variant="secondary" onClick={() => setShowForm(false)}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}

          {/* Jobs List */}
          {jobsLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 text-neutral-500 animate-spin" />
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-8 text-center">
              <Briefcase className="w-12 h-12 text-neutral-400 dark:text-neutral-600 mx-auto mb-3" />
              <p className="text-neutral-500 dark:text-neutral-400">No job postings yet</p>
              <Button size="sm" className="mt-4" onClick={() => setShowForm(true)}>
                Create First Job
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredJobs.map((job) => (
                <motion.div
                  key={job.id}
                  className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-4"
                  whileHover={{ backgroundColor: "rgba(0, 0, 0, 0.02)" }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-neutral-900 dark:text-white">{job.title}</h3>
                        <span className={`px-2 py-0.5 text-xs ${job.is_active ? "bg-green-500/20 text-green-600 dark:text-green-400" : "bg-neutral-200 dark:bg-neutral-700 text-neutral-500 dark:text-neutral-400"}`}>
                          {job.is_active ? "Active" : "Draft"}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-neutral-500 dark:text-neutral-400">
                        <span className="flex items-center gap-1">
                          <Briefcase className="w-3.5 h-3.5" />
                          {job.department}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          {job.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {job.type}
                        </span>
                      </div>
                      <p className="text-sm text-neutral-500 mt-2 line-clamp-2">{job.description}</p>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleActive(job)}
                        title={job.is_active ? "Hide" : "Publish"}
                      >
                        {job.is_active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(job)}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(job.id)}>
                        <Trash2 className="w-4 h-4 text-red-400" />
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
