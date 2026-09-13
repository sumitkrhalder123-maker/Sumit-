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
  Camera,
  ExternalLink,
  CheckCircle2
} from 'lucide-react';
import { CategoryType, Project } from '../types';
import { getVideoInfo } from '../utils/mediaUtils';

export const FULL_PORTFOLIO_CANVA_URL = 'https://canva.link/u62tr0nfmig5ft7';

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
        <div className="max-w-3xl mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-900 border border-cyan-500/25 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-3 shadow-lg shadow-cyan-950/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Client Showcase & Portfolio</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Selected Works & Creative Case Studies
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed">
            Commercial Gen AI videos, photorealistic imagery, viral brand systems, and high-cadence edits created for real corporate clients and studios.
          </p>
        </div>

        {/* SINGLE HIGH-END MASTER PORTFOLIO SHOWCASE BANNER */}
        <div className="mb-12 relative rounded-2xl p-[1px] bg-gradient-to-r from-cyan-500/40 via-blue-500/30 to-purple-500/40 shadow-2xl shadow-cyan-950/30 overflow-hidden group">
          {/* Ambient background blur inside card */}
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-cyan-500/20 transition-all duration-700" />
          <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-purple-500/20 transition-all duration-700" />

          <div className="relative rounded-2xl bg-gradient-to-r from-[#090e18]/95 via-[#0c1424]/95 to-[#0a101d]/95 p-5 sm:p-7 backdrop-blur-xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="flex items-start sm:items-center gap-4 sm:gap-5">
              <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-cyan-500/20 via-blue-600/20 to-purple-600/20 border border-cyan-400/30 flex items-center justify-center text-cyan-300 shrink-0 shadow-lg shadow-cyan-500/10 group-hover:scale-105 group-hover:border-cyan-400/50 transition-all duration-300">
                <ExternalLink className="w-7 h-7 text-cyan-400 group-hover:rotate-12 transition-transform duration-300" />
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
                </span>
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <span className="text-xs font-mono font-bold tracking-wider text-cyan-400 uppercase">
                    Live Master Presentation Deck
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Canva Verified</span>
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-cyan-200 transition-colors">
                  Explore Full Interactive Portfolio & Client Decks
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
                  Direct access to complete client deliverables, uncompressed 4K video reels, GenAI pitch decks, and brand identity systems in ultra high resolution.
                </p>

                {/* Badges */}
                <div className="flex flex-wrap items-center gap-2 mt-3 text-[11px] text-slate-400 font-medium">
                  <span className="px-2 py-0.5 rounded bg-slate-900/90 text-cyan-300 border border-cyan-500/20">
                    4K Video Reels
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-900/90 text-purple-300 border border-purple-500/20">
                    GenAI Pitch Decks
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-900/90 text-blue-300 border border-blue-500/20">
                    Brand Identity Guides
                  </span>
                  <span className="hidden sm:inline-block px-2 py-0.5 rounded bg-slate-900/90 text-emerald-300 border border-emerald-500/20">
                    Commercial Ad Campaigns
                  </span>
                </div>
              </div>
            </div>

            {/* The 1 and ONLY CTA Link */}
            <a
              href={FULL_PORTFOLIO_CANVA_URL}
              target="_blank"
              rel="noopener noreferrer"
              id="btn-single-full-portfolio"
              className="relative inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-xl font-bold text-sm text-white overflow-hidden shadow-xl shadow-cyan-500/25 hover:shadow-cyan-400/40 hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 group/btn shrink-0 w-full lg:w-auto"
            >
              {/* Vibrant gradient background */}
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 group-hover/btn:from-cyan-400 group-hover/btn:via-blue-500 group-hover/btn:to-indigo-500 transition-all duration-300" />

              {/* Shimmer light sweep */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000 ease-out" />

              <span className="relative z-10 font-bold tracking-wide">Open Full Portfolio</span>
              <ExternalLink className="relative z-10 w-4 h-4 text-cyan-100 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
            </a>
          </div>
        </div>

        {/* Category Filters (only shown if there are projects) */}
        {projects.length > 0 && (
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
        )}

        {/* Clean Empty State or Projects Grid */}
        {filteredProjects.length === 0 ? (
          <div className="py-20 px-6 rounded-2xl border border-slate-800/80 bg-[#0e1422]/60 text-center max-w-lg mx-auto flex flex-col items-center justify-center">
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mb-4">
              <Layers className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Portfolio Under Curation</h3>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Commercial projects, case studies, and creative deliverables are currently being updated and will be published here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredProjects.map((project) => {
              const videoInfo = getVideoInfo(project.videoUrl);
              const mediaCount = project.mediaItems?.length || (project.videoUrl ? 2 : 1);

              return (
                <div
                  key={project.id}
                  id={`project-card-${project.id}`}
                  onClick={() => onSelectProject(project)}
                  className="group relative bg-[#0e1422] border border-slate-800/80 hover:border-cyan-500/50 rounded-2xl overflow-hidden shadow-xl transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-cyan-500/10 flex flex-col cursor-pointer"
                >
                  {/* Thumbnail / Media Container */}
                  <div className="relative aspect-video overflow-hidden bg-slate-900">
                    <img
                      src={project.thumbnail}
                      alt={project.title}
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0e1422] via-transparent to-black/30 opacity-70 group-hover:opacity-50 transition-opacity" />

                    {/* Top tags */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 z-10">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-black/60 backdrop-blur-md text-cyan-300 border border-cyan-500/30">
                        {project.categoryLabel}
                      </span>

                      {mediaCount > 1 && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-black/70 backdrop-blur-md text-slate-200 border border-slate-700">
                          <FolderOpen className="w-3.5 h-3.5 text-cyan-400" />
                          <span>{mediaCount} Assets</span>
                        </span>
                      )}
                    </div>

                    {/* Video play icon indicator */}
                    {(project.videoUrl || project.category === 'ai-video' || project.category === 'video-editing') && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-12 h-12 rounded-full bg-cyan-500/80 text-white flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-cyan-400 transition-all">
                          <Play className="w-5 h-5 fill-current translate-x-0.5" />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Card Content Body */}
                  <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Client / Context Info */}
                      <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 mb-2">
                        <Building className="w-3.5 h-3.5" />
                        <span>{project.clientOrContext}</span>
                      </div>

                      {/* Project Title */}
                      <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors leading-snug">
                        {project.title}
                      </h3>

                      {/* Project Summary */}
                      <p className="mt-2.5 text-xs sm:text-sm text-slate-300 line-clamp-2 leading-relaxed">
                        {project.summary}
                      </p>
                    </div>

                    {/* Tools / Tech Chips */}
                    <div className="mt-5 pt-4 border-t border-slate-800/80">
                      <div className="flex flex-wrap gap-1.5">
                        {project.toolsUsed.slice(0, 4).map((tool) => (
                          <span
                            key={tool}
                            className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-900 text-slate-300 border border-slate-800"
                          >
                            {tool}
                          </span>
                        ))}
                        {project.toolsUsed.length > 4 && (
                          <span className="px-1.5 py-0.5 rounded text-[11px] font-medium bg-slate-900 text-slate-400 border border-slate-800">
                            +{project.toolsUsed.length - 4}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Bottom Card Footer */}
                  <div className="px-5 sm:px-6 py-3 bg-slate-900/40 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <span className="text-cyan-400 font-semibold group-hover:text-cyan-300 inline-flex items-center gap-1">
                      Open Project Case Study &rarr;
                    </span>
                    <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-colors" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
