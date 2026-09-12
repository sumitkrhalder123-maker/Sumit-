import { Achievement, Education, Experience, Language, Project, SkillItem } from '../types';
import rawClientProjects from './clientProjects.json';

const clientProjectsList: Project[] = Array.isArray(rawClientProjects) ? (rawClientProjects as Project[]) : [];

export const PERSONAL_INFO = {
  name: 'Sumit Kumer Halder',
  shortName: 'Sumit',
  titles: [
    'AI Generalist',
    'Video Editor',
    'AI Graphic Designer',
    'Prompt Engineer'
  ],
  currentHeadline: 'AI Generalist & Multimedia Creative Specialist',
  phone: '+91 9062355706',
  email: 'sumitkrhalder26@gmail.com',
  location: 'Dum Dum, Kolkata, India',
  officeName: 'Graphics Sumit',
  officeNameBengali: 'গ্রাফিক্স সুমিত',
  addressFull: 'Graphics Sumit, North Dumdum, Kolkata 700028, West Bengal, India',
  googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Graphics+Sumit+North+Dumdum+Kolkata',
  coordinates: { lat: 22.6450, lng: 88.4050 },
  dob: '17/04/2000',
  bio: 'I am a dedicated Graphics Designer and AI Expert with a solid background in multimedia design and creative digital direction. With extensive experience in Gen AI prompt engineering, high-cadence video editing, and social media brand growth, I deliver high-impact visual experiences that merge cutting-edge artificial intelligence with polished cinematic craftsmanship.',
  status: 'Open to Full-Time & High-Impact Freelance Roles',
  yearsExperience: '5+ Years',
};

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'ach-1',
    title: 'Exceeded Design Targets',
    metric: '30%',
    category: 'Design & Video Excellence',
    description: 'Surpassed company quarterly design production and video delivery benchmarks by 30% through streamlined editing workflows.',
  },
  {
    id: 'ach-2',
    title: 'Social Media Growth',
    metric: '10K+',
    category: 'Audience Scaling',
    description: 'Built, curated, and scaled engaged brand communities with over 10,000 active followers using high-conversion visual creatives.',
  },
  {
    id: 'ach-3',
    title: 'Gen AI Efficiency Surge',
    metric: '+25%',
    category: 'AI Workflow Optimization',
    description: 'Boosted prompt precision, asset turnaround, and generative visual quality by 25% within three months of deployment.',
  },
  {
    id: 'ach-4',
    title: 'Delivery Time Reduction',
    metric: '15%',
    category: 'Time Management',
    description: 'Consistently cut production cycle times by 15% across commercial video editing and social asset packages.',
  },
];

export const EXPERIENCES: Experience[] = [
  {
    id: 'exp-grapes',
    role: 'Gen AI Artist',
    company: 'Grapes Worldwide',
    period: '06/2025 - 07/2026',
    isCurrent: false,
    type: 'Full-Time',
    responsibilities: [
      'Spearhead AI image generation pipelines utilizing Flux, Midjourney, and ComfyUI for commercial ad campaigns.',
      'Produce cinematic AI video generations leveraging Kling, Veo 3, Seedance 2.0, and Nano Banana models.',
      'Harmonize generative outputs with professional post-production editing in Premiere Pro and DaVinci Resolve.',
      'Craft advanced prompt architecture, camera motion parameters, and style consistency protocols.'
    ],
    technologies: ['Midjourney', 'Flux', 'Kling', 'Veo 3', 'Comfy UI', 'Seedance 2.0', 'Premiere Pro', 'Photoshop'],
    highlightMetric: 'Lead Gen AI creative campaigns with accelerated turnaround'
  },
  {
    id: 'exp-riverbed',
    role: 'Sr. Graphics Designer',
    company: 'RIVERBED EVENTS',
    period: '08/2024 - 06/2025',
    isCurrent: false,
    type: 'Full-Time',
    responsibilities: [
      'Directed end-to-end event branding, stage backdrop graphics, countdown social campaigns, and sponsor collateral.',
      'Managed social media publishing calendars, engagement strategy, and promotional reels.',
      'Unified brand aesthetics across multi-platform physical prints and digital display systems.'
    ],
    technologies: ['Photoshop', 'Illustrator', 'Premiere Pro', 'Social Media Strategy', 'Event Branding'],
    highlightMetric: 'Delivered high-visibility visual branding for major events'
  },
  {
    id: 'exp-ananka',
    role: 'Sr. Graphics Designer',
    company: 'ANANKA (National PC)',
    period: '04/2022 - 06/2024',
    isCurrent: false,
    type: 'Full-Time',
    responsibilities: [
      'Engineered high-energy promotional tech videos, product unboxings, and hardware launch reels for gaming & workstation PCs.',
      'Designed technical product banners, e-commerce graphics, and social branding assets.',
      'Scaled brand reach and engaged PC gaming enthusiasts with tailored motion snippets.'
    ],
    technologies: ['Premiere Pro', 'After Effects', 'Photoshop', 'DaVinci Resolve', 'Hardware Commercials'],
    highlightMetric: 'Exceeded design performance targets by 30% in 2022'
  },
  {
    id: 'exp-naantam',
    role: 'Sr. Graphics Designer',
    company: 'NAANTAM PVT. LTD.',
    period: '06/2019 - 03/2022',
    isCurrent: false,
    type: 'Remote Part-Time',
    responsibilities: [
      'Designed digital marketing graphics, promotional banners, and visual identity collateral.',
      'Produced engaging social media video edits and story formats that boosted brand engagement.',
      'Collaborated remotely with marketing teams to maintain agile project turnaround times.'
    ],
    technologies: ['Photoshop', 'Illustrator', 'Video Editing', 'Social Media Management', 'InDesign'],
    highlightMetric: 'Managed multi-channel brand accounts growing to 10K+ followers'
  }
];

