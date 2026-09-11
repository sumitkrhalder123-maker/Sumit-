export type CategoryType = 'all' | 'photography' | 'ai-video' | 'ai-image' | 'video-editing' | 'graphic-design';

export interface MediaItem {
  id: string;
  type: 'image' | 'video';
  url: string;
  thumbnailUrl?: string;
  title?: string;
  caption?: string;
  isCover?: boolean;
}

export interface Project {
  id: string;
  title: string;
  category: 'photography' | 'ai-video' | 'ai-image' | 'video-editing' | 'graphic-design';
  categoryLabel: string;
  summary: string;
  clientOrContext: string;
  thumbnail: string;
  mediaType?: 'image' | 'video';
  videoUrl?: string;
  mediaItems?: MediaItem[];
  externalLink?: string;
  toolsUsed: string[];
  promptSnippet?: string;
  workflow: string[];
  deliverables: string[];
  metrics?: string;
  aspectRatio?: string;
  isCustomUpload?: boolean;
  uploadedAt?: string;
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  period: string;
  isCurrent?: boolean;
  type?: string;
  responsibilities: string[];
  technologies: string[];
  highlightMetric?: string;
}

export interface Education {
  degree: string;
  institution: string;
  period: string;
  focus: string;
}

export interface Achievement {
  id: string;
  title: string;
  metric: string;
  description: string;
  category: string;
}

export interface SkillItem {
  name: string;
  category: 'genai' | 'video' | 'design' | 'workflow';
  level: string; // e.g., 'Mastery', 'Advanced', 'Specialist'
  experience: string;
  highlighted?: boolean;
}

export interface Language {
  name: string;
  proficiency: 'Advanced' | 'Proficient';
  dots: number; // out of 5
  note?: string;
}
