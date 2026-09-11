import { useState, useEffect, useCallback, useRef } from 'react';
import { Project } from '../types';
import { PROJECTS as DEFAULT_PROJECTS, BASE_PROJECTS } from '../data/portfolioData';

const STORAGE_KEY = 'sumit_portfolio_projects_v4';
const BASE_PROJECT_IDS = new Set(BASE_PROJECTS.map((p) => p.id));

export function useProjectsStorage() {
  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      // Clear previous versions
      localStorage.removeItem('sumit_portfolio_projects_v1');
      localStorage.removeItem('sumit_portfolio_projects_v2');
      localStorage.removeItem('sumit_portfolio_projects_v3');
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to load stored portfolio projects:', e);
    }
    return DEFAULT_PROJECTS;
  });

  const [syncStatus, setSyncStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [lastSyncMessage, setLastSyncMessage] = useState<string>('');
  const syncTimeoutRef = useRef<any>(null);

  // Sync back to localStorage whenever projects state changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    } catch (e) {
      console.warn('Could not save projects to localStorage (quota or disabled):', e);
    }
  }, [projects]);

  // Method to persist projects permanently to backend filesystem
  const savePermanentlyToCodebase = useCallback(async (projectsToSave?: Project[]) => {
    const targetProjects = projectsToSave || projects;
    // Extract custom or client projects to persist to repository
    const clientProjectsToPersist = targetProjects.filter(
      (p) => p.isCustomUpload || !BASE_PROJECT_IDS.has(p.id)
    );

    setSyncStatus('saving');
    try {
      const res = await fetch('/api/save-projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projects: clientProjectsToPersist.length > 0 ? clientProjectsToPersist : targetProjects,
        }),
      });

      if (!res.ok) {
        throw new Error(`Server responded with ${res.status}`);
      }

      const data = await res.json();
      setSyncStatus('saved');
      setLastSyncMessage(data.message || 'Successfully saved to codebase!');
      return { success: true, count: clientProjectsToPersist.length, message: data.message };
    } catch (err: any) {
      console.warn('Permanent server save failed or static environment:', err.message);
      setSyncStatus('error');
      setLastSyncMessage(
        'Server endpoint unavailable (running in static host/GitHub Pages). LocalStorage and Export JSON active.'
      );
      return { success: false, error: err.message };
    }
  }, [projects]);

  // Auto-sync custom projects to server on initial load or change (debounced)
  useEffect(() => {
    const hasCustom = projects.some((p) => p.isCustomUpload || !BASE_PROJECT_IDS.has(p.id));
    if (!hasCustom) return;

    if (syncTimeoutRef.current) {
      clearTimeout(syncTimeoutRef.current);
    }

    syncTimeoutRef.current = setTimeout(() => {
      savePermanentlyToCodebase();
    }, 2000);

    return () => {
      if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);
    };
  }, [projects, savePermanentlyToCodebase]);

  const addProject = (newProject: Omit<Project, 'id'>) => {
    const id = `custom-proj-${Date.now()}`;
    const projectWithId: Project = {
      ...newProject,
      id,
      isCustomUpload: true,
      uploadedAt: new Date().toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
      }),
    };
    // Prepend new client work to the top of the portfolio
    setProjects((prev) => [projectWithId, ...prev]);
    return projectWithId;
  };

  const updateProject = (id: string, updated: Partial<Project>) => {
    setProjects((prev) =>
      prev.map((proj) => (proj.id === id ? { ...proj, ...updated } : proj))
    );
  };

  const deleteProject = (id: string) => {
    setProjects((prev) => prev.filter((proj) => proj.id !== id));
  };

  const resetToDefault = () => {
    setProjects(DEFAULT_PROJECTS);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    // Also clear server client projects if needed
    savePermanentlyToCodebase([]);
  };

  const exportProjectsJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(projects, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `sumit_portfolio_projects_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const importProjectsJSON = (jsonInput: string | Project[]) => {
    try {
      const parsed: Project[] = typeof jsonInput === 'string' ? JSON.parse(jsonInput) : jsonInput;
      if (!Array.isArray(parsed) || parsed.length === 0) {
        throw new Error('Provided input is not a valid list of projects.');
      }

      // Merge avoiding duplicate IDs
      setProjects((prev) => {
        const existingIds = new Set(parsed.map((p) => p.id));
        const merged = [...parsed, ...prev.filter((p) => !existingIds.has(p.id))];
        // Save immediately
        savePermanentlyToCodebase(merged);
        return merged;
      });

      return { success: true, count: parsed.length };
    } catch (err: any) {
      console.error('Import failed:', err);
      return { success: false, error: err.message || 'Invalid JSON format' };
    }
  };

  const customProjectsCount = projects.filter(
    (p) => p.isCustomUpload || !BASE_PROJECT_IDS.has(p.id)
  ).length;

  return {
    projects,
    addProject,
    updateProject,
    deleteProject,
    resetToDefault,
    exportProjectsJSON,
    importProjectsJSON,
    savePermanentlyToCodebase,
    customProjectsCount,
    syncStatus,
    lastSyncMessage,
  };
}

