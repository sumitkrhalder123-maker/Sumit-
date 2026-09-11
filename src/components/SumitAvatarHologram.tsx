import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import {
  Sparkles,
  RotateCw,
  Eye,
  Zap,
  User,
  Scan,
  Maximize2,
  ShieldCheck,
  Cpu
} from 'lucide-react';

type HologramMode = 'fullbody' | 'portrait';
type VisualStyle = 'cyber' | 'matrix' | 'neon';

const THEME_CONFIGS: Record<VisualStyle, { primary: number; secondary: number; accent: number; text: string; glow: string }> = {
  cyber: {
    primary: 0x00f0ff,
    secondary: 0x0077ff,
    accent: 0xe0ffff,
    text: 'text-cyan-400',
    glow: 'rgba(0, 240, 255, 0.4)',
  },
  matrix: {
    primary: 0x00ff88,
    secondary: 0x00aa44,
    accent: 0xd0ffea,
    text: 'text-emerald-400',
    glow: 'rgba(0, 255, 136, 0.4)',
  },
  neon: {
    primary: 0xb026ff,
    secondary: 0x6610f2,
    accent: 0xf5d0ff,
    text: 'text-purple-400',
    glow: 'rgba(176, 38, 255, 0.4)',
  },
};

export const SumitAvatarHologram: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<HologramMode>('fullbody');
  const [style, setStyle] = useState<VisualStyle>('cyber');
  const [autoRotate, setAutoRotate] = useState(true);
  const [isScanning, setIsScanning] = useState(false);
  const [currentAngle, setCurrentAngle] = useState(0);

  const sceneRef = useRef<THREE.Scene | null>(null);
  const avatarGroupRef = useRef<THREE.Group | null>(null);
  const materialsRef = useRef<THREE.Material[]>([]);
  const scanPlaneRef = useRef<THREE.Mesh | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const targetCamYRef = useRef(1.8);
  const targetCamDistRef = useRef(4.8);

  // Preset angles matching the uploaded photo angles
  const ANGLE_PRESETS = [
    { label: 'Front (0°)', rad: 0 },
    { label: '3/4 Angle (45°)', rad: Math.PI / 4 },
    { label: 'Profile (90°)', rad: Math.PI / 2 },
    { label: 'Rear (180°)', rad: Math.PI },
  ];

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Three.js Scene Setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.fog = new THREE.FogExp2(0x070b14, 0.05);

    const width = container.clientWidth || 420;
    const height = container.clientHeight || 460;

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, mode === 'portrait' ? 2.4 : 1.8, mode === 'portrait' ? 3.0 : 4.8);
    camera.lookAt(0, mode === 'portrait' ? 2.3 : 1.5, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    const theme = THEME_CONFIGS[style];

    // Lighting
    const ambLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambLight);

    const primaryLight = new THREE.PointLight(theme.primary, 4, 15);
    primaryLight.position.set(0, 3.5, 2.5);
    scene.add(primaryLight);

    const rimLight = new THREE.PointLight(theme.secondary, 3, 10);
    rimLight.position.set(0, 1.5, -2.5);
    scene.add(rimLight);

    // Root Avatar Group
    const avatarRoot = new THREE.Group();
    avatarGroupRef.current = avatarRoot;
    scene.add(avatarRoot);

    materialsRef.current = [];

    // Helper to register materials
    const registerMat = <T extends THREE.Material>(mat: T): T => {
      materialsRef.current.push(mat);
      return mat;
    };

    // Holographic Base / Pedestal
    const baseGroup = new THREE.Group();
    avatarRoot.add(baseGroup);

    // Outer glow ring
    const outerRingGeo = new THREE.RingGeometry(1.4, 1.45, 64);
    const ringMat = registerMat(
      new THREE.MeshBasicMaterial({
        color: theme.primary,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.8,
      })
    );
    const outerRing = new THREE.Mesh(outerRingGeo, ringMat);
    outerRing.rotation.x = -Math.PI / 2;
    outerRing.position.y = 0.02;
    baseGroup.add(outerRing);

    // Inner concentric ring
    const innerRingGeo = new THREE.RingGeometry(0.9, 0.94, 48);
    const innerRingMat = registerMat(
      new THREE.MeshBasicMaterial({
        color: theme.accent,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.6,
      })
    );
    const innerRing = new THREE.Mesh(innerRingGeo, innerRingMat);
    innerRing.rotation.x = -Math.PI / 2;
    innerRing.position.y = 0.03;
    baseGroup.add(innerRing);

    // Center pedestal disc with wireframe grid
    const pedGeo = new THREE.CylinderGeometry(1.3, 1.4, 0.12, 48);
    const pedMat = registerMat(
      new THREE.MeshStandardMaterial({
        color: 0x0a101d,
        roughness: 0.3,
        metalness: 0.9,
        wireframe: false,
      })
    );
    const pedestal = new THREE.Mesh(pedGeo, pedMat);
    pedestal.position.y = -0.06;
    baseGroup.add(pedestal);

    // Glowing Emitter Core
    const emitterCoreGeo = new THREE.CircleGeometry(0.5, 32);
    const emitterCoreMat = registerMat(
      new THREE.MeshBasicMaterial({
        color: theme.primary,
        transparent: true,
        opacity: 0.85,
      })
    );
    const emitterCore = new THREE.Mesh(emitterCoreGeo, emitterCoreMat);
    emitterCore.rotation.x = -Math.PI / 2;
    emitterCore.position.y = 0.04;
    baseGroup.add(emitterCore);

    // Upward Light Rays Cylinder (Volumetric Hologram Column)
    const coneGeo = new THREE.CylinderGeometry(1.2, 0.6, 3.8, 32, 1, true);
    const coneMat = registerMat(
      new THREE.MeshBasicMaterial({
        color: theme.primary,
        transparent: true,
        opacity: 0.08,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
      })
    );
    const lightCone = new THREE.Mesh(coneGeo, coneMat);
    lightCone.position.y = 1.9;
    baseGroup.add(lightCone);

    // ==========================================
    // 2. BUILD SUMIT'S 3D ANATOMICAL MODEL
    // Designed precisely as per the uploaded multi-angle images:
    // - Black Rectangular Sunglasses
    // - Mustache
    // - Neat modern side/tapered haircut
    // - Dark T-shirt with signature white/light horizontal chest stripe ("Minimum")
    // - Hands lightly in pockets
    // - Light beige/grey Chinos & White Sneakers
    // ==========================================
    const humanGroup = new THREE.Group();
    avatarRoot.add(humanGroup);

    // Holographic Human Shaders / Materials
    const holoWireMat = registerMat(
      new THREE.MeshBasicMaterial({
        color: theme.primary,
        wireframe: true,
        transparent: true,
        opacity: 0.45,
      })
    );

    const shirtBlackMat = registerMat(
      new THREE.MeshStandardMaterial({
        color: 0x0f1523,
        emissive: theme.primary,
        emissiveIntensity: 0.15,
        roughness: 0.5,
        metalness: 0.2,
      })
    );

    // The signature horizontal chest stripe from user's t-shirt
    const chestStripeMat = registerMat(
      new THREE.MeshStandardMaterial({
        color: 0xe8ecf5,
        emissive: theme.accent,
        emissiveIntensity: 0.4,
        roughness: 0.3,
      })
    );

    const pantsMat = registerMat(
      new THREE.MeshStandardMaterial({
        color: 0x8892a0,
        emissive: theme.primary,
        emissiveIntensity: 0.1,
        roughness: 0.6,
      })
    );

    const shoesMat = registerMat(
      new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: theme.accent,
        emissiveIntensity: 0.3,
        roughness: 0.2,
      })
    );

    const skinMat = registerMat(
      new THREE.MeshStandardMaterial({
        color: 0xb5805e,
        emissive: theme.primary,
        emissiveIntensity: 0.18,
        roughness: 0.7,
      })
    );

    const hairMat = registerMat(
      new THREE.MeshStandardMaterial({
        color: 0x111318,
        emissive: theme.secondary,
        emissiveIntensity: 0.1,
        roughness: 0.8,
      })
    );

    // Sunglasses Material (Dark glossy lenses + frame)
    const glassesMat = registerMat(
      new THREE.MeshStandardMaterial({
        color: 0x05070a,
        roughness: 0.1,
        metalness: 0.9,
        emissive: theme.primary,
        emissiveIntensity: 0.25,
      })
    );

    // --- LEGS & SHOES ---
    // Left Shoe
    const shoeGeo = new THREE.BoxGeometry(0.18, 0.12, 0.36);
    const leftShoe = new THREE.Mesh(shoeGeo, shoesMat);
    leftShoe.position.set(-0.2, 0.06, 0.05);
    humanGroup.add(leftShoe);

    // Right Shoe
    const rightShoe = new THREE.Mesh(shoeGeo, shoesMat);
    rightShoe.position.set(0.2, 0.06, 0.05);
    humanGroup.add(rightShoe);

    // Left Pant Leg (tapered chino)
    const legGeo = new THREE.CylinderGeometry(0.12, 0.1, 1.05, 16);
    const leftLeg = new THREE.Mesh(legGeo, pantsMat);
    leftLeg.position.set(-0.2, 0.64, 0);
    humanGroup.add(leftLeg);

    // Wireframe overlay for left leg
    const leftLegWire = new THREE.Mesh(legGeo, holoWireMat);
    leftLegWire.position.copy(leftLeg.position);
    leftLegWire.scale.multiplyScalar(1.02);
    humanGroup.add(leftLegWire);

    // Right Pant Leg
    const rightLeg = new THREE.Mesh(legGeo, pantsMat);
    rightLeg.position.set(0.2, 0.64, 0);
    humanGroup.add(rightLeg);

    const rightLegWire = new THREE.Mesh(legGeo, holoWireMat);
    rightLegWire.position.copy(rightLeg.position);
    rightLegWire.scale.multiplyScalar(1.02);
    humanGroup.add(rightLegWire);

    // Pelvis / Hips
    const hipsGeo = new THREE.BoxGeometry(0.54, 0.3, 0.28);
    const hips = new THREE.Mesh(hipsGeo, pantsMat);
    hips.position.set(0, 1.22, 0);
    humanGroup.add(hips);

    // --- TORSO (T-SHIRT WITH SIGNATURE STRIPE) ---
    // Lower black t-shirt section
    const lowerTorsoGeo = new THREE.BoxGeometry(0.56, 0.26, 0.28);
    const lowerTorso = new THREE.Mesh(lowerTorsoGeo, shirtBlackMat);
    lowerTorso.position.set(0, 1.46, 0);
    humanGroup.add(lowerTorso);

    // Middle Chest Stripe (Iconic white/off-white horizontal band from the user's photo)
    const chestStripeGeo = new THREE.BoxGeometry(0.58, 0.22, 0.29);
    const chestStripe = new THREE.Mesh(chestStripeGeo, chestStripeMat);
    chestStripe.position.set(0, 1.68, 0);
    humanGroup.add(chestStripe);

    // Upper black t-shirt & shoulders
    const upperTorsoGeo = new THREE.BoxGeometry(0.6, 0.28, 0.29);
    const upperTorso = new THREE.Mesh(upperTorsoGeo, shirtBlackMat);
    upperTorso.position.set(0, 1.9, 0);
    humanGroup.add(upperTorso);

    // Holographic wireframe overlay on torso
    const torsoWireGeo = new THREE.BoxGeometry(0.61, 0.74, 0.3);
    const torsoWire = new THREE.Mesh(torsoWireGeo, holoWireMat);
    torsoWire.position.set(0, 1.68, 0);
    humanGroup.add(torsoWire);

    // Thin silver neck chain
    const chainGeo = new THREE.TorusGeometry(0.12, 0.012, 8, 24);
    const chainMat = registerMat(
      new THREE.MeshStandardMaterial({
        color: 0xdddddd,
        metalness: 0.95,
        roughness: 0.1,
        emissive: theme.accent,
        emissiveIntensity: 0.3,
      })
    );
    const chain = new THREE.Mesh(chainGeo, chainMat);
    chain.position.set(0, 2.02, 0.08);
    chain.rotation.x = Math.PI / 3;
    humanGroup.add(chain);

    // --- ARMS & HANDS (Relaxed pose matching photo) ---
    const armGeo = new THREE.CylinderGeometry(0.09, 0.075, 0.76, 16);

    // Left Arm
    const leftArm = new THREE.Mesh(armGeo, shirtBlackMat);
    leftArm.position.set(-0.38, 1.62, 0.04);
    leftArm.rotation.z = Math.PI * 0.08;
    leftArm.rotation.x = -Math.PI * 0.04;
    humanGroup.add(leftArm);

    // Left Forearm / Hand towards pocket
    const forearmGeo = new THREE.CylinderGeometry(0.07, 0.065, 0.45, 16);
    const leftForearm = new THREE.Mesh(forearmGeo, skinMat);
    leftForearm.position.set(-0.35, 1.15, 0.08);
    leftForearm.rotation.z = -Math.PI * 0.06;
    humanGroup.add(leftForearm);

    // Smartwatch on Left Wrist (as in photo)
    const watchGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.04, 16);
    const watchMat = registerMat(
      new THREE.MeshStandardMaterial({
        color: 0x050505,
        metalness: 0.9,
        emissive: theme.primary,
        emissiveIntensity: 0.5,
      })
    );
    const watch = new THREE.Mesh(watchGeo, watchMat);
    watch.position.set(-0.35, 1.05, 0.08);
    watch.rotation.z = Math.PI / 2;
    humanGroup.add(watch);

    // Right Arm
    const rightArm = new THREE.Mesh(armGeo, shirtBlackMat);
    rightArm.position.set(0.38, 1.62, 0.04);
    rightArm.rotation.z = -Math.PI * 0.08;
    rightArm.rotation.x = -Math.PI * 0.04;
    humanGroup.add(rightArm);

    const rightForearm = new THREE.Mesh(forearmGeo, skinMat);
    rightForearm.position.set(0.35, 1.15, 0.08);
    rightForearm.rotation.z = Math.PI * 0.06;
    humanGroup.add(rightForearm);

    // --- NECK & HEAD ---
    const neckGeo = new THREE.CylinderGeometry(0.09, 0.1, 0.18, 16);
    const neck = new THREE.Mesh(neckGeo, skinMat);
    neck.position.set(0, 2.1, 0);
    humanGroup.add(neck);

    // Head / Face
    const headGeo = new THREE.SphereGeometry(0.21, 24, 24);
    headGeo.scale(1, 1.25, 1.05);
    const head = new THREE.Mesh(headGeo, skinMat);
    head.position.set(0, 2.34, 0);
    humanGroup.add(head);

    // Wireframe on head
    const headWire = new THREE.Mesh(headGeo, holoWireMat);
    headWire.position.copy(head.position);
    headWire.scale.multiplyScalar(1.02);
    humanGroup.add(headWire);

    // Hair (Neat side-parted voluminous top with clean sides as in photo)
    const hairGeo = new THREE.SphereGeometry(0.22, 20, 20);
    hairGeo.scale(1.04, 1.1, 1.12);
    const hair = new THREE.Mesh(hairGeo, hairMat);
    hair.position.set(0, 2.45, -0.02);
    humanGroup.add(hair);

    // Mustache (distinctive trim mustache from uploaded photo)
    const mustacheGeo = new THREE.BoxGeometry(0.12, 0.022, 0.03);
    const mustacheMat = registerMat(
      new THREE.MeshBasicMaterial({
        color: 0x111111,
      })
    );
    const mustache = new THREE.Mesh(mustacheGeo, mustacheMat);
    mustache.position.set(0, 2.24, 0.2);
    humanGroup.add(mustache);

    // --- ICONIC BLACK SUNGLASSES (FROM PHOTO) ---
    const glassesGroup = new THREE.Group();
    humanGroup.add(glassesGroup);
    glassesGroup.position.set(0, 2.36, 0.17);

    // Left Lens Frame
    const lensGeo = new THREE.BoxGeometry(0.1, 0.065, 0.025);
    const leftLens = new THREE.Mesh(lensGeo, glassesMat);
    leftLens.position.set(-0.07, 0, 0.04);
    glassesGroup.add(leftLens);

    // Right Lens Frame
    const rightLens = new THREE.Mesh(lensGeo, glassesMat);
    rightLens.position.set(0.07, 0, 0.04);
    glassesGroup.add(rightLens);

    // Bridge
    const bridgeGeo = new THREE.BoxGeometry(0.05, 0.015, 0.02);
    const bridge = new THREE.Mesh(bridgeGeo, glassesMat);
    bridge.position.set(0, 0.015, 0.04);
    glassesGroup.add(bridge);

    // Left Temple Arm
    const templeGeo = new THREE.BoxGeometry(0.015, 0.015, 0.22);
    const leftTemple = new THREE.Mesh(templeGeo, glassesMat);
    leftTemple.position.set(-0.12, 0, -0.06);
    glassesGroup.add(leftTemple);

    // Right Temple Arm
    const rightTemple = new THREE.Mesh(templeGeo, glassesMat);
    rightTemple.position.set(0.12, 0, -0.06);
    glassesGroup.add(rightTemple);

    // Cyan Neon Glint on sunglasses lens
    const glintGeo = new THREE.PlaneGeometry(0.08, 0.01);
    const glintMat = registerMat(
      new THREE.MeshBasicMaterial({
        color: theme.primary,
        transparent: true,
        opacity: 0.9,
      })
    );
    const glint = new THREE.Mesh(glintGeo, glintMat);
    glint.position.set(-0.07, 0.015, 0.056);
    glassesGroup.add(glint);

    // ==========================================
    // 3. SCI-FI HUD RINGS & VOLUMETRIC SCAN PLANE
    // ==========================================
    // Orbiting Data Ring around waist
    const dataRingGeo = new THREE.TorusGeometry(0.75, 0.008, 8, 48);
    const dataRingMat = registerMat(
      new THREE.MeshBasicMaterial({
        color: theme.primary,
        transparent: true,
        opacity: 0.7,
      })
    );
    const dataRing = new THREE.Mesh(dataRingGeo, dataRingMat);
    dataRing.position.set(0, 1.6, 0);
    dataRing.rotation.x = Math.PI / 2.3;
    humanGroup.add(dataRing);

    // Second inclined HUD ring
    const dataRing2Geo = new THREE.TorusGeometry(0.9, 0.006, 8, 48);
    const dataRing2 = new THREE.Mesh(dataRing2Geo, dataRingMat);
    dataRing2.position.set(0, 1.2, 0);
    dataRing2.rotation.x = Math.PI / 1.8;
    dataRing2.rotation.y = Math.PI / 4;
    humanGroup.add(dataRing2);

    // Moving Laser Scan Plane
    const scanPlaneGeo = new THREE.RingGeometry(0.05, 1.15, 32);
    const scanPlaneMat = registerMat(
      new THREE.MeshBasicMaterial({
        color: theme.primary,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.35,
        blending: THREE.AdditiveBlending,
      })
    );
    const scanPlane = new THREE.Mesh(scanPlaneGeo, scanPlaneMat);
    scanPlane.rotation.x = -Math.PI / 2;
    scanPlane.position.y = 0.2;
    avatarRoot.add(scanPlane);
    scanPlaneRef.current = scanPlane;

    // Ambient Hologram Particles
    const particleCount = 280;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const radius = 0.2 + Math.random() * 0.9;
      particlePositions[i * 3] = Math.cos(theta) * radius;
      particlePositions[i * 3 + 1] = Math.random() * 2.7;
      particlePositions[i * 3 + 2] = Math.sin(theta) * radius;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = registerMat(
      new THREE.PointsMaterial({
        color: theme.primary,
        size: 0.025,
        transparent: true,
        opacity: 0.7,
        blending: THREE.AdditiveBlending,
      })
    );
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    avatarRoot.add(particleSystem);

    // Interactive Drag Controls
    let isDragging = false;
    let prevMouseX = 0;
    let rotationVelocity = 0;

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      setAutoRotate(false);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging || !avatarGroupRef.current) return;
      const deltaX = e.clientX - prevMouseX;
      avatarGroupRef.current.rotation.y += deltaX * 0.01;
      rotationVelocity = deltaX * 0.005;
      prevMouseX = e.clientX;
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    container.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);

    // Animation Loop
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Auto rotation
      if (avatarGroupRef.current) {
        if (autoRotate) {
          avatarGroupRef.current.rotation.y += 0.008;
        } else if (!isDragging) {
          avatarGroupRef.current.rotation.y += rotationVelocity;
          rotationVelocity *= 0.94;
        }
        // Update angle state in degrees
        const deg = Math.round(((avatarGroupRef.current.rotation.y % (Math.PI * 2)) + (Math.PI * 2)) % (Math.PI * 2) * (180 / Math.PI));
        setCurrentAngle(deg);
      }

      // Orbit HUD Rings spin
      dataRing.rotation.z = elapsedTime * 0.5;
      dataRing2.rotation.z = -elapsedTime * 0.4;
      innerRing.rotation.z = elapsedTime * 0.8;
      outerRing.rotation.z = -elapsedTime * 0.3;

      // Laser Scan Plane Vertical Sweep
      if (scanPlaneRef.current) {
        const scanY = 1.35 + Math.sin(elapsedTime * 2.2) * 1.25;
        scanPlaneRef.current.position.y = scanY;
        scanPlaneRef.current.scale.setScalar(0.85 + Math.sin(elapsedTime * 4) * 0.15);
      }

      // Smooth Camera Transition for Mode (Portrait vs Fullbody)
      if (cameraRef.current) {
        cameraRef.current.position.y += (targetCamYRef.current - cameraRef.current.position.y) * 0.08;
        cameraRef.current.position.z += (targetCamDistRef.current - cameraRef.current.position.z) * 0.08;
        const targetLookY = mode === 'portrait' ? 2.3 : 1.45;
        cameraRef.current.lookAt(0, targetLookY, 0);
      }

      // Floating particles gentle drift
      const positions = particleGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        positions[i * 3 + 1] += 0.004;
        if (positions[i * 3 + 1] > 2.8) {
          positions[i * 3 + 1] = 0.05;
        }
      }
      particleGeo.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container || !cameraRef.current) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      cameraRef.current.aspect = newW / newH;
      cameraRef.current.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [style]);

  // Handle Mode Change (Fullbody vs Portrait close-up)
  const handleModeChange = (newMode: HologramMode) => {
    setMode(newMode);
    if (newMode === 'portrait') {
      targetCamYRef.current = 2.38;
      targetCamDistRef.current = 2.4;
    } else {
      targetCamYRef.current = 1.75;
      targetCamDistRef.current = 4.8;
    }
  };

  // Rotate to specific angle preset
  const setAnglePreset = (rad: number) => {
    if (avatarGroupRef.current) {
      avatarGroupRef.current.rotation.y = rad;
      setAutoRotate(false);
    }
  };

  const triggerScan = () => {
    setIsScanning(true);
    setTimeout(() => setIsScanning(false), 2400);
  };

  const theme = THEME_CONFIGS[style];

  return (
    <div className="rounded-2xl bg-gradient-to-b from-[#0e1424] via-[#090d18] to-[#070a14] border border-cyan-500/30 overflow-hidden shadow-2xl relative">
      {/* Hologram Header Bar */}
      <div className="p-3.5 sm:p-4 bg-slate-900/90 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <User className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-extrabold text-white tracking-wide">
                Graphics Sumit • 3D Hologram
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
            </div>
            <p className="text-[10px] text-slate-400 font-mono">
              DIGITAL TWIN // PHOTOGRAMMETRY SYNCED
            </p>
          </div>
        </div>

        {/* View Mode & Style Switcher */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-950 p-0.5 rounded-lg border border-slate-800 text-[10px]">
            <button
              onClick={() => handleModeChange('fullbody')}
              className={`px-2 py-1 rounded-md font-semibold transition-all ${
                mode === 'fullbody'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Full Body
            </button>
            <button
              onClick={() => handleModeChange('portrait')}
              className={`px-2 py-1 rounded-md font-semibold transition-all ${
                mode === 'portrait'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Sunglasses Bust
            </button>
          </div>

          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`p-1.5 rounded-lg border text-xs transition-all ${
              autoRotate
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
            }`}
            title="Toggle 360° Auto-Rotate"
          >
            <RotateCw className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }} />
          </button>
        </div>
      </div>

      {/* 3D WebGL Canvas Viewport */}
      <div className="relative w-full h-[380px] sm:h-[410px] cursor-grab active:cursor-grabbing select-none overflow-hidden">
        {/* Ambient Hologram Light Cone Backlight */}
        <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/10 via-transparent to-transparent pointer-events-none" />

        {/* Animated Grid Floor Lines */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(${theme.glow} 1px, transparent 1px)`,
            backgroundSize: '20px 20px',
          }}
        />

        {/* Three.js Container */}
        <div ref={containerRef} className="w-full h-full" />

        {/* Overlay HUD Telemetry */}
        <div className="absolute top-3 left-3 pointer-events-none font-mono text-[9px] text-cyan-400/80 space-y-0.5 bg-slate-950/60 p-2 rounded-lg border border-cyan-500/20 backdrop-blur-xs">
          <div className="flex items-center gap-1.5 text-slate-300 font-bold">
            <Cpu className="w-3 h-3 text-cyan-400" />
            <span>AI CREATIVE LEAD</span>
          </div>
          <div>ROT: {currentAngle}° // 360° FREE ORBIT</div>
          <div>OPTICS: UV POLARIZED SUNGLASSES</div>
          <div>VOXEL DENSITY: 60 FPS RENDER</div>
        </div>

        {/* Top Right Quick Scan Trigger */}
        <div className="absolute top-3 right-3 flex flex-col items-end gap-1.5">
          <button
            onClick={triggerScan}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-950/80 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20 text-[10px] font-mono transition-all shadow-md backdrop-blur-xs"
          >
            <Scan className="w-3 h-3 text-cyan-400" />
            <span>{isScanning ? 'SCANNING...' : 'SCAN BIOMETRICS'}</span>
          </button>
        </div>

        {/* Bottom Orbit Angle Quick Selector (matches uploaded shoot angles) */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-slate-950/90 border border-slate-800/90 px-2 py-1 rounded-xl backdrop-blur-md shadow-lg">
          <span className="text-[9px] font-mono text-slate-400 mr-1 uppercase">Angles:</span>
          {ANGLE_PRESETS.map((preset) => (
            <button
              key={preset.label}
              onClick={() => setAnglePreset(preset.rad)}
              className="px-2 py-0.5 rounded-lg text-[10px] font-medium bg-slate-900 hover:bg-cyan-500/20 hover:text-cyan-300 text-slate-300 border border-slate-800 transition-all whitespace-nowrap"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* ========================================================
          USER DIRECT MANDATE: "holo gram k niche likha hoga Graphics Sumit"
          Prominent, high-impact branding marquee right below the hologram
          ======================================================== */}
      <div className="p-4 sm:p-5 bg-gradient-to-b from-[#0b101c] to-[#080c16] border-t border-cyan-500/25 text-center relative overflow-hidden">
        {/* Subtle accent glow line */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-[1px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[10px] font-mono uppercase tracking-widest mb-2 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
          <span>Verified Creative Identity // Digital Holographic Model</span>
        </div>

        {/* Primary Mandated Title: Graphics Sumit */}
        <h3
          id="hologram-graphics-sumit-name"
          className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-white to-blue-400 tracking-wider drop-shadow-sm"
        >
          Graphics Sumit
        </h3>

        {/* Subtitle with Bengali identity & roles */}
        <div className="flex items-center justify-center gap-2 mt-1 flex-wrap">
          <span className="text-xs font-semibold text-slate-200">
            গ্রাফিক্স সুমিত
          </span>
          <span className="text-slate-500 text-xs">•</span>
          <span className="text-xs text-cyan-300 font-medium">
            AI Generalist
          </span>
          <span className="text-slate-500 text-xs">•</span>
          <span className="text-xs text-slate-300 font-medium">
            Video Editor
          </span>
          <span className="text-slate-500 text-xs">•</span>
          <span className="text-xs text-slate-300 font-medium">
            Prompt Engineer
          </span>
        </div>

        {/* Feature Highlights Grid */}
        <div className="mt-3.5 pt-3 border-t border-slate-800/80 grid grid-cols-3 gap-2 text-center font-mono text-[10px]">
          <div className="p-1.5 rounded-lg bg-slate-900/60 border border-slate-800">
            <span className="text-slate-400 block text-[9px]">OUTFIT SYNC</span>
            <span className="text-slate-200 font-semibold">T-Shirt & Chinos</span>
          </div>
          <div className="p-1.5 rounded-lg bg-slate-900/60 border border-slate-800">
            <span className="text-slate-400 block text-[9px]">STYLING</span>
            <span className="text-cyan-300 font-semibold">Sunglasses & Mustache</span>
          </div>
          <div className="p-1.5 rounded-lg bg-slate-900/60 border border-slate-800">
            <span className="text-slate-400 block text-[9px]">LOCATION</span>
            <span className="text-emerald-400 font-semibold">Dum Dum, Kolkata</span>
          </div>
        </div>
      </div>
    </div>
  );
};
