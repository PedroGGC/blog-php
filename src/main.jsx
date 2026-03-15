import React from 'react';
import ReactDOM from 'react-dom/client';
import Particles from './components/react-bits/Particles';
import GradientText from './components/react-bits/GradientText';
import ShinyText from './components/react-bits/ShinyText';
import ElasticSlider from './components/react-bits/ElasticSlider';
import FuzzyText from './components/react-bits/FuzzyText';
import GlitchText from './components/react-bits/GlitchText';
import { VscHome, VscArchive, VscAccount, VscColorMode, VscBell, VscAdd, VscSignOut } from 'react-icons/vsc';

import './index.css';

// --- Global Styles for Vertical Nav ---
const style = document.createElement('style');
style.textContent = `
  .side-nav-vertical {
    position: fixed;
    top: 1.5rem;
    left: 1.5rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
    z-index: 1000;
  }
  #vertical-nav-buttons {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
  }
  #top-right-audio-slider {
    position: fixed;
    top: 1.5rem;
    right: 1.5rem;
    z-index: 1000;
    width: 300px;
  }
  .nav-circle-btn {
    position: relative !important;
    width: 3.5rem !important;
    height: 3.5rem !important;
    border-radius: 50% !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    background: var(--color-surface) !important;
    color: var(--color-text) !important;
    border: 1px solid var(--color-border) !important;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1) !important;
    cursor: pointer !important;
    transition: all 0.2s ease !important;
    text-decoration: none !important;
    padding: 0 !important;
    margin: 0 !important;
    box-sizing: border-box !important;
    outline: none !important;
  }
  .nav-circle-btn:hover {
    transform: scale(1.1) !important;
    background: var(--color-surface-hover) !important;
    color: var(--color-primary) !important;
    box-shadow: 0 6px 12px rgba(0,0,0,0.15) !important;
  }
  .logo-circle-link {
    width: 3.5rem;
    height: 3.5rem;
    border-radius: 50%;
    background: var(--color-surface);
    color: var(--color-text);
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 800;
    font-size: 1.1rem;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    border: 1px solid var(--color-border);
    text-decoration: none;
    transition: all 0.2s ease;
    margin-bottom: 0.5rem;
  }
  .logo-circle-link:hover {
    transform: scale(1.1);
    background: var(--color-surface-hover);
    color: var(--color-primary);
  }
  .nav-circle-btn.btn-new-post {
    border: 1px solid var(--color-border) !important;
  }
  .nav-circle-btn .notification-count {
    position: absolute;
    top: -2px;
    right: -2px;
  }
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
  .rt-inline-wrapper {
    display: inline-flex;
    align-items: baseline;
    vertical-align: baseline;
    line-height: inherit;
    font-size: inherit;
  }
  .rt-inline-wrapper > * {
    line-height: inherit;
  }
  .rt-inline-wrapper canvas {
    vertical-align: baseline;
    line-height: inherit;
  }
  .lofi-top-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    width: 100%;
  }
  .lofi-status {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.65rem;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    font-weight: 700;
    min-width: 0;
  }
  .lofi-play-btn {
    margin-left: 1rem;
  }
  .lofi-track-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    width: 100%;
    flex-wrap: wrap;
  }
  .lofi-track-select {
    appearance: none;
    background: rgba(255, 255, 255, 0.12);
    border: 1px solid rgba(255, 255, 255, 0.25);
    color: inherit;
    border-radius: 999px;
    padding: 2px 10px;
    font-size: 0.75rem;
  }
  .lofi-chip {
    background: rgba(255, 255, 255, 0.16);
    border: 1px solid rgba(255, 255, 255, 0.25);
    color: inherit;
    border-radius: 999px;
    padding: 2px 10px;
    font-size: 0.7rem;
  }
`;
document.head.appendChild(style);

// --- Mount Helpers ---

const roots = new WeakMap();

const renderRoot = (el, component) => {
  let root = roots.get(el);
  if (!root) {
    root = ReactDOM.createRoot(el);
    roots.set(el, root);
  }
  root.render(component);
};

