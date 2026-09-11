import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Sparkles, RotateCw, Eye, Zap, Compass, Activity, Layers } from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';

type ColorTheme = 'cyan' | 'emerald' | 'purple';

const COLOR_PALETTES: Record<ColorTheme, { primary: number; secondary: number; accent: number; text: string; bgBadge: string }> = {
  cyan: {
    primary: 0x00f0ff,
    secondary: 0x0088ff,
    accent: 0x70ffff,
    text: 'text-cyan-400',
    bgBadge: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300',
  },
  emerald: {
    primary: 0x00ff88,
    secondary: 0x00aa55,
    accent: 0xaaffcc,
    text: 'text-emerald-400',
    bgBadge: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300',
  },
  purple: {
    primary: 0xb026ff,
    secondary: 0x6610f2,
    accent: 0xe0aaff,
    text: 'text-purple-400',
    bgBadge: 'bg-purple-500/10 border-purple-500/30 text-purple-300',
  },
};

export const OfficeHologram: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeTheme, setActiveTheme] = useState<ColorTheme>('cyan');
  const [autoRotate, setAutoRotate] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [fps, setFps] = useState(60);

  const sceneRef = useRef<THREE.Scene | null>(null);
  const materialsRef = useRef<THREE.Material[]>([]);
  const scanWaveRef = useRef<THREE.Mesh | null>(null);
  const scanTimeRef = useRef(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene Setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.fog = new THREE.FogExp2(0x070a11, 0.04);

    const width = container.clientWidth || 400;
    const height = container.clientHeight || 450;

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 4.2, 7.8);
    camera.lookAt(0, 0.9, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    container.appendChild(renderer.domElement);

    const palette = COLOR_PALETTES[activeTheme];

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(palette.primary, 3.5, 15);
    pointLight.position.set(0, 4, 2);
    scene.add(pointLight);

    const rimLight = new THREE.DirectionalLight(palette.secondary, 2.0);
    rimLight.position.set(-5, 6, -3);
    scene.add(rimLight);

    // Group for whole hologram
    const hologramGroup = new THREE.Group();
    scene.add(hologramGroup);

    // Materials store
    const mats: THREE.Material[] = [];

    const wireframeMat = new THREE.MeshStandardMaterial({
      color: palette.primary,
      wireframe: true,
      transparent: true,
      opacity: 0.7,
      emissive: palette.primary,
      emissiveIntensity: 0.35,
    });
    mats.push(wireframeMat);

    const glassMat = new THREE.MeshPhysicalMaterial({
      color: palette.secondary,
      transparent: true,
      opacity: 0.3,
      metalness: 0.1,
      roughness: 0.2,
      transmission: 0.8,
      thickness: 0.5,
      emissive: palette.primary,
      emissiveIntensity: 0.15,
    });
    mats.push(glassMat);

    const glowLineMat = new THREE.LineBasicMaterial({
      color: palette.accent,
      transparent: true,
      opacity: 0.9,
    });
    mats.push(glowLineMat);

    materialsRef.current = mats;

    // --- 3D OFFICE ARCHITECTURE ---

    // A. Holographic Emitter Pedestal (Base Platform)
    const baseCylinderGeo = new THREE.CylinderGeometry(3.2, 3.4, 0.35, 48);
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0x09101d,
      roughness: 0.4,
      metalness: 0.8,
      wireframe: false,
    });
    const baseMesh = new THREE.Mesh(baseCylinderGeo, baseMat);
    baseMesh.position.y = -0.18;
    hologramGroup.add(baseMesh);

    // Glowing Neon Rim around Pedestal
    const torusGeo = new THREE.TorusGeometry(3.3, 0.04, 16, 64);
    const torusMat = new THREE.MeshBasicMaterial({ color: palette.primary });
    const torusMesh = new THREE.Mesh(torusGeo, torusMat);
    torusMesh.rotation.x = Math.PI / 2;
    torusMesh.position.y = 0;
    hologramGroup.add(torusMesh);

    // Concentric rotating rings on pedestal
    const innerRingGeo = new THREE.RingGeometry(2.2, 2.25, 48);
    const ringMat = new THREE.MeshBasicMaterial({
      color: palette.accent,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.5,
    });
    const innerRing = new THREE.Mesh(innerRingGeo, ringMat);
    innerRing.rotation.x = Math.PI / 2;
    innerRing.position.y = 0.02;
    hologramGroup.add(innerRing);

    // B. Holographic Floor Grid
    const gridHelper = new THREE.GridHelper(5.5, 22, palette.primary, palette.secondary);
    gridHelper.position.y = 0.01;
    (gridHelper.material as THREE.Material).transparent = true;
    (gridHelper.material as THREE.Material).opacity = 0.35;
    hologramGroup.add(gridHelper);

    // C. Office Workstation Desk
    const deskGeo = new THREE.BoxGeometry(2.8, 0.08, 1.4);
    const deskMesh = new THREE.Mesh(deskGeo, glassMat);
    deskMesh.position.set(0, 1.1, 0);
    hologramGroup.add(deskMesh);

    // Desk Edge Glow
    const deskEdges = new THREE.EdgesGeometry(deskGeo);
    const deskLine = new THREE.LineSegments(deskEdges, glowLineMat);
    deskLine.position.copy(deskMesh.position);
    hologramGroup.add(deskLine);

    // Desk Legs (Modern angled metallic legs)
    const legGeo = new THREE.CylinderGeometry(0.04, 0.04, 1.1, 8);
    const legPositions = [
      [-1.25, 0.55, -0.55],
      [1.25, 0.55, -0.55],
      [-1.25, 0.55, 0.55],
      [1.25, 0.55, 0.55],
    ];
    legPositions.forEach(([x, y, z]) => {
      const leg = new THREE.Mesh(legGeo, wireframeMat);
      leg.position.set(x, y, z);
      hologramGroup.add(leg);
    });

    // D. Multi-Monitor Setup

    // 1. Center Primary Ultrawide Curved Display
    const centerScreenGeo = new THREE.BoxGeometry(1.6, 0.85, 0.05);
    const centerScreenMat = new THREE.MeshBasicMaterial({
      color: 0x051322,
      wireframe: false,
    });
    const centerScreen = new THREE.Mesh(centerScreenGeo, centerScreenMat);
    centerScreen.position.set(0, 1.75, -0.25);
    hologramGroup.add(centerScreen);

    // Center screen glowing border
    const centerEdges = new THREE.EdgesGeometry(centerScreenGeo);
    const centerLine = new THREE.LineSegments(centerEdges, new THREE.LineBasicMaterial({ color: palette.primary }));
    centerLine.position.copy(centerScreen.position);
    hologramGroup.add(centerLine);

    // Monitor Stand
    const standGeo = new THREE.BoxGeometry(0.1, 0.55, 0.1);
    const standMesh = new THREE.Mesh(standGeo, wireframeMat);
    standMesh.position.set(0, 1.35, -0.3);
    hologramGroup.add(standMesh);

    // 2. Left Portrait Coding/Prompting Screen
    const leftScreenGeo = new THREE.BoxGeometry(0.5, 0.85, 0.04);
    const leftScreen = new THREE.Mesh(leftScreenGeo, glassMat);
    leftScreen.position.set(-1.15, 1.75, -0.1);
    leftScreen.rotation.y = Math.PI / 7;
    hologramGroup.add(leftScreen);

    const leftEdges = new THREE.EdgesGeometry(leftScreenGeo);
    const leftLine = new THREE.LineSegments(leftEdges, glowLineMat);
    leftLine.position.copy(leftScreen.position);
    leftLine.rotation.copy(leftScreen.rotation);
    hologramGroup.add(leftLine);

    // 3. Right Preview / Color Grading Monitor
    const rightScreenGeo = new THREE.BoxGeometry(0.7, 0.65, 0.04);
    const rightScreen = new THREE.Mesh(rightScreenGeo, glassMat);
    rightScreen.position.set(1.15, 1.7, -0.1);
    rightScreen.rotation.y = -Math.PI / 6;
    hologramGroup.add(rightScreen);

    const rightEdges = new THREE.EdgesGeometry(rightScreenGeo);
    const rightLine = new THREE.LineSegments(rightEdges, glowLineMat);
    rightLine.position.copy(rightScreen.position);
    rightLine.rotation.copy(rightScreen.rotation);
    hologramGroup.add(rightLine);

    // Dynamic Canvas Texture for Center Screen (Animated Timeline)
    const screenCanvas = document.createElement('canvas');
    screenCanvas.width = 512;
    screenCanvas.height = 256;
    const ctx = screenCanvas.getContext('2d');
    const screenTexture = new THREE.CanvasTexture(screenCanvas);

    const dynamicScreenGeo = new THREE.PlaneGeometry(1.54, 0.8);
    const dynamicScreenMat = new THREE.MeshBasicMaterial({
      map: screenTexture,
      transparent: true,
      opacity: 0.95,
    });
    const dynamicScreen = new THREE.Mesh(dynamicScreenGeo, dynamicScreenMat);
    dynamicScreen.position.set(0, 1.75, -0.22);
    hologramGroup.add(dynamicScreen);

    // E. High-End Creative PC Rig
    const pcCaseGeo = new THREE.BoxGeometry(0.35, 0.65, 0.7);
    const pcMesh = new THREE.Mesh(pcCaseGeo, wireframeMat);
    pcMesh.position.set(1.05, 0.35, 0.15);
    hologramGroup.add(pcMesh);

    // Internal glowing GPU / RAM wireframe
    const gpuGeo = new THREE.BoxGeometry(0.12, 0.25, 0.45);
    const gpuMat = new THREE.MeshBasicMaterial({ color: palette.primary, wireframe: true });
    const gpuMesh = new THREE.Mesh(gpuGeo, gpuMat);
    gpuMesh.position.copy(pcMesh.position);
    hologramGroup.add(gpuMesh);

    // Keyboard & Studio Audio Interface / Mousepad
    const kbGeo = new THREE.BoxGeometry(0.75, 0.02, 0.25);
    const kbMesh = new THREE.Mesh(kbGeo, wireframeMat);
    kbMesh.position.set(-0.1, 1.15, 0.15);
    hologramGroup.add(kbMesh);

    const mouseGeo = new THREE.BoxGeometry(0.1, 0.03, 0.16);
    const mouseMesh = new THREE.Mesh(mouseGeo, glowLineMat);
    mouseMesh.position.set(0.55, 1.15, 0.15);
    hologramGroup.add(mouseMesh);

    // F. Designer Studio Ergonomic Chair
    const chairSeatGeo = new THREE.BoxGeometry(0.65, 0.1, 0.65);
    const chairSeat = new THREE.Mesh(chairSeatGeo, glassMat);
    chairSeat.position.set(0, 0.75, 0.75);
    hologramGroup.add(chairSeat);

    const chairBackGeo = new THREE.BoxGeometry(0.6, 0.75, 0.08);
    const chairBack = new THREE.Mesh(chairBackGeo, wireframeMat);
    chairBack.position.set(0, 1.25, 1.05);
    chairBack.rotation.x = 0.08;
    hologramGroup.add(chairBack);

    const chairStemGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.7, 8);
    const chairStem = new THREE.Mesh(chairStemGeo, wireframeMat);
    chairStem.position.set(0, 0.35, 0.75);
    hologramGroup.add(chairStem);

    // G. Floating Holographic Sign / Room Marker
    const textCanvas = document.createElement('canvas');
    textCanvas.width = 1024;
    textCanvas.height = 256;
    const tCtx = textCanvas.getContext('2d');
    if (tCtx) {
      tCtx.fillStyle = 'rgba(0,0,0,0)';
      tCtx.fillRect(0, 0, 1024, 256);
      tCtx.font = 'bold 56px sans-serif';
      tCtx.textAlign = 'center';
      tCtx.fillStyle = '#00f0ff';
      tCtx.shadowColor = '#00f0ff';
      tCtx.shadowBlur = 18;
      tCtx.fillText('GRAPHICS SUMIT', 512, 100);
      tCtx.font = 'bold 28px sans-serif';
      tCtx.fillStyle = '#94a3b8';
      tCtx.shadowBlur = 0;
      tCtx.fillText('CREATIVE STUDIO HQ • DUM DUM, KOLKATA', 512, 160);
    }
    const textTexture = new THREE.CanvasTexture(textCanvas);
    const signGeo = new THREE.PlaneGeometry(3.0, 0.75);
    const signMat = new THREE.MeshBasicMaterial({
      map: textTexture,
      transparent: true,
      side: THREE.DoubleSide,
    });
    const signMesh = new THREE.Mesh(signGeo, signMat);
    signMesh.position.set(0, 2.7, 0);
    hologramGroup.add(signMesh);

    // H. Holographic Projection Cone / Beam
    const coneGeo = new THREE.ConeGeometry(2.9, 3.8, 32, 1, true);
    const coneMat = new THREE.MeshBasicMaterial({
      color: palette.primary,
      transparent: true,
      opacity: 0.07,
      side: THREE.DoubleSide,
      wireframe: false,
    });
    const coneMesh = new THREE.Mesh(coneGeo, coneMat);
    coneMesh.position.set(0, 1.9, 0);
    coneMesh.rotation.x = Math.PI;
    hologramGroup.add(coneMesh);

    // I. Floating Ambient Holographic Particles
    const particleCount = 180;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 4.5;
      particlePositions[i + 1] = Math.random() * 3.5;
      particlePositions[i + 2] = (Math.random() - 0.5) * 4.5;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: palette.accent,
      size: 0.045,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    hologramGroup.add(particles);

    // J. Volumetric Scan Wave Disc (Triggered by user button)
    const scanGeo = new THREE.CylinderGeometry(2.8, 2.8, 0.05, 32);
    const scanMat = new THREE.MeshBasicMaterial({
      color: palette.primary,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
    });
    const scanWave = new THREE.Mesh(scanGeo, scanMat);
    scanWave.position.y = 0;
    hologramGroup.add(scanWave);
    scanWaveRef.current = scanWave;

    // Orbit / Mouse Interaction
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let rotationVelocityX = 0;
    let rotationVelocityY = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      rotationVelocityY = deltaX * 0.006;
      rotationVelocityX = deltaY * 0.003;

      hologramGroup.rotation.y += rotationVelocityY;
      camera.position.y = Math.max(1.5, Math.min(6.5, camera.position.y - rotationVelocityX));
      camera.lookAt(0, 1.1, 0);

      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    // Touch support
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDragging = true;
        previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!isDragging || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - previousMousePosition.x;
      hologramGroup.rotation.y += deltaX * 0.008;
      previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    dom.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onMouseUp);

    // Resize observer
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 400;
      const h = container.clientHeight || 450;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // Animation Loop
    let animId: number;
    let lastTime = performance.now();
    let frameCount = 0;
    let fpsTimer = performance.now();
    let dynamicTime = 0;

    const animate = (time: number) => {
      animId = requestAnimationFrame(animate);

      const delta = (time - lastTime) * 0.001;
      lastTime = time;
      dynamicTime += delta;

      // Calculate FPS
      frameCount++;
      if (time - fpsTimer > 1000) {
        setFps(Math.round((frameCount * 1000) / (time - fpsTimer)));
        frameCount = 0;
        fpsTimer = time;
      }

      // Auto rotation when idle
      if (autoRotate && !isDragging) {
        hologramGroup.rotation.y += 0.006;
      }

      // Rotate inner pedestal ring
      innerRing.rotation.z -= 0.015;

      // Drift particles upward
      const pos = particleGeo.attributes.position.array as Float32Array;
      for (let i = 1; i < particleCount * 3; i += 3) {
        pos[i] += delta * 0.35;
        if (pos[i] > 3.6) {
          pos[i] = 0.05;
        }
      }
      particleGeo.attributes.position.needsUpdate = true;

      // Draw animated video timeline & audio waveform on center screen
      if (ctx) {
        ctx.fillStyle = '#060f1e';
        ctx.fillRect(0, 0, 512, 256);

        // Header bar
        ctx.fillStyle = '#0b192e';
        ctx.fillRect(0, 0, 512, 34);
        ctx.fillStyle = '#00f0ff';
        ctx.font = 'bold 13px monospace';
        ctx.fillText('PR PRO // 4K TIMELINE - REEL_VITAL_FINAL.mp4', 12, 22);

        // Video preview box
        ctx.fillStyle = '#081426';
        ctx.fillRect(15, 45, 230, 130);
        ctx.strokeStyle = '#0088ff';
        ctx.strokeRect(15, 45, 230, 130);

        // Pulsing AI audio waveform
        ctx.strokeStyle = palette.text.includes('cyan') ? '#00f0ff' : '#00ff88';
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let x = 0; x < 210; x += 6) {
          const wave = Math.sin(dynamicTime * 5 + x * 0.1) * 22 * Math.cos(dynamicTime * 2);
          ctx.lineTo(25 + x, 110 + wave);
        }
        ctx.stroke();

        // Right side: AI Prompt generation readout
        ctx.fillStyle = '#94a3b8';
        ctx.font = '11px monospace';
        ctx.fillText('> GEMINI / MIDJOURNEY ENGINE', 260, 65);
        ctx.fillStyle = '#38bdf8';
        ctx.fillText('> PROMPT: Commercial cinematic lighting', 260, 85);
        ctx.fillStyle = '#64748b';
        ctx.fillText('> RENDERING FRAME: 184 / 240', 260, 105);

        // Bottom timeline tracks
        ctx.fillStyle = '#0b1628';
        ctx.fillRect(15, 190, 480, 50);

        // Track clips
        ctx.fillStyle = '#0284c7';
        ctx.fillRect(20, 195, 120, 18);
        ctx.fillStyle = '#059669';
        ctx.fillRect(145, 195, 140, 18);
        ctx.fillStyle = '#7c3aed';
        ctx.fillRect(290, 195, 90, 18);

        // Playhead indicator
        const playheadX = 20 + ((dynamicTime * 80) % 460);
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(playheadX, 188, 2, 54);

        screenTexture.needsUpdate = true;
      }

      // Scanning Pulse Animation
      if (scanWaveRef.current && scanWaveRef.current.material) {
        if (scanning) {
          scanTimeRef.current += delta * 2.5;
          const progress = scanTimeRef.current;
          scanWaveRef.current.position.y = progress * 3.2;
          const opacity = Math.sin(progress * Math.PI) * 0.7;
          (scanWaveRef.current.material as THREE.MeshBasicMaterial).opacity = Math.max(0, opacity);

          if (progress >= 1.0) {
            setScanning(false);
            scanTimeRef.current = 0;
            (scanWaveRef.current.material as THREE.MeshBasicMaterial).opacity = 0;
          }
        }
      }

      // Subtle breathing float for text sign
      signMesh.position.y = 2.7 + Math.sin(dynamicTime * 2) * 0.04;

      renderer.render(scene, camera);
    };

    animId = requestAnimationFrame(animate);

    // Cleanup
    return () => {
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
      dom.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      dom.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onMouseUp);

      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      scene.clear();
    };
  }, [activeTheme, autoRotate, scanning]);

  const handleTriggerScan = () => {
    setScanning(true);
    scanTimeRef.current = 0;
  };

  return (
    <div className="relative rounded-2xl bg-gradient-to-b from-[#0e1422] to-[#080c14] border border-slate-800 shadow-2xl overflow-hidden flex flex-col">
      {/* Hologram Header HUD Bar */}
      <div className="px-4 py-3 bg-slate-900/90 border-b border-slate-800/80 flex items-center justify-between gap-3 text-xs z-20">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
          </span>
          <span className="font-bold text-white tracking-wide">3D HOLOGRAM: GRAPHICS SUMIT</span>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-slate-400">
          <Activity className="w-3.5 h-3.5 text-cyan-400" />
          <span className="font-mono text-cyan-300">{fps} FPS</span>
          <span className="hidden sm:inline text-slate-600">|</span>
          <span className="hidden sm:inline text-emerald-400 font-semibold">UPLINK ACTIVE</span>
        </div>
      </div>

      {/* 3D WebGL Canvas Viewport */}
      <div
        ref={containerRef}
        className="w-full h-[410px] sm:h-[450px] relative cursor-grab active:cursor-grabbing select-none"
        title="Click and drag to rotate the 3D hologram in 360°"
      >
        {/* Hologram Overlay HUD Scanlines & Targets */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_50%,rgba(7,10,17,0.7)_100%)] z-10" />

        {/* Top Left Telemetry Readout */}
        <div className="absolute top-3 left-3 z-10 pointer-events-none font-mono text-[10px] text-cyan-400/80 space-y-0.5 bg-black/40 backdrop-blur-sm p-2 rounded-lg border border-cyan-500/20">
          <div>LOC: 22.645°N, 88.405°E</div>
          <div>STUDIO: DUM DUM, KOLKATA</div>
          <div>RIG: DUAL GPU // GEN AI NODE</div>
        </div>

        {/* Top Right Reticle */}
        <div className="absolute top-3 right-3 z-10 pointer-events-none font-mono text-[10px] text-slate-400 bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-slate-700/60 flex items-center gap-1.5">
          <Compass className="w-3.5 h-3.5 text-cyan-400 animate-spin" style={{ animationDuration: '10s' }} />
          <span>360° INTERACTIVE</span>
        </div>

        {/* Bottom Instruction Pill */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 pointer-events-none text-[11px] font-medium text-slate-300 bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-full border border-slate-700/60 shadow-lg flex items-center gap-1.5 whitespace-nowrap">
          <Eye className="w-3.5 h-3.5 text-cyan-400" />
          <span>Drag with mouse / finger to orbit office</span>
        </div>
      </div>

      {/* Bottom Interactive Controls Strip */}
      <div className="p-3 bg-slate-900/90 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2.5 text-xs z-20">
        {/* Color Palette Switcher */}
        <div className="flex items-center gap-1.5">
          <span className="text-slate-400 text-[11px] mr-1 hidden sm:inline">Beam Mode:</span>
          {(['cyan', 'emerald', 'purple'] as ColorTheme[]).map((theme) => (
            <button
              key={theme}
              onClick={() => setActiveTheme(theme)}
              className={`px-2 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all ${
                activeTheme === theme
                  ? COLOR_PALETTES[theme].bgBadge + ' shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 bg-slate-800/60 hover:bg-slate-800'
              }`}
            >
              {theme}
            </button>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleTriggerScan}
            disabled={scanning}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold text-cyan-300 bg-cyan-950/40 hover:bg-cyan-950/70 border border-cyan-500/30 transition-all hover:border-cyan-400 active:scale-95 disabled:opacity-50"
          >
            <Zap className="w-3 h-3 text-cyan-400" />
            <span>{scanning ? 'Scanning...' : 'Scan Pulse'}</span>
          </button>

          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
              autoRotate
                ? 'text-emerald-300 bg-emerald-950/40 border border-emerald-500/30'
                : 'text-slate-400 bg-slate-800/60 border border-slate-700'
            }`}
          >
            <RotateCw className={`w-3 h-3 ${autoRotate ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }} />
            <span>{autoRotate ? 'Orbit On' : 'Orbit Paused'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
