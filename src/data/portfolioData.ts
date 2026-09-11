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
  // Generative AI
  { name: 'Midjourney', category: 'genai', level: 'Mastery', experience: 'Photorealistic styling, parameter fine-tuning, multi-prompting', highlighted: true },
  { name: 'Flux', category: 'genai', level: 'Mastery', experience: 'Advanced open-weights generation, high-fidelity anatomy & text rendering', highlighted: true },
  { name: 'Kling', category: 'genai', level: 'Advanced', experience: 'Physics-accurate motion generation, dynamic camera angles, cinematic pan/zoom', highlighted: true },
  { name: 'Veo 3', category: 'genai', level: 'Advanced', experience: 'High-definition video generation and temporal consistency', highlighted: true },
  { name: 'Comfy UI', category: 'genai', level: 'Advanced', experience: 'Node-based modular workflows, ControlNet, IP-Adapter, custom checkpoints', highlighted: true },
  { name: 'Seedance 2.0', category: 'genai', level: 'Advanced', experience: 'Creative AI video choreography and character motion synthesis' },
  { name: 'Nano Banana', category: 'genai', level: 'Specialist', experience: 'Rapid AI prototyping and experimental pipeline workflows' },
  { name: 'ChatGPT', category: 'genai', level: 'Mastery', experience: 'System prompt engineering, creative scriptwriting, storyboard generation' },
  { name: 'Adobe Firefly', category: 'genai', level: 'Advanced', experience: 'Commercial generative fill, vector recoloring, concept exploration' },

  // Video Production & Post
  { name: 'Premiere Pro', category: 'video', level: 'Mastery', experience: 'Multicam editing, audio mixing, color correction, dynamic transitions', highlighted: true },
  { name: 'After Effects', category: 'video', level: 'Mastery', experience: 'Motion graphics, kinetic typography, visual effects, compositing', highlighted: true },
  { name: 'DaVinci Resolve', category: 'video', level: 'Advanced', experience: 'Color grading, node-based balancing, Fairlight audio workflows', highlighted: true },

  // Graphic Design
  { name: 'Photoshop', category: 'design', level: 'Mastery', experience: 'Photo manipulation, advanced composite art, digital painting, commercial retouching', highlighted: true },
  { name: 'Illustrator', category: 'design', level: 'Mastery', experience: 'Vector branding, icon systems, key visual illustration, typography design', highlighted: true },
  { name: 'InDesign', category: 'design', level: 'Advanced', experience: 'Editorial layout, multi-page brochures, print pre-flight production' },

  // Workflow & Specializations
  { name: 'Prompt Engineering', category: 'workflow', level: 'Mastery', experience: 'Structural token weighting, negative prompt styling, consistent persona seeding', highlighted: true },
  { name: 'Social Media Management', category: 'workflow', level: 'Mastery', experience: 'Audience growth strategy, reel pacing, thumbnail conversion optimization' },
  { name: 'Multimedia Office Admin', category: 'workflow', level: 'Mastery', experience: 'Asset organization, delivery scheduling, client communication' }
];

