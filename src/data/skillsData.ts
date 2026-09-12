export interface SoftwareTool {
  name: string;
  roleCategory: 'video' | 'motion' | 'graphics' | 'print' | 'genai-workflow';
  roleCategoryLabel: string;
  badge: string;
  level: 'Mastery' | 'Advanced' | 'Expert';
  description: string;
  features: string[];
  color: string;
}

export interface AIModelItem {
  name: string;
  provider: string;
  category: 'image' | 'video' | 'audio';
  modelsCount?: string; // e.g. "10 models", "4 models"
  isNew?: boolean;
  specialty: string;
  description: string;
  tags: string[];
}

export interface ProfessionalSkill {
  id: string;
  title: string;
  category: 'creative' | 'ai-production' | 'commercial';
  categoryLabel: string;
  proficiency: number; // 90-99
  description: string;
  deliverables: string[];
  iconType: string;
}

// -------------------------------------------------------------
// PART 1: SOFTWARE (Separated by role: Video, Motion, Graphic, Print, GenAI)
// -------------------------------------------------------------
export const SOFTWARE_TOOLS: SoftwareTool[] = [
  {
    name: 'Adobe Premiere Pro',
    roleCategory: 'video',
    roleCategoryLabel: 'Video Editing & Timeline Assembly',
    badge: 'Video Editing',
    level: 'Mastery',
    description: 'Industry-standard timeline editing, multi-camera switching, audio ducking, rhythm cutting, and high-retention pacing for reels, ads, and long-form content.',
    features: ['High-Pacing Reels & Shorts', 'Multi-Cam Editing', 'Audio Ducking & Sync', 'Custom Color LUTs'],
    color: 'from-purple-500 to-indigo-600'
  },
  {
    name: 'Adobe After Effects',
    roleCategory: 'motion',
    roleCategoryLabel: 'Motion Graphics, VFX & Compositing',
    badge: 'Motion & VFX',
    level: 'Mastery',
    description: 'Kinetic typography, 2D/3D camera tracking, complex visual effects, holographic elements, speed ramping, and seamless transition animation.',
    features: ['Kinetic Typography', '3D Camera Tracking', 'VFX Compositing', 'Dynamic Motion Presets'],
    color: 'from-indigo-600 to-blue-600'
  },
  {
    name: 'Adobe Photoshop',
    roleCategory: 'graphics',
    roleCategoryLabel: 'Graphic Design & Photo Manipulation',
    badge: 'Graphic Design',
    level: 'Mastery',
    description: 'High-end photo manipulation, raster composite artwork, matte painting, digital art retouching, e-commerce product hero shots, and commercial key visuals.',
    features: ['Advanced Compositing', 'Commercial Retouching', 'AI Generative Integration', 'Matte Painting'],
    color: 'from-blue-600 to-cyan-600'
  },
  {
    name: 'DaVinci Resolve',
    roleCategory: 'video',
    roleCategoryLabel: 'Color Grading & Audio Post-Production',
    badge: 'Color & Finishing',
    level: 'Advanced',
    description: 'Cinematic color science, node-based color balancing, primary/secondary wheels, HDR mastering, and Fairlight audio enhancement for filmic deliverables.',
    features: ['Node-Based Color Science', 'Primary/Secondary Wheels', 'Fairlight Audio Mixing', 'Film Emulation LUTs'],
    color: 'from-rose-500 to-orange-500'
  },
  {
    name: 'Adobe Illustrator',
    roleCategory: 'graphics',
    roleCategoryLabel: 'Vector Design & Brand Identity',
    badge: 'Vector & Branding',
    level: 'Mastery',
    description: 'Scalable vector branding, custom typography, corporate identity systems, marketing icons, badge emblems, packaging blueprints, and vector art.',
    features: ['Vector Brand Identity', 'Custom Iconography', 'Logo Systems & Guidelines', 'Packaging Vector Layout'],
    color: 'from-amber-500 to-yellow-600'
  },
  {
    name: 'Adobe InDesign',
    roleCategory: 'print',
    roleCategoryLabel: 'Editorial Layout & Print Production',
    badge: 'Print & Publishing',
    level: 'Advanced',
    description: 'Multi-page editorial publications, event brochures, print catalogs, press-ready CMYK pre-flight files, bleed setup, and typographic hierarchy grids.',
    features: ['Multi-Page Editorial Layout', 'Print Pre-Flight & CMYK', 'Brochures & Catalogs', 'Grid System Architecture'],
    color: 'from-pink-500 to-rose-600'
  },
  {
    name: 'ComfyUI',
    roleCategory: 'genai-workflow',
    roleCategoryLabel: 'Node-Based Generative AI Workflows',
    badge: 'AI Node Architecture',
    level: 'Advanced',
    description: 'Modular node pipelines, ControlNet depth/canny guiding, IP-Adapter facial & style transfer, custom LoRA blending, and batch upscaling pipelines.',
    features: ['Modular Node Pipelines', 'ControlNet & Canny Pass', 'IP-Adapter Style Transfer', 'Latent Upscale & Refine'],
    color: 'from-emerald-500 to-teal-600'
  }
];

