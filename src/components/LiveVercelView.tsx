import React, { useState } from "react";
import {
  ExternalLink,
  Maximize2,
  Minimize2,
  RefreshCw,
  Globe,
  Database,
  CheckCircle2,
  Cpu,
  Layers,
  Shield,
  Smartphone,
  Laptop,
} from "lucide-react";

export const LiveVercelView: React.FC = () => {
  const [iframeKey, setIframeKey] = useState<number>(0);
  const [deviceMode, setDeviceMode] = useState<"desktop" | "mobile">("desktop");
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const vercelUrl = "https://agrinova-indol.vercel.app/";

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-12 py-8 space-y-8">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-stone-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-stone-400 mb-1">
            <span>Production Deployment</span>
            <span>·</span>
            <span>Vercel Platform</span>
            <span>·</span>
            <span className="text-emerald-400 font-mono">agrinova-indol.vercel.app</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Live AgriNova Production Web App
          </h2>
          <p className="text-sm text-stone-300 mt-1">
            Explore the deployed precision-agriculture web platform and direct farmer marketplace running on Vercel.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href={vercelUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-stone-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors shadow-sm"
          >
            <span>Open in New Tab</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Production Metadata Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-stone-900/80 border border-stone-800 rounded-xl">
        <div className="space-y-1">
          <span className="text-xs text-stone-400">Live URL</span>
          <div className="text-sm font-bold text-white font-mono truncate">
            <a
              href={vercelUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-emerald-400 underline"
            >
              agrinova-indol.vercel.app
            </a>
          </div>
          <span className="text-[11px] text-emerald-400">Status: Active &amp; Deployed</span>
        </div>

        <div className="space-y-1">
          <span className="text-xs text-stone-400">Farmer Network</span>
          <div className="text-sm font-bold text-white font-mono">500 Farmers Connected</div>
          <span className="text-[11px] text-stone-400">Real-time early decisions</span>
        </div>

        <div className="space-y-1">
          <span className="text-xs text-stone-400">Marketplace Transactions</span>
          <div className="text-sm font-bold text-white font-mono">200 Active Transactions</div>
          <span className="text-[11px] text-stone-400">MySQL Database Ledger</span>
        </div>

        <div className="space-y-1">
          <span className="text-xs text-stone-400">Architecture</span>
          <div className="text-sm font-bold text-white font-mono">React.js + MySQL</div>
          <span className="text-[11px] text-stone-400">Vercel Edge Infrastructure</span>
        </div>
      </div>

      {/* Embedded App Frame Viewer */}
      <div
        className={`bg-stone-950 border border-stone-800 rounded-2xl overflow-hidden transition-all shadow-2xl ${
          isFullscreen ? "fixed inset-4 z-50 flex flex-col" : "space-y-0"
        }`}
      >
        {/* Browser Top Navigation Bar Simulation */}
        <div className="px-4 py-3 bg-stone-900 border-b border-stone-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
            <span className="text-xs font-mono text-stone-400 ml-2 hidden sm:inline">
              https://agrinova-indol.vercel.app/
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center bg-stone-950 rounded-lg p-0.5 border border-stone-800">
              <button
                onClick={() => setDeviceMode("desktop")}
                className={`p-1.5 rounded text-xs transition-colors ${
                  deviceMode === "desktop"
                    ? "bg-stone-800 text-white"
                    : "text-stone-400 hover:text-white"
                }`}
                title="Desktop View"
              >
                <Laptop className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setDeviceMode("mobile")}
                className={`p-1.5 rounded text-xs transition-colors ${
                  deviceMode === "mobile"
                    ? "bg-stone-800 text-white"
                    : "text-stone-400 hover:text-white"
                }`}
                title="Mobile View"
              >
                <Smartphone className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              onClick={() => setIframeKey((prev) => prev + 1)}
              className="p-1.5 rounded bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors"
              title="Reload Frame"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1.5 rounded bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors"
              title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            >
              {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Viewport Frame */}
        <div
          className={`flex justify-center bg-stone-950 ${
            isFullscreen ? "flex-1" : "min-h-[640px] h-[720px]"
          }`}
        >
          <div
            className={`h-full transition-all duration-300 flex flex-col ${
              deviceMode === "mobile"
                ? "w-[390px] border-x border-stone-800 shadow-2xl my-4 rounded-xl overflow-hidden"
                : "w-full"
            }`}
          >
            <iframe
              key={iframeKey}
              src={vercelUrl}
              title="AgriNova Live App"
              className="w-full flex-1 border-0 bg-stone-900"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
              loading="lazy"
            />
          </div>
        </div>

        {/* Bottom Helper Bar */}
        <div className="p-3 bg-stone-900/90 border-t border-stone-800 text-xs text-stone-400 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Globe className="w-3.5 h-3.5 text-emerald-400" />
            <span>
              Direct link:{" "}
              <a
                href={vercelUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-stone-200 underline hover:text-emerald-400 font-mono"
              >
                {vercelUrl}
              </a>
            </span>
          </div>
          <span>Precision Agriculture &amp; Farmer Marketplace</span>
        </div>
      </div>

      {/* Technical Architecture Blueprint */}
      <div className="p-6 bg-stone-900/60 border border-stone-800 rounded-xl space-y-4">
        <h3 className="text-base font-bold text-white">
          System Architecture &amp; Key Implementation Deliverables
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs text-stone-300 leading-relaxed">
          <div className="p-4 bg-stone-950/70 border border-stone-800 rounded-lg space-y-2">
            <div className="font-semibold text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>Real-Time Soil Telemetry &amp; Alerts</span>
            </div>
            <p>
              Sub-surface IoT sensor telemetry (volumetric soil moisture, nitrogen, phosphorus,
              potassium, and soil pH) with automated threshold triggers supporting 500 farmers in
              early decision-making.
            </p>
          </div>

          <div className="p-4 bg-stone-950/70 border border-stone-800 rounded-lg space-y-2">
            <div className="font-semibold text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>AI Crop Doctor Pathology</span>
            </div>
            <p>
              Multi-pathogen fungal and bacterial diagnostic engine paired with soil-climate crop
              suitability recommendations for rapid, data-backed agricultural planning.
            </p>
          </div>

          <div className="p-4 bg-stone-950/70 border border-stone-800 rounded-lg space-y-2">
            <div className="font-semibold text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>Direct Marketplace (200 Transactions)</span>
            </div>
            <p>
              React.js frontend paired with a MySQL relational database deployed on Vercel,
              processing 200 active commercial purchase orders with escrow protection.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
