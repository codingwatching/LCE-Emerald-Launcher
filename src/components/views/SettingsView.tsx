import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { TauriService, Runner } from '../../services/TauriService';

export default function SettingsView({ 
  vfxEnabled, setVfxEnabled, 
  music: musicVolume, setMusic: setMusicVolume, 
  sfx: sfxVolume, setSfx: setSfxVolume, 
  layout, setLayout, 
  currentTrack, setCurrentTrack,
  tracks,
  playClickSound, playBackSound, setActiveView,
  linuxRunner, setLinuxRunner,
  perfBoost, setPerfBoost,
  isGameRunning, stopGame
}: any) {
  const [focusIndex, setFocusIndex] = useState<number | null>(null);
  const [runners, setRunners] = useState<Runner[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const layouts = ["KBM", "PLAYSTATION", "XBOX"];
  const ITEM_COUNT = 9; // Music, SFX, Track, VFX, Layout, Runner, PerfBoost, macOS Setup, Stop Game, Back - wait, let's recalibrate index

  useEffect(() => {
    TauriService.getAvailableRunners().then(setRunners);
  }, []);

  const handleLayoutToggle = () => {
    playClickSound();
    const currentIndex = layouts.indexOf(layout);
    const nextIndex = (currentIndex + 1) % layouts.length;
    setLayout(layouts[nextIndex]);
  };

  const handleVfxToggle = () => {
    if(setVfxEnabled) {
      playClickSound();
      setVfxEnabled(!vfxEnabled);
    }
  };

  const handlePerfToggle = () => {
    playClickSound();
    setPerfBoost(!perfBoost);
  };

  const handleRunnerToggle = () => {
    playClickSound();
    if (runners.length === 0) return;
    const currentIndex = runners.findIndex(r => r.id === linuxRunner);
    const nextIndex = (currentIndex + 1) % runners.length;
    setLinuxRunner(runners[nextIndex].id);
  };

  const handleTrackToggle = () => {
    playClickSound();
    if (setCurrentTrack && tracks) {
      setCurrentTrack((currentTrack + 1) % tracks.length);
    }
  };

  const handleMacosSetup = async () => {
    playClickSound();
    try {
      await TauriService.setupMacosRuntime();
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Backspace') {
        playBackSound();
        setActiveView('main');
        return;
      }

      if (e.key === 'ArrowDown') {
        setFocusIndex(prev => (prev === null || prev >= ITEM_COUNT - 1) ? 0 : prev + 1);
      } else if (e.key === 'ArrowUp') {
        setFocusIndex(prev => (prev === null || prev <= 0) ? ITEM_COUNT - 1 : prev - 1);
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        const delta = e.key === 'ArrowRight' ? 5 : -5;
        if (focusIndex === 0) setMusicVolume((v: number) => Math.max(0, Math.min(100, v + delta)));
        else if (focusIndex === 1) setSfxVolume((v: number) => Math.max(0, Math.min(100, v + delta)));
      } else if (e.key === 'Enter' && focusIndex !== null) {
        if (focusIndex === 2) handleTrackToggle();
        else if (focusIndex === 3) handleVfxToggle();
        else if (focusIndex === 4) handleLayoutToggle();
        else if (focusIndex === 5) handleRunnerToggle();
        else if (focusIndex === 6) handlePerfToggle();
        else if (focusIndex === 7) handleMacosSetup();
        else if (focusIndex === 8) { if(isGameRunning) stopGame(); else { playBackSound(); setActiveView('main'); } }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [focusIndex, musicVolume, sfxVolume, setMusicVolume, setSfxVolume, playBackSound, setActiveView, handleTrackToggle, handleVfxToggle, handleLayoutToggle, runners, linuxRunner, perfBoost, isGameRunning]);

  useEffect(() => {
    if (focusIndex !== null) {
      const el = containerRef.current?.querySelector(`[data-index="${focusIndex}"]`) as HTMLElement;
      if (el) el.focus();
    }
  }, [focusIndex]);

  let trackName = "Unknown";
  if (tracks && tracks.length > 0) {
     const fullPath = tracks[currentTrack];
     trackName = fullPath.split('/').pop().replace('.ogg', '').replace('.wav', '');
  }

  const getItemStyle = (index: number) => ({
    backgroundImage: focusIndex === index ? "url('/images/button_highlighted.png')" : "url('/images/Button_Background.png')", 
    backgroundSize: "100% 100%", 
    imageRendering: "pixelated" as const
  });

  const getSliderStyle = (index: number) => ({
    backgroundImage: focusIndex === index ? "url('/images/Button_Background2.png')" : "url('/images/Button_Background2.png')", 
    backgroundSize: "100% 100%", 
    imageRendering: "pixelated" as const,
    color: focusIndex === index ? '#FFFF55' : 'white'
  });

  const selectedRunnerName = runners.find(r => r.id === linuxRunner)?.name || "Native / Default";

  return (
    <motion.div ref={containerRef} tabIndex={-1} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="flex flex-col items-center w-full max-w-2xl outline-none">
      <h2 className="text-2xl text-white mc-text-shadow mb-4 border-b-2 border-[#373737] pb-2 w-[40%] max-w-[200px] text-center tracking-widest uppercase opacity-80">Settings</h2>
      
      <div className="w-full max-w-[540px] space-y-2 mb-4 p-6 flex flex-col items-center overflow-y-auto max-h-[60vh]">

        <div 
          data-index="0" tabIndex={0}
          onMouseEnter={() => setFocusIndex(0)}
          className="relative w-[360px] h-10 flex items-center justify-center cursor-pointer transition-all outline-none border-none hover:text-[#FFFF55] shrink-0" 
          style={getSliderStyle(0)}
        >
          <span className={`absolute z-10 text-xl mc-text-shadow pointer-events-none transition-colors tracking-widest ${focusIndex === 0 ? 'text-[#FFFF55]' : 'text-white'}`}>
            Music: {musicVolume}%
          </span>
          <div className="absolute w-full h-full flex items-center justify-center">
            <input 
              type="range" min="0" max="100" step="1"
              value={musicVolume} 
              onChange={(e) => setMusicVolume(parseInt(e.target.value))} 
              onMouseUp={playClickSound} 
              className="mc-slider-custom w-[calc(100%+16px)] h-full opacity-100 cursor-pointer z-20 outline-none m-0" 
            />
          </div>
        </div>

        <div 
          data-index="1" tabIndex={0}
          onMouseEnter={() => setFocusIndex(1)}
          className="relative w-[360px] h-10 flex items-center justify-center cursor-pointer transition-all outline-none border-none hover:text-[#FFFF55] shrink-0" 
          style={getSliderStyle(1)}
        >
          <span className={`absolute z-10 text-xl mc-text-shadow pointer-events-none transition-colors tracking-widest ${focusIndex === 1 ? 'text-[#FFFF55]' : 'text-white'}`}>
            SFX: {sfxVolume}%
          </span>
          <div className="absolute w-full h-full flex items-center justify-center">
            <input 
              type="range" min="0" max="100" step="1"
              value={sfxVolume} 
              onChange={(e) => setSfxVolume(parseInt(e.target.value))} 
              onMouseUp={playClickSound} 
              className="mc-slider-custom w-[calc(100%+16px)] h-full opacity-100 cursor-pointer z-20 outline-none m-0" 
            />
          </div>
        </div>

        <button 
           data-index="2"
           onMouseEnter={() => setFocusIndex(2)}
           onClick={handleTrackToggle}
           className={`w-[360px] h-10 flex items-center justify-center px-4 relative z-30 transition-colors outline-none border-none hover:text-[#FFFF55] shrink-0 ${focusIndex === 2 ? 'text-[#FFFF55]' : 'text-white'}`}
           style={getItemStyle(2)}
        >
           <span className="text-xl mc-text-shadow tracking-widest truncate w-full text-center">{trackName} - C418</span>
        </button>

        {setVfxEnabled && (
        <button 
           data-index="3"
           onMouseEnter={() => setFocusIndex(3)}
           onClick={handleVfxToggle}
           className={`w-[360px] h-10 flex items-center justify-center px-4 relative z-30 transition-colors outline-none border-none hover:text-[#FFFF55] shrink-0 ${focusIndex === 3 ? 'text-[#FFFF55]' : 'text-white'}`}
           style={getItemStyle(3)}
        >
           <span className="text-xl mc-text-shadow tracking-widest">VFX: {vfxEnabled ? 'ON' : 'OFF'}</span>
        </button>
        )}

        <button 
           data-index="4"
           onMouseEnter={() => setFocusIndex(4)}
           onClick={handleLayoutToggle}
           className={`w-[360px] h-10 flex items-center justify-center px-4 relative z-30 transition-colors outline-none border-none hover:text-[#FFFF55] shrink-0 ${focusIndex === 4 ? 'text-[#FFFF55]' : 'text-white'}`}
           style={getItemStyle(4)}
        >
           <span className="text-xl mc-text-shadow tracking-widest">Layout: {layout}</span>
        </button>

        <button 
           data-index="5"
           onMouseEnter={() => setFocusIndex(5)}
           onClick={handleRunnerToggle}
           className={`w-[360px] h-10 flex items-center justify-center px-4 relative z-30 transition-colors outline-none border-none hover:text-[#FFFF55] shrink-0 ${focusIndex === 5 ? 'text-[#FFFF55]' : 'text-white'}`}
           style={getItemStyle(5)}
        >
           <span className="text-xl mc-text-shadow tracking-widest truncate w-full text-center">Runner: {selectedRunnerName}</span>
        </button>

        <button 
           data-index="6"
           onMouseEnter={() => setFocusIndex(6)}
           onClick={handlePerfToggle}
           className={`w-[360px] h-10 flex items-center justify-center px-4 relative z-30 transition-colors outline-none border-none hover:text-[#FFFF55] shrink-0 ${focusIndex === 6 ? 'text-[#FFFF55]' : 'text-white'}`}
           style={getItemStyle(6)}
        >
           <span className="text-xl mc-text-shadow tracking-widest uppercase">M1/M2 Boost: {perfBoost ? 'Enabled' : 'Disabled'}</span>
        </button>

        <button 
           data-index="7"
           onMouseEnter={() => setFocusIndex(7)}
           onClick={handleMacosSetup}
           className={`w-[360px] h-10 flex items-center justify-center px-4 relative z-30 transition-colors outline-none border-none hover:text-[#FFFF55] shrink-0 ${focusIndex === 7 ? 'text-[#FFFF55]' : 'text-white'}`}
           style={getItemStyle(7)}
        >
           <span className="text-xl mc-text-shadow tracking-widest uppercase text-xs">Setup macOS Compatibility</span>
        </button>

        {isGameRunning && (
          <button 
            data-index="8"
            onMouseEnter={() => setFocusIndex(8)}
            onClick={stopGame}
            className={`w-[360px] h-10 flex items-center justify-center px-4 relative z-30 transition-colors outline-none border-none hover:text-red-500 shrink-0 ${focusIndex === 8 ? 'text-red-400' : 'text-red-200'}`}
            style={getItemStyle(8)}
          >
            <span className="text-xl mc-text-shadow tracking-widest font-bold">STOP GAME</span>
          </button>
        )}

      </div>

      <button 
        data-index={isGameRunning ? "9" : "8"}
        onMouseEnter={() => setFocusIndex(isGameRunning ? 9 : 8)}
        onClick={() => { playBackSound(); setActiveView('main'); }} 
        className={`w-72 h-10 flex items-center justify-center transition-colors text-xl mc-text-shadow outline-none border-none hover:text-[#FFFF55] ${focusIndex === (isGameRunning ? 9 : 8) ? 'text-[#FFFF55]' : 'text-white'}`}
        style={getItemStyle(isGameRunning ? 9 : 8)}
      >
        Back
      </button>
    </motion.div>
  );
}