// -------------------------------------------------------------
// PART 2: AI TOOLS & MODELS (Image, Video, Audio/Voice/SFX)
// -------------------------------------------------------------

// IMAGE GENERATION MODELS (as per user text & uploaded screenshots)
export const AI_IMAGE_MODELS: AIModelItem[] = [
  {
    name: 'Google',
    provider: 'Google DeepMind',
    category: 'image',
    modelsCount: '4 models',
    specialty: 'Imagen 3, Imagen 3 Fast, Nano Banana, Flash Image',
    description: 'Superior photorealism, nuanced lighting fidelity, zero-hallucination typography, and lightning-fast concept iterations.',
    tags: ['Imagen 3', 'Nano Banana', 'High Dynamic Range', 'Fidelity']
  },
  {
    name: 'GPT / OpenAI',
    provider: 'OpenAI',
    category: 'image',
    modelsCount: '6 models',
    specialty: 'DALL-E 3, GPT-4o Vision Canvas, Style Diffusion',
    description: 'Exceptional natural language prompt comprehension, complex compositional relationships, and commercial concept art.',
    tags: ['DALL-E 3', 'GPT-4o Vision', 'Concept Art', 'Prompt Fidelity']
  },
  {
    name: 'Seedream',
    provider: 'ByteDance',
    category: 'image',
    modelsCount: '5 models',
    specialty: 'Seedream 3.0, Seedream High-Def, Photoreal',
    description: 'Next-gen Asian aesthetic rendering, hyper-detailed hair & skin pores, cinematic atmospheric depth.',
    tags: ['Seedream 3.0', 'High-Def Skin', 'Atmosphere', 'Commercial']
  },
  {
    name: 'Flux',
    provider: 'Black Forest Labs',
    category: 'image',
    modelsCount: '10 models',
    specialty: 'Flux.1 Dev, Schnell, Pro, Realism, Kontext',
    description: 'Industry-leading open-weights model family. Unmatched anatomical realism, perfect text rendering, and pristine texture clarity.',
    tags: ['Flux.1 Pro', 'Flux Dev', 'Zero Distortion', 'Text Rendering']
  },
  {
    name: 'Mystic',
    provider: 'Freepik / Mystic AI',
    category: 'image',
    modelsCount: '4 models',
    specialty: 'Mystic v2.5 Cinematic, Photoreal, Fantasy',
    description: 'Hollywood-grade cinematic lighting, dramatic depth of field, and ultra-high resolution creative poster renders.',
    tags: ['Cinematic Lighting', 'Depth of Field', 'Poster Art', '8K']
  },
  {
    name: 'Ideogram',
    provider: 'Ideogram AI',
    category: 'image',
    modelsCount: '3 models',
    specialty: 'Ideogram 2.0 Typography, Graphic Design, Turbo',
    description: 'The world benchmark for in-image typography, brand packaging mockups, emblem designs, and graphic layouts.',
    tags: ['Ideogram 2.0', 'Graphic Typography', 'Logos', 'Packaging']
  },
  {
    name: 'Recraft',
    provider: 'Recraft AI',
    category: 'image',
    modelsCount: '3 models',
    specialty: 'Recraft V3 Vector, 20B Icon, Realistic',
    description: 'Native SVG vector generation, brand color palette lock, clean icon sets, and corporate marketing assets.',
    tags: ['Native SVG', 'Vector Art', 'Brand Palette', 'Icons']
  },
  {
    name: 'Krea',
    provider: 'Krea AI',
    category: 'image',
    modelsCount: '1 model',
    specialty: 'Realtime AI Canvas & Neural Enhancer',
    description: 'Instant zero-latency sketch-to-image synthesis, creative canvas manipulation, and AI resolution scaling.',
    tags: ['Realtime Canvas', 'Instant Iteration', 'AI Enhancer']
  },
  {
    name: 'Adobe Firefly',
    provider: 'Adobe',
    category: 'image',
    modelsCount: '3 models',
    specialty: 'Firefly Image 3, Generative Fill, Expand',
    description: 'Commercial-safe creative generation natively integrated with Photoshop, seamless vector recoloring, and smart inpainting.',
    tags: ['Generative Fill', 'Commercial Safe', 'Photoshop Native']
  },
  {
    name: 'Qwen',
    provider: 'Alibaba Cloud',
    category: 'image',
    modelsCount: '3 models',
    specialty: 'Qwen-VL Visual, Multimodal Synthesis',
    description: 'High-accuracy multimodal visual understanding, bilingual prompt synthesis, and artistic scene construction.',
    tags: ['Multimodal', 'Visual Reasoning', 'Bilingual']
  },
  {
    name: 'Grok',
    provider: 'xAI',
    category: 'image',
    modelsCount: '2 models',
    specialty: 'Grok 2 Aurora, Grok Vision Studio',
    description: 'Uncensored photorealistic rendering, dramatic contrasts, and rapid-fire visual prototyping.',
    tags: ['Grok 2', 'Aurora', 'Creative Freedom', 'Fast']
  },
  {
    name: 'Z-Image',
    provider: 'Z-Engine',
    category: 'image',
    modelsCount: '1 model',
    specialty: 'Hyper-Realistic Micro-Detail Engine',
    description: 'Focused on fine jewelry, fabric weave macro shots, and automotive industrial reflection details.',
    tags: ['Macro Detail', 'Jewelry & Fabric', 'Reflections']
  },
  {
    name: 'Microsoft',
    provider: 'Microsoft',
    category: 'image',
    modelsCount: '1 model',
    specialty: 'Microsoft Designer & Copilot Visual',
    description: 'Fast social media post generation, smart templates, and corporate slide graphics.',
    tags: ['Social Templates', 'Copilot', 'Fast Layouts']
  },
  {
    name: 'Classic Engine',
    provider: 'Stability & Midjourney',
    category: 'image',
    modelsCount: '2 models',
    specialty: 'Midjourney v6.1 & SDXL Turbo',
    description: 'Artistic flair, iconic aesthetic prompt styling, and custom fine-tuned checkpoint pipelines.',
    tags: ['Midjourney v6', 'SDXL', 'Artistic Flair']
  }
];

