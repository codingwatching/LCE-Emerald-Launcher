import { useEffect } from "react";
import RpcService from "../services/RpcService";

interface DiscordRPCProps {
  rpcEnabled: boolean;
  showIntro: boolean;
  username: string;
  profile: string;
  activeView: string;
  isGameRunning: boolean;
  downloadProgress: number | null;
  downloadingId: string | null;
  editions: any[];
}

export function useDiscordRPC({
  rpcEnabled,
  showIntro,
  username,
  profile,
  activeView,
  isGameRunning,
  downloadProgress,
  downloadingId,
  editions,
}: DiscordRPCProps) {
  useEffect(() => {
    const updateRPC = async () => {
      if (!rpcEnabled || showIntro || !username) return;

      const version = editions.find((e) => e.id === profile);
      const versionName = version ? version.name : "Unknown Version";
      let details = "In Menus";
      let state = isGameRunning ? `Playing as ${username}` : `Logged in as ${username}`;

      if (isGameRunning) {
        details = `Playing ${versionName}`;
      } else if (downloadProgress !== null) {
        const downloadingName = editions.find((e) => e.id === downloadingId)?.name || "Game Files";
        details = `Downloading ${downloadingName} (${downloadProgress.toFixed(0)}%)`;
      } else {
        const tabNames: Record<string, string> = {
          main: "Main Menu",
          versions: "Selecting Version",
          settings: "In Settings",
          themes: "Browsing Themes",
          skins: "Browsing Skins",
          marketplace: "Browsing Marketplace",
        };
        details = tabNames[activeView] || "In Menus";
      }

      await RpcService.updateActivity(details, state, isGameRunning);
    };

    updateRPC();
  }, [rpcEnabled, showIntro, username, profile, activeView, isGameRunning, downloadProgress, downloadingId, editions]);
}
