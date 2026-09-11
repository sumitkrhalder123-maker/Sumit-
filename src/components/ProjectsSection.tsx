import React, { useState } from 'react';
import {
  Sparkles,
  Layers,
  ArrowUpRight,
  Video,
  Image,
  Film,
  Palette,
  Play,
  Building,
  FolderOpen,
  Camera
} from 'lucide-react';
import { CategoryType, Project } from '../types';
import { getVideoInfo } from '../utils/mediaUtils';

interface ProjectsSectionProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({
  projects,
  onSelectProject,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('all');

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
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-start sm:justify-center gap-2 mb-10 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              id={`portfolio-cat-${cat.id}`}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
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
          {/* Render All Filtered Projects */}
          {filteredProjects.map((project) => {
            const hasVideo =
              project.mediaType === 'video' ||
              Boolean(project.mediaItems && project.mediaItems.some((m) => m.type === 'video')) ||
              Boolean(project.videoUrl);
            const mediaCount = project.mediaItems?.length || 1;

            return (
              <div
                key={project.id}
                onClick={() => onSelectProject(project)}
                className="group cursor-pointer rounded-2xl overflow-hidden border border-slate-800 hover:border-cyan-500/40 bg-gradient-to-b from-[#0e1422] to-[#0a0d16] flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-cyan-950/30"
              >
                <div>
                  {/* Media Preview Container */}
                  <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
                    <img
                      src={project.thumbnail}
                      alt={project.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    />

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0e1422] via-transparent to-black/30 opacity-70 group-hover:opacity-40 transition-opacity" />

                    {/* Media Count Badge */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-black/70 backdrop-blur-md text-cyan-300 border border-cyan-500/30 flex items-center gap-1 shadow-lg">
                        <FolderOpen className="w-3 h-3 text-cyan-400" />
                        <span>{mediaCount} {mediaCount === 1 ? 'Asset' : 'Assets'}</span>
                      </span>
                    </div>

                    {/* Video indicator overlay */}
                    {hasVideo && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-12 h-12 rounded-full bg-cyan-500/90 text-black flex items-center justify-center shadow-xl shadow-cyan-500/50 group-hover:scale-110 transition-transform">
                          <Play className="w-5 h-5 fill-current translate-x-0.5" />
                        </div>
                      </div>
                    )}

                    {/* Client Name Pill */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-slate-950/80 backdrop-blur-md text-slate-200 border border-slate-700/60 flex items-center gap-1.5 truncate max-w-[70%]">
                        <Building className="w-3 h-3 text-cyan-400 shrink-0" />
                        <span className="truncate">{project.clientOrContext}</span>
                      </span>

                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 backdrop-blur-md">
                        {project.categoryLabel}
                      </span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-5 sm:p-6">
                    <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-cyan-300 transition-colors mb-2 line-clamp-1">
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
                  <span className="text-cyan-400 font-semibold group-hover:text-cyan-300 inline-flex items-center gap-1.5 transition-colors">
                    <span>View Case Study ({mediaCount})</span>
                    <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </span>
                  <span className="text-[11px] text-slate-500">Open Folder</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
