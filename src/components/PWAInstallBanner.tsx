"use client";
import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function PWAInstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [show, setShow] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setInstalled(true);
      return;
    }

    // Check if user dismissed it before
    const dismissed = sessionStorage.getItem("pwa_dismissed");
    if (dismissed) return;

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Show banner after 3 seconds
      setTimeout(() => setShow(true), 3000);
    };

    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", () => setInstalled(true));

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const result = await deferredPrompt.userChoice;
    if (result.outcome === "accepted") {
      setInstalled(true);
    }
    setShow(false);
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShow(false);
    sessionStorage.setItem("pwa_dismissed", "1");
  };

  if (!show || installed) return null;

  return (
    <div className="pwa-install-banner">
      <div className="pwa-install-banner-icon">💡</div>
      <div className="pwa-install-banner-text">
        <div className="pwa-install-banner-title">Jilola ilovasini yuklab oling</div>
        <div className="pwa-install-banner-sub">Telefoningizga o'rnating — tez, qulay!</div>
      </div>
      <button className="pwa-install-btn" onClick={handleInstall}>
        O'rnatish
      </button>
      <button className="pwa-dismiss-btn" onClick={handleDismiss} aria-label="Yopish">
        ✕
      </button>
    </div>
  );
}
