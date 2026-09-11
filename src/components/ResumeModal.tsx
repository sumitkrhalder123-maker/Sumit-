import React, { useEffect } from 'react';
import { X, Printer, Download, Mail, Phone, MapPin, Calendar, Check, ExternalLink, Copy } from 'lucide-react';
import { PERSONAL_INFO, EXPERIENCES, EDUCATION_LIST, ACHIEVEMENTS, LANGUAGES, SKILLS_LIST } from '../data/portfolioData';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ResumeModal: React.FC<ResumeModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = React.useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyContact = () => {
    navigator.clipboard.writeText(
      `Sumit Kumer Halder - AI Generalist & Video Editor\nEmail: ${PERSONAL_INFO.email}\nPhone: ${PERSONAL_INFO.phone}\nLocation: ${PERSONAL_INFO.location}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto bg-black/85 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-[#0c101a] text-slate-100 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-4 max-h-[95vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Floating Action Bar */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-slate-800 bg-slate-900/90 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <span className="font-bold text-sm text-white">Curriculum Vitae</span>
            <span className="text-xs text-slate-400 hidden sm:inline">• Sumit Kumer Halder</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyContact}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Info'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-white transition-colors shadow-sm"
              title="Print or Save as PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ml-1"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* CV Document Container */}
        <div className="p-6 sm:p-10 overflow-y-auto space-y-8 bg-[#0c101a]">
          {/* Header Section */}
          <div className="border-b border-slate-800 pb-6 flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight uppercase">
                {PERSONAL_INFO.name}
              </h1>
              <p className="text-base sm:text-lg font-semibold text-cyan-400 mt-1">
                AI Generalist | Video Editor | AI Graphic Designer | Prompt Engineering
              </p>

              {/* Contact metadata row */}
              <div className="flex flex-wrap items-center gap-y-2 gap-x-5 mt-4 text-xs text-slate-300">
                <a href={`tel:${PERSONAL_INFO.phone}`} className="flex items-center gap-1.5 hover:text-cyan-300">
                  <Phone className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{PERSONAL_INFO.phone}</span>
                </a>
                <a href={`mailto:${PERSONAL_INFO.email}`} className="flex items-center gap-1.5 hover:text-cyan-300">
                  <Mail className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{PERSONAL_INFO.email}</span>
                </a>
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{PERSONAL_INFO.location}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                  <span>DOB: {PERSONAL_INFO.dob}</span>
                </span>
              </div>
            </div>

            {/* Avatar representation badge */}
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 p-1 flex-shrink-0 self-start">
              <div className="w-full h-full rounded-xl bg-[#0b0f17] flex items-center justify-center font-black text-2xl sm:text-3xl text-cyan-400 border border-cyan-500/30">
                SKH
              </div>
            </div>
          </div>

          {/* Two-Column CV Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column (7 cols): Summary, Experience, Education */}
            <div className="lg:col-span-7 space-y-7">
              {/* Summary */}
              <div>
                <h2 className="text-xs font-black tracking-widest text-cyan-400 uppercase mb-2">
                  Summary
                </h2>
                <div className="h-0.5 w-12 bg-cyan-500 mb-3" />
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-900/40 p-4 rounded-xl border border-slate-800">
                  {PERSONAL_INFO.bio}
                </p>
              </div>

              {/* Experience */}
              <div>
                <h2 className="text-xs font-black tracking-widest text-cyan-400 uppercase mb-2">
                  Experience
                </h2>
                <div className="h-0.5 w-12 bg-cyan-500 mb-4" />

                <div className="space-y-5">
                  {EXPERIENCES.map((exp) => (
                    <div key={exp.id} className="relative pl-4 border-l-2 border-cyan-500/40">
                      <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-cyan-400" />
                      <div className="flex flex-wrap items-center justify-between gap-1">
                        <h3 className="text-sm font-bold text-white">{exp.role}</h3>
                        <span className="text-[11px] font-mono text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/20">
                          {exp.period}
                        </span>
                      </div>
                      <div className="text-xs font-semibold text-slate-300 mb-2">
                        {exp.company}
                      </div>
                      <ul className="space-y-1 text-xs text-slate-400">
                        {exp.responsibilities.map((r, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="text-cyan-400">•</span>
                            <span>{r}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Education */}
              <div>
                <h2 className="text-xs font-black tracking-widest text-cyan-400 uppercase mb-2">
                  Education
                </h2>
                <div className="h-0.5 w-12 bg-cyan-500 mb-4" />

                <div className="space-y-3">
                  {EDUCATION_LIST.map((edu, idx) => (
                    <div key={idx} className="bg-slate-900/40 p-3.5 rounded-xl border border-slate-800">
                      <div className="flex justify-between items-center text-xs">
                        <h3 className="font-bold text-white">{edu.degree}</h3>
                        <span className="text-[11px] font-mono text-slate-400">{edu.period}</span>
                      </div>
                      <p className="text-xs text-cyan-400 font-medium mt-0.5">{edu.institution}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column (5 cols): Key Achievements, Languages, Skills */}
            <div className="lg:col-span-5 space-y-7">
              {/* Key Achievements */}
              <div>
                <h2 className="text-xs font-black tracking-widest text-cyan-400 uppercase mb-2">
                  Key Achievements
                </h2>
                <div className="h-0.5 w-12 bg-cyan-500 mb-4" />

                <div className="space-y-3">
                  {ACHIEVEMENTS.map((ach) => (
                    <div key={ach.id} className="p-3 rounded-xl bg-slate-900/50 border border-slate-800">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-white">{ach.title}</span>
                        <span className="text-xs font-extrabold text-cyan-400">{ach.metric}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        {ach.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Languages */}
              <div>
                <h2 className="text-xs font-black tracking-widest text-cyan-400 uppercase mb-2">
                  Languages
                </h2>
                <div className="h-0.5 w-12 bg-cyan-500 mb-4" />

                <div className="space-y-2.5">
                  {LANGUAGES.map((lang) => (
                    <div key={lang.name} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/40 border border-slate-800/80">
                      <div>
                        <span className="text-xs font-bold text-white">{lang.name}</span>
                        <span className="text-[10px] text-slate-400 ml-1.5 font-mono">({lang.proficiency})</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {[1, 2, 3, 4, 5].map((dot) => (
                          <div
                            key={dot}
                            className={`w-2.5 h-2.5 rounded-full ${
                              dot <= lang.dots ? 'bg-cyan-400' : 'bg-slate-800'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Technical Skills List */}
              <div>
                <h2 className="text-xs font-black tracking-widest text-cyan-400 uppercase mb-2">
                  Skills & Tools
                </h2>
                <div className="h-0.5 w-12 bg-cyan-500 mb-4" />

                <div className="grid grid-cols-2 gap-2 text-xs">
                  {SKILLS_LIST.map((s) => (
                    <div
                      key={s.name}
                      className="p-2 rounded-lg bg-slate-900/70 border border-slate-800 font-medium text-slate-200 flex items-center justify-between"
                    >
                      <span className="truncate">{s.name}</span>
                      <span className="text-[9px] px-1 py-0.5 rounded bg-slate-800 text-cyan-300 font-mono">
                        {s.level.substring(0, 3)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