const mount = (id, component, options = {}) => {
  const el = document.getElementById(id);
  if (!el) {
    return;
  }
  const force = options.force === true;
  if (el.dataset.mounted && !force) {
    return;
  }
  el.dataset.mounted = "true";
  renderRoot(el, component);
};

const mountAll = (selector, componentFactory) => {
  document.querySelectorAll(selector).forEach(el => {
    if (!el.dataset.mounted) {
      el.dataset.mounted = "true";
      ReactDOM.createRoot(el).render(componentFactory(el));
    }
  });
};

// --- Rich Text Effect Mounter ---

const mountRichTextEffects = () => {
  mountAll('.rt-gradient', (el) => (
    <span className="rt-inline-wrapper">
      <GradientText colors={["#3b82f6", "#10b981", "#f59e0b"]} animationSpeed={8} showBorder={false}>
        {el.dataset.text}
      </GradientText>
    </span>
  ));

  mountAll('.rt-shiny', (el) => (
    <ShinyText text={el.dataset.text} speed={8} color="var(--color-text)" shineColor="#3b82f6" spread={100} />
  ));

  mountAll('.rt-fuzzy', (el) => (
    <span className="rt-inline-wrapper">
      <FuzzyText baseIntensity={0.05} hoverIntensity={0.2} enableHover fontSize="inherit" fontWeight="inherit" fontFamily="inherit" color="inherit">
        {el.dataset.text}
      </FuzzyText>
    </span>
  ));

  mountAll('.rt-glitch', (el) => (
    <GlitchText speed={0.3} enableShadows={true} enableOnHover={false}>
      {el.dataset.text}
    </GlitchText>
  ));
};

window.mountRichTextEffects = mountRichTextEffects;

const VerticalNav = ({ isLoggedIn }) => {
  // Detecta automaticamente se estamos em uma subpasta
  const pathname = window.location.pathname;
  const isSubdir = pathname.includes('/pages/') || pathname.includes('/auth/');
  const isDeepSubdir = pathname.includes('/src/actions/');
  
  let root = '';
  if (isDeepSubdir) {
    root = '../../';
  } else if (isSubdir) {
    root = '../';
  }
  
  return (
    <>
      <a href={`${root}index.php`} className="nav-circle-btn" title="Início"><VscHome size={24} /></a>
      <a href={`${root}pages/post_manage.php`} className="nav-circle-btn" title="Posts"><VscArchive size={24} /></a>
      
      {isLoggedIn && (
        <a href={`${root}pages/post_manage.php?action=create`} className="nav-circle-btn btn-new-post" title="Novo Post">
          <VscAdd size={24} />
        </a>
      )}

      <button 
        className="nav-circle-btn" 
        onClick={() => document.getElementById('hidden-theme-toggle')?.click()}
        title="Alterar Tema"
      >
        <VscColorMode size={24} />
      </button>

      {isLoggedIn && (
        <button 
          className="nav-circle-btn" 
          id="bell-toggle"
          title="Notificações"
          type="button"
        >
          <VscBell size={24} />
          <span id="bell-badge" className="notification-count" style={{ display: "none" }}>0</span>
        </button>
      )}

      <a href={isLoggedIn ? `${root}pages/account.php` : `${root}auth/login.php`} className="nav-circle-btn" title={isLoggedIn ? "Perfil" : "Entrar"}>
        <VscAccount size={24} />
      </a>

      {isLoggedIn && (
        <a href={`${root}src/actions/logout.php`} className="nav-circle-btn" title="Sair">
          <VscSignOut size={24} />
        </a>
      )}
    </>
  );
};

