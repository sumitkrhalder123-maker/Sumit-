import React, { useState, useEffect, useRef } from 'react';
import {
  MapPin,
  Compass,
  Maximize2,
  Minimize2,
  Navigation,
  ExternalLink,
  RotateCcw,
  Star,
  Plane,
  Building,
  Radio,
  Layers,
  Sparkles,
  LocateFixed
} from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';

type ZoomLevel = 'india' | 'bengal' | 'dumdum';

export const IndianThemeMap: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoomLevel, setZoomLevel] = useState<ZoomLevel>('india');
  const [hasAutoZoomed, setHasAutoZoomed] = useState(false);
  const [isZooming, setIsZooming] = useState(false);
  const [viewMode, setViewMode] = useState<'theme' | 'google-embed'>('theme');
  const [radarAngle, setRadarAngle] = useState(0);

  // Animate radar sweep in theme mode
  useEffect(() => {
    let animId: number;
    const animateRadar = () => {
      setRadarAngle((prev) => (prev + 1.8) % 360);
      animId = requestAnimationFrame(animateRadar);
    };
    animId = requestAnimationFrame(animateRadar);
    return () => cancelAnimationFrame(animId);
  }, []);

  // IntersectionObserver: When viewer scrolls into this section, trigger the automatic zoom sequence!
  useEffect(() => {
    const el = containerRef.current;
    if (!el || hasAutoZoomed) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasAutoZoomed) {
          triggerCinematicZoomSequence();
        }
      },
      { threshold: 0.35 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasAutoZoomed]);

  const triggerCinematicZoomSequence = () => {
    setHasAutoZoomed(true);
    setIsZooming(true);
    setZoomLevel('india');

    // Step 1: India Overview (1.2s)
    setTimeout(() => {
      // Step 2: West Bengal / Kolkata Region (1.4s)
      setZoomLevel('bengal');

      setTimeout(() => {
        // Step 3: Direct Target Lock on "Graphics Sumit" in Dum Dum
        setZoomLevel('dumdum');
        setIsZooming(false);
      }, 1400);
    }, 1200);
  };

  const handleManualZoom = (level: ZoomLevel) => {
    setZoomLevel(level);
  };

  // Coordinates for the SVG viewbox transformations
  // India viewBox center: ~ (500, 500)
  // Kolkata / Dum Dum coordinates in our 1000x1000 map coordinates: x = 690, y = 520
  const getViewBox = () => {
    switch (zoomLevel) {
      case 'india':
        return '0 0 1000 1000';
      case 'bengal':
        // Zoomed in 3x around Eastern India / Bengal
        return '530 380 320 320';
      case 'dumdum':
        // Zoomed in 10x directly into Dum Dum street quadrant
        return '645 480 90 90';
    }
  };

  return (
    <div
      ref={containerRef}
      id="indian-theme-map"
      className="relative rounded-3xl bg-[#090d16] border border-slate-800 shadow-2xl overflow-hidden flex flex-col"
    >
      {/* Top Map HUD Bar */}
      <div className="px-5 py-3.5 bg-slate-900/90 border-b border-slate-800/90 flex flex-wrap items-center justify-between gap-3 text-xs z-20">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span className="font-bold text-white tracking-wide uppercase">
              India Cartography: Graphics Sumit
            </span>
          </div>

          <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span>Verified Google Maps Studio</span>
          </span>
        </div>

        {/* Action controls */}
        <div className="flex items-center gap-2">
          <div className="flex rounded-xl bg-slate-800/80 p-0.5 border border-slate-700">
            <button
              onClick={() => setViewMode('theme')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'theme'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Themed Cartography
            </button>
            <button
              onClick={() => setViewMode('google-embed')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'google-embed'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Live Google Maps
            </button>
          </div>

          <a
            href={PERSONAL_INFO.googleMapsUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-cyan-500/50 transition-all"
            title="Open Graphics Sumit location on Google Maps in a new tab"
          >
            <span>Open in Google Maps</span>
            <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
          </a>
        </div>
      </div>

      {/* Main Map Canvas / Stage Area */}
      <div className="relative w-full h-[450px] sm:h-[520px] bg-[#05080f] overflow-hidden select-none">
        {viewMode === 'google-embed' ? (
          /* Live Interactive Google Maps Embed centered on Graphics Sumit / Dum Dum */
          <div className="w-full h-full relative">
            <iframe
              title="Google Maps Location - Graphics Sumit"
              src={`https://maps.google.com/maps?q=${encodeURIComponent('Graphics Sumit, North Dumdum, Kolkata')}&t=m&z=15&output=embed&iwloc=near`}
              className="w-full h-full border-0 filter invert-[90%] hue-rotate-180 contrast-[105%]"
              loading="lazy"
              allowFullScreen
            />
            {/* Dark mode tint overlay for seamless integration */}
            <div className="absolute inset-0 pointer-events-none border-2 border-cyan-500/20" />
          </div>
        ) : (
          /* Custom Cyber Themed Vector Map of India with Animated Zoom */
          <div className="w-full h-full relative flex items-center justify-center">
            {/* Background Grid Lines & Coordinates */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:36px_36px] pointer-events-none" />

            {/* Glowing Map SVG */}
            <svg
              viewBox={getViewBox()}
              className="w-full h-full transition-all duration-1000 ease-out"
              style={{
                filter: 'drop-shadow(0 0 16px rgba(0,240,255,0.08))',
              }}
            >
              <defs>
                {/* Glow Filters */}
                <filter id="cyanGlow" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>

                {/* Radar Sweep Gradient */}
                <radialGradient id="radarSweep" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.4" />
                  <stop offset="70%" stopColor="#0088ff" stopOpacity="0.1" />
                  <stop offset="100%" stopColor="#0088ff" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* 1. INDIA SUB-CONTINENT GEOGRAPHIC SILHOUETTE */}
              <g id="india-geometry">
                {/* Outer Subcontinent Boundary Path */}
                <path
                  d="M 390 120 
                     L 470 110 L 510 130 L 540 180 L 510 220 L 540 240 L 580 230 L 630 250 
                     L 700 240 L 760 270 L 800 290 L 820 330 L 790 350 L 740 330 L 710 370 
                     L 680 390 L 670 450 L 700 480 L 715 540 L 690 600 L 650 670 L 600 740 
                     L 540 820 L 510 880 L 490 880 L 460 810 L 430 730 L 400 660 L 370 580 
                     L 350 510 L 370 480 L 340 450 L 310 430 L 320 390 L 360 380 L 350 330 
                     L 330 280 L 350 240 L 360 190 Z"
                  fill="#0c1524"
                  stroke="#1e3a5f"
                  strokeWidth="2.5"
                  strokeLinejoin="round"
                  className="transition-colors duration-500 hover:fill-[#0e1b2f]"
                />

                {/* Internal State Corridors & Major Road Networks */}
                <path
                  d="M 390 280 L 470 310 L 580 330 L 690 520"
                  stroke="#0284c7"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                  opacity="0.6"
                />
                <path
                  d="M 690 520 L 600 740 L 510 880"
                  stroke="#0284c7"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                  opacity="0.6"
                />
                <path
                  d="M 350 510 L 470 540 L 690 520"
                  stroke="#0284c7"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                  opacity="0.6"
                />

                {/* West Bengal Region Highlight */}
                <path
                  d="M 660 410 L 685 415 L 705 450 L 715 510 L 695 560 L 670 540 L 665 480 Z"
                  fill="#00f0ff"
                  fillOpacity={zoomLevel === 'india' ? '0.15' : '0.08'}
                  stroke="#00f0ff"
                  strokeWidth={zoomLevel === 'india' ? '2' : '1'}
                  strokeDasharray={zoomLevel === 'dumdum' ? '2 2' : 'none'}
                />

                {/* Major Indian Hub Dots (Delhi, Mumbai, Bengaluru, Chennai) */}
                {zoomLevel === 'india' && (
                  <g id="major-cities" opacity="0.8">
                    {/* New Delhi */}
                    <circle cx="440" cy="280" r="4" fill="#38bdf8" />
                    <text x="448" y="284" fill="#94a3b8" fontSize="13" fontFamily="monospace">
                      NEW DELHI
                    </text>

                    {/* Mumbai */}
                    <circle cx="360" cy="530" r="4" fill="#38bdf8" />
                    <text x="290" y="534" fill="#94a3b8" fontSize="13" fontFamily="monospace">
                      MUMBAI
                    </text>

                    {/* Bengaluru */}
                    <circle cx="450" cy="740" r="4" fill="#38bdf8" />
                    <text x="458" y="744" fill="#94a3b8" fontSize="13" fontFamily="monospace">
                      BENGALURU
                    </text>

                    {/* Kolkata indicator */}
                    <circle cx="690" cy="520" r="6" fill="#00f0ff" filter="url(#cyanGlow)" />
                    <text x="702" y="525" fill="#00f0ff" fontWeight="bold" fontSize="16" fontFamily="sans-serif">
                      KOLKATA
                    </text>
                  </g>
                )}
              </g>

              {/* 2. REGIONAL STREET & DISTRICT GRID (Visible when zoomed in to Bengal / Dum Dum) */}
              {(zoomLevel === 'bengal' || zoomLevel === 'dumdum') && (
                <g id="local-dumdum-surroundings">
                  {/* Hooghly River Arterial Curve */}
                  <path
                    d="M 660 480 Q 675 510 682 545 Q 688 565 685 590"
                    fill="none"
                    stroke="#0284c7"
                    strokeWidth={zoomLevel === 'dumdum' ? '4' : '2'}
                    opacity="0.85"
                  />
                  <text
                    x="668"
                    y="505"
                    fill="#38bdf8"
                    fontSize={zoomLevel === 'dumdum' ? '2.5' : '6'}
                    opacity="0.6"
                  >
                    HOOGHLY RIVER
                  </text>

                  {/* Arterial Highways (Jessore Rd, Belghachia Rd, Kalyani Expy, VIP Rd) */}
                  <path
                    d="M 670 490 L 690 520 L 710 515 L 725 540"
                    fill="none"
                    stroke="#334155"
                    strokeWidth={zoomLevel === 'dumdum' ? '1.8' : '1'}
                  />
                  <path
                    d="M 680 500 L 690 520 L 705 535 L 710 560"
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth={zoomLevel === 'dumdum' ? '1.5' : '0.8'}
                    opacity="0.7"
                  />
                  <path
                    d="M 690 520 L 702 495 L 720 485"
                    fill="none"
                    stroke="#64748b"
                    strokeWidth={zoomLevel === 'dumdum' ? '1.2' : '0.8'}
                  />

                  {/* Local Landmark Pins (Matching User's Uploaded Map) */}
                  {zoomLevel === 'dumdum' && (
                    <g id="street-landmarks" opacity="0.95">
                      {/* North Dumdum (উত্তর দমদম) */}
                      <circle cx="690" cy="502" r="1.5" fill="#94a3b8" />
                      <text x="690" y="499" fill="#f1f5f9" fontSize="2.8" fontWeight="bold" textAnchor="middle">
                        North Dumdum / উত্তর দমদম
                      </text>

                      {/* Netaji Subhash Chandra Bose Int'l Airport */}
                      <g transform="translate(712, 508)">
                        <circle cx="0" cy="0" r="2.2" fill="#0284c7" />
                        <text x="3.5" y="0.8" fill="#38bdf8" fontSize="2.2" fontWeight="bold">
                          NSCB Int'l Airport (CCU) ✈️
                        </text>
                      </g>

                      {/* Dum Dum Junction Railway Station */}
                      <g transform="translate(675, 526)">
                        <rect x="-1.5" y="-1.5" width="3" height="3" fill="#64748b" rx="0.5" />
                        <text x="-2" y="4.5" fill="#cbd5e1" fontSize="2.0">
                          Dum Dum Junc. 🚉
                        </text>
                      </g>

                      {/* Dunlop */}
                      <g transform="translate(676, 508)">
                        <circle cx="0" cy="0" r="1.2" fill="#64748b" />
                        <text x="-2" y="-2" fill="#cbd5e1" fontSize="2.0">
                          Dunlop
                        </text>
                      </g>

                      {/* Baranagar */}
                      <g transform="translate(673, 516)">
                        <circle cx="0" cy="0" r="1.2" fill="#64748b" />
                        <text x="-2" y="-2" fill="#cbd5e1" fontSize="2.0">
                          Baranagar
                        </text>
                      </g>

                      {/* Diamond Plaza */}
                      <g transform="translate(692, 532)">
                        <circle cx="0" cy="0" r="1.2" fill="#38bdf8" />
                        <text x="2" y="1" fill="#38bdf8" fontSize="1.8">
                          Diamond Plaza 🛍️
                        </text>
                      </g>

                      {/* Charnock Hospital */}
                      <g transform="translate(705, 522)">
                        <circle cx="0" cy="0" r="1.4" fill="#ef4444" />
                        <text x="2.5" y="1" fill="#f87171" fontSize="1.8">
                          Charnock Hospital 🏥
                        </text>
                      </g>

                      {/* Baguiati / Kaikhali */}
                      <g transform="translate(704, 534)">
                        <circle cx="0" cy="0" r="1" fill="#64748b" />
                        <text x="1.8" y="1" fill="#94a3b8" fontSize="1.8">
                          Baguiati / Kaikhali
                        </text>
                      </g>
                    </g>
                  )}
                </g>
              )}

              {/* 3. PRIMARY TARGET: GRAPHICS SUMIT (GRAPHICS SUMIT PINPOINT) */}
              <g id="graphics-sumit-target-pin" transform="translate(690, 520)">
                {/* Radar Concentric Pulsing Rings */}
                <circle
                  cx="0"
                  cy="0"
                  r={zoomLevel === 'dumdum' ? '8' : zoomLevel === 'bengal' ? '18' : '30'}
                  fill="none"
                  stroke="#00f0ff"
                  strokeWidth={zoomLevel === 'dumdum' ? '0.4' : '1.2'}
                  opacity="0.8"
                >
                  <animate attributeName="r" values="2;28" dur="2.5s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="1;0" dur="2.5s" repeatCount="indefinite" />
                </circle>

                <circle
                  cx="0"
                  cy="0"
                  r={zoomLevel === 'dumdum' ? '5' : '14'}
                  fill="none"
                  stroke="#00f0ff"
                  strokeWidth={zoomLevel === 'dumdum' ? '0.3' : '1'}
                  opacity="0.6"
                >
                  <animate attributeName="r" values="2;18" dur="2.5s" begin="0.8s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.8;0" dur="2.5s" begin="0.8s" repeatCount="indefinite" />
                </circle>

                {/* Target Reticle Crosshairs */}
                <line
                  x1={zoomLevel === 'dumdum' ? '-12' : '-35'}
                  y1="0"
                  x2={zoomLevel === 'dumdum' ? '12' : '35'}
                  y2="0"
                  stroke="#00f0ff"
                  strokeWidth={zoomLevel === 'dumdum' ? '0.3' : '1'}
                  strokeDasharray="2 2"
                  opacity="0.75"
                />
                <line
                  x1="0"
                  y1={zoomLevel === 'dumdum' ? '-12' : '-35'}
                  x2="0"
                  y2={zoomLevel === 'dumdum' ? '12' : '35'}
                  stroke="#00f0ff"
                  strokeWidth={zoomLevel === 'dumdum' ? '0.3' : '1'}
                  strokeDasharray="2 2"
                  opacity="0.75"
                />

                {/* Pinpoint Anchor Core */}
                <circle cx="0" cy="0" r={zoomLevel === 'dumdum' ? '1.5' : '4'} fill="#ef4444" filter="url(#cyanGlow)" />

                {/* PROMINENT PIN & BADGE (Scaled according to zoom) */}
                {zoomLevel === 'dumdum' ? (
                  /* Ultra-Detail Close-Up Pin matching Google Maps uploaded screenshot */
                  <g transform="translate(0, -2)">
                    {/* Red Map Pin SVG */}
                    <path
                      d="M 0 -7 C -2.5 -7 -4.5 -5 -4.5 -2.5 C -4.5 1 0 7 0 7 C 0 7 4.5 1 4.5 -2.5 C 4.5 -5 2.5 -7 0 -7 Z"
                      fill="#ef4444"
                      stroke="#ffffff"
                      strokeWidth="0.5"
                    />
                    <circle cx="0" cy="-2.5" r="1.5" fill="#ffffff" />
                    <circle cx="0" cy="-2.5" r="0.8" fill="#ef4444" />

                    {/* Star Marker badge right beside */}
                    <g transform="translate(4.5, -0.5)">
                      <circle cx="0" cy="0" r="1.8" fill="#f59e0b" stroke="#ffffff" strokeWidth="0.3" />
                      <polygon
                        points="0,-1.1 0.35,-0.35 1.1,-0.35 0.5,0.1 0.7,0.85 0,0.4 -0.7,0.85 -0.5,0.1 -1.1,-0.35 -0.35,-0.35"
                        fill="#ffffff"
                      />
                    </g>

                    {/* Prominent Label: GRAPHICS SUMIT & BENGALI SUBTITLE */}
                    <g transform="translate(0, -9)">
                      {/* Dark Backdrop Pill */}
                      <rect
                        x="-24"
                        y="-7.5"
                        width="48"
                        height="8.5"
                        rx="2"
                        fill="#070a11"
                        stroke="#00f0ff"
                        strokeWidth="0.4"
                        filter="url(#cyanGlow)"
                      />

                      {/* Text */}
                      <text
                        x="0"
                        y="-3"
                        fill="#ffffff"
                        fontSize="3.2"
                        fontWeight="900"
                        fontFamily="sans-serif"
                        textAnchor="middle"
                        letterSpacing="0.2"
                      >
                        Graphics Sumit ⭐
                      </text>
                      <text
                        x="0"
                        y="-0.2"
                        fill="#00f0ff"
                        fontSize="2.1"
                        fontWeight="bold"
                        fontFamily="sans-serif"
                        textAnchor="middle"
                      >
                        গ্রাফিক্স সুমিত • Creative Studio
                      </text>
                    </g>
                  </g>
                ) : (
                  /* Regional & India Overview Pin */
                  <g transform="translate(0, -6)">
                    <rect
                      x="-65"
                      y="-28"
                      width="130"
                      height="24"
                      rx="6"
                      fill="#070a11"
                      stroke="#00f0ff"
                      strokeWidth="1.5"
                      filter="url(#cyanGlow)"
                    />
                    <text
                      x="0"
                      y="-12"
                      fill="#ffffff"
                      fontSize="12"
                      fontWeight="bold"
                      fontFamily="sans-serif"
                      textAnchor="middle"
                    >
                      📍 GRAPHICS SUMIT
                    </text>
                  </g>
                )}
              </g>
            </svg>

            {/* In-Map HUD Telemetry Overlay (Bottom Left) */}
            <div className="absolute bottom-4 left-4 z-10 font-mono text-[11px] text-cyan-300 bg-slate-900/85 backdrop-blur-md p-3 rounded-2xl border border-cyan-500/30 shadow-xl space-y-1">
              <div className="flex items-center gap-2 font-bold text-white">
                <LocateFixed className="w-4 h-4 text-cyan-400" />
                <span>LOCATION: GRAPHICS SUMIT</span>
              </div>
              <div className="text-[10px] text-slate-400">
                COORDINATES: <span className="text-cyan-400 font-bold">22.6450° N, 88.4050° E</span>
              </div>
              <div className="text-[10px] text-slate-400">
                AREA: North Dumdum, Kolkata 700028, West Bengal
              </div>
              <div className="text-[10px] text-emerald-400 flex items-center gap-1 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>GOOGLE MAPS LISTED ENTITY</span>
              </div>
            </div>

            {/* In-Map Zoom Controls (Bottom Right) */}
            <div className="absolute bottom-4 right-4 z-10 flex flex-col gap-1.5 bg-slate-900/90 backdrop-blur-md p-1.5 rounded-2xl border border-slate-700 shadow-xl">
              <button
                onClick={() => handleManualZoom('dumdum')}
                className={`p-2 rounded-xl text-xs font-bold transition-all ${
                  zoomLevel === 'dumdum'
                    ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
                title="Zoom directly into Graphics Sumit Dum Dum street view"
              >
                <Maximize2 className="w-4 h-4" />
              </button>

              <button
                onClick={() => handleManualZoom('bengal')}
                className={`p-2 rounded-xl text-xs font-bold transition-all ${
                  zoomLevel === 'bengal'
                    ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
                title="Regional View: West Bengal & Kolkata Corridor"
              >
                <Building className="w-4 h-4" />
              </button>

              <button
                onClick={() => handleManualZoom('india')}
                className={`p-2 rounded-xl text-xs font-bold transition-all ${
                  zoomLevel === 'india'
                    ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
                title="Zoom out to Full India Map"
              >
                <Minimize2 className="w-4 h-4" />
              </button>

              <button
                onClick={triggerCinematicZoomSequence}
                disabled={isZooming}
                className="p-2 rounded-xl text-xs font-bold text-cyan-400 hover:text-white hover:bg-cyan-950/60 border border-cyan-500/30 transition-all"
                title="Replay cinematic zoom sequence into Graphics Sumit"
              >
                <RotateCcw className={`w-4 h-4 ${isZooming ? 'animate-spin' : ''}`} />
              </button>
            </div>

            {/* Active Flight Sequence Status Banner */}
            {isZooming && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 px-4 py-1.5 rounded-full bg-cyan-950/90 border border-cyan-400 text-cyan-300 text-xs font-mono font-bold shadow-2xl animate-pulse flex items-center gap-2">
                <Navigation className="w-3.5 h-3.5 animate-bounce" />
                <span>
                  {zoomLevel === 'india'
                    ? 'LOCKING SATELLITE VECTOR // INDIA OVERVIEW'
                    : 'ZOOMING INTO DUM DUM, KOLKATA: GRAPHICS SUMIT'}
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Map Footer Bar with Direct Address & Directions */}
      <div className="px-6 py-4 bg-slate-900/90 border-t border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
        <div className="space-y-1 max-w-xl">
          <div className="flex items-center gap-2 text-white font-bold">
            <MapPin className="w-4 h-4 text-rose-500" />
            <span>Graphics Sumit (গ্রাফিক্স সুমিত)</span>
          </div>
          <p className="text-slate-300 text-xs leading-relaxed">
            Near Dum Dum Junction, North Dumdum, Kolkata 700028, West Bengal, India. Accessible via Jessore Road & Belghachia Road.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={triggerCinematicZoomSequence}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold text-cyan-300 bg-cyan-950/40 hover:bg-cyan-950/70 border border-cyan-500/30 transition-all flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Replay Zoom In</span>
          </button>

          <a
            href={PERSONAL_INFO.googleMapsUrl}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-500/25 transition-all flex items-center gap-1.5"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>Get Directions</span>
          </a>
        </div>
      </div>
    </div>
  );
};
