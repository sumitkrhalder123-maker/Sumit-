import React from 'react';
import { GraduationCap, Award, Calendar, CheckCircle2, TrendingUp, Clock, Zap, Target } from 'lucide-react';
import { EDUCATION_LIST, ACHIEVEMENTS } from '../data/portfolioData';

export const EducationAchievementsSection: React.FC = () => {
  return (
    <section id="education" className="py-20 lg:py-28 relative bg-[#0b0f17]/85 backdrop-blur-[0.5px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Education */}
          <div className="lg:col-span-6 space-y-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-3">
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Academic & Professional Training</span>
              </div>
              <h2 className="text-3xl font-extrabold text-white tracking-tight">
                Education & Credentials
              </h2>
              <p className="mt-2 text-sm text-slate-300">
                Formal grounding in commerce, business administration, and high-end animation/graphics design.
              </p>
            </div>

            <div className="space-y-5">
              {EDUCATION_LIST.map((edu, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-[#0e1422] border border-slate-800 hover:border-slate-700 transition-all shadow-xl group"
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-cyan-950/60 text-cyan-400 border border-cyan-500/20 flex items-center gap-1.5">
                      <Calendar className="w-3 h-3" />
                      <span>{edu.period}</span>
                    </span>
                    <span className="text-[11px] font-mono text-slate-500">Degree & Certification</span>
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors mt-2">
                    {edu.degree}
                  </h3>

                  <p className="text-sm font-semibold text-cyan-400 mt-1 mb-3">
                    {edu.institution}
                  </p>

                  <p className="text-xs text-slate-300 leading-relaxed pt-3 border-t border-slate-800/80">
                    <strong>Focus:</strong> {edu.focus}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Key Achievements */}
          <div className="lg:col-span-6 space-y-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-3">
                <Award className="w-3.5 h-3.5" />
                <span>Documented Milestones</span>
              </div>
              <h2 className="text-3xl font-extrabold text-white tracking-tight">
                Key Career Achievements
              </h2>
              <p className="mt-2 text-sm text-slate-300">
                Verifiable metrics reflecting quantifiable speed, audience expansion, and generative AI production gains.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {ACHIEVEMENTS.map((ach) => (
                <div
                  key={ach.id}
                  className="p-5 rounded-2xl bg-[#0e1422] border border-slate-800 hover:border-cyan-500/40 transition-all shadow-lg flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-semibold text-slate-400">
                        {ach.category}
                      </span>
                      {ach.id === 'ach-1' && <Target className="w-4 h-4 text-cyan-400" />}
                      {ach.id === 'ach-2' && <TrendingUp className="w-4 h-4 text-emerald-400" />}
                      {ach.id === 'ach-3' && <Zap className="w-4 h-4 text-amber-400" />}
                      {ach.id === 'ach-4' && <Clock className="w-4 h-4 text-blue-400" />}
                    </div>

                    <div className="text-3xl font-black text-white mb-2 tracking-tight">
                      <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-400 bg-clip-text text-transparent">
                        {ach.metric}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-white mb-1.5">
                      {ach.title}
                    </h4>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      {ach.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center gap-1.5 text-[11px] text-emerald-400 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Verified Milestone</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
