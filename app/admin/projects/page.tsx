'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  FolderKanban,
  Plus,
  Search,
  Edit,
  Eye,
  Trash2,
  Upload,
  X,
  MapPin,
  Zap,
  Calendar,
  UserCheck,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Star,
  Archive,
  RefreshCw,
  ArrowUpRight,
} from 'lucide-react';
import { Project } from '@/lib/data';

const CATEGORY_OPTIONS = [
  'Institutional Solar',
  'Commercial Solar',
  'Commercial & Logistics',
  'Industrial Solar',
  'Solar Infrastructure',
  'Residential Solar',
  'Electrical Infrastructure',
];

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft' | 'archived' | 'featured'>('all');

  // Modal States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  // Form Fields State
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    client: '',
    location: '',
    capacity: '',
    category: 'Commercial Solar',
    completionYear: new Date().getFullYear(),
    summary: '',
    fullStory: '',
    mainImage: '',
    gallery: [] as string[],
    isFeatured: false,
    status: 'published' as 'published' | 'draft' | 'archived',
  });

  // Local Image Previews
  const [mainImagePreview, setMainImagePreview] = useState<string>('');
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
  const [uploadingMain, setUploadingMain] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  // Preview Modal
  const [previewProject, setPreviewProject] = useState<Project | null>(null);

  // Danger Zone Delete Modal
  const [deleteConfirmProject, setDeleteConfirmProject] = useState<Project | null>(null);
  const [deleteTitleInput, setDeleteTitleInput] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/projects');
      if (res.ok) {
        const data = await res.json();
        setProjects(data.projects || []);
      }
    } catch {
      // Ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Helper for Slug Auto-Generation
  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData((prev) => ({
      ...prev,
      title,
      // Auto update slug if creating new project or editing slug manually
      slug: editingProject ? prev.slug : generateSlug(title),
    }));
  };

  const openCreateModal = () => {
    setEditingProject(null);
    setFormData({
      title: '',
      slug: '',
      client: '',
      location: '',
      capacity: '',
      category: 'Commercial Solar',
      completionYear: new Date().getFullYear(),
      summary: '',
      fullStory: '',
      mainImage: '',
      gallery: [],
      isFeatured: false,
      status: 'published',
    });
    setMainImagePreview('');
    setGalleryPreviews([]);
    setFormError('');
    setIsFormOpen(true);
  };

  const openEditModal = (project: Project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      slug: project.slug,
      client: project.client,
      location: project.location,
      capacity: project.capacity,
      category: project.category,
      completionYear: project.completionYear,
      summary: project.summary,
      fullStory: project.fullStory,
      mainImage: project.mainImage,
      gallery: project.gallery || [],
      isFeatured: project.isFeatured,
      status: project.status || 'published',
    });
    setMainImagePreview(project.mainImage);
    setGalleryPreviews(project.gallery || []);
    setFormError('');
    setIsFormOpen(true);
  };

  // Main Image Upload Handler
  const handleMainImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Instant local preview
    const localUrl = URL.createObjectURL(file);
    setMainImagePreview(localUrl);
    setUploadingMain(true);

    const body = new FormData();
    body.append('file', file);

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body,
      });

      const data = await res.json();
      if (res.ok && data.url) {
        setFormData((prev) => ({ ...prev, mainImage: data.url }));
        setMainImagePreview(data.url);
      } else {
        setFormError(data.error || 'Failed to upload main image');
      }
    } catch {
      setFormError('Failed to upload image due to network error');
    } finally {
      setUploadingMain(false);
    }
  };

  // Gallery Upload Handler
  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingGallery(true);
    const newGalleryUrls = [...formData.gallery];
    const newPreviews = [...galleryPreviews];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const localUrl = URL.createObjectURL(file);
      newPreviews.push(localUrl);

      const body = new FormData();
      body.append('file', file);

      try {
        const res = await fetch('/api/admin/upload', {
          method: 'POST',
          body,
        });
        const data = await res.json();
        if (res.ok && data.url) {
          newGalleryUrls.push(data.url);
        }
      } catch {
        // Skip failed
      }
    }

    setFormData((prev) => ({ ...prev, gallery: newGalleryUrls }));
    setGalleryPreviews(newGalleryUrls);
    setUploadingGallery(false);
  };

  const removeGalleryImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      gallery: prev.gallery.filter((_, i) => i !== index),
    }));
    setGalleryPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // Save Project Handler
  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!formData.mainImage && !mainImagePreview) {
      setFormError('Please select or enter a main image for the project');
      return;
    }

    setSaving(true);

    const payload = {
      ...formData,
      mainImage: formData.mainImage || mainImagePreview,
      completionYear: Number(formData.completionYear),
    };

    try {
      const endpoint = editingProject ? `/api/admin/projects/${editingProject.id}` : '/api/admin/projects';
      const method = editingProject ? 'PUT' : 'POST';

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setFormError(data.error || 'Failed to save project');
        setSaving(false);
        return;
      }

      setIsFormOpen(false);
      fetchProjects();
    } catch {
      setFormError('Network error while saving project');
    } finally {
      setSaving(false);
    }
  };

  // Delete Project Handler
  const handleDeleteProject = async () => {
    if (!deleteConfirmProject) return;
    setDeleting(true);
    setDeleteError('');

    try {
      const res = await fetch(`/api/admin/projects/${deleteConfirmProject.id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ confirmTitle: deleteTitleInput }),
      });

      const data = await res.json();

      if (!res.ok) {
        setDeleteError(data.error || 'Failed to delete project');
        setDeleting(false);
        return;
      }

      setDeleteConfirmProject(null);
      setDeleteTitleInput('');
      fetchProjects();
    } catch {
      setDeleteError('Network error while deleting project');
    } finally {
      setDeleting(false);
    }
  };

  // Filtered Projects
  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (statusFilter === 'published') return p.status === 'published';
    if (statusFilter === 'draft') return p.status === 'draft';
    if (statusFilter === 'archived') return p.status === 'archived';
    if (statusFilter === 'featured') return p.isFeatured;

    return true;
  });

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-solix-green uppercase tracking-wider">
            <FolderKanban className="w-4 h-4" />
            <span>Project Portfolio Management</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            Projects CMS
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage clean energy project case studies, metadata, images, and homepage features.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-2 bg-solix-green hover:bg-emerald-600 text-white text-xs font-bold px-5 py-3 rounded-xl transition-all shadow-lg shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Create New Project</span>
        </button>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Search by title, client, location, or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-solix-green"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {(['all', 'published', 'draft', 'archived', 'featured'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setStatusFilter(tab)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold capitalize transition-colors whitespace-nowrap ${
                statusFilter === tab
                  ? 'bg-slate-800 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              {tab === 'all' ? 'All Projects' : tab}
            </button>
          ))}

          <button
            type="button"
            onClick={fetchProjects}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ml-1"
            title="Refresh List"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Projects Grid / Table */}
      {loading ? (
        <div className="bg-slate-950 border border-slate-800 rounded-3xl p-12 text-center text-slate-400 text-xs">
          Loading project portfolio...
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="bg-slate-950 border border-slate-800 rounded-3xl p-12 text-center space-y-3">
          <FolderKanban className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-white">No projects found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {searchQuery
              ? 'No projects match your current search query or filter criteria.'
              : 'Click "Create New Project" above to publish your first case study.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden flex flex-col justify-between hover:border-slate-700 transition-all group"
            >
              <div className="space-y-4">
                {/* Image Preview & Badges */}
                <div className="relative w-full aspect-[16/10] bg-slate-900 overflow-hidden">
                  <Image
                    src={project.mainImage}
                    alt={project.title}
                    fill
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="bg-slate-900/90 backdrop-blur-md text-emerald-400 border border-emerald-500/30 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                      {project.category}
                    </span>
                  </div>

                  <div className="absolute top-3 right-3 flex items-center gap-1.5">
                    {project.isFeatured && (
                      <span className="bg-amber-500 text-slate-950 text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                        <Star className="w-3 h-3 fill-current" />
                        <span>Featured</span>
                      </span>
                    )}
                    <span
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full capitalize ${
                        project.status === 'published'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : project.status === 'draft'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      }`}
                    >
                      {project.status || 'published'}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="px-6 space-y-3">
                  <div className="flex items-center justify-between text-[11px] font-medium text-slate-400 border-b border-slate-800 pb-2.5">
                    <div className="flex items-center gap-1 truncate max-w-[50%]">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="truncate">{project.location}</span>
                    </div>
                    <div className="flex items-center gap-1 truncate max-w-[45%]">
                      <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span className="truncate">{project.capacity}</span>
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-white leading-snug line-clamp-1">
                    {project.title}
                  </h3>

                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {project.summary}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-6 pt-4 border-t border-slate-900 flex items-center justify-between gap-2 mt-4">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => openEditModal(project)}
                    className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-3 py-2 rounded-xl transition-colors border border-slate-800"
                  >
                    <Edit className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Edit</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPreviewProject(project)}
                    className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold px-3 py-2 rounded-xl transition-colors border border-slate-800"
                    title="Live Preview"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Preview</span>
                  </button>
                </div>

                <Link
                  href={`/projects/${project.slug}`}
                  target="_blank"
                  className="p-2 text-slate-400 hover:text-emerald-400 transition-colors"
                  title="View Public Page"
                >
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE / EDIT PROJECT MODAL */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-8">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950">
              <div>
                <h2 className="text-lg font-bold text-white">
                  {editingProject ? `Edit Project: ${editingProject.title}` : 'Create New Project Case Study'}
                </h2>
                <p className="text-xs text-slate-400">
                  Manage core metadata, content scope, main image, and gallery.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-900 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProject} className="p-6 sm:p-8 space-y-6 max-h-[80vh] overflow-y-auto">
              {formError && (
                <div className="bg-rose-500/10 border border-rose-500/30 rounded-2xl p-4 text-rose-300 text-xs flex items-start gap-3">
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span>{formError}</span>
                </div>
              )}

              {/* CORE INFORMATION GRID */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 border-b border-slate-800 pb-2">
                  1. Core Information
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Title */}
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs font-semibold text-slate-300">
                      Project Title <span className="text-emerald-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. MNS University of Agriculture Multan"
                      value={formData.title}
                      onChange={handleTitleChange}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-solix-green"
                    />
                  </div>

                  {/* Slug */}
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs font-semibold text-slate-300">
                      URL Slug <span className="text-emerald-400">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-2.5 text-xs text-slate-500 font-mono">/projects/</span>
                      <input
                        type="text"
                        required
                        placeholder="mns-university-of-agriculture-multan"
                        value={formData.slug}
                        onChange={(e) => setFormData({ ...formData, slug: generateSlug(e.target.value) })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-24 pr-4 py-2.5 text-xs text-emerald-400 font-mono focus:outline-none focus:border-solix-green"
                      />
                    </div>
                  </div>

                  {/* Client */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">
                      Client / Organization <span className="text-emerald-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. MNS University Administration"
                      value={formData.client}
                      onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-solix-green"
                    />
                  </div>

                  {/* Location */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">
                      Location <span className="text-emerald-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Multan, Punjab, Pakistan"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-solix-green"
                    />
                  </div>

                  {/* Capacity */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">
                      Capacity / Rating <span className="text-emerald-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 25KW or High-Capacity On-Grid Array"
                      value={formData.capacity}
                      onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-solix-green"
                    />
                  </div>

                  {/* Category */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">
                      Category <span className="text-emerald-400">*</span>
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-solix-green"
                    >
                      {CATEGORY_OPTIONS.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Completion Year */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">
                      Completion / Commission Year <span className="text-emerald-400">*</span>
                    </label>
                    <input
                      type="number"
                      required
                      min={1990}
                      max={2035}
                      value={formData.completionYear}
                      onChange={(e) => setFormData({ ...formData, completionYear: parseInt(e.target.value) || 2024 })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-solix-green"
                    />
                  </div>

                  {/* Visibility Status */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Visibility Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({ ...formData, status: e.target.value as 'published' | 'draft' | 'archived' })
                      }
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-solix-green"
                    >
                      <option value="published">Published (Visible Publicly)</option>
                      <option value="draft">Draft (Admin Only)</option>
                      <option value="archived">Archived (Internal Retained)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* PROJECT CONTENT */}
              <div className="space-y-4 pt-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 border-b border-slate-800 pb-2">
                  2. Project Narrative & Content
                </h3>

                {/* Summary */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <label className="font-semibold text-slate-300">
                      Short Summary <span className="text-emerald-400">*</span> (Card Grid & Meta)
                    </label>
                    <span
                      className={`font-mono ${
                        formData.summary.length > 300 ? 'text-amber-400' : 'text-slate-500'
                      }`}
                    >
                      {formData.summary.length}/300 chars
                    </span>
                  </div>
                  <textarea
                    required
                    rows={3}
                    maxLength={400}
                    placeholder="Turnkey solar energy installation powering campus academic blocks..."
                    value={formData.summary}
                    onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-solix-green leading-relaxed"
                  />
                </div>

                {/* Full Story */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    Full Story / Engineering Scope <span className="text-emerald-400">*</span>
                  </label>
                  <textarea
                    required
                    rows={6}
                    placeholder="E&E Industries engineered and commissioned a comprehensive solar power array at MNS University... Describe technical requirements, engineering challenges, execution, and outcomes."
                    value={formData.fullStory}
                    onChange={(e) => setFormData({ ...formData, fullStory: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-solix-green leading-relaxed font-sans"
                  />
                </div>
              </div>

              {/* MEDIA & UPLOADS */}
              <div className="space-y-4 pt-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 border-b border-slate-800 pb-2">
                  3. Media & Uploads
                </h3>

                {/* Main Image */}
                <div className="space-y-3">
                  <label className="text-xs font-semibold text-slate-300">
                    Main Project Image <span className="text-emerald-400">*</span>
                  </label>

                  <div className="flex flex-col sm:flex-row gap-4 items-start">
                    {/* Image Preview Box */}
                    <div className="relative w-full sm:w-48 aspect-[4/3] bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shrink-0 flex items-center justify-center">
                      {mainImagePreview || formData.mainImage ? (
                        <Image
                          src={mainImagePreview || formData.mainImage}
                          alt="Main preview"
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="text-center p-4 text-slate-600 text-xs">
                          <Upload className="w-6 h-6 mx-auto mb-1 opacity-50" />
                          <span>No Image</span>
                        </div>
                      )}
                    </div>

                    {/* Upload Controls */}
                    <div className="space-y-3 flex-1 w-full">
                      <div className="flex items-center gap-3">
                        <label className="inline-flex items-center gap-2 bg-solix-green hover:bg-emerald-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl cursor-pointer transition-colors shadow-md">
                          <Upload className="w-4 h-4" />
                          <span>{uploadingMain ? 'Uploading...' : 'Upload Image File'}</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleMainImageUpload}
                            disabled={uploadingMain}
                            className="hidden"
                          />
                        </label>
                        <span className="text-[11px] text-slate-500">Max 5MB (JPG, PNG, WEBP)</span>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[11px] text-slate-400">Or enter image URL manually:</span>
                        <input
                          type="url"
                          placeholder="https://images.unsplash.com/..."
                          value={formData.mainImage}
                          onChange={(e) => {
                            setFormData({ ...formData, mainImage: e.target.value });
                            setMainImagePreview(e.target.value);
                          }}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-solix-green"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Gallery */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-300">
                      Project Gallery Images ({galleryPreviews.length} uploaded)
                    </label>

                    <label className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-semibold px-3 py-1.5 rounded-xl cursor-pointer transition-colors border border-slate-700">
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Gallery Photos</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleGalleryUpload}
                        disabled={uploadingGallery}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {galleryPreviews.length > 0 ? (
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 pt-1">
                      {galleryPreviews.map((url, idx) => (
                        <div key={idx} className="relative aspect-square bg-slate-950 rounded-xl overflow-hidden group border border-slate-800">
                          <Image src={url} alt={`Gallery ${idx}`} fill className="object-cover" />
                          <button
                            type="button"
                            onClick={() => removeGalleryImage(idx)}
                            className="absolute top-1 right-1 bg-rose-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Remove image"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 italic">No additional gallery photos added yet.</p>
                  )}
                </div>
              </div>

              {/* OPTIONS & DANGER ZONE */}
              <div className="space-y-4 pt-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 border-b border-slate-800 pb-2">
                  4. Options & Danger Zone
                </h3>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="isFeatured"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="w-4 h-4 rounded text-solix-green focus:ring-emerald-500 bg-slate-950 border-slate-800"
                  />
                  <label htmlFor="isFeatured" className="text-xs font-semibold text-white">
                    Feature on Homepage Showcase (Featured Project)
                  </label>
                </div>

                {/* DANGER ZONE (Only when editing existing project) */}
                {editingProject && (
                  <div className="mt-8 border border-rose-900/50 bg-rose-950/20 rounded-2xl p-5 space-y-3">
                    <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-wider">
                      <AlertTriangle className="w-4 h-4" />
                      <span>Danger Zone</span>
                    </div>
                    <p className="text-xs text-slate-400">
                      Permanently removing this project will delete it completely from the system and public website.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setIsFormOpen(false);
                        setDeleteConfirmProject(editingProject);
                        setDeleteTitleInput('');
                        setDeleteError('');
                      }}
                      className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors inline-flex items-center gap-2"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete Project Permanently...</span>
                    </button>
                  </div>
                )}
              </div>

              {/* SUBMIT BUTTONS */}
              <div className="pt-6 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || uploadingMain || uploadingGallery}
                  className="bg-solix-green hover:bg-emerald-600 text-white text-xs font-bold px-6 py-2.5 rounded-xl transition-colors shadow-lg disabled:opacity-50 flex items-center gap-2"
                >
                  {saving ? 'Saving Project...' : editingProject ? 'Update Project' : 'Publish Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* LIVE PREVIEW MODAL */}
      {previewProject && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-8">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                <Eye className="w-4 h-4" />
                <span>Live Project Public Preview</span>
              </div>
              <button
                type="button"
                onClick={() => setPreviewProject(null)}
                className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-900 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 sm:p-8 space-y-6 max-h-[80vh] overflow-y-auto bg-slate-950">
              {/* Card Preview */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Public Grid Card Display:
                </span>
                <div className="bg-white rounded-3xl p-6 border border-solix-border shadow-solix space-y-4 text-slate-900 max-w-sm mx-auto">
                  <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden">
                    <Image src={previewProject.mainImage} alt={previewProject.title} fill className="object-cover" />
                    <div className="absolute top-3 left-3 bg-solix-dark text-white text-xs font-bold px-3 py-1 rounded-full">
                      {previewProject.category}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs font-medium text-solix-muted border-b border-solix-border/40 pb-3">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-solix-green" />
                      <span>{previewProject.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5 text-amber-500" />
                      <span>{previewProject.capacity}</span>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-solix-dark leading-snug">{previewProject.title}</h3>
                  <p className="text-xs text-solix-muted leading-relaxed line-clamp-3">{previewProject.summary}</p>
                </div>
              </div>

              {/* Case Study Detail Header Preview */}
              <div className="space-y-2 pt-4 border-t border-slate-850">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Case Study Detail Overview:
                </span>
                <div className="bg-white rounded-3xl p-6 border border-solix-border shadow-solix space-y-4 text-slate-900">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-solix-bg p-4 rounded-2xl border border-solix-border text-xs">
                    <div>
                      <div className="text-solix-muted font-bold flex items-center gap-1">
                        <UserCheck className="w-3.5 h-3.5 text-solix-green" /> Client
                      </div>
                      <div className="font-extrabold text-solix-dark">{previewProject.client}</div>
                    </div>
                    <div>
                      <div className="text-solix-muted font-bold flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-solix-green" /> Location
                      </div>
                      <div className="font-extrabold text-solix-dark">{previewProject.location}</div>
                    </div>
                    <div>
                      <div className="text-solix-muted font-bold flex items-center gap-1">
                        <Zap className="w-3.5 h-3.5 text-amber-500" /> Capacity
                      </div>
                      <div className="font-extrabold text-solix-dark">{previewProject.capacity}</div>
                    </div>
                    <div>
                      <div className="text-solix-muted font-bold flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-solix-green" /> Year
                      </div>
                      <div className="font-extrabold text-solix-dark">{previewProject.completionYear}</div>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2">
                    <h4 className="text-sm font-bold text-solix-dark">Engineering Scope Narrative</h4>
                    <p className="text-xs text-solix-muted leading-relaxed whitespace-pre-wrap">
                      {previewProject.fullStory}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DANGER ZONE CONFIRMATION DELETE MODAL */}
      {deleteConfirmProject && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-rose-900/50 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mx-auto">
                <Trash2 className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-bold text-white">Delete Project Permanently?</h2>
              <p className="text-xs text-slate-400">
                This action is irreversible. To confirm deletion, type the exact project title below:
              </p>
              <div className="bg-slate-950 p-2.5 rounded-xl text-xs font-mono font-bold text-rose-300 border border-slate-800">
                "{deleteConfirmProject.title}"
              </div>
            </div>

            {deleteError && (
              <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-3 text-rose-300 text-xs">
                {deleteError}
              </div>
            )}

            <div className="space-y-3">
              <input
                type="text"
                placeholder="Type exact title here..."
                value={deleteTitleInput}
                onChange={(e) => setDeleteTitleInput(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-rose-500"
              />

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setDeleteConfirmProject(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={
                    deleting ||
                    deleteTitleInput.trim() !== deleteConfirmProject.title.trim()
                  }
                  onClick={handleDeleteProject}
                  className="bg-rose-600 hover:bg-rose-700 disabled:opacity-40 text-white text-xs font-bold px-5 py-2 rounded-xl transition-colors shadow-lg"
                >
                  {deleting ? 'Deleting...' : 'Delete Permanently'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