const LofiPlayer = () => {
  const STORAGE_KEY = 'lofi-player-state';
  const audioRef = React.useRef(null);
  const lastTimeRef = React.useRef(0);
  const pendingTimeRef = React.useRef(null);
  const autoPlayRef = React.useRef(false);
  const isPlayingRef = React.useRef(false);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [volume, setVolume] = React.useState(30);
  const tracks = [
    {
      label: 'Lo-fi Breeze',
      url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
    },
    {
      label: 'Midnight Drive',
      url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3'
    },
    {
      label: 'Cafe Rain',
      url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3'
    },
    {
      label: 'Focus Flow',
      url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3'
    }
  ];
  const [trackIndex, setTrackIndex] = React.useState(0);
  const currentTrack = tracks[trackIndex];

  const persistState = React.useCallback(() => {
    try {
      const payload = {
        isPlaying,
        volume,
        trackIndex,
        currentTime: lastTimeRef.current || 0
      };
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // no-op if storage is unavailable
    }
  }, [isPlaying, volume, trackIndex]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    autoPlayRef.current = false;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(e => console.log("Auto-play prevented", e));
    }
    setIsPlaying(!isPlaying);
    persistState();
  };

  const handleVolumeChange = (val) => {
    setVolume(val);
    if (audioRef.current) {
      audioRef.current.volume = val / 100;
    }
    persistState();
  };

  const handleTrackChange = (event) => {
    const nextIndex = Number(event.target.value);
    if (!Number.isFinite(nextIndex)) return;
    pendingTimeRef.current = 0;
    lastTimeRef.current = 0;
    setTrackIndex(nextIndex);
    persistState();
  };

  const selectPreviousTrack = () => {
    pendingTimeRef.current = 0;
    lastTimeRef.current = 0;
    setTrackIndex((prev) => (prev - 1 + tracks.length) % tracks.length);
    persistState();
  };

  const selectNextTrack = () => {
    pendingTimeRef.current = 0;
    lastTimeRef.current = 0;
    setTrackIndex((prev) => (prev + 1) % tracks.length);
    persistState();
  };

  React.useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  React.useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw);
      if (typeof saved.trackIndex === 'number') {
        const safeIndex = Math.max(0, Math.min(tracks.length - 1, saved.trackIndex));
        setTrackIndex(safeIndex);
      }
      if (typeof saved.volume === 'number' && Number.isFinite(saved.volume)) {
        setVolume(saved.volume);
      }
      if (typeof saved.currentTime === 'number' && Number.isFinite(saved.currentTime) && saved.currentTime >= 0) {
        pendingTimeRef.current = saved.currentTime;
        lastTimeRef.current = saved.currentTime;
      }
      if (typeof saved.isPlaying === 'boolean') {
        setIsPlaying(saved.isPlaying);
        autoPlayRef.current = saved.isPlaying;
      }
    } catch {
      // ignore malformed storage
    }
  }, [tracks.length]);

  React.useEffect(() => {
    window.__persistLofiState = persistState;
    return () => {
      if (window.__persistLofiState === persistState) {
        delete window.__persistLofiState;
      }
    };
  }, [persistState]);

  React.useEffect(() => {
    const handlePageHide = () => persistState();
    window.addEventListener('pagehide', handlePageHide);
    window.addEventListener('beforeunload', handlePageHide);
    return () => {
      window.removeEventListener('pagehide', handlePageHide);
      window.removeEventListener('beforeunload', handlePageHide);
    };
  }, [persistState]);

  React.useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = volume / 100;
  }, [volume]);

  React.useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => {
      lastTimeRef.current = audio.currentTime || 0;
    };

    const onLoadedMetadata = () => {
      if (pendingTimeRef.current !== null && Number.isFinite(pendingTimeRef.current)) {
        const target = Math.max(0, Math.min(pendingTimeRef.current, audio.duration || pendingTimeRef.current));
        audio.currentTime = target;
        pendingTimeRef.current = null;
      }

      if (autoPlayRef.current) {
        audio.play().then(() => {
          if (!isPlayingRef.current) setIsPlaying(true);
        }).catch(() => {
          autoPlayRef.current = false;
          if (isPlayingRef.current) setIsPlaying(false);
        });
      }
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
    };
  }, []);

  React.useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.load();
    if (isPlaying) {
      audioRef.current.play().catch(e => console.log("Auto-play prevented", e));
    }
  }, [trackIndex]);

  return (
    <div className="flex flex-col items-center gap-2 w-full p-4 bg-white/10 dark:bg-black/20 backdrop-blur-lg rounded-3xl border border-white/20 shadow-xl">
      <audio 
        ref={audioRef} 
        loop 
        src={currentTrack.url}
      />
      <div className="lofi-top-row px-2">
        <div className="lofi-status">
          <GradientText colors={["#3b82f6", "#10b981"]} animationSpeed={3}>
            {isPlaying ? "Playing" : "Paused"}
          </GradientText>
          <span>{currentTrack.label}</span>
        </div>
        <button 
          onClick={togglePlay}
          className="lofi-play-btn text-xs bg-white/20 hover:bg-white/30 px-2 py-1 rounded-full transition-colors"
        >
          {isPlaying ? "Pause" : "Play"}
        </button>
      </div>
      <div className="lofi-track-row px-2">
        <label className="sr-only" htmlFor="lofi-track-select">Selecionar música</label>
        <select
          id="lofi-track-select"
          className="lofi-track-select"
          value={trackIndex}
          onChange={handleTrackChange}
        >
          {tracks.map((track, index) => (
            <option key={track.url} value={index}>{track.label}</option>
          ))}
        </select>
        <button type="button" className="lofi-chip" onClick={selectPreviousTrack}>Anterior</button>
        <button type="button" className="lofi-chip" onClick={selectNextTrack}>Próxima</button>
      </div>
      <ElasticSlider defaultValue={30} leftIcon={<span>🔈</span>} rightIcon={<span>🔊</span>} onChange={handleVolumeChange} />
    </div>
  );
};

