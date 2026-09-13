import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { AboutSection } from './components/AboutSection';
import { SkillsSection } from './components/SkillsSection';
import { ProjectsSection } from './components/ProjectsSection';
import { ProjectModal } from './components/ProjectModal';
import { ExperienceSection } from './components/ExperienceSection';
import { EducationAchievementsSection } from './components/EducationAchievementsSection';
import { ContactSection } from './components/ContactSection';
import { ResumeModal } from './components/ResumeModal';
import { Footer } from './components/Footer';
import { SnowBackground } from './components/SnowBackground';
import { ChatBotWidget } from './components/ChatBotWidget';
import { Project } from './types';
import { useProjectsStorage } from './hooks/useProjectsStorage';

export default function App() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isResumeOpen, setIsResumeOpen] = useState(false);

  const { projects } = useProjectsStorage();

  const handleOpenContact = () => {
    const contactElement = document.getElementById('contact');
    if (contactElement) {
      contactElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#070a11] text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200 relative">
      {/* Ambient Looping Snowfall in Background (Behind all text & cards) */}
      <SnowBackground />

      {/* Main Interactive Content Layer */}
      <div className="relative z-10">
        {/* Navigation Bar */}
        <Navbar onOpenResume={() => setIsResumeOpen(true)} />

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
      />

      {/* Resume / CV Modal */}
      <ResumeModal
        isOpen={isResumeOpen}
        onClose={() => setIsResumeOpen(false)}
      />

      {/* Floating Chat Bot Widget in Right-Side Bottom Corner */}
      <ChatBotWidget />
    </div>
  );
}