// VIDEO GENERATION MODELS (as per user text & uploaded screenshot 2)
export const AI_VIDEO_MODELS: AIModelItem[] = [
  {
    name: 'Alibaba',
    provider: 'Alibaba WanX',
    category: 'video',
    modelsCount: '10 models',
    specialty: 'WanX 2.1 14B, Wan 2.1 Cinematic, Wan I2V',
    description: 'State-of-the-art cinematic video synthesis, seamless camera panning, ultra-smooth physics, and complex motion dynamics.',
    tags: ['Wan 2.1', '14B Parameters', 'Cinematic Motion', 'T2V & I2V']
  },
  {
    name: 'Kling',
    provider: 'Kuaishou AI',
    category: 'video',
    modelsCount: '10 models',
    specialty: 'Kling 1.5 Pro, Kling 2.0, Motion Brush, LipSync',
    description: 'Accurate real-world physics simulation, 1080p 30fps fluid motion, cinematic pan/tilt/zoom, and dynamic camera choreography.',
    tags: ['Kling 2.0', 'Motion Brush', 'Physical Realism', 'LipSync']
  },
  {
    name: 'MiniMax',
    provider: 'Hailuo AI',
    category: 'video',
    modelsCount: '7 models',
    specialty: 'Hailuo AI Video-01, Director Mode, Cinematic',
    description: 'Hyper-realistic human facial expressions, natural dialogue cadence, and photorealistic cinematic slow-motion.',
    tags: ['Hailuo Video-01', 'Realistic Humans', 'Cinematic Camera', 'Facial Physics']
  },
  {
    name: 'ByteDance',
    provider: 'ByteDance / Seedance',
    category: 'video',
    modelsCount: '6 models',
    specialty: 'Seedance 2.0, Jimeng Video, Choreography',
    description: 'Complex dance choreography, dynamic action scenes, high-frame-rate social video reels, and seamless character consistency.',
    tags: ['Seedance 2.0', 'Jimeng Video', 'Action & Dance', 'Reels']
  },
  {
    name: 'Google',
    provider: 'Google DeepMind',
    category: 'video',
    modelsCount: '4 models',
    specialty: 'Veo, Veo 2, Veo 3.1 Ultra, Veo Lite',
    description: 'Next-generation video foundation model. High-definition 1080p/4K, superior temporal consistency, and cinematic lens controls.',
    tags: ['Veo 3.1', 'Temporal Stability', '4K Cinematic', 'Lens Physics']
  },
  {
    name: 'Runway',
    provider: 'RunwayML',
    category: 'video',
    modelsCount: '3 models',
    specialty: 'Gen-3 Alpha, Gen-3 Turbo, Gen-2 Motion Brush',
    description: 'Pioneering Hollywood AI video tool. Dynamic multi-axis camera control, motion brush masking, and style transforms.',
    tags: ['Gen-3 Alpha', 'Motion Brush', 'Camera Control', 'VFX']
  },
  {
    name: 'OpenAI',
    provider: 'OpenAI',
    category: 'video',
    modelsCount: '2 models',
    specialty: 'Sora Ultra, Sora Extended 1080p',
    description: 'Deep 3D world modeling, persistent character identity, complex scene interactions, and photorealistic lighting.',
    tags: ['Sora', 'World Simulator', 'Persistent Identity', 'Photoreal']
  },
  {
    name: 'Luma',
    provider: 'Luma AI',
    category: 'video',
    modelsCount: '1 model',
    specialty: 'Dream Machine 1.5 & Ray 2 Engine',
    description: 'High-speed camera transitions, smooth morphing, dramatic perspective sweeps, and cinematic drone shots.',
    tags: ['Dream Machine', 'Drone Sweeps', 'Smooth Morphing', 'Fast']
  },
  {
    name: 'PixVerse',
    provider: 'PixVerse',
    category: 'video',
    modelsCount: '2 models',
    specialty: 'PixVerse v3 Realism & Anime Motion',
    description: 'Creative character animation, anime aesthetic motion, viral social media effects, and 4K upscale pass.',
    tags: ['PixVerse v3', 'Anime Motion', 'Social FX', '4K']
  },
  {
    name: 'Higgsfield',
    provider: 'Higgsfield AI',
    category: 'video',
    modelsCount: '2 models',
    specialty: 'Higgsfield Cinema Camera & Character Motion',
    description: 'Precision mobile camera tracking, dramatic dolly zooms, and social media creator-focused motion tools.',
    tags: ['Cinema Rig', 'Dolly Zoom', 'Creator Video']
  },
  {
    name: 'Veed',
    provider: 'Veed.io',
    category: 'video',
    modelsCount: '3 models',
    specialty: 'Veed AI Suite, Avatars & Auto-Shorts',
    description: 'Fast-turnaround social media commercial video pipelines, auto-captions, and digital talking presenters.',
    tags: ['Talking Avatar', 'Auto-Shorts', 'Timeline Sync']
  },
  {
    name: 'Flux Video',
    provider: 'Black Forest Labs Community',
    category: 'video',
    modelsCount: '1 model',
    specialty: 'Flux Motion & Animate Diff Node',
    description: 'Frame-consistent animation loops, style interpolation, and node-driven visual rhythm.',
    tags: ['Flux Animate', 'Style Loops', 'Interpolation']
  },
  {
    name: 'Grok Video',
    provider: 'xAI',
    category: 'video',
    modelsCount: '2 models',
    specialty: 'Grok Imagine Video & Motion Engine',
    description: 'Rapid video generation from textual descriptions with high motion range and creative storytelling.',
    tags: ['Grok Video', 'Storytelling', 'High Motion']
  }
];

