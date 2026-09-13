import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Gamepad2,
  Trophy,
  RotateCcw,
  Play,
  Pause,
  Volume2,
  VolumeX,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Zap
} from 'lucide-react';

interface Point {
  x: number;
  y: number;
}

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

const GRID_COLS = 22;
const GRID_ROWS = 15;
const INITIAL_SNAKE: Point[] = [
  { x: 10, y: 7 },
  { x: 9, y: 7 },
  { x: 8, y: 7 },
];
const INITIAL_DIRECTION: Direction = 'RIGHT';
const SPEED_NORMAL = 110; // ms per tick
const SPEED_FAST = 75;

export const RetroSnakeGame: React.FC = () => {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Point>({ x: 15, y: 7 });
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('sumit_snake_highscore');
      return saved ? parseInt(saved, 10) : 0;
    } catch {
      return 0;
    }
  });
  const [isSoundOn, setIsSoundOn] = useState<boolean>(true);
  const [speedMode, setSpeedMode] = useState<'normal' | 'fast'>('normal');

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const nextDirectionRef = useRef<Direction>(INITIAL_DIRECTION);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Sound generator using Web Audio API (no external asset dependencies)
  const playBeep = useCallback((freq: number, type: OscillatorType = 'square', duration = 0.08) => {
    if (!isSoundOn) return;
    try {
      if (!audioCtxRef.current) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) {
          audioCtxRef.current = new AudioCtx();
        }
      }
      if (audioCtxRef.current?.state === 'suspended') {
        audioCtxRef.current.resume();
      }
      if (!audioCtxRef.current) return;

      const osc = audioCtxRef.current.createOscillator();
      const gain = audioCtxRef.current.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtxRef.current.currentTime);
      gain.gain.setValueAtTime(0.08, audioCtxRef.current.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtxRef.current.currentTime + duration);

      osc.connect(gain);
      gain.connect(audioCtxRef.current.destination);
      osc.start();
      osc.stop(audioCtxRef.current.currentTime + duration);
    } catch {
      // Audio playback silently guarded
    }
  }, [isSoundOn]);

  const playEatSound = useCallback(() => {
    playBeep(620, 'square', 0.07);
    setTimeout(() => playBeep(880, 'square', 0.09), 60);
  }, [playBeep]);

  const playGameOverSound = useCallback(() => {
    playBeep(240, 'sawtooth', 0.15);
    setTimeout(() => playBeep(160, 'sawtooth', 0.25), 140);
  }, [playBeep]);

  // Generate random food not on snake body
  const spawnFood = useCallback((currentSnake: Point[]): Point => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_COLS),
        y: Math.floor(Math.random() * GRID_ROWS),
      };
      const collides = currentSnake.some((seg) => seg.x === newFood.x && seg.y === newFood.y);
      if (!collides) break;
    }
    return newFood;
  }, []);

  // Reset Game
  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    const newFood = spawnFood(INITIAL_SNAKE);
    setFood(newFood);
    setDirection(INITIAL_DIRECTION);
    nextDirectionRef.current = INITIAL_DIRECTION;
    setScore(0);
    setIsGameOver(false);
    setIsPlaying(true);
    playBeep(520, 'square', 0.08);
  };

  // Turn logic with 180° turn prevention
  const changeDirection = useCallback((newDir: Direction) => {
    const current = nextDirectionRef.current;
    if (newDir === 'UP' && current !== 'DOWN') nextDirectionRef.current = 'UP';
    if (newDir === 'DOWN' && current !== 'UP') nextDirectionRef.current = 'DOWN';
    if (newDir === 'LEFT' && current !== 'RIGHT') nextDirectionRef.current = 'LEFT';
    if (newDir === 'RIGHT' && current !== 'LEFT') nextDirectionRef.current = 'RIGHT';

    if (!isPlaying && !isGameOver) {
      setIsPlaying(true);
    }
  }, [isPlaying, isGameOver]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA')) {
        return;
      }

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          e.preventDefault();
          changeDirection('UP');
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          e.preventDefault();
          changeDirection('DOWN');
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          e.preventDefault();
          changeDirection('LEFT');
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          e.preventDefault();
          changeDirection('RIGHT');
          break;
        case ' ':
          e.preventDefault();
          if (isGameOver) {
            resetGame();
          } else {
            setIsPlaying((prev) => !prev);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [changeDirection, isGameOver]);

  // Game loop tick
  useEffect(() => {
    if (!isPlaying || isGameOver) return;

    const intervalTime = speedMode === 'fast' ? SPEED_FAST : SPEED_NORMAL;

    const timer = setInterval(() => {
      setSnake((prevSnake) => {
        const currentHead = prevSnake[0];
        const dir = nextDirectionRef.current;
        setDirection(dir);

        let newHead: Point;
        switch (dir) {
          case 'UP':
            newHead = { x: currentHead.x, y: currentHead.y - 1 };
            break;
          case 'DOWN':
            newHead = { x: currentHead.x, y: currentHead.y + 1 };
            break;
          case 'LEFT':
            newHead = { x: currentHead.x - 1, y: currentHead.y };
            break;
          case 'RIGHT':
            newHead = { x: currentHead.x + 1, y: currentHead.y };
            break;
        }

        // Wall collision check (classic Nokia mode)
        if (
          newHead.x < 0 ||
          newHead.x >= GRID_COLS ||
          newHead.y < 0 ||
          newHead.y >= GRID_ROWS
        ) {
          setIsGameOver(true);
          setIsPlaying(false);
          playGameOverSound();
          return prevSnake;
        }

        // Self-collision check
        const hitSelf = prevSnake.some((seg) => seg.x === newHead.x && seg.y === newHead.y);
        if (hitSelf) {
          setIsGameOver(true);
          setIsPlaying(false);
          playGameOverSound();
          return prevSnake;
        }

        // Food eaten check
        const ateFood = newHead.x === food.x && newHead.y === food.y;
        let newSnake: Point[];

        if (ateFood) {
          newSnake = [newHead, ...prevSnake];
          playEatSound();
          setScore((s) => {
            const nextScore = s + 10;
            if (nextScore > highScore) {
              setHighScore(nextScore);
              try {
                localStorage.setItem('sumit_snake_highscore', nextScore.toString());
              } catch {}
            }
            return nextScore;
          });
          setFood(spawnFood([newHead, ...prevSnake]));
        } else {
          newSnake = [newHead, ...prevSnake.slice(0, -1)];
        }

        return newSnake;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isPlaying, isGameOver, food, highScore, playEatSound, playGameOverSound, spawnFood, speedMode]);

  // Canvas drawing: Retro Nokia LCD Screen with Cyber Dark Theme
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const cellW = width / GRID_COLS;
    const cellH = height / GRID_ROWS;

    // Background: Nokia LCD Matrix styled with Dark Obsidian & Deep Emerald-Teal
    ctx.fillStyle = '#050c13';
    ctx.fillRect(0, 0, width, height);

    // Subtle LCD pixel dot grid
    ctx.fillStyle = 'rgba(6, 182, 212, 0.04)';
    for (let r = 0; r < GRID_ROWS; r++) {
      for (let c = 0; c < GRID_COLS; c++) {
        ctx.fillRect(c * cellW + 1, r * cellH + 1, cellW - 2, cellH - 2);
      }
    }

    // Outer border boundary line (classic Nokia screen edge)
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.25)';
    ctx.lineWidth = 1;
    ctx.strokeRect(1, 1, width - 2, height - 2);

    // Draw Food (Pulsing Cyber Ruby/Emerald Pixel Core)
    const foodX = food.x * cellW + 1.5;
    const foodY = food.y * cellH + 1.5;
    const foodSize = cellW - 3;

    ctx.fillStyle = '#f43f5e'; // Bright Rose / Neon Cherry
    ctx.shadowColor = '#f43f5e';
    ctx.shadowBlur = 8;
    ctx.fillRect(foodX, foodY, foodSize, foodSize);

    // Inner bright core of food
    ctx.fillStyle = '#fff';
    ctx.fillRect(foodX + foodSize * 0.25, foodY + foodSize * 0.25, foodSize * 0.5, foodSize * 0.5);
    ctx.shadowBlur = 0;

    // Draw Snake
    snake.forEach((seg, idx) => {
      const x = seg.x * cellW + 1;
      const y = seg.y * cellH + 1;
      const size = cellW - 2;

      if (idx === 0) {
        // Snake Head: Vibrant Cyan with neon halo
        ctx.fillStyle = '#06b6d4';
        ctx.shadowColor = '#06b6d4';
        ctx.shadowBlur = 6;
        ctx.fillRect(x, y, size, size);
        ctx.shadowBlur = 0;

        // Head Eyes
        ctx.fillStyle = '#050c13';
        const eyeSize = Math.max(2, size * 0.22);
        if (direction === 'RIGHT') {
          ctx.fillRect(x + size - eyeSize - 1, y + 2, eyeSize, eyeSize);
          ctx.fillRect(x + size - eyeSize - 1, y + size - eyeSize - 2, eyeSize, eyeSize);
        } else if (direction === 'LEFT') {
          ctx.fillRect(x + 2, y + 2, eyeSize, eyeSize);
          ctx.fillRect(x + 2, y + size - eyeSize - 2, eyeSize, eyeSize);
        } else if (direction === 'UP') {
          ctx.fillRect(x + 2, y + 2, eyeSize, eyeSize);
          ctx.fillRect(x + size - eyeSize - 2, y + 2, eyeSize, eyeSize);
        } else {
          ctx.fillRect(x + 2, y + size - eyeSize - 1, eyeSize, eyeSize);
          ctx.fillRect(x + size - eyeSize - 2, y + size - eyeSize - 1, eyeSize, eyeSize);
        }
      } else {
        // Snake Body: High-contrast Emerald Nokia pixels
        ctx.fillStyle = idx % 2 === 0 ? '#10b981' : '#059669';
        ctx.fillRect(x, y, size, size);

        // Small inner pixel accent
        ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
        ctx.fillRect(x + 2, y + 2, size - 4, size - 4);
      }
    });

    // Scanlines effect (gentle CRT / retro monitor vibe)
    ctx.fillStyle = 'rgba(0, 0, 0, 0.12)';
    for (let y = 0; y < height; y += 3) {
      ctx.fillRect(0, y, width, 1);
    }
  }, [snake, food, direction]);

  return (
    <div
      id="retro-snake-section"
      className="p-4 sm:p-5 rounded-2xl bg-[#0b111e] border border-slate-800/90 shadow-xl relative overflow-hidden transition-all"
    >
      {/* Top Header Row (Chota Sa & Compact) */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Gamepad2 className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-white tracking-wide">
                Nokia Cyber Snake
              </span>
              <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                3310
              </span>
            </div>
            <p className="text-[10px] text-slate-400 hidden sm:block">
              Classic retro arcade reimagined in portfolio theme
            </p>
          </div>
        </div>

        {/* Score, High Score & Controls */}
        <div className="flex items-center gap-2">
          <div className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 flex items-center gap-3 text-[11px] font-mono">
            <div className="flex items-center gap-1 text-slate-300">
              <span className="text-slate-500 text-[10px]">SCORE</span>
              <span className="font-bold text-cyan-400">{score}</span>
            </div>
            <div className="w-px h-3 bg-slate-800" />
            <div className="flex items-center gap-1 text-amber-400">
              <Trophy className="w-3 h-3 text-amber-400" />
              <span className="font-bold">{highScore}</span>
            </div>
          </div>

          {/* Sound Toggle Button */}
          <button
            type="button"
            onClick={() => setIsSoundOn(!isSoundOn)}
            className={`p-1.5 rounded-lg border transition ${
              isSoundOn
                ? 'bg-slate-900 text-cyan-300 border-slate-700 hover:border-cyan-500'
                : 'bg-slate-950 text-slate-500 border-slate-800 hover:text-slate-300'
            }`}
            title={isSoundOn ? 'Mute 8-bit Sound' : 'Enable 8-bit Sound'}
          >
            {isSoundOn ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Main Grid: Screen on Left, Compact D-Pad on Right */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
        {/* Canvas Screen (Left side) */}
        <div className="sm:col-span-8 relative flex items-center justify-center rounded-xl overflow-hidden border-2 border-slate-800 bg-[#04080e] shadow-inner">
          <canvas
            ref={canvasRef}
            width={330}
            height={225}
            className="w-full h-auto max-h-[225px] aspect-[22/15] object-contain select-none"
          />

          {/* Start / Pause / Game Over Overlay */}
          {!isPlaying && (
            <div className="absolute inset-0 bg-black/80 backdrop-blur-xs flex flex-col items-center justify-center p-3 text-center z-10 select-none">
              {isGameOver ? (
                <div className="space-y-2 animate-in fade-in zoom-in duration-200">
                  <div className="text-sm font-extrabold text-rose-400 tracking-wider">
                    GAME OVER
                  </div>
                  <div className="text-[11px] text-slate-300 font-mono">
                    Final Score: <strong className="text-cyan-300">{score}</strong>
                    {score >= highScore && score > 0 && (
                      <span className="text-amber-400 ml-1.5 font-bold">★ NEW HIGH!</span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={resetGame}
                    className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 text-black font-extrabold text-xs flex items-center gap-1.5 mx-auto shadow-md transition"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Play Again</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-2.5">
                  <div className="text-xs font-bold text-cyan-300 tracking-wide">
                    READY TO SLITHER?
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (snake.length === INITIAL_SNAKE.length && score === 0) {
                        resetGame();
                      } else {
                        setIsPlaying(true);
                      }
                    }}
                    className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-black font-extrabold text-xs flex items-center gap-1.5 mx-auto shadow-md transition"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Start Game</span>
                  </button>
                  <p className="text-[10px] text-slate-400 font-mono">
                    Use Arrow Keys, WASD, or D-Pad
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Compact Right Control Panel ("Chota Sa") */}
        <div className="sm:col-span-4 flex flex-col justify-between items-center space-y-2.5 py-1">
          {/* Action Row: Pause / Restart & Speed */}
          <div className="flex items-center justify-between w-full max-w-[170px] gap-1.5">
            <button
              type="button"
              onClick={() => {
                if (isGameOver) resetGame();
                else setIsPlaying(!isPlaying);
              }}
              className="flex-1 py-1 px-2 rounded-md bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-slate-700 text-[10px] font-semibold flex items-center justify-center gap-1 transition"
              title={isPlaying ? 'Pause' : 'Resume'}
            >
              {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
              <span>{isPlaying ? 'Pause' : 'Play'}</span>
            </button>

            <button
              type="button"
              onClick={resetGame}
              className="py-1 px-2 rounded-md bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-[10px] font-semibold flex items-center gap-1 transition"
              title="Reset Game"
            >
              <RotateCcw className="w-3 h-3" />
            </button>

            <button
              type="button"
              onClick={() => setSpeedMode(speedMode === 'normal' ? 'fast' : 'normal')}
              className={`py-1 px-2 rounded-md border text-[10px] font-mono font-bold flex items-center gap-0.5 transition ${
                speedMode === 'fast'
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-slate-900 text-slate-400 border-slate-800'
              }`}
              title="Toggle Speed"
            >
              <Zap className="w-2.5 h-2.5" />
              <span>{speedMode === 'fast' ? 'TURBO' : 'NORM'}</span>
            </button>
          </div>

          {/* Tactile Nokia Cross D-Pad */}
          <div className="relative w-28 h-28 flex items-center justify-center select-none">
            {/* Center Hub */}
            <div className="w-7 h-7 rounded-md bg-slate-900 border border-slate-700/80 shadow-inner flex items-center justify-center z-10 pointer-events-none">
              <span className="w-2 h-2 rounded-full bg-cyan-400/80" />
            </div>

            {/* UP Button */}
            <button
              type="button"
              onClick={() => changeDirection('UP')}
              aria-label="Move Up"
              className="absolute top-0 w-8 h-8 rounded-t-lg bg-slate-900 hover:bg-cyan-950/60 active:bg-cyan-900 text-slate-300 hover:text-cyan-300 border border-slate-700 flex items-center justify-center transition shadow-xs"
            >
              <ChevronUp className="w-4 h-4" />
            </button>

            {/* DOWN Button */}
            <button
              type="button"
              onClick={() => changeDirection('DOWN')}
              aria-label="Move Down"
              className="absolute bottom-0 w-8 h-8 rounded-b-lg bg-slate-900 hover:bg-cyan-950/60 active:bg-cyan-900 text-slate-300 hover:text-cyan-300 border border-slate-700 flex items-center justify-center transition shadow-xs"
            >
              <ChevronDown className="w-4 h-4" />
            </button>

            {/* LEFT Button */}
            <button
              type="button"
              onClick={() => changeDirection('LEFT')}
              aria-label="Move Left"
              className="absolute left-0 w-8 h-8 rounded-l-lg bg-slate-900 hover:bg-cyan-950/60 active:bg-cyan-900 text-slate-300 hover:text-cyan-300 border border-slate-700 flex items-center justify-center transition shadow-xs"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* RIGHT Button */}
            <button
              type="button"
              onClick={() => changeDirection('RIGHT')}
              aria-label="Move Right"
              className="absolute right-0 w-8 h-8 rounded-r-lg bg-slate-900 hover:bg-cyan-950/60 active:bg-cyan-900 text-slate-300 hover:text-cyan-300 border border-slate-700 flex items-center justify-center transition shadow-xs"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="text-[9px] font-mono text-slate-500 text-center">
            TAP D-PAD OR USE ARROW KEYS
          </div>
        </div>
      </div>
    </div>
  );
};