export const BASE_PROJECTS: Project[] = [
  {
    id: 'proj-indianoil-photography',
    title: 'Indian Oil Photography Project',
    category: 'photography',
    categoryLabel: 'Commercial Photography',
    summary: 'Commercial photography campaign documenting Indian Oil Corporation (IOCL), Indane LPG Composite Cylinders, and SERVO Lubricants transit branding across the UNESCO World Heritage Darjeeling Himalayan Railway network.',
    clientOrContext: 'Indian Oil Corporation Ltd. (IOCL)',
    thumbnail: './assets/projects/indianoil/photo-1.svg',
    mediaItems: [
      {
        id: 'io-photo-1',
        type: 'image',
        url: './assets/projects/indianoil/photo-1.svg',
        title: 'IndianOil XtraGreen Himalayan Rail Transit Campaign',
        caption: 'Darjeeling Himalayan Railway blue locomotive #602 traversing scenic mountain curves with IndianOil XtraGreen environmental coach wraps ("Make the world a greener place, mile by mile").',
        isCover: true,
      },
      {
        id: 'io-photo-2',
        type: 'image',
        url: './assets/projects/indianoil/photo-2.svg',
        title: 'Indane Composite LPG & SERVO Platform Pillar Campaign',
        caption: 'Station platform pillars wrapped with Indane modern kitchen composite cylinder ("Almost 50% lighter than steel, translucent body, rust-free") and SERVO 4T XTRA motorcycle lubricant creatives.',
      },
      {
        id: 'io-photo-3',
        type: 'image',
        url: './assets/projects/indianoil/photo-3.svg',
        title: 'Darjeeling Station Concourse & Outdoor Hoardings',
        caption: 'High-footfall platform concourse with arriving toy train, elevated commercial hoardings, and continuous pillar advertising displays.',
      },
      {
        id: 'io-photo-4',
        type: 'image',
        url: './assets/projects/indianoil/photo-4.svg',
        title: 'Historic DHR Steam & Diesel Railway Junction',
        caption: 'Panoramic junction view featuring vintage coal-fired DHR B-Class steam locomotive 788 and blue diesel train against sunset mountain valley hills.',
      },
      {
        id: 'io-photo-5',
        type: 'image',
        url: './assets/projects/indianoil/photo-5.svg',
        title: 'DHR Mountain Street Track Rounding & Train Wrap',
        caption: 'Dynamic street-level perspective of narrow-gauge carriages rounding the hill town bend alongside pedestrians and traffic with outdoor transit wraps.',
      },
      {
        id: 'io-photo-6',
        type: 'image',
        url: './assets/projects/indianoil/photo-6.svg',
        title: 'Station Passenger Gallery Pillar Brand Sequence',
        caption: 'Vanishing architectural perspective of repetitive station concourse pillars showcasing alternating Indane Composite LPG and SERVO 4T XTRA brand wraps.',
      }
    ],
    toolsUsed: ['Commercial DSLR / Mirrorless', 'Lightroom Classic', 'Photoshop', 'On-Location Art Direction'],
    promptSnippet: 'On-site commercial shoot: Darjeeling Himalayan Railway UNESCO site, IOCL XtraGreen & Indane Composite Cylinder campaign documentation',
    workflow: [
      'On-location reconnaissance across Darjeeling Himalayan Railway mountain track points and station platforms',
      'Capturing moving narrow-gauge locomotives with IndianOil XtraGreen branding in natural alpine mountain mist',
      'Architectural and concourse photography documenting Indane composite cylinder & Servo 4T Xtra pillar wraps',
      'Professional post-processing in Lightroom Classic and Photoshop: color calibration, perspective correction, and brand asset delivery'
    ],
    deliverables: [
      'High-Resolution Commercial Photo Suite (Print & Digital Ready)',
      'On-Site Transit Advertising Brand Proof Documentation',
      'Social Media & PR High-Impact Visual Package'
    ],
    metrics: 'Documented 6+ primary branding touchpoints across Darjeeling stations and rolling stock',
    aspectRatio: '16:9'
  },
  {
    id: 'proj-1',
    title: 'Cinematic Gen AI Commercial Film',
    category: 'ai-video',
    categoryLabel: 'AI Video & Motion',
    summary: 'A futuristic brand film blending photorealistic AI video synthesis with dynamic pacing and custom cinematic sound scoring.',
    clientOrContext: 'Grapes Worldwide Campaign',
    thumbnail: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    mediaItems: [
      {
        id: 'p1-m1',
        type: 'video',
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        title: 'Master Commercial Video (60s Cut)',
        caption: 'Full cinematic cut featuring Kling & Veo 3 camera trajectories',
        isCover: true,
      },
      {
        id: 'p1-m2',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80',
        title: 'Metropolis Neon Concept Poster',
        caption: 'Midjourney v6.1 generation with volumetric lighting',
      },
      {
        id: 'p1-m3',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80',
        title: 'Cyberpunk Atmospheric Scene Still',
        caption: 'Color-graded in DaVinci Resolve with anamorphic flares',
      },
      {
        id: 'p1-m4',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
        title: 'Character Seed Consistency Frame',
        caption: 'ComfyUI IP-Adapter portrait consistency output',
      }
    ],
    toolsUsed: ['Kling', 'Veo 3', 'Premiere Pro', 'DaVinci Resolve'],
    promptSnippet: 'Cinematic wide-angle shot of a futuristic metropolis bathed in golden hour neon glow, anamorphic lens flare, photorealistic lighting, 8k resolution, slow smooth tracking shot --v 6.0 --style raw',
    workflow: [
      'Conceptualized storyboard and scripted scene-by-scene prompts for temporal consistency',
      'Generated raw motion sequences in Kling & Veo 3 with precise camera velocity parameters',
      'Assembled cut in Premiere Pro with rhythmic beat alignment and sound design',
      'Final color grade in DaVinci Resolve matching modern cinematic film stocks'
    ],
    deliverables: ['4K Commercial Cut (60s)', '15s Social Teaser Reels', 'High-res poster stills'],
    metrics: 'Achieved 25% faster generation pipeline using optimized prompt weights',
    aspectRatio: '16:9'
  },
  {
    id: 'proj-2',
    title: 'Hyper-Realistic Product Concept Photography',
    category: 'ai-image',
    categoryLabel: 'AI Image Generation',
    summary: 'High-end luxury commercial imagery generated with zero physical studio costs using custom Flux & Midjourney prompt pipelines.',
    clientOrContext: 'Luxury Beverage & Tech Brand Showcase',
    thumbnail: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80',
    mediaItems: [
      {
        id: 'p2-m1',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80',
        title: 'Obsidian Stone Perfume Key Visual',
        caption: 'Hasselblad H6D studio lighting emulation using Flux',
        isCover: true,
      },
      {
        id: 'p2-m2',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=80',
        title: 'Cosmetics Luxury Bottle Macro',
        caption: 'Subsurface scattering and water droplet details',
      },
      {
        id: 'p2-m3',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&w=1200&q=80',
        title: 'E-Commerce Hero Banner Composition',
        caption: 'Commercial retouching and vector typography overlay in Photoshop',
      }
    ],
    toolsUsed: ['Flux', 'Midjourney', 'Comfy UI', 'Photoshop'],
    promptSnippet: 'Studio product photography of an architectural perfume flask perched on wet obsidian stone, subtle water droplets, volumetric dramatic chiaroscuro studio lighting, Hasselblad H6D-100c --ar 4:5 --q 2',
    workflow: [
      'Engineered multi-modal prompts with lighting temperature and lens focal length specifications',
      'Utilized ComfyUI node workflows with ControlNet depth maps for exact product silhouettes',
      'Executed commercial retouching, label sharpness, and color calibration in Adobe Photoshop'
    ],
    deliverables: ['Master Key Visual Suite', 'E-commerce hero graphics', 'Social carousel templates'],
    metrics: 'Zero studio rental costs with 100% photorealistic studio fidelity',
    aspectRatio: '4:5'
  },
  {
    id: 'proj-3',
    title: 'High-Energy Gaming & PC Hardware Commercial',
    category: 'video-editing',
    categoryLabel: 'Commercial Video Editing',
    summary: 'Fast-paced product showcase and social reels with rhythmic speed ramps, custom sound effects, and kinetic typography.',
    clientOrContext: 'National PC / Ananka Campaign',
    thumbnail: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=1200&q=80',
    mediaItems: [
      {
        id: 'p3-m1',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=1200&q=80',
        title: 'Custom Liquid-Cooled Rig Hero Poster',
        caption: 'Key art produced for YouTube thumbnail and print display',
        isCover: true,
      },
      {
        id: 'p3-m2',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80',
        title: 'Neon Esports Setup Aesthetic',
        caption: 'Color grading and ambient glow treatments in After Effects',
      },
      {
        id: 'p3-m3',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80',
        title: 'Component Tech Spec Highlight',
        caption: 'Overlaid dynamic graphic callouts and kinetic specs',
      }
    ],
    toolsUsed: ['Premiere Pro', 'After Effects', 'DaVinci Resolve', 'Photoshop'],
    workflow: [
      'Curated raw multi-angle camera footage of liquid-cooled custom PC rigs',
      'Built custom speed-ramp transitions synced with sub-bass audio hits',
      'Designed kinetic 3D specs callout overlays and neon glow accents in After Effects',
      'Delivered ready-to-publish vertical reels optimized for Instagram & YouTube Shorts'
    ],
    deliverables: ['Long-form 4K YouTube Showcase', '4x Viral Vertical Reels', 'Thumbnail graphic pack'],
    metrics: 'Drove 40%+ spike in social engagement and surpassed 2022 targets by 30%',
    aspectRatio: '16:9'
  },
  {
    id: 'proj-4',
    title: 'Experiential Event Branding & Stage Graphics',
    category: 'graphic-design',
    categoryLabel: 'Branding & Graphics',
    summary: 'Complete physical and digital visual identity system for a premier entertainment and corporate event.',
    clientOrContext: 'RIVERBED EVENTS',
    thumbnail: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80',
    mediaItems: [
      {
        id: 'p4-m1',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80',
        title: 'Main Arena Stage Lighting & LED Visuals',
        caption: 'Stage graphic direction designed for live audience of 5,000+',
        isCover: true,
      },
      {
        id: 'p4-m2',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80',
        title: 'VIP Pass & Event Collateral Set',
        caption: 'InDesign print pre-flight identity layout',
      },
      {
        id: 'p4-m3',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80',
        title: 'Presenter Backdrop Motion Loops',
        caption: 'Seamless video background loops in After Effects',
      }
    ],
    toolsUsed: ['Photoshop', 'Illustrator', 'InDesign', 'After Effects'],
    workflow: [
      'Developed primary event typography, color palette, and vector identity motifs in Illustrator',
      'Engineered ultra-wide LED stage backdrop motion graphics and presenter title loops',
      'Produced print-ready VIP passes, venue signage, and commemorative programs in InDesign',
      'Managed social media countdown campaigns leading up to the live event'
    ],
    deliverables: ['Main Stage LED Backdrops (8K)', 'Social Media Promo Kit', 'Print Identity Package'],
    metrics: 'Maintained seamless visual consistency for 5,000+ live event attendees',
    aspectRatio: '16:9'
  },
  {
    id: 'proj-5',
    title: 'Organic Social Media Content Engine (10K+ Followers)',
    category: 'graphic-design',
    categoryLabel: 'Social Media & Growth',
    summary: 'Strategic visual system and weekly content rhythm that propelled brand social channels from ground up to 10,000+ active followers.',
    clientOrContext: 'NAANTAM PVT. LTD. & Riverbed',
    thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    mediaItems: [
      {
        id: 'p5-m1',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
        title: 'Brand Visual Guide & Fluid Gradient Carousels',
        caption: 'High-save carousel design framework',
        isCover: true,
      },
      {
        id: 'p5-m2',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
        title: 'Instagram Micro-Content Templates',
        caption: 'Photoshop reusable templates for rapid weekly publishing',
      }
    ],
    toolsUsed: ['Photoshop', 'Illustrator', 'Premiere Pro', 'ChatGPT'],
    workflow: [
      'Designed recognizable brand carousels, infographics, and quick-tip story templates',
      'Used ChatGPT for ideating high-hook copywriting and viral trend alignment',
      'Edited short-form micro-videos that generated high save and share ratios',
      'Systematized asset delivery to reduce turnaround by 15% consistently'
    ],
    deliverables: ['50+ Custom Carousel Packs', 'Reel Video Series', 'Brand Style Guidebook'],
    metrics: 'Scaled audience beyond 10,000+ targeted organic followers',
    aspectRatio: '1:1'
  },
  {
    id: 'proj-6',
    title: 'Sci-Fi Character & Cinematic Worldbuilding',
    category: 'ai-video',
    categoryLabel: 'AI Video & Conceptual Art',
    summary: 'Narrative worldbuilding project featuring consistent character generation across varied environments and camera choreography.',
    clientOrContext: 'Personal Creative Exploration & Exhibition',
    thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
    mediaItems: [
      {
        id: 'p6-m1',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
        title: 'Cyber Rain Street Hero Concept Still',
        caption: 'Midjourney v6.1 photorealistic cinematic lighting',
        isCover: true,
      },
      {
        id: 'p6-m2',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80',
        title: 'Matte Carbon Armor Lookbook Profile',
        caption: 'Consistent face and costume seeds generated in Seedance 2.0',
      }
    ],
    toolsUsed: ['Midjourney', 'Seedance 2.0', 'Kling', 'DaVinci Resolve'],
    promptSnippet: 'Atmospheric cyberpunk rain street, cyber-enhanced protagonist in matte carbon armor walking towards camera, neon reflections on wet asphalt, volumetric mist, blade runner 2049 cinematography --v 6.1',
    workflow: [
      'Trained consistent character seeds across multiple lighting setups in Midjourney & ComfyUI',
      'Synthesized dynamic walking and action camera sequences using Seedance 2.0 and Kling',
      'Synchronized temporal frame interpolation and audio soundscapes in DaVinci Resolve'
    ],
    deliverables: ['Narrative Micro-Short Video', 'Concept Art Digital Lookbook'],
    metrics: '99% temporal character consistency across scene transitions',
    aspectRatio: '16:9'
  }
];

// Merge client projects loaded from repository/JSON with base projects
export const PROJECTS: Project[] = [
  ...clientProjectsList,
  ...BASE_PROJECTS.filter((bp) => !clientProjectsList.some((cp) => cp.id === bp.id))
];