// VOICE-OVER / MUSIC / SFX MODELS (as per user text & uploaded screenshot 3)
export const AI_AUDIO_MODELS: AIModelItem[] = [
  {
    name: 'ElevenLabs v3',
    provider: 'ElevenLabs',
    category: 'audio',
    isNew: true,
    specialty: 'Contextual Audio Tags & Emotion Delivery',
    description: 'Add audio tags to help guide delivery. Direct whisper, shouting, suspenseful murmurs, laughter, and hyper-realistic human inflections.',
    tags: ['Audio Tags', 'Emotion Guidance', 'Whispers & Shouts', 'Studio Voice']
  },
  {
    name: 'ElevenLabs v2',
    provider: 'ElevenLabs',
    category: 'audio',
    specialty: 'High-Quality Voice Synthesis & Voice Cloning',
    description: 'Flawless commercial voiceovers with natural cadence, zero robotic artifacts, voice cloning, and support for 29+ languages.',
    tags: ['Voice Cloning', '29+ Languages', 'Commercial VO', 'Natural Prosody']
  },
  {
    name: 'Gemini 2.5 Pro',
    provider: 'Google DeepMind',
    category: 'audio',
    specialty: 'Premium Voiceovers with Studio Quality',
    description: 'Premium voiceovers with studio quality and natural prosody. Seamless narration for cinematic documentaries and brand stories.',
    tags: ['Studio Quality', 'Natural Prosody', 'Cinematic Narration']
  },
  {
    name: 'Gemini 3.1 Flash TTS',
    provider: 'Google DeepMind',
    category: 'audio',
    isNew: true,
    specialty: 'Fast Multi-Speaker Synthesis with Style Instructions',
    description: 'Ultra-low latency conversational speech synthesis, multi-speaker dialogues, and real-time custom tone shaping.',
    tags: ['Multi-Speaker', 'Low Latency', 'Style Directives', 'Conversational']
  },
  {
    name: 'Seed Audio 1.0',
    provider: 'ByteDance',
    category: 'audio',
    specialty: 'High-Quality Speech Synthesis & Precise Audio Control',
    description: 'High-fidelity voice synthesis with fine-grained breath, pitch, cadence, and expressive pacing control for advertising.',
    tags: ['Fine Control', 'Breath & Cadence', 'Expressive Speech', 'Commercial']
  },
  {
    name: 'Flow Music',
    provider: 'Flow AI',
    category: 'audio',
    specialty: 'Cinematic AI Background Scoring & Beats',
    description: 'Original royalty-free musical arrangements, rhythm-matched beats for social reels, ambient cinematic textures, and custom build-ups.',
    tags: ['Royalty-Free', 'Cinematic Scoring', 'Beat Sync', 'Reels Audio']
  },
  {
    name: 'ChatGPT Voice & Text-To-Speech',
    provider: 'OpenAI',
    category: 'audio',
    specialty: 'Conversational Voice & Dynamic Articulation',
    description: 'High-intelligibility vocal output with expressive vocal coloration and natural pause intervals.',
    tags: ['Conversational', 'Dynamic Pacing', 'Voice Modulation']
  },
  {
    name: 'AI Sound Design & Foley FX',
    provider: 'Neural SFX Engine',
    category: 'audio',
    specialty: 'Whooshes, Riser Sweeps, Atmospheric Drones',
    description: 'Custom Foley effects, cinematic impact whooshes, futuristic UI beeps, and environmental soundscapes engineered for video impact.',
    tags: ['Foley FX', 'Whooshes & Risers', 'Impacts', 'Soundscapes']
  }
];

