# wsup leonardo

don't touch the backend (`src-tauri/`), it works fine. focus on the react frontend.

## hooks to use

**useAudio(musicVol, sfxVol, isMuted)** - music & sounds  
returns: `musicRef`, `playRandomMusic`, `pauseMusic`, `resumeMusic`, `playSfx`, `ensureAudio`

**useGameInstances(...)** - installs & launches  
returns: `installedStatus`, `installingInstance`, `downloadProgress`, `isGameRunning`, `executeInstall`, `launchGame`, `stopGame`, `updateAllStatus`

**useSettings()** - user prefs (auto-saves to localStorage)  
returns: `musicVol`, `sfxVol`, `isMuted`, `showClickParticles`, `showPanorama`, `themeStyleId`, `themePaletteId`, `macosCompatReady` + setters

**useLauncher(...)** - launch button with fade  
returns: `isRunning`, `fadeAndLaunch`, `stopGame`

**TauriService** - call rust functions directly  
`launchGame(instanceId, servers)`, `saveConfig(config)`, etc.

## replace these

- `src/components/views/*.tsx` - main views
- `src/components/modals/*.tsx` - popups
- `src/components/common/*.tsx` - shared stuff
- `src/components/layout/*.tsx` - sidebar
- `src/css/index.css` - styling
- `src/pages/App.tsx` - structure (keep hook calls)

## keep these

- `src/hooks/*.ts` - logic
- `src/services/tauri.ts` - api
- `src/services/versions.ts` - versions
- `src/types/*.ts` - types
- `src/services/audio.ts` - sounds
- `src/services/RPC.ts` - discord

## rules

1. one game at a time - `isGameRunning` updates every 2s
2. music - no Media Session API or OS controls, just background playback
3. auto-pause/resume - handled by hooks already
4. first run - check `isFirstRun` in App.tsx

## sounds

`click.wav`, `orb.ogg`, `levelup.ogg`, `back.ogg`, `pop.wav`, `wood click.wav`

## music

5 tracks in `/public/music/` (music1-5.ogg, btw we may add some, but i added those because they're the most chill)

## types

```typescript
interface McServer { name: string; ip: string; port: number; }
interface AppConfig { username: string; skinBase64?: string; themeStyleId?: string; }
```

we're letting u cook man 🔥
