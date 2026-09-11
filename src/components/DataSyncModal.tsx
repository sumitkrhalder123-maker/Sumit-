import React, { useState } from 'react';
import {
  X,
  Database,
  Download,
  Upload,
  Copy,
  Check,
  AlertCircle,
  HardDrive,
  FileCode,
  Sparkles,
  Terminal
} from 'lucide-react';
import { Project } from '../types';

interface DataSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  customCount: number;
  onSaveToCodebase: () => Promise<{ success: boolean; count?: number; message?: string; error?: string }>;
  onExportJSON: () => void;
  onImportJSON: (jsonInput: string) => { success: boolean; count?: number; error?: string };
  syncStatus: 'idle' | 'saving' | 'saved' | 'error';
  lastSyncMessage?: string;
}

export const DataSyncModal: React.FC<DataSyncModalProps> = ({
  isOpen,
  onClose,
  projects,
  customCount,
  onSaveToCodebase,
  onExportJSON,
  onImportJSON,
  syncStatus,
  lastSyncMessage,
}) => {
  const [pasteInput, setPasteInput] = useState('');
  const [importFeedback, setImportFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [isSavingCodebase, setIsSavingCodebase] = useState(false);
  const [saveFeedback, setSaveFeedback] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleManualSaveToCodebase = async () => {
    setIsSavingCodebase(true);
    setSaveFeedback(null);
    try {
      const result = await onSaveToCodebase();
      if (result.success) {
        setSaveFeedback(`✅ ${result.message || 'Saved to codebase successfully!'}`);
      } else {
        setSaveFeedback(`⚠️ ${result.error || 'Could not reach server endpoint. Use Export JSON as a backup.'}`);
      }
    } catch (err: any) {
      setSaveFeedback(`⚠️ Save failed: ${err.message}`);
    } finally {
      setIsSavingCodebase(false);
    }
  };

  const handleImportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setImportFeedback(null);
    if (!pasteInput.trim()) {
      setImportFeedback({ type: 'error', message: 'Please paste your projects JSON content.' });
      return;
    }

    const res = onImportJSON(pasteInput.trim());
    if (res.success) {
      setImportFeedback({
        type: 'success',
        message: `Successfully imported and restored ${res.count} project(s)!`,
      });
      setPasteInput('');
    } else {
      setImportFeedback({
        type: 'error',
        message: `Import failed: ${res.error || 'Invalid JSON format'}`,
      });
    }
  };

  const handleCopyConsoleScript = () => {
    const script = `copy(localStorage.getItem('sumit_portfolio_projects_v2'))`;
    navigator.clipboard.writeText(script);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl bg-[#0d121f] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden my-6 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/80 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white leading-tight">
                Client Projects Sync & GitHub Pages Persistence
              </h3>
              <p className="text-xs text-slate-400">
                Ensure all {customCount} real client projects are baked into your repository files
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Action 1: Save to Codebase permanently */}
          <div className="p-5 rounded-2xl bg-[#0b0f17] border border-cyan-500/30 space-y-3">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <HardDrive className="w-4 h-4 text-cyan-400" />
                  <h4 className="text-sm font-bold text-white">
                    1. Save Permanently to Codebase (For GitHub Pages)
                  </h4>
                </div>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Writes all active client projects directly to <code className="text-cyan-300 bg-slate-800 px-1.5 py-0.5 rounded font-mono">src/data/clientProjects.json</code> in this repository. Once saved, when you run your GitHub Pages workflow or <code className="text-cyan-300 bg-slate-800 px-1.5 py-0.5 rounded font-mono">git push</code>, every visitor and recruiter will see all your uploaded client projects!
                </p>
              </div>
              <button
                onClick={handleManualSaveToCodebase}
                disabled={isSavingCodebase}
                className="shrink-0 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 transition-all shadow-lg shadow-cyan-500/20 disabled:opacity-50"
              >
                {isSavingCodebase ? 'Saving...' : '💾 Save to Codebase Now'}
              </button>
            </div>

            {saveFeedback && (
              <div className="p-3 rounded-xl bg-slate-900/90 text-xs border border-slate-700">
                {saveFeedback}
              </div>
            )}
            {lastSyncMessage && !saveFeedback && (
              <div className="text-[11px] text-slate-400">
                Status: {lastSyncMessage}
              </div>
            )}
          </div>

          {/* Action 2: Export JSON Backup */}
          <div className="p-5 rounded-2xl bg-[#0b0f17] border border-slate-800 space-y-3">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <Download className="w-4 h-4 text-emerald-400" />
                  <h4 className="text-sm font-bold text-white">
                    2. Download Offline JSON Backup
                  </h4>
                </div>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Downloads a complete <code className="text-emerald-300 bg-slate-800 px-1.5 py-0.5 rounded font-mono">.json</code> backup file of all {projects.length} portfolio items and media assets to your computer.
                </p>
              </div>
              <button
                onClick={onExportJSON}
                className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export JSON File</span>
              </button>
            </div>
          </div>

          {/* Action 3: Browser Console Recovery Guide (If uploading on another tab) */}
          <div className="p-5 rounded-2xl bg-[#0b0f17] border border-slate-800 space-y-3">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-amber-400" />
              <h4 className="text-sm font-bold text-white">
                3. Recover from Another Browser Tab / Device
              </h4>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              If you previously uploaded the 12 projects on a different browser window or tab, you can copy the data directly from that browser’s Developer Console (press <kbd className="bg-slate-800 px-1.5 py-0.5 rounded text-amber-300 font-mono">F12</kbd> or <kbd className="bg-slate-800 px-1.5 py-0.5 rounded text-amber-300 font-mono">Cmd+Option+I</kbd>):
            </p>
            <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-slate-950 font-mono text-xs text-amber-300 border border-slate-800">
              <code>copy(localStorage.getItem('sumit_portfolio_projects_v2'))</code>
              <button
                onClick={handleCopyConsoleScript}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-sans transition-colors shrink-0"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-400">
              Running this command copies your entire 12-project portfolio package to your clipboard. Then paste it into the field below and click <strong>Import & Restore</strong>.
            </p>
          </div>

          {/* Action 4: Paste & Import JSON */}
          <form onSubmit={handleImportSubmit} className="p-5 rounded-2xl bg-[#0b0f17] border border-slate-800 space-y-3">
            <div className="flex items-center gap-2">
              <Upload className="w-4 h-4 text-blue-400" />
              <h4 className="text-sm font-bold text-white">
                4. Import / Restore Projects JSON
              </h4>
            </div>
            <p className="text-xs text-slate-300">
              Paste the projects JSON array or console output here to immediately restore them:
            </p>
            <textarea
              value={pasteInput}
              onChange={(e) => setPasteInput(e.target.value)}
              placeholder="Paste JSON array or clipboard string here [ { id: '...', title: 'Bikano', ... } ]"
              rows={4}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-500 text-slate-200 font-mono text-xs outline-none resize-none transition-all placeholder:text-slate-600"
            />
            {importFeedback && (
              <div
                className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                  importFeedback.type === 'success'
                    ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-500/30'
                    : 'bg-red-950/40 text-red-300 border border-red-500/30'
                }`}
              >
                {importFeedback.type === 'success' ? (
                  <Check className="w-4 h-4 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0" />
                )}
                <span>{importFeedback.message}</span>
              </div>
            )}
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-md"
              >
                📥 Import & Restore Projects
              </button>
            </div>
          </form>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-3.5 border-t border-slate-800 bg-slate-900/60">
          <span className="text-xs text-slate-400">
            Current portfolio items: <strong className="text-white">{projects.length}</strong> ({customCount} client projects)
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
