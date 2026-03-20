import { useState, useEffect } from "react";
import { TauriService } from "../services/TauriService";

const BASE_EDITIONS = [
  {
    id: "legacy_evolved",
    name: "Legacy Evolved",
    desc: "Backporting the newer title updates back to the LCE",
    url: "https://github.com/piebotc/LegacyEvolved/releases/download/nightly/LCEWindows64.zip",
  },
  {
    id: "vanilla_tu24",
    name: "Title Update 24",
    desc: "Based on TU19, but with the features of TU24.",
    url: "https://huggingface.co/datasets/KayJann/emerald-legacy-assets/resolve/main/emerald_tu24_vanilla.zip",
  },
  {
    id: "vanilla_tu19",
    name: "Title Update 19",
    desc: "Leaked 4J Studios build. (smartcmd)",
    url: "https://github.com/smartcmd/MinecraftConsoles/releases/download/nightly/LCEWindows64.zip",
  },
];

interface GameManagerProps {
  profile: string;
  setProfile: (id: string) => void;
  customEditions: any[];
  setCustomEditions: (editions: any[]) => void;
}

export function useGameManager({ profile, setProfile, customEditions, setCustomEditions }: GameManagerProps) {
  const [installs, setInstalls] = useState<string[]>([]);
  const [isGameRunning, setIsGameRunning] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState<number | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const editions = [...BASE_EDITIONS, ...customEditions];

  const checkInstalls = async () => {
    const results = await Promise.all(
      editions.map(async (e) => {
        const isInstalled = await TauriService.checkGameInstalled(e.id);
        return isInstalled ? e.id : null;
      }),
    );
    setInstalls(results.filter((id): id is string => id !== null));
  };

  useEffect(() => {
    checkInstalls();
    const unlistenDownload = TauriService.onDownloadProgress((p) => setDownloadProgress(p));
    return () => {
      unlistenDownload.then((u) => u());
    };
  }, [customEditions]);

  const toggleInstall = async (id: string) => {
    if (downloadingId) return;
    const edition = editions.find((e) => e.id === id);
    if (!edition) return;
    try {
      setDownloadingId(id);
      setDownloadProgress(0);
      await TauriService.downloadAndInstall(edition.url, id);
      await checkInstalls();
      setProfile(id);
      setDownloadProgress(null);
      setDownloadingId(null);
    } catch (e) {
      console.error(e);
      setDownloadProgress(null);
      setDownloadingId(null);
    }
  };

  const handleUninstall = async (id: string) => {
    await TauriService.deleteInstance(id);
    await checkInstalls();
  };

  const handleLaunch = async () => {
    if (isGameRunning) return;
    setIsGameRunning(true);
    try {
      await TauriService.launchGame(profile, []);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGameRunning(false);
    }
  };

  const stopGame = async () => {
    try {
      await TauriService.stopGame(profile);
      setIsGameRunning(false);
    } catch (e) {
      console.error(e);
    }
  };

  const addCustomEdition = (edition: { name: string; desc: string; url: string }) => {
    const id = `custom_${Date.now()}`;
    const newEdition = { ...edition, id };
    setCustomEditions([...customEditions, newEdition]);
    return id;
  };

  const deleteCustomEdition = (id: string) => {
    setCustomEditions(customEditions.filter((e) => e.id !== id));
    TauriService.deleteInstance(id).catch(console.error);
  };

  return {
    installs,
    isGameRunning,
    downloadProgress,
    downloadingId,
    editions,
    toggleInstall,
    handleUninstall,
    handleLaunch,
    stopGame,
    addCustomEdition,
    deleteCustomEdition,
    checkInstalls,
  };
}
