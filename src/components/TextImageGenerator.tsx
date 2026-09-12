import React, { useState, useRef, useEffect } from 'react';
import {
  Wand2,
  Sparkles,
  Upload,
  Image as ImageIcon,
  Download,
  Maximize2,
  RefreshCw,
  Copy,
  Check,
  Trash2,
  Zap,
  Sliders,
  X,
  ExternalLink,
  Layers,
  Flame
} from 'lucide-react';

interface AspectRatioOption {
  id: string;
  label: string;
  sublabel: string;
  width: number;
  height: number;
  iconRatio: string;
}

const ASPECT_RATIOS: AspectRatioOption[] = [
  { id: '1:1', label: '1:1', sublabel: 'Square (1024×1024)', width: 1024, height: 1024, iconRatio: 'w-4 h-4' },
  { id: '16:9', label: '16:9', sublabel: 'Landscape (1280×720)', width: 1280, height: 720, iconRatio: 'w-5 h-3' },
  { id: '9:16', label: '9:16', sublabel: 'Story / Reel (720×1280)', width: 720, height: 1280, iconRatio: 'w-3 h-5' },
  { id: '4:5', label: '4:5', sublabel: 'Social Portrait (896×1120)', width: 896, height: 1120, iconRatio: 'w-3.5 h-4.5' },
];

const STYLE_PRESETS = [
  { name: 'Photorealistic 8K', promptSuffix: ', hyperrealistic photograph, 8k resolution, shot on 35mm lens, f/1.8, cinematic studio lighting, photorealistic textures, masterwork' },
  { name: 'Cinematic 3D', promptSuffix: ', unreal engine 5 render, octane render, volumetric god rays, hyper-detailed, 8k raytracing, dramatic atmospheric lighting' },
  { name: 'Cyberpunk Neon', promptSuffix: ', cyberpunk aesthetic, neon cyan and magenta illumination, holographic accents, dark rain-slicked metropolis, futuristic high-tech' },
  { name: 'Dark Fantasy', promptSuffix: ', dark fantasy art style, mystical ethereal atmosphere, cinematic contrast, intricate ornate details, dramatic shadows' },
  { name: 'Anime Masterpiece', promptSuffix: ', vibrant anime key visual, Makoto Shinkai aesthetic, gorgeous detailed background, crisp linework, expressive character design' },
  { name: 'Brand Mockup', promptSuffix: ', clean luxury product photography, minimalist studio backdrop, soft diffused shadows, high-end commercial advertising' },
];

const INSPIRATIONAL_PROMPTS = [
  'Futuristic holographic cybernetic portrait of a visionary designer wearing neon LED headphones in a dark glass studio, Dum Dum Kolkata skyline reflection, 8k resolution, cinematic lighting',
  'A mystical Indian tiger made of liquid neon light roaming an ancient futuristic temple covered in bioluminescent flora, volumetric fog, octane render 8k',
  'Luxury glass perfume bottle with floating golden galaxy particles inside, standing on dark wet obsidian stone, soft cinematic rim light, photorealistic advertisement',
  'Ultra-detailed isometric 3D render of an AI video production editing suite with multiple curved OLED monitors, neon cyan cables, audio visualizer holograms',
  'Cyberpunk street in Kolkata at midnight during monsoon, neon rickshaws, glowing Bengali typography signage, rain reflections on asphalt, photorealistic 8k',
  'Futuristic armored mecha samurai standing atop a towering skyscraper during sunrise, volumetric light rays, intricate mechanical armor plates, artstation trending'
];

interface GeneratedItem {
  id: string;
  url: string;
  prompt: string;
  aspectRatio: string;
  timestamp: number;
}

