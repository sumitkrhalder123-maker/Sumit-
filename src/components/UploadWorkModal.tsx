import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  UploadCloud,
  Film,
  Image as ImageIcon,
  Link as LinkIcon,
  Plus,
  Trash2,
  Check,
  Building,
  Terminal,
  Layers,
  Award,
  AlertCircle,
  Star,
  FolderOpen,
  Play,
  Video
} from 'lucide-react';
import { Project, MediaItem } from '../types';
import { compressImageFile, getVideoInfo } from '../utils/mediaUtils';

interface UploadWorkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (project: Omit<Project, 'id'>, editId?: string) => void;
  editingProject?: Project | null;
}

const COMMON_CLIENTS = [
  'Indian Oil Corporation Ltd. (IOCL)',
  'Grapes Worldwide',
  'Riverbed Events',
  'Naantam Pvt. Ltd.',
  'Ananka / National PC',
  'Private Freelance Client',
  'Creative Studio'
];

const SUGGESTED_TOOLS = [
  'Lightroom Classic',
  'Commercial DSLR / Mirrorless',
  'On-Location Art Direction',
  'Midjourney',
  'Flux',
  'Kling',
  'Veo 3',
  'Comfy UI',
  'Premiere Pro',
  'After Effects',
  'DaVinci Resolve',
  'Photoshop',
  'Illustrator',
  'InDesign',
  'ChatGPT',
  'Seedance 2.0'
];

const CATEGORY_OPTIONS: {
  id: Project['category'];
  label: string;
}[] = [
  { id: 'photography', label: 'Commercial Photography' },
  { id: 'ai-video', label: 'AI Video & Motion' },
  { id: 'ai-image', label: 'AI Image Generation' },
  { id: 'video-editing', label: 'Commercial Video Editing' },
  { id: 'graphic-design', label: 'Graphic Design & Branding' },
];

