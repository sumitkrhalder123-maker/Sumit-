import { useState, useEffect } from 'react';
import { Project } from '../types';
import { PROJECTS as DEFAULT_PROJECTS } from '../data/portfolioData';

const STORAGE_KEY = 'sumit_portfolio_projects_v2';

export function useProjectsStorage() {
  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to load stored portfolio projects:', e);
    }
    return DEFAULT_PROJECTS;
  });

  // Sync back to localStorage whenever projects state changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    } catch (e) {
      console.warn('Could not save projects to localStorage (quota or disabled):', e);
    }
  }, [projects]);

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

  const customProjectsCount = projects.filter((p) => p.isCustomUpload).length;

  return {
    projects,
    addProject,
    updateProject,
    deleteProject,
    resetToDefault,
    exportProjectsJSON,
    customProjectsCount,
  };
}
