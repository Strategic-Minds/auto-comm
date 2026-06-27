"use client";

import { useEffect, useState } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

type PwaInstallButtonsProps = {
  compact?: boolean;
  tone?: "dark" | "light";
};

export function PwaInstallButtons({ compact = false, tone = "light" }: PwaInstallButtonsProps) {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [status, setStatus] = useState("PWA ready");
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches || Boolean((window.navigator as Navigator & { standalone?: boolean }).standalone);
    setInstalled(isStandalone);

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").then(() => setStatus(isStandalone ? "Installed" : "Ready to install")).catch(() => setStatus("Install ready after refresh"));
    }

    const handleInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as BeforeInstallPromptEvent);
      setStatus("Ready to install");
    };

    const handleInstalled = () => {
      setInstalled(true);
      setInstallPrompt(null);
      setStatus("Installed");
    };

    window.addEventListener("beforeinstallprompt", handleInstallPrompt);
    window.addEventListener("appinstalled", handleInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleInstallPrompt);
      window.removeEventListener("appinstalled", handleInstalled);
    };
  }, []);

  async function requestInstall(label: "download" | "home") {
    if (installed) {
      setStatus("Already on home screen");
      return;
    }

    if (!installPrompt) {
      setStatus(label === "download" ? "Use browser install menu" : "Use Add to Home Screen");
      return;
    }

    await installPrompt.prompt();
    const choice = await installPrompt.userChoice;
    setInstallPrompt(null);
    setStatus(choice.outcome === "accepted" ? "Install accepted" : "Install dismissed");
  }

  const dark = tone === "dark";
  const sharedButton = {
    minHeight: compact ? 38 : 44,
    border: 0,
    borderRadius: 999,
    padding: compact ? "0 14px" : "0 18px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    fontSize: compact ? 12 : 13,
    fontWeight: 950,
    whiteSpace: "nowrap" as const,
    cursor: "pointer"
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
      <button
        aria-label="Download Auto Chat as an app"
        onClick={() => requestInstall("download")}
        style={{
          ...sharedButton,
          background: "#39ff14",
          color: "#050706",
          boxShadow: "0 16px 36px rgba(57,255,20,.32)"
        }}
      >
        <span aria-hidden="true">A</span>
        Download App
      </button>
      <button
        aria-label="Add Auto Chat to the home screen"
        onClick={() => requestInstall("home")}
        style={{
          ...sharedButton,
          background: dark ? "rgba(255,255,255,.1)" : "#050706",
          color: "#ffffff",
          boxShadow: dark ? "inset 0 0 0 1px rgba(255,255,255,.16)" : "0 14px 32px rgba(5,7,6,.2)"
        }}
      >
        Home Screen
      </button>
      <span
        aria-live="polite"
        style={{
          minHeight: compact ? 28 : 32,
          borderRadius: 999,
          padding: compact ? "0 10px" : "0 12px",
          display: "inline-flex",
          alignItems: "center",
          color: dark ? "rgba(255,255,255,.72)" : "#687168",
          background: dark ? "rgba(255,255,255,.08)" : "rgba(255,255,255,.75)",
          fontSize: 11,
          fontWeight: 900
        }}
      >
        {status}
      </span>
    </div>
  );
}