let richTextObserverStarted = false;

const initPageWidgets = () => {
  const navContainer = document.getElementById('vertical-nav-buttons');
  const isLoggedIn = navContainer?.dataset.loggedIn === 'true';
  const pathname = window.location.pathname;
  const isSubdir = pathname.includes('/pages/') || pathname.includes('/auth/');
  const isDeepSubdir = pathname.includes('/src/actions/');
  let basePath = '';
  if (isDeepSubdir) {
    basePath = '../../';
  } else if (isSubdir) {
    basePath = '../';
  }

  mount('header-logo-circular', (
    <a href={`${basePath}index.php`} className="logo-circle-link">Tabs</a>
  ), { force: true });

  mount('vertical-nav-buttons', <VerticalNav isLoggedIn={isLoggedIn} basePath={basePath} />, { force: true });

  mount('top-right-audio-slider', <LofiPlayer />);

  mount('hero-particles', (
    <Particles
      particleCount={200}
      particleSpread={10}
      speed={0.2}
      particleColors={["#000000", "#000000", "#ffffff", "#ffffff"]}
      moveParticlesOnHover={true}
      particleHoverFactor={2}
      alphaParticles={true}
      particleBaseSize={80}
      sizeRandomness={1.5}
      cameraDistance={40}
    />
  ));

  mountAll('.post-title-shiny', (el) => (
    <ShinyText
      text={el.dataset.title}
      speed={3}
      color="var(--color-text)"
      shineColor="#3b82f6"
      spread={100}
    />
  ));

  mount('empty-fuzzy', (
    <div className="flex flex-col items-center justify-center py-20">
      <FuzzyText 
        baseIntensity={0.2}
        hoverIntensity={0.6}
        enableHover
        fontSize="4rem"
        fontWeight={900}
      >
        Nada aqui ainda...
      </FuzzyText>
    </div>
  ));

  mountRichTextEffects();

  if (!richTextObserverStarted) {
    richTextObserverStarted = true;
    // Re-run effects after a small delay to catch anything rendered by other scripts
    setTimeout(mountRichTextEffects, 100);

    // Observe DOM changes to re-mount effects (useful for transitions or dynamic content)
    const observer = new MutationObserver(() => {
      mountRichTextEffects();
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }
};

window.initPageWidgets = initPageWidgets;

document.addEventListener('DOMContentLoaded', initPageWidgets);