export const EDUCATION_LIST: Education[] = [
  {
    degree: 'Bachelor Of Commerce (B.Com)',
    institution: 'SVSU OPEN UNIVERSITY',
    period: '01/2021 - 01/2025',
    focus: 'Commerce, Business Administration & Marketing Fundamentals'
  },
  {
    degree: 'Diploma in Graphics Design',
    institution: 'MAAC (Maya Academy of Advanced Cinematics)',
    period: '02/2018 - 08/2020',
    focus: 'Digital Design, Motion Media, Typography & Visual Communication'
  }
];

export const LANGUAGES: Language[] = [
  {
    name: 'Bengali',
    proficiency: 'Proficient',
    dots: 5,
    note: 'Native / Bilingual Mastery'
  },
  {
    name: 'English',
    proficiency: 'Advanced',
    dots: 4,
    note: 'Fluent Professional & Creative Communication'
  },
  {
    name: 'Hindi',
    proficiency: 'Advanced',
    dots: 4,
    note: 'Fluent Professional & Creative Communication'
  }
];

export const SKILLS_LIST: SkillItem[] = [
  // Generative AI & Video Models
  { name: 'Flux (Pro / Dev)', category: 'genai', level: 'Mastery', experience: 'High-fidelity anatomical rendering, photorealism, and zero-distortion text', highlighted: true },
  { name: 'Kling 2.0', category: 'genai', level: 'Mastery', experience: '1080p cinematic video generation, motion brush, and camera physics', highlighted: true },
  { name: 'Google Veo 3.1', category: 'genai', level: 'Mastery', experience: 'Ultra-high-definition video synthesis, temporal consistency, and lens physics', highlighted: true },
  { name: 'Alibaba Wan 2.1', category: 'genai', level: 'Mastery', experience: '14B cinematic motion dynamics, text-to-video, and image-to-video', highlighted: true },
  { name: 'Seedance 2.0', category: 'genai', level: 'Advanced', experience: 'Creative AI video choreography and character motion synthesis', highlighted: true },
  { name: 'ComfyUI', category: 'genai', level: 'Mastery', experience: 'Node-based modular workflows, ControlNet, IP-Adapter, LoRAs & latent upscaling', highlighted: true },
  { name: 'ElevenLabs v3 / v2', category: 'genai', level: 'Mastery', experience: 'Emotional voice tagging, studio-quality narration, and custom voice cloning', highlighted: true },
  { name: 'ChatGPT & Prompting', category: 'genai', level: 'Mastery', experience: 'System prompt architecture, negative token tuning, scriptwriting & storyboards', highlighted: true },
  { name: 'Adobe Firefly', category: 'genai', level: 'Advanced', experience: 'Commercial generative fill, vector recoloring, concept exploration' },

  // Video Production & Post
  { name: 'Premiere Pro', category: 'video', level: 'Mastery', experience: 'Multicam editing, audio ducking, rhythm cutting, high-pacing reels', highlighted: true },
  { name: 'After Effects', category: 'video', level: 'Mastery', experience: 'Kinetic typography, 3D tracking, visual effects compositing, dynamic presets', highlighted: true },
  { name: 'DaVinci Resolve', category: 'video', level: 'Advanced', experience: 'Color grading, node-based balancing, Fairlight audio mastering', highlighted: true },

  // Graphic Design & Print
  { name: 'Photoshop', category: 'design', level: 'Mastery', experience: 'Photo manipulation, advanced composite art, commercial retouching', highlighted: true },
  { name: 'Illustrator', category: 'design', level: 'Mastery', experience: 'Vector branding, icon systems, key visual illustration, typography', highlighted: true },
  { name: 'InDesign', category: 'design', level: 'Advanced', experience: 'Editorial layout, multi-page brochures, print pre-flight production' },

  // Creative Specializations & Marketing
  { name: 'AI Product Photography', category: 'workflow', level: 'Mastery', experience: 'Commercial studio lighting, luxury cosmetic sets, reflection matching', highlighted: true },
  { name: 'AI UGC Ad Creation', category: 'workflow', level: 'Mastery', experience: 'Direct-response hook architecture, high-CTR performance creatives', highlighted: true },
  { name: 'Cinematic Color Grading', category: 'workflow', level: 'Mastery', experience: 'Film stock emulation, tone mapping, teal & orange separation' }
];

export const BASE_PROJECTS: Project[] = [];

// Empty portfolio list as requested by user
export const PROJECTS: Project[] = [];
