import React from "react";
import { ExternalLink, Sprout } from "lucide-react";

interface TopBarProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  onOpenLiveModal: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  activeTab,
  onSelectTab,
  onOpenLiveModal,
}) => {
  return (
    <header className="sticky top-0 z-50 bg-[#0c0e0d]/90 backdrop-blur-md border-b border-stone-800/80 px-6 lg:px-12 py-3.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => onSelectTab("overview")}
          className="flex items-center gap-2.5 text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0 hover:text-emerald-400 transition-colors"
        >
          <div className="w-8 h-8 rounded-lg bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Sprout className="w-4 h-4" />
          </div>
          <span>AgriNova</span>
        </button>

        {/* Zone 2: 4–5 clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-stone-400">
          <button
            onClick={() => onSelectTab("overview")}
            className={`whitespace-nowrap shrink-0 transition-colors pb-0.5 ${
              activeTab === "overview"
                ? "text-emerald-400 border-b-2 border-emerald-500 font-semibold"
                : "hover:text-stone-200"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => onSelectTab("telemetry")}
            className={`whitespace-nowrap shrink-0 transition-colors pb-0.5 ${
              activeTab === "telemetry"
                ? "text-emerald-400 border-b-2 border-emerald-500 font-semibold"
                : "hover:text-stone-200"
            }`}
          >
            Soil Telemetry &amp; Climate
          </button>
          <button
            onClick={() => onSelectTab("cropdoctor")}
            className={`whitespace-nowrap shrink-0 transition-colors pb-0.5 ${
              activeTab === "cropdoctor"
                ? "text-emerald-400 border-b-2 border-emerald-500 font-semibold"
                : "hover:text-stone-200"
            }`}
          >
            AI Crop Doctor
          </button>
          <button
            onClick={() => onSelectTab("marketplace")}
            className={`whitespace-nowrap shrink-0 transition-colors pb-0.5 ${
              activeTab === "marketplace"
                ? "text-emerald-400 border-b-2 border-emerald-500 font-semibold"
                : "hover:text-stone-200"
            }`}
          >
            Farmer Marketplace
          </button>
          <button
            onClick={() => onSelectTab("liveapp")}
            className={`whitespace-nowrap shrink-0 transition-colors pb-0.5 ${
              activeTab === "liveapp"
                ? "text-emerald-400 border-b-2 border-emerald-500 font-semibold"
                : "hover:text-stone-200"
            }`}
          >
            Live Vercel App
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href="https://agrinova-indol.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-stone-950 bg-emerald-400 rounded-lg hover:bg-emerald-300 transition-colors whitespace-nowrap shrink-0 shadow-sm"
          >
            <span>Visit agrinova-indol.vercel.app</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </header>
  );
};
