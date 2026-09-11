import React from 'react';
import { Briefcase, Calendar, Building, CheckCircle2, ChevronRight } from 'lucide-react';
import { EXPERIENCES } from '../data/portfolioData';

export const ExperienceSection: React.FC = () => {
  return (
    <section id="experience" className="py-20 lg:py-28 relative bg-[#090d15]/85 backdrop-blur-[0.5px] border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Briefcase className="w-3.5 h-3.5" />
            <span>Career History</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Work Experience & Milestones
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300">
            5+ years of verified professional experience navigating high-growth agencies, event powerhouses, tech brands, and modern AI studios.
          </p>
        </div>

        {/* Timeline Component */}
        <div className="relative max-w-4xl mx-auto">
          {/* Vertical Timeline Guide Line */}
          <div className="absolute left-4 sm:left-1/2 top-4 bottom-4 w-0.5 bg-gradient-to-b from-cyan-500 via-blue-500 to-slate-800 -translate-x-1/2 hidden sm:block" />

          <div className="space-y-8 sm:space-y-12">
            {EXPERIENCES.map((exp, index) => {
              const isEven = index % 2 === 0;
              return (
                <div
                  key={exp.id}
                  className={`relative flex flex-col sm:flex-row items-start ${
                    isEven ? 'sm:flex-row-reverse' : ''
                  } gap-6 sm:gap-10`}
                >
                  {/* Central Node Badge */}
                  <div className="hidden sm:flex absolute left-1/2 -translate-x-1/2 top-6 w-8 h-8 rounded-full bg-[#0b0f17] border-2 border-cyan-400 items-center justify-center text-cyan-400 shadow-md shadow-cyan-500/30 z-10">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                  </div>

                  {/* Content Card */}
                  <div className="w-full sm:w-1/2">
                    <div className="p-6 sm:p-7 rounded-2xl bg-[#0e1422] border border-slate-800 hover:border-cyan-500/40 transition-all duration-200 shadow-xl group">
                      {/* Top Header of Card */}
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-950/60 text-cyan-300 border border-cyan-500/20">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{exp.period}</span>
                        </span>

                        {exp.isCurrent ? (
                          <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 uppercase tracking-wider">
                            Current Role
                          </span>
                        ) : (
                          <span className="text-xs text-slate-400 font-medium">
                            {exp.type}
                          </span>
                        )}
                      </div>

                      {/* Job Title & Company */}
                      <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                        {exp.role}
                      </h3>
                      <div className="text-sm font-semibold text-cyan-400 flex items-center gap-1.5 mt-1 mb-4">
                        <Building className="w-4 h-4 text-slate-400" />
                        <span>{exp.company}</span>
                      </div>

                      {/* Highlight metric banner if exists */}
                      {exp.highlightMetric && (
                        <div className="mb-4 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-medium text-slate-300 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                          <span>{exp.highlightMetric}</span>
                        </div>
                      )}

                      {/* Responsibilities list */}
                      <ul className="space-y-2 text-xs sm:text-sm text-slate-300 mb-5">
                        {exp.responsibilities.map((resp, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <ChevronRight className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                            <span>{resp}</span>
                          </li>
                        ))}
                      </ul>

                      {/* Technologies pills */}
                      <div className="pt-4 border-t border-slate-800/80 flex flex-wrap gap-1.5">
                        {exp.technologies.map((tech) => (
                          <span
                            key={tech}
                            className="px-2.5 py-0.5 rounded text-[10px] font-medium bg-slate-900 text-slate-300 border border-slate-800"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Empty spacer for the alternating layout */}
                  <div className="hidden sm:block sm:w-1/2" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
