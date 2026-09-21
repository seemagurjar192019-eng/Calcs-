import React from 'react';
import { Download, CheckCircle2 } from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, promptInstall } = usePWAInstall();

  if (isInstalled) {
    return (
      <span
        id="pwa-status-installed"
        className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 rounded-lg"
        title="App running in installed PWA standalone mode"
      >
        <CheckCircle2 className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Installed</span>
      </span>
    );
  }

  if (!isInstallable) {
    return null;
  }

  return (
    <button
      id="pwa-install-btn"
      onClick={promptInstall}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-cyan-300 bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-500/40 rounded-lg shadow-sm hover:shadow-cyan-500/20 transition-all cursor-pointer"
      title="Install Precision Calculator as a native Progressive Web App"
    >
      <Download className="w-3.5 h-3.5 animate-bounce" />
      <span>Install App</span>
    </button>
  );
};
