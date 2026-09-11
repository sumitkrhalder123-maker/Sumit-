import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { AboutSection } from './components/AboutSection';
import { SkillsSection } from './components/SkillsSection';
import { ProjectsSection } from './components/ProjectsSection';
import { ProjectModal } from './components/ProjectModal';
import { UploadWorkModal } from './components/UploadWorkModal';
import { DataSyncModal } from './components/DataSyncModal';
import { ExperienceSection } from './components/ExperienceSection';
import { EducationAchievementsSection } from './components/EducationAchievementsSection';
import { ContactSection } from './components/ContactSection';
import { ResumeModal } from './components/ResumeModal';
import { Footer } from './components/Footer';
import { SnowBackground } from './components/SnowBackground';
import { Project } from './types';
import { useProjectsStorage } from './hooks/useProjectsStorage';

export default function App() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const {
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
  } = useProjectsStorage();

  const handleOpenContact = () => {
    const contactElement = document.getElementById('contact');
    if (contactElement) {
      contactElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenUpload = (projectToEdit?: Project) => {
    setEditingProject(projectToEdit || null);
    setIsUploadModalOpen(true);
  };

  const handleSaveProject = (projectData: Omit<Project, 'id'>, editId?: string) => {
    if (editId) {
      updateProject(editId, projectData);
      if (selectedProject?.id === editId) {
        setSelectedProject({ ...projectData, id: editId });
      }
    } else {
      const created = addProject(projectData);
      setSelectedProject(created);
    }
  };

  const handleDeleteProject = (id: string) => {
    deleteProject(id);
    if (selectedProject?.id === id) {
      setSelectedProject(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#070a11] text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200 relative">
      {/* Ambient Looping Snowfall in Background (Behind all text & cards) */}
      <SnowBackground />

      {/* Main Interactive Content Layer */}
      <div className="relative z-10">
        {/* Navigation Bar */}
        <Navbar
          onOpenResume={() => setIsResumeOpen(true)}
          onOpenUploadWork={() => handleOpenUpload()}
        />

        {/* Main Content Sections */}
        <main>
          {/* Hero Section */}
          <Hero onOpenResume={() => setIsResumeOpen(true)} />

          {/* About Section & Languages */}
          <AboutSection />

          {/* Skills & AI Models */}
          <SkillsSection />

          {/* Portfolio & Real Client Case Studies */}
          <ProjectsSection
            projects={projects}
            onSelectProject={(project) => setSelectedProject(project)}
            onOpenUploadModal={(proj) => handleOpenUpload(proj)}
            onDeleteProject={handleDeleteProject}
            onResetProjects={resetToDefault}
            onExportProjects={exportProjectsJSON}
            onOpenSyncModal={() => setIsSyncModalOpen(true)}
            onSaveToCodebase={savePermanentlyToCodebase}
            syncStatus={syncStatus}
            customCount={customProjectsCount}
          />

          {/* Work Experience */}
          <ExperienceSection />

          {/* Education & Key Achievements */}
          <EducationAchievementsSection />

          {/* Contact Section (#contact) */}
          <ContactSection />
        </main>

        {/* Footer */}
        <Footer onOpenResume={() => setIsResumeOpen(true)} />
      </div>

      {/* Project Details Modal */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        onContactClick={handleOpenContact}
        onEditProject={(proj) => handleOpenUpload(proj)}
        onDeleteProject={handleDeleteProject}
      />

      {/* Upload Real Client Work Modal */}
      <UploadWorkModal
        isOpen={isUploadModalOpen}
        onClose={() => {
          setIsUploadModalOpen(false);
          setEditingProject(null);
        }}
        onSave={handleSaveProject}
        editingProject={editingProject}
      />

      {/* Resume / CV Modal */}
      <ResumeModal
        isOpen={isResumeOpen}
        onClose={() => setIsResumeOpen(false)}
      />

      {/* Codebase Persistence & Backup Sync Modal */}
      <DataSyncModal
        isOpen={isSyncModalOpen}
        onClose={() => setIsSyncModalOpen(false)}
        projects={projects}
        customCount={customProjectsCount}
        onSaveToCodebase={savePermanentlyToCodebase}
        onExportJSON={exportProjectsJSON}
        onImportJSON={importProjectsJSON}
        syncStatus={syncStatus}
        lastSyncMessage={lastSyncMessage}
      />
    </div>
  );
}
