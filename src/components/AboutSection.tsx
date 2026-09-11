import React from 'react';
import { User, Sparkles, Video, Palette, TrendingUp, Globe2, Check, Calendar, MapPin, Mail, Phone } from 'lucide-react';
import { PERSONAL_INFO, LANGUAGES } from '../data/portfolioData';

export const AboutSection: React.FC = () => {
  const pillars = [
    {
      icon: <Sparkles className="w-5 h-5 text-cyan-400" />,
      title: 'Gen AI & Prompt Engineering',
      desc: 'Expertise in high-level diffusion models including Midjourney, Flux, Kling, Veo 3, and node-based ComfyUI architectures.'
    },
    {
      icon: <Video className="w-5 h-5 text-blue-400" />,
      title: 'Cinematic Video Editing',
      desc: 'Mastery over Adobe Premiere Pro, DaVinci Resolve, and After Effects for commercial ads, YouTube tech hardware reels, and dynamic motion.'
    },
    {
      icon: <Palette className="w-5 h-5 text-indigo-400" />,
      title: 'Graphic Design & Key Visuals',
      desc: 'Deep roots in Photoshop, Illustrator, and InDesign for large-scale event staging, typography, print collateral, and social identity.'
    },
    {
      icon: <TrendingUp className="w-5 h-5 text-emerald-400" />,
      title: 'Social Growth & Administration',
      desc: 'Proven track record managing and expanding brand accounts to 10,000+ followers with disciplined time management and delivery speed.'
    }
  ];

  return (
    <section id="about" className="py-20 lg:py-28 relative bg-[#0b0f17]/85 backdrop-blur-[0.5px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <User className="w-3.5 h-3.5" />
            <span>About Me</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Bridging Creative Artistry with Next-Gen Artificial Intelligence
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300">
            Dedicated Graphics Designer, AI Expert, and Video Editor based in Dum Dum, India.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Personal Narrative & Details */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-[#0e1422] border border-slate-800/90 rounded-2xl p-6 sm:p-8 shadow-xl">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span>Professional Overview</span>
              </h3>
              
              <div className="prose prose-invert text-slate-300 space-y-4 text-sm sm:text-base leading-relaxed">
                <p>
                  I am a dedicated <strong>Graphics Designer and AI Expert</strong> with a solid background in multimedia design, video production, and office administration. With extensive experience in data entry and social media management, I showcase my technical and creative skills daily in fast-paced professional environments.
                </p>
                <p>
                  Over the past five years, I have continually pushed creative boundaries—transitioning from traditional vector graphic design and video editing to leading <strong>Generative AI initiatives</strong> at Grapes Worldwide. My daily workflows involve synthesizing commercial concepts with Midjourney and Flux, orchestrating dynamic camera motion with Kling and Veo 3, and polishing deliverables in Premiere Pro and DaVinci Resolve.
                </p>
                <p className="text-slate-400 text-sm">
                  My goal is to contribute effectively to team success while enhancing technical skills for continuous personal and professional growth.
                </p>
              </div>

              {/* Key Personal Details Chips */}
              <div className="mt-8 pt-6 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-slate-500 block mb-1">Location</span>
                  <span className="font-semibold text-slate-200 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                    Dum Dum, India
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block mb-1">Date of Birth</span>
                  <span className="font-semibold text-slate-200 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                    17 / 04 / 2000
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block mb-1">Status</span>
                  <span className="font-semibold text-emerald-400 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    Available for hire
                  </span>
                </div>
              </div>
            </div>

            {/* Language Proficiency Card (Verbatim from CV) */}
            <div className="bg-[#0e1422] border border-slate-800/90 rounded-2xl p-6 sm:p-7 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Globe2 className="w-4 h-4 text-cyan-400" />
                  <span>Language Proficiency</span>
                </h3>
                <span className="text-xs text-slate-400">Fluency rating from CV</span>
              </div>

              <div className="space-y-4">
                {LANGUAGES.map((lang) => (
                  <div key={lang.name} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                    <div>
                      <span className="text-sm font-semibold text-white">{lang.name}</span>
                      <span className="text-xs text-cyan-400 ml-2 font-medium">({lang.proficiency})</span>
                      {lang.note && <p className="text-[11px] text-slate-400 mt-0.5">{lang.note}</p>}
                    </div>

                    {/* Visual 5-Dot Indicator matching the CV */}
                    <div className="flex items-center gap-1.5 self-start sm:self-center" title={`${lang.dots} out of 5`}>
                      {[1, 2, 3, 4, 5].map((dot) => {
                        const isFilled = dot <= lang.dots;
                        return (
                          <div
                            key={dot}
                            className={`w-3.5 h-3.5 rounded-full transition-all ${
                              isFilled
                                ? 'bg-gradient-to-r from-cyan-400 to-blue-500 shadow-sm shadow-cyan-500/50'
                                : 'bg-slate-800 border border-slate-700'
                            }`}
                          />
                        );
                      })}
                      <span className="text-xs font-mono text-slate-400 ml-2">{lang.dots}/5</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: 4 Strategic Pillars */}
          <div className="lg:col-span-5 space-y-4">
            <h3 className="text-lg font-bold text-white mb-2">Core Competencies</h3>
            {pillars.map((pillar, idx) => (
              <div
                key={pillar.title}
                className="p-5 rounded-2xl bg-[#0e1422] border border-slate-800/90 hover:border-cyan-500/40 transition-all hover:translate-x-1 duration-200 group"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 group-hover:border-cyan-500/30 transition-colors shrink-0">
                    {pillar.icon}
                  </div>
                  <div>
                    <h4 className="text-base font-semibold text-white group-hover:text-cyan-300 transition-colors">
                      {pillar.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-400 mt-1 leading-relaxed">
                      {pillar.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {/* Quick Contact Box */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-cyan-950/30 via-slate-900 to-blue-950/30 border border-cyan-500/20 text-xs text-slate-300 space-y-2">
              <div className="font-semibold text-cyan-300 text-sm">Need multimedia or Gen AI collaboration?</div>
              <p className="text-slate-400">
                Directly available for remote full-time contracts or freelance productions.
              </p>
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <a
                  href={`mailto:${PERSONAL_INFO.email}`}
                  className="px-3 py-1.5 rounded-lg bg-cyan-500 text-slate-950 font-bold hover:bg-cyan-400 transition-colors inline-flex items-center gap-1.5"
                >
                  <Mail className="w-3.5 h-3.5" />
                  Email Sumit
                </a>
                <a
                  href={`tel:${PERSONAL_INFO.phone}`}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 transition-colors inline-flex items-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5 text-cyan-400" />
                  Call Directly
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
