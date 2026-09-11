import React from 'react';
import { ArrowUp, Mail, Phone, MapPin, FileText } from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';

interface FooterProps {
  onOpenResume: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenResume }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#070a10]/85 backdrop-blur-[0.5px] border-t border-slate-800/80 py-12 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 pb-10 border-b border-slate-800/60">
          {/* Brand & info */}
          <div className="text-center md:text-left space-y-2">
            <div className="flex items-center justify-center md:justify-start gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
                SK
              </div>
              <span className="text-base font-bold text-white tracking-tight">
                {PERSONAL_INFO.name}
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-sm">
              AI Generalist • Video Editor • AI Graphic Designer • Prompt Engineer
            </p>
            <p className="text-[11px] text-slate-500">
              Based in Dum Dum, Kolkata, India • Available Worldwide
            </p>
          </div>

          {/* Quick links */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-300">
            <a href="#about" className="hover:text-cyan-400 transition-colors">
              About
            </a>
            <a href="#skills" className="hover:text-cyan-400 transition-colors">
              Skills
            </a>
            <a href="#portfolio" className="hover:text-cyan-400 transition-colors">
              Portfolio
            </a>
            <a href="#experience" className="hover:text-cyan-400 transition-colors">
              Experience
            </a>
            <a href="#education" className="hover:text-cyan-400 transition-colors">
              Education
            </a>
            <a href="#contact" className="hover:text-cyan-400 transition-colors">
              Contact
            </a>
            <button
              onClick={onOpenResume}
              className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Full CV</span>
            </button>
          </div>

          {/* Back to top button */}
          <button
            onClick={scrollToTop}
            id="footer-back-to-top"
            className="p-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-all flex items-center gap-2"
            title="Back to top"
          >
            <span>Top</span>
            <ArrowUp className="w-4 h-4 text-cyan-400" />
          </button>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} {PERSONAL_INFO.name}. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a href={`mailto:${PERSONAL_INFO.email}`} className="hover:text-cyan-400 transition-colors">
              {PERSONAL_INFO.email}
            </a>
            <span>•</span>
            <a href={`tel:${PERSONAL_INFO.phone}`} className="hover:text-cyan-400 transition-colors">
              {PERSONAL_INFO.phone}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
