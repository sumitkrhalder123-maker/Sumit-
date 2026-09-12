import React, { useState, useMemo } from 'react';
import {
  Cpu,
  Search,
  Sparkles,
  Video,
  Palette,
  CheckCircle2,
  Layers,
  Wand2,
  Mic,
  Film,
  Camera,
  Tv,
  Users,
  Compass,
  Code,
  Sliders,
  UserCheck,
  Maximize,
  Music,
  Printer,
  Boxes,
  Flame,
  Zap,
  Volume2
} from 'lucide-react';
import {
  SOFTWARE_TOOLS,
  AI_IMAGE_MODELS,
  AI_VIDEO_MODELS,
  AI_AUDIO_MODELS,
  MY_SKILLS_DATA,
  SoftwareTool,
  AIModelItem,
  ProfessionalSkill
} from '../data/skillsData';

type PillarTab = 'all' | 'software' | 'ai-models' | 'my-skills';
type AIModelSubTab = 'all' | 'image' | 'video' | 'audio';
type SoftwareRoleFilter = 'all' | 'video' | 'motion' | 'graphics' | 'print' | 'genai-workflow';

export const SkillsSection: React.FC = () => {
  const [activePillar, setActivePillar] = useState<PillarTab>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [aiSubTab, setAiSubTab] = useState<AIModelSubTab>('all');
  const [softwareRole, setSoftwareRole] = useState<SoftwareRoleFilter>('all');

  // Search filtering logic
  const query = searchQuery.toLowerCase().trim();

  const filteredSoftware = useMemo(() => {
    return SOFTWARE_TOOLS.filter((item) => {
      const matchesRole = softwareRole === 'all' || item.roleCategory === softwareRole;
      const matchesSearch =
        !query ||
        item.name.toLowerCase().includes(query) ||
        item.roleCategoryLabel.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.features.some((f) => f.toLowerCase().includes(query));
      return matchesRole && matchesSearch;
    });
  }, [softwareRole, query]);

  const filteredImageModels = useMemo(() => {
    return AI_IMAGE_MODELS.filter((item) => {
      return (
        !query ||
        item.name.toLowerCase().includes(query) ||
        item.provider.toLowerCase().includes(query) ||
        item.specialty.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.tags.some((t) => t.toLowerCase().includes(query))
      );
    });
  }, [query]);

  const filteredVideoModels = useMemo(() => {
    return AI_VIDEO_MODELS.filter((item) => {
      return (
        !query ||
        item.name.toLowerCase().includes(query) ||
        item.provider.toLowerCase().includes(query) ||
        item.specialty.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.tags.some((t) => t.toLowerCase().includes(query))
      );
    });
  }, [query]);

  const filteredAudioModels = useMemo(() => {
    return AI_AUDIO_MODELS.filter((item) => {
      return (
        !query ||
        item.name.toLowerCase().includes(query) ||
        item.provider.toLowerCase().includes(query) ||
        item.specialty.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.tags.some((t) => t.toLowerCase().includes(query))
      );
    });
  }, [query]);

  const filteredSkills = useMemo(() => {
    return MY_SKILLS_DATA.filter((skill) => {
      return (
        !query ||
        skill.title.toLowerCase().includes(query) ||
        skill.categoryLabel.toLowerCase().includes(query) ||
        skill.description.toLowerCase().includes(query) ||
        skill.deliverables.some((d) => d.toLowerCase().includes(query))
      );
    });
  }, [query]);

  // Render Skill Icon Helper
  const renderSkillIcon = (iconType: string) => {
    switch (iconType) {
      case 'Palette':
        return <Palette className="w-4 h-4 text-cyan-400" />;
      case 'Video':
        return <Video className="w-4 h-4 text-purple-400" />;
      case 'Camera':
        return <Camera className="w-4 h-4 text-emerald-400" />;
      case 'Sparkles':
        return <Sparkles className="w-4 h-4 text-amber-400" />;
      case 'UserCheck':
        return <UserCheck className="w-4 h-4 text-sky-400" />;
      case 'Layers':
        return <Layers className="w-4 h-4 text-cyan-400" />;
      case 'Film':
        return <Film className="w-4 h-4 text-indigo-400" />;
      case 'Maximize':
        return <Maximize className="w-4 h-4 text-emerald-400" />;
      case 'Tv':
        return <Tv className="w-4 h-4 text-blue-400" />;
      case 'Users':
        return <Users className="w-4 h-4 text-pink-400" />;
      case 'Compass':
        return <Compass className="w-4 h-4 text-amber-400" />;
      case 'Mic':
        return <Mic className="w-4 h-4 text-teal-400" />;
      case 'Code':
        return <Code className="w-4 h-4 text-violet-400" />;
      case 'Sliders':
        return <Sliders className="w-4 h-4 text-rose-400" />;
      default:
        return <Sparkles className="w-4 h-4 text-cyan-400" />;
    }
  };

  return (
    <section id="skills" className="py-20 lg:py-28 relative bg-[#090d15]/90 backdrop-blur-sm border-t border-slate-800/80">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full max-w-5xl h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-900 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-3 shadow-lg shadow-cyan-950/20">
            <Cpu className="w-3.5 h-3.5" />
            <span>3-Part Differentiated Arsenal</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Software, AI Models & Professional Skills
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-300">
            A comprehensive ecosystem organized into three distinct operational pillars: Industry Post-Production Suites, Advanced Generative AI Models, and High-Impact Creative Services.
          </p>
        </div>

        {/* Primary Pillar Navigation & Global Search */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10 pb-6 border-b border-slate-800/80">
          {/* 3 Pillar Selector Tabs */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <button
              type="button"
              onClick={() => setActivePillar('all')}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activePillar === 'all'
                  ? 'bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20'
                  : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800'
              }`}
            >
              <Boxes className="w-4 h-4" />
              <span>All 3 Pillars</span>
            </button>

            <button
              type="button"
              onClick={() => setActivePillar('software')}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activePillar === 'software'
                  ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-lg shadow-purple-500/20'
                  : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800'
              }`}
            >
              <Video className="w-4 h-4 text-purple-400" />
              <span>Part 1: Software</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-500/30">
                {SOFTWARE_TOOLS.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActivePillar('ai-models')}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activePillar === 'ai-models'
                  ? 'bg-gradient-to-r from-cyan-500 to-teal-600 text-white shadow-lg shadow-cyan-500/20'
                  : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800'
              }`}
            >
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Part 2: AI Tools & Models</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                {AI_IMAGE_MODELS.length + AI_VIDEO_MODELS.length + AI_AUDIO_MODELS.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActivePillar('my-skills')}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activePillar === 'my-skills'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/20'
                  : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800'
              }`}
            >
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Part 3: My Skills</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-500/30">
                {MY_SKILLS_DATA.length}
              </span>
            </button>
          </div>

          {/* Quick Search */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search software, AI models, skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
            />
          </div>
        </div>

        {/* ============================================================== */}
        {/* PILLAR 1: SOFTWARE (Separated by Role: Video, Motion, Graphic, Print, GenAI) */}
        {/* ============================================================== */}
        {(activePillar === 'all' || activePillar === 'software') && (
          <div className="mb-16">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-500/10 text-purple-300 border border-purple-500/30">
                    PILLAR 01
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                    <span>Professional Software Suite</span>
                  </h3>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Categorized and separated strictly by role: Video Editing, Motion VFX, Graphic Design, Print & Publication, and GenAI Node Pipelines.
                </p>
              </div>

              {/* Role Sub-Filter */}
              <div className="flex flex-wrap items-center gap-1.5">
                {[
                  { id: 'all', label: 'All Roles' },
                  { id: 'video', label: 'Video Editing' },
                  { id: 'motion', label: 'Motion & VFX' },
                  { id: 'graphics', label: 'Graphic Design' },
                  { id: 'print', label: 'Print Media' },
                  { id: 'genai-workflow', label: 'AI Nodes' }
                ].map((rf) => (
                  <button
                    key={rf.id}
                    type="button"
                    onClick={() => setSoftwareRole(rf.id as any)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                      softwareRole === rf.id
                        ? 'bg-purple-600 text-white font-bold'
                        : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {rf.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Software Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {filteredSoftware.map((tool) => (
                <div
                  key={tool.name}
                  className="p-5 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-slate-800 hover:border-purple-500/50 hover:shadow-xl hover:shadow-purple-950/20 transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 font-mono">
                          {tool.roleCategoryLabel}
                        </span>
                        <h4 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors mt-0.5">
                          {tool.name}
                        </h4>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/10 text-purple-300 border border-purple-500/30">
                        {tool.level}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed mb-4">
                      {tool.description}
                    </p>

                    {/* Features Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {tool.features.map((feat) => (
                        <span
                          key={feat}
                          className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-950 text-slate-300 border border-slate-800"
                        >
                          {feat}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Commercial Production Master</span>
                    </span>
                    <span className="text-slate-400 font-mono text-[10px]">{tool.badge}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* PILLAR 2: AI TOOLS & MODELS (Image, Video, Audio) */}
        {/* ============================================================== */}
        {(activePillar === 'all' || activePillar === 'ai-models') && (
          <div className="mb-16">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                    PILLAR 02
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                    <span>Generative AI Tools & Model Ecosystem</span>
                  </h3>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Full ecosystem breakdown by modality: Image Generation, Video Generation, and Voice-Over / Music / SFX Models.
                </p>
              </div>

              {/* Sub-Tabs: Image, Video, Audio */}
              <div className="flex items-center gap-1.5 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => setAiSubTab('all')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                    aiSubTab === 'all'
                      ? 'bg-cyan-500 text-black font-bold shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  All Modalities
                </button>
                <button
                  type="button"
                  onClick={() => setAiSubTab('image')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                    aiSubTab === 'image'
                      ? 'bg-cyan-500 text-black font-bold shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Palette className="w-3 h-3" />
                  <span>Image ({AI_IMAGE_MODELS.length})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setAiSubTab('video')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                    aiSubTab === 'video'
                      ? 'bg-cyan-500 text-black font-bold shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Film className="w-3 h-3" />
                  <span>Video ({AI_VIDEO_MODELS.length})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setAiSubTab('audio')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                    aiSubTab === 'audio'
                      ? 'bg-cyan-500 text-black font-bold shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Volume2 className="w-3 h-3" />
                  <span>Audio & Voice ({AI_AUDIO_MODELS.length})</span>
                </button>
              </div>
            </div>

            {/* Sub-Category 1: Image Generation Models */}
            {(aiSubTab === 'all' || aiSubTab === 'image') && (
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-3 px-1">
                  <Palette className="w-4 h-4 text-cyan-400" />
                  <h4 className="text-base font-bold text-white">Image Generation Models</h4>
                  <span className="text-xs text-slate-400 font-mono">({filteredImageModels.length} providers)</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  {filteredImageModels.map((item) => (
                    <div
                      key={item.name}
                      className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-cyan-500/40 hover:bg-slate-900 transition flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="font-bold text-sm text-white flex items-center gap-1.5">
                            <span>{item.name}</span>
                          </div>
                          {item.modelsCount && (
                            <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-500/30">
                              {item.modelsCount}
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] font-semibold text-cyan-400 line-clamp-1 mb-1">
                          {item.specialty}
                        </div>
                        <p className="text-[11px] text-slate-300 leading-relaxed mb-3">
                          {item.description}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-1 pt-2 border-t border-slate-800/80">
                        {item.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-1.5 py-0.5 rounded text-[9px] font-medium bg-slate-950 text-slate-400"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sub-Category 2: Video Generation Models */}
            {(aiSubTab === 'all' || aiSubTab === 'video') && (
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-3 px-1">
                  <Film className="w-4 h-4 text-purple-400" />
                  <h4 className="text-base font-bold text-white">Video Generation Models</h4>
                  <span className="text-xs text-slate-400 font-mono">({filteredVideoModels.length} engines)</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  {filteredVideoModels.map((item) => (
                    <div
                      key={item.name}
                      className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-purple-500/40 hover:bg-slate-900 transition flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="font-bold text-sm text-white flex items-center gap-1.5">
                            <span>{item.name}</span>
                          </div>
                          {item.modelsCount && (
                            <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-purple-950/80 text-purple-300 border border-purple-500/30">
                              {item.modelsCount}
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] font-semibold text-purple-400 line-clamp-1 mb-1">
                          {item.specialty}
                        </div>
                        <p className="text-[11px] text-slate-300 leading-relaxed mb-3">
                          {item.description}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-1 pt-2 border-t border-slate-800/80">
                        {item.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-1.5 py-0.5 rounded text-[9px] font-medium bg-slate-950 text-slate-400"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sub-Category 3: Voice-Over / Music / SFX Models */}
            {(aiSubTab === 'all' || aiSubTab === 'audio') && (
              <div>
                <div className="flex items-center gap-2 mb-3 px-1">
                  <Volume2 className="w-4 h-4 text-emerald-400" />
                  <h4 className="text-base font-bold text-white">Voice-Over, Music & SFX Models</h4>
                  <span className="text-xs text-slate-400 font-mono">({filteredAudioModels.length} audio systems)</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  {filteredAudioModels.map((item) => (
                    <div
                      key={item.name}
                      className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-emerald-500/40 hover:bg-slate-900 transition flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="font-bold text-sm text-white flex items-center gap-1.5">
                            <span>{item.name}</span>
                          </div>
                          {item.isNew && (
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-600 text-white uppercase tracking-wider">
                              NEW
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] font-semibold text-emerald-400 line-clamp-1 mb-1">
                          {item.specialty}
                        </div>
                        <p className="text-[11px] text-slate-300 leading-relaxed mb-3">
                          {item.description}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-1 pt-2 border-t border-slate-800/80">
                        {item.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-1.5 py-0.5 rounded text-[9px] font-medium bg-slate-950 text-slate-400"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* PILLAR 3: MY SKILLS (Creative & Technical Capabilities) */}
        {/* ============================================================== */}
        {(activePillar === 'all' || activePillar === 'my-skills') && (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30">
                    PILLAR 03
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                    <span>My Professional Skills & Creative Capabilities</span>
                  </h3>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Full commercial scope across Graphic Design, Video Editing, AI Product Photography, UGC Ads, Character Generation, and Art Direction.
                </p>
              </div>

              <div className="text-xs text-slate-400 font-mono">
                {filteredSkills.length} SPECIALIZED DISCIPLINES
              </div>
            </div>

            {/* Skills Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {filteredSkills.map((skill) => (
                <div
                  key={skill.id}
                  className="p-5 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-slate-800 hover:border-amber-500/50 hover:shadow-xl hover:shadow-amber-950/20 transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center">
                          {renderSkillIcon(skill.iconType)}
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                            {skill.categoryLabel}
                          </span>
                          <h4 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
                            {skill.title}
                          </h4>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-mono font-bold text-amber-400">
                          {skill.proficiency}%
                        </span>
                        <div className="w-12 h-1 bg-slate-800 rounded-full mt-1 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full"
                            style={{ width: `${skill.proficiency}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed mb-4">
                      {skill.description}
                    </p>

                    {/* Deliverables Checklist */}
                    <div className="space-y-1.5 mb-3 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                        Key Deliverables & Outputs:
                      </span>
                      {skill.deliverables.map((deliv) => (
                        <div key={deliv} className="flex items-center gap-1.5 text-[11px] text-slate-300">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                          <span>{deliv}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                    <span className="text-emerald-400 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Ready for Client Projects</span>
                    </span>
                    <span className="text-slate-400 font-mono text-[10px]">Verified Mastery</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty Search State */}
        {filteredSoftware.length === 0 &&
          filteredImageModels.length === 0 &&
          filteredVideoModels.length === 0 &&
          filteredAudioModels.length === 0 &&
          filteredSkills.length === 0 && (
            <div className="text-center py-16 text-slate-400 bg-slate-900/40 rounded-2xl border border-slate-800">
              <div className="w-12 h-12 rounded-full bg-slate-800 mx-auto flex items-center justify-center text-slate-400 mb-3">
                <Search className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-white">No tools or skills match "{searchQuery}"</h4>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                Try searching for a different keyword like &ldquo;Premiere&rdquo;, &ldquo;Flux&rdquo;, &ldquo;Kling&rdquo;, &ldquo;ElevenLabs&rdquo;, or &ldquo;UGC&rdquo;.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setActivePillar('all');
                  setSoftwareRole('all');
                  setAiSubTab('all');
                }}
                className="mt-4 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-bold transition"
              >
                Clear Search & Reset Filters
              </button>
            </div>
          )}
      </div>
    </section>
  );
};