export const UploadWorkModal: React.FC<UploadWorkModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingProject,
}) => {
  const [clientOrContext, setClientOrContext] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Project['category']>('ai-video');
  const [summary, setSummary] = useState('');
  const [externalLink, setExternalLink] = useState('');

  // Multi-media assets in this client folder
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [customVideoUrlInput, setCustomVideoUrlInput] = useState('');
  const [customVideoTitleInput, setCustomVideoTitleInput] = useState('');
  const [customImageUrlInput, setCustomImageUrlInput] = useState('');
  const [customImageTitleInput, setCustomImageTitleInput] = useState('');

  const [toolsUsed, setToolsUsed] = useState<string[]>([]);
  const [newToolInput, setNewToolInput] = useState('');
  const [promptSnippet, setPromptSnippet] = useState('');
  const [workflow, setWorkflow] = useState<string[]>([
    'Creative consultation and client asset review',
    'High-cadence generative AI creation and video editing in timeline',
    'Post-production polish, color correction, and final delivery suite'
  ]);
  const [newWorkflowStep, setNewWorkflowStep] = useState('');
  const [deliverables, setDeliverables] = useState<string[]>([
    'Master 4K Video Cuts',
    'Social Reels & Shorts',
    'High-Resolution Key Visuals'
  ]);
  const [newDeliverableInput, setNewDeliverableInput] = useState('');
  const [metrics, setMetrics] = useState('');

  const [isProcessingFiles, setIsProcessingFiles] = useState(false);
  const [processingProgress, setProcessingProgress] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Sync when editing or opening
  useEffect(() => {
    if (editingProject) {
      setClientOrContext(editingProject.clientOrContext || '');
      setTitle(editingProject.title || '');
      setCategory(editingProject.category || 'ai-video');
      setSummary(editingProject.summary || '');
      setExternalLink(editingProject.externalLink || '');

      // Load existing media items or build from thumbnail/videoUrl
      if (editingProject.mediaItems && editingProject.mediaItems.length > 0) {
        setMediaItems(editingProject.mediaItems);
      } else {
        const initialItems: MediaItem[] = [];
        if (editingProject.thumbnail) {
          initialItems.push({
            id: `item-${Date.now()}-1`,
            type: 'image',
            url: editingProject.thumbnail,
            title: 'Main Visual Cover',
            isCover: true,
          });
        }
        if (editingProject.videoUrl) {
          initialItems.push({
            id: `item-${Date.now()}-2`,
            type: 'video',
            url: editingProject.videoUrl,
            title: 'Featured Video',
            isCover: initialItems.length === 0,
          });
        }
        setMediaItems(initialItems);
      }

      setToolsUsed(editingProject.toolsUsed || []);
      setPromptSnippet(editingProject.promptSnippet || '');
      setWorkflow(
        editingProject.workflow && editingProject.workflow.length > 0
          ? editingProject.workflow
          : ['Initial client scope', 'Production & editing', 'Final client deliverables']
      );
      setDeliverables(
        editingProject.deliverables && editingProject.deliverables.length > 0
          ? editingProject.deliverables
          : ['Final commercial delivery']
      );
      setMetrics(editingProject.metrics || '');
      setFormError(null);
    } else {
      // Clean slate for new client folder
      setClientOrContext('');
      setTitle('');
      setCategory('ai-video');
      setSummary('');
      setExternalLink('');
      setMediaItems([]);
      setToolsUsed(['Premiere Pro', 'Kling', 'Midjourney', 'After Effects']);
      setPromptSnippet('');
      setWorkflow([
        'Analyzed client brief and storyboarded scene sequences',
        'Engineered AI motion / high-end video timeline cut',
        'Color grading, audio mixing, and multi-format client export'
      ]);
      setDeliverables(['Master 4K Video Cuts', 'Social Media Carousel & Reels', 'High-Res Key Visuals']);
      setMetrics('');
      setFormError(null);
    }
  }, [editingProject, isOpen]);

  // Escape listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Multi-file upload handler
  const handleProcessMultipleFiles = async (files: FileList | File[]) => {
    setFormError(null);
    setIsProcessingFiles(true);

    const fileArray = Array.from(files);
    const newItems: MediaItem[] = [];

    for (let i = 0; i < fileArray.length; i++) {
      const file = fileArray[i];
      setProcessingProgress(`Processing asset ${i + 1} of ${fileArray.length}: ${file.name}`);

      try {
        if (file.type.startsWith('image/')) {
          const compressed = await compressImageFile(file, 1400, 1400, 0.85);
          newItems.push({
            id: `upload-${Date.now()}-${i}-${Math.random().toString(36).substring(2, 6)}`,
            type: 'image',
            url: compressed,
            title: file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
            isCover: mediaItems.length === 0 && i === 0,
          });
        } else if (file.type.startsWith('video/')) {
          if (file.size > 20 * 1024 * 1024) {
            setFormError(`"${file.name}" is over 20MB. For larger videos, add them via YouTube, Vimeo, or Drive link below.`);
            continue;
          }
          const dataUrl = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
          });

          newItems.push({
            id: `upload-${Date.now()}-${i}-${Math.random().toString(36).substring(2, 6)}`,
            type: 'video',
            url: dataUrl,
            title: file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
            isCover: mediaItems.length === 0 && i === 0,
          });
        }
      } catch (err) {
        console.error(`Failed to process ${file.name}:`, err);
      }
    }

    setMediaItems((prev) => [...prev, ...newItems]);
    setIsProcessingFiles(false);
    setProcessingProgress('');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleProcessMultipleFiles(e.dataTransfer.files);
    }
  };

  // Add video via YouTube / Vimeo / Drive URL
  const handleAddVideoUrl = () => {
    if (!customVideoUrlInput.trim()) return;
    const info = getVideoInfo(customVideoUrlInput.trim());
    if (!info.isVideo && !customVideoUrlInput.startsWith('http')) {
      setFormError('Please enter a valid video link (YouTube, Vimeo, Google Drive, or .mp4 link).');
      return;
    }

    const newItem: MediaItem = {
      id: `vid-link-${Date.now()}`,
      type: 'video',
      url: customVideoUrlInput.trim(),
      title: customVideoTitleInput.trim() || 'Client Video Asset',
      isCover: mediaItems.length === 0,
    };

    setMediaItems([...mediaItems, newItem]);
    setCustomVideoUrlInput('');
    setCustomVideoTitleInput('');
    setFormError(null);
  };

  // Add image via URL
  const handleAddImageUrl = () => {
    if (!customImageUrlInput.trim()) return;

    const newItem: MediaItem = {
      id: `img-link-${Date.now()}`,
      type: 'image',
      url: customImageUrlInput.trim(),
      title: customImageTitleInput.trim() || 'Client Image Asset',
      isCover: mediaItems.length === 0,
    };

    setMediaItems([...mediaItems, newItem]);
    setCustomImageUrlInput('');
    setCustomImageTitleInput('');
    setFormError(null);
  };

  const handleSetCover = (itemId: string) => {
    setMediaItems(
      mediaItems.map((item) => ({
        ...item,
        isCover: item.id === itemId,
      }))
    );
  };

  const handleRemoveMediaItem = (itemId: string) => {
    const remaining = mediaItems.filter((i) => i.id !== itemId);
    // If the removed item was cover, assign new cover if any items remain
    if (remaining.length > 0 && !remaining.some((i) => i.isCover)) {
      remaining[0].isCover = true;
    }
    setMediaItems(remaining);
  };

  const handleUpdateItemTitle = (itemId: string, newTitle: string) => {
    setMediaItems(
      mediaItems.map((item) => (item.id === itemId ? { ...item, title: newTitle } : item))
    );
  };

  const handleAddTool = (toolName: string) => {
    const trimmed = toolName.trim();
    if (trimmed && !toolsUsed.includes(trimmed)) {
      setToolsUsed([...toolsUsed, trimmed]);
      setNewToolInput('');
    }
  };

  const handleRemoveTool = (toolToRemove: string) => {
    setToolsUsed(toolsUsed.filter((t) => t !== toolToRemove));
  };

  const handleAddWorkflowStep = () => {
    if (newWorkflowStep.trim()) {
      setWorkflow([...workflow, newWorkflowStep.trim()]);
      setNewWorkflowStep('');
    }
  };

  const handleRemoveWorkflowStep = (index: number) => {
    setWorkflow(workflow.filter((_, idx) => idx !== index));
  };

  const handleAddDeliverable = () => {
    if (newDeliverableInput.trim()) {
      setDeliverables([...deliverables, newDeliverableInput.trim()]);
      setNewDeliverableInput('');
    }
  };

  const handleRemoveDeliverable = (index: number) => {
    setDeliverables(deliverables.filter((_, idx) => idx !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientOrContext.trim()) {
      setFormError('Please enter the Client or Brand Name.');
      return;
    }
    if (!title.trim()) {
      setFormError('Please provide a Campaign or Project Title.');
      return;
    }
    if (mediaItems.length === 0) {
      setFormError('Please upload at least one image or video for this client folder.');
      return;
    }

    const selectedCategoryOption = CATEGORY_OPTIONS.find((c) => c.id === category);

    // Pick cover item
    const coverItem = mediaItems.find((m) => m.isCover) || mediaItems[0];
    const firstVideo = mediaItems.find((m) => m.type === 'video');

    const projectData: Omit<Project, 'id'> = {
      clientOrContext: clientOrContext.trim(),
      title: title.trim(),
      category,
      categoryLabel: selectedCategoryOption ? selectedCategoryOption.label : 'Client Work',
      summary: summary.trim() || `Commercial client project package delivered for ${clientOrContext.trim()}.`,
      thumbnail: coverItem.url,
      videoUrl: firstVideo ? firstVideo.url : undefined,
      mediaItems,
      externalLink: externalLink.trim() || undefined,
      toolsUsed: toolsUsed.length > 0 ? toolsUsed : ['Premiere Pro', 'Kling', 'Midjourney'],
      promptSnippet: promptSnippet.trim() || undefined,
      workflow: workflow.length > 0 ? workflow : ['Client briefing', 'Production & editing', 'Client delivery'],
      deliverables: deliverables.length > 0 ? deliverables : ['Client deliverables package'],
      metrics: metrics.trim() || undefined,
      aspectRatio: '16:9',
      isCustomUpload: true,
    };

    onSave(projectData, editingProject ? editingProject.id : undefined);
    onClose();
  };

  const videoCount = mediaItems.filter((m) => m.type === 'video').length;
  const imageCount = mediaItems.filter((m) => m.type === 'image').length;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-[#0d121f] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden my-6 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/80 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center">
              <FolderOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white leading-tight">
                {editingProject ? 'Edit Client Folder & Media' : 'Create Client Folder & Upload Media'}
              </h3>
              <p className="text-xs text-slate-400">
                Upload multiple images & videos for one client (e.g. Grapes Worldwide, Riverbed Events, etc.)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 overflow-y-auto space-y-6">
          {formError && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {/* Section 1: Client Name & Campaign Title */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1.5 flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-cyan-400" />
                <span>Client / Brand Name *</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Grapes Worldwide, Riverbed Events, Naantam"
                value={clientOrContext}
                onChange={(e) => setClientOrContext(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500"
              />

              {/* Quick client presets */}
              <div className="mt-2 flex flex-wrap gap-1">
                {COMMON_CLIENTS.map((client) => (
                  <button
                    key={client}
                    type="button"
                    onClick={() => setClientOrContext(client)}
                    className="text-[10px] px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                  >
                    + {client}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1.5 flex items-center gap-1.5">
                <FolderOpen className="w-3.5 h-3.5 text-cyan-400" />
                <span>Folder / Campaign Title *</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Brand Commercials & AI Concept Stills 2025"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500"
              />

              <div className="mt-2">
                <label className="text-[11px] text-slate-400 block mb-1">Primary Discipline</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as Project['category'])}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                >
                  {CATEGORY_OPTIONS.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Upload Multiple Images & Videos to this Client Folder */}
          <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800/90 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <label className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <UploadCloud className="w-4 h-4 text-cyan-400" />
                  <span>Client Media Assets (Upload Multiple Images & Videos)</span>
                </label>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Drop multiple files at once. You can mix video files, still renders, posters, and YouTube/Vimeo links.
                </p>
              </div>

              {mediaItems.length > 0 && (
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-cyan-950/50 border border-cyan-500/30 text-xs text-cyan-300">
                  <span>{mediaItems.length} Total</span>
                  <span>•</span>
                  <span>{videoCount} Videos</span>
                  <span>•</span>
                  <span>{imageCount} Images</span>
                </div>
              )}
            </div>

            {/* Drag & Drop Multi-file Area */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative cursor-pointer border-2 border-dashed rounded-2xl p-6 text-center transition-all ${
                isDragging
                  ? 'border-cyan-400 bg-cyan-950/20'
                  : 'border-slate-800 hover:border-cyan-500/50 bg-[#0c101c]'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,video/mp4,video/webm"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    handleProcessMultipleFiles(e.target.files);
                  }
                }}
              />

              {isProcessingFiles ? (
                <div className="py-4 flex flex-col items-center justify-center gap-2">
                  <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                  <span className="text-xs text-cyan-300 font-medium">
                    {processingProgress || 'Processing multiple client files...'}
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center gap-2">
                  <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center mb-1">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-semibold text-white">
                    Drop multiple images and videos here
                  </p>
                  <p className="text-xs text-slate-400">
                    Select multiple files at once (PNG, JPG, WebP, GIF, MP4, WebM) or click to browse
                  </p>
                  <div className="mt-1 inline-flex items-center gap-1.5 text-xs text-cyan-400 font-medium bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
                    <Plus className="w-3.5 h-3.5" />
                    <span>Choose Multiple Files</span>
                  </div>
                </div>
              )}
            </div>

            {/* Alternative: Add Video Link (YouTube/Vimeo/Drive) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <span className="text-[11px] font-semibold text-slate-300 flex items-center gap-1.5">
                  <Film className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Add Video Link (YouTube / Vimeo / Drive)</span>
                </span>
                <input
                  type="url"
                  placeholder="https://youtube.com/watch?v=... or Vimeo link"
                  value={customVideoUrlInput}
                  onChange={(e) => setCustomVideoUrlInput(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500"
                />
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Video title / caption (e.g. 60s TVC Master)"
                    value={customVideoTitleInput}
                    onChange={(e) => setCustomVideoTitleInput(e.target.value)}
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddVideoUrl}
                    className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-white text-xs font-semibold shrink-0"
                  >
                    Add Video
                  </button>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <span className="text-[11px] font-semibold text-slate-300 flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Add Image Link (Web / CDN / Cloud)</span>
                </span>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/... or image link"
                  value={customImageUrlInput}
                  onChange={(e) => setCustomImageUrlInput(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500"
                />
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Image title (e.g. Hero Key Visual Still)"
                    value={customImageTitleInput}
                    onChange={(e) => setCustomImageTitleInput(e.target.value)}
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddImageUrl}
                    className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-white text-xs font-semibold shrink-0"
                  >
                    Add Image
                  </button>
                </div>
              </div>
            </div>

            {/* List of uploaded media items in this client folder */}
            {mediaItems.length > 0 && (
              <div className="space-y-2 pt-3">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Client Folder Assets ({mediaItems.length})</span>
                  <span className="text-[11px] text-cyan-400">
                    ★ Click the star on any item to set it as the cover
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {mediaItems.map((item, idx) => {
                    const videoInfo = getVideoInfo(item.url);

                    return (
                      <div
                        key={item.id}
                        className={`relative rounded-xl border p-2.5 bg-slate-900/90 transition-all ${
                          item.isCover
                            ? 'border-cyan-500 shadow-md shadow-cyan-500/10'
                            : 'border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        {/* Media Preview Box */}
                        <div className="relative aspect-video rounded-lg overflow-hidden bg-black mb-2 flex items-center justify-center">
                          {item.type === 'video' ? (
                            videoInfo.isDirect ? (
                              <video
                                src={videoInfo.embedUrl}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-slate-950 flex flex-col items-center justify-center text-slate-400 p-2 text-center">
                                <Play className="w-8 h-8 text-cyan-400 mb-1" />
                                <span className="text-[10px] text-slate-300">Video Embed</span>
                              </div>
                            )
                          ) : (
                            <img
                              src={item.url}
                              alt={item.title || `Asset ${idx + 1}`}
                              className="w-full h-full object-cover"
                            />
                          )}

                          {/* Type Badge */}
                          <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-black/80 text-cyan-300 border border-cyan-500/30">
                            {item.type === 'video' ? 'Video' : 'Image'}
                          </span>

                          {/* Cover Badge */}
                          {item.isCover && (
                            <span className="absolute top-1.5 right-1.5 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-amber-500 text-black flex items-center gap-0.5">
                              <Star className="w-2.5 h-2.5 fill-black" />
                              Cover
                            </span>
                          )}
                        </div>

                        {/* Title input & actions */}
                        <div className="space-y-1.5">
                          <input
                            type="text"
                            value={item.title || ''}
                            placeholder="Asset title or scene name"
                            onChange={(e) => handleUpdateItemTitle(item.id, e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-[11px] text-slate-200 focus:outline-none focus:border-cyan-500"
                          />

                          <div className="flex items-center justify-between text-[10px]">
                            <button
                              type="button"
                              onClick={() => handleSetCover(item.id)}
                              className={`inline-flex items-center gap-1 px-2 py-1 rounded transition-colors ${
                                item.isCover
                                  ? 'text-amber-400 bg-amber-500/10 font-bold'
                                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
                              }`}
                            >
                              <Star className={`w-3 h-3 ${item.isCover ? 'fill-amber-400' : ''}`} />
                              <span>{item.isCover ? 'Main Cover' : 'Set as Cover'}</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleRemoveMediaItem(item.id)}
                              className="p-1 text-slate-500 hover:text-rose-400 rounded hover:bg-slate-800 transition-colors"
                              title="Delete asset from folder"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Section 3: Summary / Context */}
          <div>
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
              Client Project Summary / Scope of Work
            </label>
            <textarea
              rows={2}
              placeholder="Describe the brief, creative direction, and what you delivered for this client..."
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 resize-none"
            />
          </div>

          {/* Section 4: Tools & Technologies */}
          <div>
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1.5 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span>Tools, AI Models & Software Used</span>
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2.5">
              {toolsUsed.map((tool) => (
                <span
                  key={tool}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs bg-slate-800 text-cyan-300 border border-slate-700"
                >
                  <span>{tool}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTool(tool)}
                    className="hover:text-rose-400"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add tool (e.g. Kling, Midjourney, Premiere Pro, After Effects)"
                value={newToolInput}
                onChange={(e) => setNewToolInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTool(newToolInput);
                  }
                }}
                className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500"
              />
              <button
                type="button"
                onClick={() => handleAddTool(newToolInput)}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
              >
                Add
              </button>
            </div>

            {/* Suggested quick chips */}
            <div className="mt-2 flex flex-wrap gap-1">
              <span className="text-[10px] text-slate-500 py-0.5">Quick add:</span>
              {SUGGESTED_TOOLS.filter((t) => !toolsUsed.includes(t)).slice(0, 7).map((tool) => (
                <button
                  key={tool}
                  type="button"
                  onClick={() => handleAddTool(tool)}
                  className="text-[10px] px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800"
                >
                  +{tool}
                </button>
              ))}
            </div>
          </div>

          {/* Section 5: AI Prompt Recipe (Optional) */}
          <div>
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1.5 flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              <span>Prompt Architecture / Gen AI Recipe (Optional)</span>
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Cinematic wide-angle shot, volumetric lighting, photorealistic textures --v 6.1 --style raw"
              value={promptSnippet}
              onChange={(e) => setPromptSnippet(e.target.value)}
              className="w-full font-mono text-xs bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-cyan-300 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 resize-none"
            />
          </div>

          {/* Section 6: Workflow & Deliverables */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
                Production Workflow Steps
              </label>
              <div className="space-y-2 mb-2.5">
                {workflow.map((step, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs bg-slate-900/90 p-2 rounded-xl border border-slate-800">
                    <span className="w-5 h-5 rounded-full bg-cyan-500/10 text-cyan-400 text-[10px] flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <span className="flex-1 text-slate-300">{step}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveWorkflowStep(idx)}
                      className="text-slate-500 hover:text-rose-400 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add step (e.g. Node workflow in ComfyUI)"
                  value={newWorkflowStep}
                  onChange={(e) => setNewWorkflowStep(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddWorkflowStep();
                    }
                  }}
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                />
                <button
                  type="button"
                  onClick={handleAddWorkflowStep}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
                >
                  Add
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
                Key Client Deliverables
              </label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {deliverables.map((item, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-lg bg-slate-800 text-slate-200 border border-slate-700"
                  >
                    <span>{item}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveDeliverable(idx)}
                      className="hover:text-rose-400"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. 4K Master Video, 10x Social Reels"
                  value={newDeliverableInput}
                  onChange={(e) => setNewDeliverableInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddDeliverable();
                    }
                  }}
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                />
                <button
                  type="button"
                  onClick={handleAddDeliverable}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Section 7: Impact & External Link */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1.5 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-cyan-400" />
                <span>Client Impact / Result Metric</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Boosted views by 40%, 10K+ followers gained"
                value={metrics}
                onChange={(e) => setMetrics(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1.5 flex items-center gap-1.5">
                <LinkIcon className="w-3.5 h-3.5 text-cyan-400" />
                <span>Live Project / Drive / Behance Link</span>
              </label>
              <input
                type="url"
                placeholder="e.g. https://behance.net/... or client live URL"
                value={externalLink}
                onChange={(e) => setExternalLink(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {/* Modal Actions */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-500/25 transition-all"
            >
              <Check className="w-4 h-4" />
              <span>{editingProject ? 'Save Client Folder' : 'Save Client Folder & Media'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
