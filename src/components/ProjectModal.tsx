import React, { useEffect, useState } from 'react';
import {
  X,
  Sparkles,
  CheckCircle2,
  Terminal,
  ArrowRight,
  ExternalLink,
  Play,
  Film,
  Image as ImageIcon,
  Building,
  ChevronLeft,
  ChevronRight,
  FolderOpen,
  Maximize2
} from 'lucide-react';
import { Project, MediaItem } from '../types';
import { getVideoInfo } from '../utils/mediaUtils';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
  onContactClick: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({
  project,
  onClose,
  onContactClick,
}) => {
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [mediaFilter, setMediaFilter] = useState<'all' | 'video' | 'image'>('all');

  // Derive all media assets for this client folder
  const mediaList: MediaItem[] = React.useMemo(() => {
    if (!project) return [];
    if (project.mediaItems && project.mediaItems.length > 0) {
      return project.mediaItems;
    }
    const items: MediaItem[] = [];
    if (project.thumbnail) {
      items.push({
        id: 'default-thumb',
        type: 'image',
        url: project.thumbnail,
        title: project.title,
        isCover: true,
      });
    }
    if (project.videoUrl) {
      items.push({
        id: 'default-vid',
        type: 'video',
        url: project.videoUrl,
        title: 'Project Video',
        isCover: items.length === 0,
      });
    }
    return items;
  }, [project]);

  useEffect(() => {
    setActiveMediaIndex(0);
    setMediaFilter('all');
  }, [project]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' && mediaList.length > 1) {
        setActiveMediaIndex((prev) => (prev + 1) % mediaList.length);
      }
      if (e.key === 'ArrowLeft' && mediaList.length > 1) {
        setActiveMediaIndex((prev) => (prev - 1 + mediaList.length) % mediaList.length);
      }
    };
    if (project) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [project, onClose, mediaList]);

  if (!project) return null;

  const currentMedia = mediaList[activeMediaIndex] || mediaList[0];
  const currentVideoInfo = currentMedia && currentMedia.type === 'video' ? getVideoInfo(currentMedia.url) : null;

  const filteredIndices = mediaList
    .map((item, idx) => ({ item, idx }))
    .filter(({ item }) => mediaFilter === 'all' || item.type === mediaFilter);

  const videoCount = mediaList.filter((m) => m.type === 'video').length;
  const imageCount = mediaList.filter((m) => m.type === 'image').length;

  const handleNext = () => {
    if (mediaList.length > 1) {
      setActiveMediaIndex((prev) => (prev + 1) % mediaList.length);
    }
  };

  const handlePrev = () => {
    if (mediaList.length > 1) {
      setActiveMediaIndex((prev) => (prev - 1 + mediaList.length) % mediaList.length);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-[#0e1320] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-6 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/80 sticky top-0 z-20">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              {project.categoryLabel}
            </span>
            <span className="text-xs text-slate-200 font-semibold flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-cyan-400" />
              {project.clientOrContext}
            </span>
            {mediaList.length > 1 && (
              <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-800 text-cyan-300 border border-slate-700 flex items-center gap-1">
                <FolderOpen className="w-3 h-3 text-cyan-400" />
                {mediaList.length} Assets ({videoCount}v, {imageCount}i)
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
          {/* Main Media Theater Stage */}
          <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-black aspect-video flex items-center justify-center group shadow-xl">
            {currentMedia?.type === 'video' && currentVideoInfo ? (
              currentVideoInfo.isDirect ? (
                <video
                  key={currentMedia.url}
                  src={currentVideoInfo.embedUrl}
                  controls
                  autoPlay
                  className="w-full h-full object-contain"
                />
              ) : (
                <iframe
                  key={currentMedia.url}
                  src={currentVideoInfo.embedUrl}
                  title={currentMedia.title || project.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              )
            ) : (
              <img
                key={currentMedia?.url}
                src={currentMedia?.url || project.thumbnail}
                alt={currentMedia?.title || project.title}
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            )}

            {/* Navigation Arrows for Multiple Assets */}
            {mediaList.length > 1 && (
              <>
                <button
                  onClick={handlePrev}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 flex items-center justify-center transition-all opacity-80 hover:opacity-100 z-10"
                  aria-label="Previous asset"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 flex items-center justify-center transition-all opacity-80 hover:opacity-100 z-10"
                  aria-label="Next asset"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            {/* Stage Title Overlay Banner */}
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-4 flex items-center justify-between text-xs pointer-events-none">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-cyan-500 text-black">
                    {currentMedia?.type === 'video' ? 'Video Asset' : 'Image Asset'}
                  </span>
                  <span className="text-white font-medium drop-shadow">
                    {currentMedia?.title || `Asset ${activeMediaIndex + 1}`}
                  </span>
                </div>
                {currentMedia?.caption && (
                  <p className="text-[11px] text-slate-300 drop-shadow">
                    {currentMedia.caption}
                  </p>
                )}
              </div>

              {mediaList.length > 1 && (
                <div className="px-2 py-1 rounded bg-black/70 text-slate-300 border border-white/10 text-[11px] font-mono">
                  {activeMediaIndex + 1} / {mediaList.length}
                </div>
              )}
            </div>
          </div>

          {/* Client Folder Multi-Asset Thumbnails Strip */}
          {mediaList.length > 1 && (
            <div className="space-y-2.5 p-4 rounded-xl bg-slate-950 border border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <FolderOpen className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Client Folder Gallery ({mediaList.length} items)</span>
                </span>

                {/* Filter Tabs if both videos and images exist */}
                {videoCount > 0 && imageCount > 0 && (
                  <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 text-[10px]">
                    <button
                      onClick={() => setMediaFilter('all')}
                      className={`px-2 py-0.5 rounded ${
                        mediaFilter === 'all'
                          ? 'bg-cyan-500/20 text-cyan-300 font-semibold'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      All ({mediaList.length})
                    </button>
                    <button
                      onClick={() => setMediaFilter('video')}
                      className={`px-2 py-0.5 rounded ${
                        mediaFilter === 'video'
                          ? 'bg-cyan-500/20 text-cyan-300 font-semibold'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Videos ({videoCount})
                    </button>
                    <button
                      onClick={() => setMediaFilter('image')}
                      className={`px-2 py-0.5 rounded ${
                        mediaFilter === 'image'
                          ? 'bg-cyan-500/20 text-cyan-300 font-semibold'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Images ({imageCount})
                    </button>
                  </div>
                )}
              </div>

              {/* Scrollable Thumbnails Carousel */}
              <div className="flex gap-2.5 overflow-x-auto pb-1 pt-0.5 scrollbar-thin">
                {filteredIndices.map(({ item, idx }) => (
                  <button
                    key={item.id || idx}
                    onClick={() => setActiveMediaIndex(idx)}
                    className={`relative shrink-0 w-24 sm:w-28 aspect-video rounded-lg overflow-hidden border transition-all text-left group cursor-pointer ${
                      activeMediaIndex === idx
                        ? 'border-cyan-400 ring-2 ring-cyan-500/50 scale-105 shadow-md shadow-cyan-500/20'
                        : 'border-slate-800 opacity-70 hover:opacity-100 hover:border-slate-700'
                    }`}
                  >
                    {item.type === 'video' ? (
                      <div className="w-full h-full bg-slate-900 flex items-center justify-center relative">
                        <Play className="w-5 h-5 text-cyan-400 fill-cyan-400/30" />
                        <span className="absolute bottom-1 right-1 text-[8px] bg-black/80 text-cyan-300 px-1 rounded">
                          Video
                        </span>
                      </div>
                    ) : (
                      <img
                        src={item.url}
                        alt={item.title || `Asset ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    )}

                    {item.isCover && (
                      <span className="absolute top-1 left-1 w-2 h-2 rounded-full bg-amber-400 ring-1 ring-black" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Campaign Details & Scope */}
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
              {project.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {project.summary}
            </p>
          </div>

          {/* External Live Link if provided */}
          {project.externalLink && (
            <div className="p-3.5 rounded-xl bg-cyan-950/20 border border-cyan-500/30 flex items-center justify-between gap-3">
              <div className="text-xs text-slate-300">
                <span className="font-semibold text-cyan-300">Live Client Showcase:</span> View full high-resolution project on official channel
              </div>
              <a
                href={project.externalLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-cyan-500 text-white hover:bg-cyan-400 shrink-0 transition-colors"
              >
                <span>Open Project</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}

          {/* Tools Used */}
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
              Technologies & AI Tools
            </span>
            <div className="flex flex-wrap gap-2">
              {project.toolsUsed.map((tool) => (
                <span
                  key={tool}
                  className="px-3 py-1 rounded-lg text-xs font-medium bg-slate-800 text-slate-200 border border-slate-700"
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>

          {/* Prompt Engineering Insight if available */}
          {project.promptSnippet && (
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80">
              <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 mb-2">
                <Terminal className="w-4 h-4" />
                <span>Prompt Architecture & Generation Recipe</span>
              </div>
              <p className="font-mono text-xs text-slate-300 bg-slate-900/80 p-3 rounded-lg border border-slate-800 select-all whitespace-pre-wrap">
                "{project.promptSnippet}"
              </p>
            </div>
          )}

          {/* Production Workflow */}
          {project.workflow && project.workflow.length > 0 && (
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-3">
                Production Workflow & Execution
              </span>
              <div className="space-y-2.5">
                {project.workflow.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-300">
                    <div className="w-5 h-5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 flex items-center justify-center font-mono text-[10px] shrink-0 mt-0.5">
                      {idx + 1}
                    </div>
                    <span className="leading-relaxed">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Deliverables & Client Impact */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {project.deliverables && project.deliverables.length > 0 && (
              <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2.5">
                  Client Deliverables
                </span>
                <ul className="space-y-2">
                  {project.deliverables.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-xs sm:text-sm text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {project.metrics && (
              <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/20 flex flex-col justify-center">
                <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider block mb-1">
                  Client Impact & Results
                </span>
                <p className="text-sm font-semibold text-white">
                  {project.metrics}
                </p>
              </div>
            )}
          </div>

          {/* Footer Call to Action */}
          <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-400 text-center sm:text-left">
              Interested in similar creative video and AI production for your brand?
            </div>
            <button
              onClick={() => {
                onClose();
                onContactClick();
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-md shadow-cyan-500/20 transition-all cursor-pointer"
            >
              <span>Work With Sumit</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
