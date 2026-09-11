import React, { useState } from 'react';
import {
  Sparkles,
  Layers,
  ArrowUpRight,
  Video,
  Image,
  Film,
  Palette,
  UploadCloud,
  Plus,
  Edit3,
  Trash2,
  Play,
  RotateCcw,
  Download,
  Building,
  CheckCircle,
  FolderOpen,
  Camera
} from 'lucide-react';
import { CategoryType, Project } from '../types';
import { getVideoInfo } from '../utils/mediaUtils';

interface ProjectsSectionProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
  onOpenUploadModal: (projectToEdit?: Project) => void;
  onDeleteProject: (projectId: string) => void;
  onResetProjects?: () => void;
  onExportProjects?: () => void;
  customCount?: number;
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({
  projects,
  onSelectProject,
  onOpenUploadModal,
  onDeleteProject,
  onResetProjects,
  onExportProjects,
  customCount = 0,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('all');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const categories: { id: CategoryType; label: string; icon: React.ReactNode }[] = [
    { id: 'all', label: 'All Projects', icon: <Layers className="w-3.5 h-3.5" /> },
    { id: 'photography', label: 'Commercial Photography', icon: <Camera className="w-3.5 h-3.5" /> },
    { id: 'ai-video', label: 'AI Video & Motion', icon: <Video className="w-3.5 h-3.5" /> },
    { id: 'ai-image', label: 'AI Image Generation', icon: <Image className="w-3.5 h-3.5" /> },
    { id: 'video-editing', label: 'Commercial Video Editing', icon: <Film className="w-3.5 h-3.5" /> },
    { id: 'graphic-design', label: 'Branding & Social Media', icon: <Palette className="w-3.5 h-3.5" /> },
  ];

  const filteredProjects = projects.filter((project) => {
    if (selectedCategory === 'all') return true;
    return project.category === selectedCategory;
  });

  return (
    <section id="portfolio" className="py-20 lg:py-28 relative bg-[#0b0f17]/85 backdrop-blur-[0.5px]">
      {/* Background glow accents */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-cyan-500/5 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Client Showcase & Portfolio</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Selected Works & Creative Case Studies
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-300">
              Commercial Gen AI videos, photorealistic imagery, viral brand systems, and high-cadence edits created for real corporate clients and studios.
            </p>
          </div>

          {/* Action buttons: Upload Real Work + Utilities */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => onOpenUploadModal()}
              id="upload-real-work-btn"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-500/25 transition-all hover:scale-105 active:scale-95"
            >
              <FolderOpen className="w-4 h-4" />
              <span>Upload Client Folder</span>
            </button>

            {onExportProjects && (
              <button
                onClick={onExportProjects}
                title="Backup and download your portfolio projects data as JSON"
                className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-medium bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Export JSON</span>
              </button>
            )}

            {customCount > 0 && onResetProjects && (
              <button
                onClick={() => {
                  if (window.confirm('Reset all projects back to default showcase? Your custom additions will be cleared.')) {
                    onResetProjects();
                  }
                }}
                title="Reset back to default template projects"
                className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-medium bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Client Work Status Banner if custom items uploaded */}
        {customCount > 0 && (
          <div className="mb-8 p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5 text-cyan-300">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                <strong className="font-semibold text-white">{customCount} real client project{customCount > 1 ? 's' : ''}</strong> uploaded and actively showcased in your portfolio.
              </span>
            </div>
            <button
              onClick={() => onOpenUploadModal()}
              className="text-cyan-400 hover:text-cyan-300 font-semibold underline underline-offset-4 self-start sm:self-auto"
            >
              + Upload Another Project
            </button>
          </div>
        )}

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-start sm:justify-center gap-2 mb-10 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              id={`portfolio-cat-${cat.id}`}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                selectedCategory === cat.id
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25'
                  : 'bg-[#0f1422] text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {cat.icon}
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Dedicated "Add Client Project" interactive card */}
          <div
            onClick={() => onOpenUploadModal()}
            className="group cursor-pointer min-h-[380px] rounded-2xl border-2 border-dashed border-slate-800 hover:border-cyan-500/60 bg-gradient-to-b from-[#0e1422]/60 to-[#0b0f17] hover:bg-cyan-950/10 p-6 flex flex-col items-center justify-center text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-950/20"
          >
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/25 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-cyan-500 group-hover:text-white transition-all duration-300 shadow-lg shadow-cyan-500/10">
              <FolderOpen className="w-7 h-7" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-cyan-300 transition-colors mb-1.5">
              Create Client Folder
            </h3>
            <p className="text-xs text-slate-400 max-w-xs leading-relaxed mb-4">
              Upload multiple images and videos for one client (e.g. Grapes Worldwide, Riverbed Events, Naantam) in a single organized case study.
            </p>
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 group-hover:bg-cyan-500 group-hover:text-white transition-all">
              <Plus className="w-3.5 h-3.5" />
              <span>+ Upload Client Media</span>
            </span>
          </div>

          {/* Render All Filtered Projects */}
          {filteredProjects.map((project) => {
            const videoInfo = getVideoInfo(project.videoUrl);
            const mediaCount = project.mediaItems?.length || (project.videoUrl ? 2 : 1);
            const hasVideos = (project.mediaItems && project.mediaItems.some(m => m.type === 'video')) || videoInfo.isVideo;
            const videoCount = project.mediaItems ? project.mediaItems.filter(m => m.type === 'video').length : (videoInfo.isVideo ? 1 : 0);
            const imageCount = project.mediaItems ? project.mediaItems.filter(m => m.type === 'image').length : 1;

            return (
              <div
                key={project.id}
                className="group relative bg-[#0e1422] border border-slate-800/90 hover:border-cyan-500/40 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-cyan-950/30 flex flex-col justify-between"
              >
                {/* Clickable Area for modal */}
                <div onClick={() => onSelectProject(project)} className="cursor-pointer">
                  {/* Thumbnail image container */}
                  <div className="relative aspect-video overflow-hidden bg-slate-950">
                    <img
                      src={project.thumbnail}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0e1422] via-transparent to-transparent opacity-85" />

                    {/* Video indicator badge */}
                    {hasVideos && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-12 h-12 rounded-full bg-cyan-500/80 backdrop-blur-md text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                          <Play className="w-5 h-5 ml-0.5 fill-white" />
                        </div>
                      </div>
                    )}

                    {/* Top badges */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                      <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-black/75 backdrop-blur-md text-cyan-300 border border-cyan-500/20">
                        {project.categoryLabel}
                      </span>

                      <div className="flex items-center gap-1.5">
                        {project.isCustomUpload && (
                          <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-emerald-500/90 text-white shadow-sm">
                            Client Work
                          </span>
                        )}
                        <div className="w-7 h-7 rounded-full bg-black/60 backdrop-blur-md text-slate-300 flex items-center justify-center group-hover:text-cyan-400 group-hover:scale-110 transition-all">
                          <ArrowUpRight className="w-4 h-4" />
                        </div>
                      </div>
                    </div>

                    {/* Bottom thumbnail asset count badge */}
                    {mediaCount > 1 && (
                      <div className="absolute bottom-2.5 left-3 px-2 py-0.5 rounded text-[10px] font-semibold bg-black/80 backdrop-blur-md text-slate-200 border border-white/10 flex items-center gap-1">
                        <FolderOpen className="w-3 h-3 text-cyan-400" />
                        <span>{mediaCount} Assets ({videoCount > 0 ? `${videoCount}v, ` : ''}{imageCount}i)</span>
                      </div>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="p-5 sm:p-6">
                    <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-400 mb-1.5">
                      <Building className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span className="line-clamp-1">{project.clientOrContext}</span>
                    </div>

                    <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1 mb-2">
                      {project.title}
                    </h3>

                    <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed mb-4">
                      {project.summary}
                    </p>

                    {/* Tools used pills */}
                    <div className="flex flex-wrap gap-1.5">
                      {project.toolsUsed.slice(0, 3).map((tool) => (
                        <span
                          key={tool}
                          className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-900 text-slate-300 border border-slate-800"
                        >
                          {tool}
                        </span>
                      ))}
                      {project.toolsUsed.length > 3 && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-900 text-slate-400 border border-slate-800">
                          +{project.toolsUsed.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Bottom Card Footer with Actions */}
                <div className="px-5 sm:px-6 py-3 bg-slate-900/40 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span
                    onClick={() => onSelectProject(project)}
                    className="cursor-pointer text-cyan-400 font-semibold hover:text-cyan-300 inline-flex items-center gap-1"
                  >
                    Open Client Folder ({mediaCount}) &rarr;
                  </span>

                  {/* Edit / Delete quick controls */}
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenUploadModal(project);
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-slate-800 transition-colors"
                      title="Edit project details"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (deletingId === project.id) {
                          onDeleteProject(project.id);
                          setDeletingId(null);
                        } else {
                          setDeletingId(project.id);
                          setTimeout(() => setDeletingId(null), 3000);
                        }
                      }}
                      className={`p-1.5 rounded-lg transition-colors ${
                        deletingId === project.id
                          ? 'bg-rose-600 text-white'
                          : 'text-slate-400 hover:text-rose-400 hover:bg-slate-800'
                      }`}
                      title={deletingId === project.id ? 'Click again to confirm delete' : 'Delete project'}
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
    </section>
  );
};