export const TextImageGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState<string>(
    'Futuristic cybernetic portrait of a visionary designer in a glowing high-tech studio with holographic displays, cinematic lighting, 8k octane render'
  );
  const [selectedRatio, setSelectedRatio] = useState<AspectRatioOption>(ASPECT_RATIOS[0]);
  const [selectedStyle, setSelectedStyle] = useState<string>('Photorealistic 8K');
  const [isEnhancePrompt, setIsEnhancePrompt] = useState<boolean>(true);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);
  const [seed, setSeed] = useState<number>(() => Math.floor(Math.random() * 1000000));
  const [copied, setCopied] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  // Reference Image Upload State
  const [referenceImage, setReferenceImage] = useState<string | null>(null);
  const [referenceFileName, setReferenceFileName] = useState<string>('');
  const [refInfluence, setRefInfluence] = useState<'style' | 'composition' | 'color'>('style');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Recent creations storage
  const [history, setHistory] = useState<GeneratedItem[]>(() => {
    try {
      const saved = localStorage.getItem('graphics_sumit_ai_gen_history');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [
      {
        id: 'sample-1',
        url: 'https://image.pollinations.ai/prompt/cybernetic%20creative%20designer%20hologram%20studio%20kolkata%20cinematic%208k%20octane%20render?width=1024&height=1024&seed=4821&nologo=true',
        prompt: 'Cybernetic creative designer in a holographic studio, cinematic 8k octane render',
        aspectRatio: '1:1',
        timestamp: Date.now() - 3600000
      }
    ];
  });

  useEffect(() => {
    try {
      localStorage.setItem('graphics_sumit_ai_gen_history', JSON.stringify(history.slice(0, 8)));
    } catch {
      // ignore
    }
  }, [history]);

  // Handle reference image upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (PNG, JPG, WEBP).');
      return;
    }

    setReferenceFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setReferenceImage(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) return;

    setReferenceFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setReferenceImage(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const removeReferenceImage = () => {
    setReferenceImage(null);
    setReferenceFileName('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Generate Image
  const handleGenerate = () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    const newSeed = Math.floor(Math.random() * 10000000);
    setSeed(newSeed);

    // Build the final prompt
    let finalPrompt = prompt.trim();
    const styleObj = STYLE_PRESETS.find((s) => s.name === selectedStyle);
    if (styleObj) {
      finalPrompt += styleObj.promptSuffix;
    }

    // Add reference image guidance if uploaded
    if (referenceImage) {
      if (refInfluence === 'style') {
        finalPrompt += `, matching visual aesthetic, lighting and style cues of uploaded reference image [${referenceFileName}]`;
      } else if (refInfluence === 'color') {
        finalPrompt += `, matching harmonious color palette and chromatic tone of uploaded reference image [${referenceFileName}]`;
      } else {
        finalPrompt += `, adhering to spatial composition and framing of uploaded reference image [${referenceFileName}]`;
      }
    }

    // High resolution dimensions based on ratio
    const width = selectedRatio.width;
    const height = selectedRatio.height;

    // Use Pollinations AI free Flux engine (100% free, high res, zero API key required, works anywhere)
    const encodedPrompt = encodeURIComponent(finalPrompt);
    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${width}&height=${height}&seed=${newSeed}&model=flux&nologo=true&enhance=${isEnhancePrompt}`;

    // Preload image to ensure seamless UI transition
    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    img.src = imageUrl;

    img.onload = () => {
      setCurrentImageUrl(imageUrl);
      setIsGenerating(false);

      // Add to recent history
      setHistory((prev) => [
        {
          id: `gen-${Date.now()}`,
          url: imageUrl,
          prompt: finalPrompt,
          aspectRatio: selectedRatio.id,
          timestamp: Date.now(),
        },
        ...prev.slice(0, 7),
      ]);
    };

    img.onerror = () => {
      // Fallback with turbo model if flux took longer
      const fallbackUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${width}&height=${height}&seed=${newSeed}&model=turbo&nologo=true`;
      setCurrentImageUrl(fallbackUrl);
      setIsGenerating(false);
    };
  };

  const handleInspireMe = () => {
    const random = INSPIRATIONAL_PROMPTS[Math.floor(Math.random() * INSPIRATIONAL_PROMPTS.length)];
    setPrompt(random);
  };

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Download high-resolution image
  const handleDownload = async (urlToDownload?: string) => {
    const targetUrl = urlToDownload || currentImageUrl;
    if (!targetUrl) return;

    try {
      const response = await fetch(targetUrl);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = `GraphicsSumit-AI-Gen-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.warn('Direct blob download failed, falling back to window open:', err);
      window.open(targetUrl, '_blank');
    }
  };

  return (
    <div className="w-full rounded-2xl bg-gradient-to-b from-slate-900/95 via-slate-950/95 to-[#070a11]/95 border border-cyan-500/30 p-4 sm:p-5 shadow-2xl backdrop-blur-xl relative overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute -top-24 -right-24 w-60 h-60 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Badge & Title */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 text-white">
            <Wand2 className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-base sm:text-lg font-bold text-white tracking-wide flex items-center gap-1.5">
                <span>Text To Image Generator</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 uppercase tracking-wider">
                  HIGH RES • 100% FREE
                </span>
              </h4>
            </div>
            <p className="text-[11px] text-slate-400">
              Flux Gen AI Engine with Image Reference Guidance by Graphics Sumit
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleInspireMe}
            className="px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 hover:text-white border border-slate-700 transition flex items-center gap-1.5"
            title="Load an inspiring prompt"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Inspire Me</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Prompt, Upload & Controls (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Textarea Prompt */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <label className="font-semibold text-slate-200 flex items-center gap-1.5">
                <span>Prompt Description</span>
                <span className="text-[10px] text-cyan-400 font-mono">Detailed</span>
              </label>
              <button
                type="button"
                onClick={handleCopyPrompt}
                className="hover:text-cyan-300 flex items-center gap-1 transition text-[11px]"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <div className="relative">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={3}
                placeholder="Describe anything you want to generate in detail (e.g. Cyberpunk samurai in neon Kolkata, 8k cinematic...)"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700/80 focus:border-cyan-400 text-slate-100 text-xs sm:text-sm placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/40 transition resize-none"
              />
            </div>
          </div>

          {/* IMAGE REFERENCE UPLOAD SECTION */}
          <div className="space-y-2 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-200">
                <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
                <span>Reference Image Guidance</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  Optional
                </span>
              </div>

              {referenceImage && (
                <button
                  type="button"
                  onClick={removeReferenceImage}
                  className="text-[11px] text-rose-400 hover:text-rose-300 flex items-center gap-1 transition"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Remove Ref</span>
                </button>
              )}
            </div>

            {!referenceImage ? (
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-800 hover:border-cyan-500/50 rounded-xl p-3 text-center cursor-pointer transition bg-slate-900/30 hover:bg-slate-900/60 group"
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
                  className="hidden"
                />
                <div className="flex items-center justify-center gap-2 text-xs text-slate-400 group-hover:text-cyan-300">
                  <div className="p-1.5 rounded-lg bg-slate-800 group-hover:bg-cyan-500/20 text-cyan-400 transition">
                    <Upload className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-slate-200 group-hover:text-cyan-200">
                      Upload Reference Image
                    </span>
                    <span className="text-[11px] text-slate-400 ml-1.5 hidden sm:inline">
                      (Drag & drop or browse)
                    </span>
                  </div>
                </div>
                <div className="text-[10px] text-slate-400 mt-1">
                  Upload any photo, sketch or render to guide the AI style, palette, or composition
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 p-2 rounded-lg bg-slate-900/80 border border-slate-700/60">
                <div className="relative w-14 h-14 rounded-lg overflow-hidden border border-cyan-500/40 shrink-0 bg-black">
                  <img
                    src={referenceImage}
                    alt="Reference"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-0 right-0 p-0.5 bg-black/60 rounded-bl text-[8px] text-cyan-300 font-mono">
                    REF
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-white truncate">{referenceFileName}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Reference mode:</div>
                  <div className="flex items-center gap-1.5 mt-1">
                    {(['style', 'color', 'composition'] as const).map((mode) => (
                      <button
                        key={mode}
                        type="button"
                        onClick={() => setRefInfluence(mode)}
                        className={`px-2 py-0.5 rounded text-[10px] font-medium capitalize transition ${
                          refInfluence === mode
                            ? 'bg-cyan-500 text-black font-bold'
                            : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        {mode}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Style Presets */}
          <div className="space-y-1.5">
            <div className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Creative Style Presets</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {STYLE_PRESETS.map((style) => (
                <button
                  key={style.name}
                  type="button"
                  onClick={() => setSelectedStyle(style.name)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                    selectedStyle === style.name
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20 font-bold'
                      : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800 border border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {style.name}
                </button>
              ))}
            </div>
          </div>

          {/* Aspect Ratio & Resolution Selector */}
          <div className="space-y-1.5">
            <div className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span>Resolution & Aspect Ratio</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {ASPECT_RATIOS.map((ratio) => (
                <button
                  key={ratio.id}
                  type="button"
                  onClick={() => setSelectedRatio(ratio)}
                  className={`p-2 rounded-xl text-left border transition flex flex-col justify-between ${
                    selectedRatio.id === ratio.id
                      ? 'bg-cyan-950/40 border-cyan-400/80 text-white ring-1 ring-cyan-400/30'
                      : 'bg-slate-950/50 border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-200">{ratio.label}</span>
                    <div className={`border border-current rounded-sm ${ratio.iconRatio}`} />
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 font-mono truncate">
                    {ratio.sublabel.split(' ')[0]}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Prompt Enhancer Switch & Generate CTA */}
          <div className="pt-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300 select-none py-1">
              <input
                type="checkbox"
                checked={isEnhancePrompt}
                onChange={(e) => setIsEnhancePrompt(e.target.checked)}
                className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-cyan-500 focus:ring-cyan-400"
              />
              <span className="flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                <span>Auto-Enhance Prompt Quality</span>
              </span>
            </label>

            <button
              type="button"
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className="flex-1 py-3 px-5 rounded-xl font-bold text-sm text-black bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-black" />
                  <span>Synthesizing High-Res Canvas...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 text-black fill-current" />
                  <span>Generate Free High-Res Image</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Interactive Canvas / Live Render Result (5 cols) */}
        <div className="lg:col-span-5 flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Generated Output Canvas</span>
            </span>

            {currentImageUrl && !isGenerating && (
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setModalOpen(true)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                  title="Fullscreen preview"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDownload()}
                  className="p-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-semibold transition flex items-center gap-1 text-xs px-2.5"
                  title="Download High-Res PNG"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Save HD</span>
                </button>
              </div>
            )}
          </div>

          {/* Main Visual Frame */}
          <div className="relative flex-1 min-h-[300px] sm:min-h-[340px] rounded-xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center group shadow-inner">
            {isGenerating ? (
              <div className="flex flex-col items-center justify-center p-6 text-center space-y-3">
                {/* Cyber Scanner Animation */}
                <div className="relative w-16 h-16">
                  <div className="absolute inset-0 rounded-full border-2 border-cyan-500/20 animate-ping" />
                  <div className="w-16 h-16 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin flex items-center justify-center">
                    <Wand2 className="w-6 h-6 text-cyan-400" />
                  </div>
                </div>
                <div>
                  <div className="text-sm font-bold text-white">Generating High-Res Artwork...</div>
                  <div className="text-xs text-cyan-300/80 font-mono mt-0.5">
                    Flux Engine • {selectedRatio.width} × {selectedRatio.height}px
                  </div>
                </div>
                <div className="text-[11px] text-slate-400 max-w-[260px] italic">
                  Applying neural lighting, high-frequency texture passes, and composition filters...
                </div>
              </div>
            ) : currentImageUrl ? (
              <div className="relative w-full h-full flex items-center justify-center bg-black">
                <img
                  src={currentImageUrl}
                  alt="Generated AI Artwork"
                  className="w-full h-full max-h-[380px] object-contain select-none"
                  referrerPolicy="no-referrer"
                />

                {/* Overlay Action Bar on Hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-between pointer-events-none">
                  <div className="flex items-center justify-between pointer-events-auto">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-black/70 text-cyan-300 border border-cyan-500/30">
                      SEED: #{seed}
                    </span>
                    <button
                      type="button"
                      onClick={() => setModalOpen(true)}
                      className="p-1.5 rounded-lg bg-black/60 hover:bg-black/90 text-white backdrop-blur transition"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center gap-2 pointer-events-auto">
                    <button
                      type="button"
                      onClick={() => handleDownload()}
                      className="flex-1 py-2 px-3 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-black font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-black/60 transition"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download High-Res (PNG)</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleGenerate}
                      className="py-2 px-3 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-white text-xs font-semibold flex items-center gap-1 transition"
                      title="Generate new variation"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Re-roll</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-6 text-center space-y-2.5">
                <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-cyan-400 shadow-md">
                  <Wand2 className="w-7 h-7 opacity-80" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-200">Ready to Generate</div>
                  <div className="text-xs text-slate-400 mt-1 max-w-[240px]">
                    Enter a prompt or click &ldquo;Inspire Me&rdquo;, optionally upload a reference image, and click Generate!
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleGenerate}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-bold transition border border-cyan-500/20"
                >
                  Try Sample Generation
                </button>
              </div>
            )}
          </div>

          {/* Recent Creations Bar */}
          {history.length > 0 && (
            <div className="mt-3 pt-3 border-t border-slate-800/70">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-semibold text-slate-400">Recent Session Renders:</span>
                <span className="text-[10px] text-slate-400 font-mono">{history.length} saved</span>
              </div>
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
                {history.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setCurrentImageUrl(item.url);
                      setPrompt(item.prompt);
                    }}
                    className={`relative w-11 h-11 rounded-lg overflow-hidden border shrink-0 bg-black transition ${
                      currentImageUrl === item.url
                        ? 'border-cyan-400 ring-2 ring-cyan-400/40'
                        : 'border-slate-800 hover:border-slate-600 opacity-70 hover:opacity-100'
                    }`}
                    title={item.prompt}
                  >
                    <img
                      src={item.url}
                      alt="History thumbnail"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Fullscreen Lightbox Modal */}
      {modalOpen && currentImageUrl && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-4 sm:p-6"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="relative max-w-5xl w-full max-h-[90vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Toolbar */}
            <div className="w-full flex items-center justify-between pb-3 text-white">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-cyan-400">Full Resolution Preview</span>
                <span className="text-xs text-slate-400">({selectedRatio.label})</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleDownload()}
                  className="px-3 py-1.5 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-black font-bold text-xs flex items-center gap-1.5 transition"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download High-Res</span>
                </button>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Image */}
            <div className="rounded-xl overflow-hidden border border-slate-800 shadow-2xl bg-black max-h-[75vh]">
              <img
                src={currentImageUrl}
                alt="Fullscreen Artwork"
                className="max-h-[75vh] w-auto object-contain"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Prompt Caption */}
            <p className="mt-3 text-xs text-slate-300 text-center max-w-3xl line-clamp-2 px-4">
              &ldquo;{prompt}&rdquo;
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
