import React from 'react';
import { Sparkles, ArrowRight, FileText, Phone, Mail, MapPin, Play, CheckCircle2, Award, Zap, Users } from 'lucide-react';
import { PERSONAL_INFO, ACHIEVEMENTS } from '../data/portfolioData';

interface HeroProps {
  onOpenResume: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenResume }) => {
  return (
    <section
      id="hero"
      className="relative min-h-screen pt-28 pb-16 lg:pt-36 lg:pb-24 flex flex-col justify-center overflow-hidden"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[800px] h-[400px] bg-gradient-to-tr from-cyan-500/10 via-blue-600/10 to-indigo-500/10 blur-[130px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-600/5 blur-[90px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-blue-600/5 blur-[100px] rounded-full pointer-events-none -z-10" />

      {/* Grid overlay subtle texture */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none -z-10"
        style={{
          backgroundImage: `radial-gradient(circle, #38bdf8 1px, transparent 1px)`,
          backgroundSize: '32px 32px'
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Main Hero Copy */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Tag Badge */}
            <div
              id="hero-badge"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/30 text-cyan-300 text-xs font-medium mb-6 shadow-sm shadow-cyan-500/10"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>AI Generalist & Video Creative Specialist</span>
            </div>

            {/* Main Headline */}
            <h1
              id="hero-headline"
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1] mb-5"
            >
              Hi, I'm <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 bg-clip-text text-transparent">{PERSONAL_INFO.name}</span>
            </h1>

            {/* Sub-headline / Roles banner */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-6">
              {PERSONAL_INFO.titles.map((title, idx) => (
                <span
                  key={title}
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-800/80 text-slate-200 border border-slate-700/80"
                >
                  {title}
                </span>
              ))}
            </div>

            {/* Summary description */}
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl font-normal leading-relaxed mb-8">
              Pioneering modern visual storytelling with cutting-edge <strong>Generative AI workflows</strong> (Midjourney, Flux, Kling, Veo 3, ComfyUI) paired with high-precision <strong>post-production video editing</strong> (Premiere Pro, DaVinci Resolve) and strategic <strong>social media brand acceleration</strong>.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-10 w-full sm:w-auto">
              <a
                href="#portfolio"
                id="hero-explore-work-cta"
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all focus:outline-none focus:ring-2 focus:ring-cyan-400"
              >
                <span>Explore Portfolio</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <button
                onClick={onOpenResume}
                id="hero-resume-btn"
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-sm font-semibold text-slate-200 bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 hover:border-slate-600 transition-all focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
              >
                <FileText className="w-4 h-4 text-cyan-400" />
                <span>View Full CV</span>
              </button>

              <a
                href="#contact"
                id="hero-contact-btn"
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/50 transition-all"
              >
                <span>Get In Touch</span>
              </a>
            </div>

            {/* Quick Contact Chips */}
            <div className="flex flex-wrap items-center gap-y-2 gap-x-4 pt-6 border-t border-slate-800/80 text-xs text-slate-400">
              <a
                href={`mailto:${PERSONAL_INFO.email}`}
                className="inline-flex items-center gap-1.5 hover:text-cyan-400 transition-colors"
                id="hero-chip-email"
              >
                <Mail className="w-3.5 h-3.5 text-cyan-400" />
                <span>{PERSONAL_INFO.email}</span>
              </a>
              <span className="text-slate-700">•</span>
              <a
                href={`tel:${PERSONAL_INFO.phone}`}
                className="inline-flex items-center gap-1.5 hover:text-cyan-400 transition-colors"
                id="hero-chip-phone"
              >
                <Phone className="w-3.5 h-3.5 text-cyan-400" />
                <span>{PERSONAL_INFO.phone}</span>
              </a>
              <span className="text-slate-700">•</span>
              <span className="inline-flex items-center gap-1.5" id="hero-chip-location">
                <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                <span>{PERSONAL_INFO.location}</span>
              </span>
            </div>
          </div>

          {/* Right Visual / Creative Card & Live Stack Showcase */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md">
              {/* Outer decorative glow */}
              <div className="absolute -inset-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-3xl blur-md opacity-30 group-hover:opacity-60 transition duration-1000 -z-10" />

              <div className="relative bg-[#0e131f] border border-slate-800 rounded-2xl p-6 sm:p-7 shadow-2xl overflow-hidden">
                {/* Profile Header within Card */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center text-white font-extrabold text-2xl shadow-md shadow-cyan-500/30">
                      SK
                    </div>
                    <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-[#0e131f] shadow" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{PERSONAL_INFO.name}</h3>
                    <p className="text-xs text-cyan-400 font-medium">{PERSONAL_INFO.currentHeadline}</p>
                    <div className="flex items-center gap-1.5 mt-1 text-[11px] text-slate-400">
                      <MapPin className="w-3 h-3 text-slate-500" />
                      <span>Dum Dum, Kolkata, India</span>
                    </div>
                  </div>
                </div>

                {/* Current Active Role */}
                <div className="mb-5 p-3.5 rounded-xl bg-slate-900/90 border border-slate-800">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-400">Current Role</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                      Active
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-white">Gen AI Artist @ Grapes Worldwide</p>
                  <p className="text-xs text-slate-400 mt-1">
                    AI Image & Video Generation • Prompt Engineering • Video Edit
                  </p>
                </div>

                {/* Core Toolkit Pills */}
                <div className="mb-6">
                  <span className="text-xs font-medium text-slate-400 block mb-2">Featured Core Stack</span>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                      <span className="text-slate-200 font-medium">Midjourney & Flux</span>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                      <span className="text-slate-200 font-medium">Kling & Veo 3</span>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
                      <span className="text-slate-200 font-medium">Premiere & DaVinci</span>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-violet-400"></span>
                      <span className="text-slate-200 font-medium">ComfyUI & Nodes</span>
                    </div>
                  </div>
                </div>

                {/* Quick Impact Highlight */}
                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-emerald-400">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Exceeded design targets by 30%</span>
                  </div>
                  <a
                    href="#experience"
                    className="text-cyan-400 hover:text-cyan-300 font-medium text-xs flex items-center gap-1"
                  >
                    Details &rarr;
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Metric Counters Grid (from CV Achievements) */}
        <div className="mt-16 pt-10 border-t border-slate-800/60 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {ACHIEVEMENTS.map((ach) => (
            <div
              key={ach.id}
              className="p-5 rounded-2xl bg-[#0f1523]/60 border border-slate-800/80 hover:border-slate-700 transition-all group"
            >
              <div className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-transparent bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text mb-1">
                {ach.metric}
              </div>
              <div className="text-sm font-semibold text-white group-hover:text-cyan-300 transition-colors">
                {ach.title}
              </div>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                {ach.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