// -------------------------------------------------------------
// PART 3: MY SKILLS (Creative & Technical Capabilities)
// -------------------------------------------------------------
export const MY_SKILLS_DATA: ProfessionalSkill[] = [
  {
    id: 'graphic-design',
    title: 'Graphic Design',
    category: 'creative',
    categoryLabel: 'Design & Visual Identity',
    proficiency: 98,
    description: 'Comprehensive brand identity design, luxury event collateral, promotional banners, typographic layouts, packaging design, and multi-channel marketing assets.',
    deliverables: ['Brand Identity Systems', 'Social Media Templates', 'High-Converting Ad Graphics', 'Print Ready Banners'],
    iconType: 'Palette'
  },
  {
    id: 'video-editing',
    title: 'Video Editing',
    category: 'creative',
    categoryLabel: 'Post-Production & Motion',
    proficiency: 98,
    description: 'Expert commercial editing with high-retention hook architecture, dynamic transitions, pacing to beats, multi-cam assembly, and sound design.',
    deliverables: ['Instagram Reels / YouTube Shorts', 'Commercial Brand Spots', 'Product Unboxing Videos', 'Podcast / Long-Form Edits'],
    iconType: 'Video'
  },
  {
    id: 'ai-product-photography',
    title: 'AI Product Photography',
    category: 'ai-production',
    categoryLabel: 'Generative Studio',
    proficiency: 96,
    description: 'Creating hyper-realistic commercial product scenes without expensive studio rentals. Masterful lighting matching, contact shadows, and luxury material reflections.',
    deliverables: ['Luxury Cosmetic Shoots', 'E-Commerce Hero Assets', 'Contextual Lifestyle Placements', 'Packshot Retouching'],
    iconType: 'Camera'
  },
  {
    id: 'ai-marketing-creative',
    title: 'AI Marketing Creative Generation',
    category: 'commercial',
    categoryLabel: 'Growth & Advertising',
    proficiency: 97,
    description: 'High-cadence generative marketing creatives designed for paid performance ads (Meta, TikTok, Google Ads). Rapid A/B testing variations with distinctive angles.',
    deliverables: ['High-CTR Ad Creatives', 'A/B Test Creative Sets', 'Seasonal Campaign Visuals', 'Audience-Specific Hooks'],
    iconType: 'Sparkles'
  },
  {
    id: 'ai-ugc-ad-creation',
    title: 'AI UGC Ad Creation',
    category: 'commercial',
    categoryLabel: 'Growth & Advertising',
    proficiency: 95,
    description: 'Producing authentic-feeling User Generated Content ads with AI creators, natural voiceovers, dynamic text popups, and native TikTok/Reels pacing.',
    deliverables: ['Direct-Response UGC Ads', 'Hook-First Video Scripts', 'Customer Testimonial Concepts', 'Viral Trend Adaptation'],
    iconType: 'UserCheck'
  },
  {
    id: 'ai-product-showcase',
    title: 'AI Product Showcase & Visualization',
    category: 'ai-production',
    categoryLabel: 'Generative Studio',
    proficiency: 96,
    description: 'Exploded product views, 3D-style kinetic rotations, futuristic hologram displays, and premium brand launch animations.',
    deliverables: ['Hardware & Tech Unveilings', 'App Feature Visualizers', 'Macro Texture Deep Dives', 'Packaging Mockups'],
    iconType: 'Layers'
  },
  {
    id: 'ai-video-generation',
    title: 'AI Video Generation & Animation',
    category: 'ai-production',
    categoryLabel: 'Generative Studio',
    proficiency: 97,
    description: 'Harnessing Kling, Veo, Wan 2.1, and Runway to generate cinematic b-roll, fantasy scenes, action loops, and motion-tracked video elements from text or stills.',
    deliverables: ['Cinematic B-Roll Clips', 'Character Action Loops', 'Image-to-Video Extensions', 'Dynamic Camera Sequences'],
    iconType: 'Film'
  },
  {
    id: 'ai-image-enhancement',
    title: 'AI Image Enhancement & Upscaling',
    category: 'ai-production',
    categoryLabel: 'Post-Production',
    proficiency: 98,
    description: 'Restoring low-res assets into pristine 4K/8K masterworks. Frequency separation, neural texture synthesis, artifact cleaning, and professional grading.',
    deliverables: ['8K Print Upscaling', 'Noise & Compression Removal', 'Facial & Skin Pore Restoration', 'Lighting Re-Balancing'],
    iconType: 'Maximize'
  },
  {
    id: 'ai-commercial-advertising',
    title: 'AI Commercial & Advertising Content',
    category: 'commercial',
    categoryLabel: 'Commercial Campaigns',
    proficiency: 96,
    description: 'End-to-end commercial production blending AI-generated visuals with professional typography, corporate logos, custom music, and voiceovers.',
    deliverables: ['Full 30s-60s TVC / Web Spots', 'Brand Anthem Videos', 'Investor Pitch Teasers', 'Product Launch Promos'],
    iconType: 'Tv'
  },
  {
    id: 'ai-character-lifestyle',
    title: 'AI Character & Lifestyle Scene Generation',
    category: 'ai-production',
    categoryLabel: 'Generative Studio',
    proficiency: 95,
    description: 'Engineering consistent personas, diverse cultural representations, authentic lifestyle moments, fashion lookbooks, and high-fashion editorial portraits.',
    deliverables: ['Consistent Persona Seeding', 'Fashion & Apparel Lookbooks', 'Cultural & Street Scenes', 'Corporate Team Concepts'],
    iconType: 'Users'
  },
  {
    id: 'ai-concept-art-direction',
    title: 'AI Creative Concept & Art Direction',
    category: 'creative',
    categoryLabel: 'Creative Leadership',
    proficiency: 97,
    description: 'Translating client visions into comprehensive visual pitch decks, moodboards, color scripts, visual guidelines, and storyboard sequences before production.',
    deliverables: ['Visual Moodboards & Decks', 'Creative Storyboards', 'Color & Lighting Scripts', 'Brand Style Directives'],
    iconType: 'Compass'
  },
  {
    id: 'ai-voice-caption-generation',
    title: 'AI Voice & Caption Generation',
    category: 'creative',
    categoryLabel: 'Audio & Social',
    proficiency: 98,
    description: 'Synthesizing studio-grade emotional narration using ElevenLabs & Gemini TTS, paired with engaging kinetic subtitles styled for maximum social retention.',
    deliverables: ['Studio Emotional Voiceovers', 'Word-by-Word Kinetic Captions', 'Bilingual Dubbing & LipSync', 'Soundtrack Mixing'],
    iconType: 'Mic'
  },
  {
    id: 'prompt-engineering-tuning',
    title: 'Prompt Architecture & Negative Tuning',
    category: 'ai-production',
    categoryLabel: 'GenAI Core',
    proficiency: 99,
    description: 'Deep mathematical understanding of token weights, syntax structure, negative prompt boundaries, seed consistency, and model-specific parameter tuning.',
    deliverables: ['Reusable Production Prompts', 'Anatomy Error Eliminators', 'Model Parameter Cheat Sheets', 'Consistent Style Recipes'],
    iconType: 'Code'
  },
  {
    id: 'cinematic-color-grading',
    title: 'Cinematic Color Grading & Finishing',
    category: 'creative',
    categoryLabel: 'Post-Production',
    proficiency: 95,
    description: 'Crafting distinctive visual atmospheres through film stock emulation, teal & orange separation, skin tone preservation, and custom 3D LUT mastering.',
    deliverables: ['Custom Brand LUT Packages', 'Film Stock Emulation', 'HDR Color Balancing', 'Mood Tone Mapping'],
    iconType: 'Sliders'
  }
];
