import { useState, useEffect, useCallback } from "react";
import pkg from "../../package.json";

const CURRENT_VERSION = pkg.version;
const REPO_URL = "https://api.github.com/repos/Emerald-Legacy-Launcher/Emerald-Legacy-Launcher/releases/latest";

export function useUpdateCheck() {
  const [updateMessage, setUpdateMessage] = useState<string | null>(null);

  const checkUpdates = useCallback(async () => {
    try {
      const response = await fetch(REPO_URL);
      if (!response.ok) return;

      const data = await response.json();
      const latestVersion = data.tag_name.replace(/^v/, '');

      if (latestVersion !== CURRENT_VERSION) {
        setUpdateMessage(`Version ${data.tag_name} is now available!`);
      }
    } catch (e) {
      console.error("Failed to check for updates:", e);
    }
  }, []);

  useEffect(() => {
    checkUpdates();
  }, [checkUpdates]);

  return {
    updateMessage,
    clearUpdateMessage: () => setUpdateMessage(null),
  };
}
