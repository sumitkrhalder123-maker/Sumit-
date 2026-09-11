import React, { useState } from 'react';
import { Cpu, Search, Sparkles, Video, Palette, CheckCircle2, Layers } from 'lucide-react';
import { SKILLS_LIST } from '../data/portfolioData';

export const SkillsSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'genai' | 'video' | 'design' | 'workflow'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const tabs = [
    { id: 'all', label: 'All Stack', icon: <Layers className="w-4 h-4" /> },
    { id: 'genai', label: 'Generative AI & Prompting', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'video', label: 'Video Production & Motion', icon: <Video className="w-4 h-4" /> },
    { id: 'design', label: 'Graphic Design & Print', icon: <Palette className="w-4 h-4" /> },
    { id: 'workflow', label: 'Workflow & Strategy', icon: <Cpu className="w-4 h-4" /> },
  ];

  const filteredSkills = SKILLS_LIST.filter((skill) => {
    const matchesTab = activeTab === 'all' || skill.category === activeTab;
    const matchesSearch =
      skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skill.experience.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <section id="skills" className="py-20 lg:py-28 relative bg-[#090d15]/85 backdrop-blur-[0.5px] border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Cpu className="w-3.5 h-3.5" />
            <span>Technical Capabilities</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Tools, Technologies & AI Models
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300">
            A specialized toolkit combining generative neural models with industry-standard post-production and design suites.
          </p>
        </div>

        {/* Filters & Search Toolbar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                id={`skill-tab-${tab.id}`}
                className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-150 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20'
                    : 'bg-[#0f1422] text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search tools & models..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              id="skill-search-input"
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#0f1422] border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all"
            />
          </div>
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {filteredSkills.map((skill) => (
            <div
              key={skill.name}
              className={`p-5 rounded-2xl bg-[#0e1320] border transition-all duration-200 flex flex-col justify-between ${
                skill.highlighted
                  ? 'border-slate-800 hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-950/20'
                  : 'border-slate-800/80 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center font-mono font-bold text-xs text-cyan-400">
                      {skill.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-white tracking-tight">
                        {skill.name}
                      </h4>
                      <span className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider">
                        {skill.category === 'genai'
                          ? 'Generative AI'
                          : skill.category === 'video'
                          ? 'Video & Motion'
                          : skill.category === 'design'
                          ? 'Graphic Design'
                          : 'Workflow & Strategy'}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                      skill.level === 'Mastery'
                        ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30'
                        : skill.level === 'Advanced'
                        ? 'bg-blue-500/10 text-blue-300 border-blue-500/30'
                        : 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30'
                    }`}
                  >
                    {skill.level}
                  </span>
                </div>

                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  {skill.experience}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1 text-emerald-400">
                  <CheckCircle2 className="w-3 h-3" />
                  Production Ready
                </span>
                <span className="text-slate-500 font-mono">CV Verified</span>
              </div>
            </div>
          ))}
        </div>

        {filteredSkills.length === 0 && (
          <div className="text-center py-12 text-slate-400">
            No tools found matching "{searchQuery}". Try clearing your search query.
          </div>
        )}
      </div>
    </section>
  );
};
