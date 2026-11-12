import React from "react";
import {
  ExternalLink,
  Activity,
  Stethoscope,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Database,
  Radio,
} from "lucide-react";

interface HeroBannerProps {
  onSelectTab: (tab: string) => void;
  onOpenLiveModal: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onSelectTab,
  onOpenLiveModal,
}) => {
  return (
    <section className="relative overflow-hidden pt-6 pb-12 border-b border-stone-800/80">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Live Vercel Banner Notice */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 p-3.5 bg-stone-900/90 border border-emerald-900/40 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
            <div className="flex items-center gap-2 text-xs text-stone-300">
              <span className="font-semibold text-emerald-400">Production Live Deployment:</span>
              <a
                href="https://agrinova-indol.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-stone-200 underline hover:text-emerald-400"
              >
                https://agrinova-indol.vercel.app/
              </a>
              <span className="hidden sm:inline text-stone-600">·</span>
              <span className="hidden sm:inline text-stone-400">Vercel Edge Host</span>
              <span className="hidden sm:inline text-stone-600">·</span>
              <span className="hidden sm:inline text-stone-400">MySQL Database</span>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <button
              onClick={onOpenLiveModal}
              className="text-xs text-stone-300 hover:text-white px-2.5 py-1 rounded bg-stone-800 hover:bg-stone-700 transition-colors"
            >
              Preview in Modal
            </button>
            <a
              href="https://agrinova-indol.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-medium text-emerald-400 hover:text-emerald-300 px-2.5 py-1 rounded bg-emerald-950/60 border border-emerald-800/50 hover:bg-emerald-900/60 transition-colors"
            >
              <span>Open Vercel App</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* 2-Column Hero Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-10">
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-emerald-400 uppercase mb-3">
                <span>Precision Agriculture &amp; Farmer-to-Buyer Ecosystem</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight text-balance">
                Real-Time Soil Telemetry, AI Crop Diagnostics &amp; Direct Farmer Trade
              </h1>
              <p className="mt-4 text-base sm:text-lg text-stone-300 leading-relaxed">
                AgriNova connects 500 connected farmers to actionable micro-climate
                intelligence, automated disease pathology with generative AI, and a direct
                marketplace with over 200 verified commercial transactions.
              </p>
            </div>

            {/* User's Exact Pillars as Verified Achievements */}
            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3 p-3 bg-stone-900/60 border border-stone-800/80 rounded-lg">
                <Radio className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div className="text-sm">
                  <span className="font-semibold text-white">Precision-Agriculture IoT: </span>
                  <span className="text-stone-300">
                    Real-time soil telemetry and micro-climate alerts supporting 500 farmers in early decision-making.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-stone-900/60 border border-stone-800/80 rounded-lg">
                <Stethoscope className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div className="text-sm">
                  <span className="font-semibold text-white">AI Crop Doctor: </span>
                  <span className="text-stone-300">
                    Multi-pathogen disease diagnostics and tailored crop recommendation engine for faster, data-driven farming decisions.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-stone-900/60 border border-stone-800/80 rounded-lg">
                <Database className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div className="text-sm">
                  <span className="font-semibold text-white">Direct Farmer Marketplace: </span>
                  <span className="text-stone-300">
                    React.js frontend paired with MySQL relational ledger, supporting 200 active commercial transactions on Vercel.
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onSelectTab("telemetry")}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-stone-950 bg-emerald-400 rounded-lg hover:bg-emerald-300 transition-colors shadow-sm"
              >
                <span>Explore Soil Telemetry Hub</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => onSelectTab("cropdoctor")}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-stone-800 hover:bg-stone-700 border border-stone-700 rounded-lg transition-colors"
              >
                <span>Launch AI Crop Doctor</span>
              </button>
            </div>
          </div>

          {/* Right Hero Image Card */}
          <div className="lg:col-span-5 relative rounded-2xl overflow-hidden border border-stone-800 bg-stone-950 min-h-[360px] lg:h-full flex flex-col justify-end">
            <img
              src="/src/assets/images/hero_agrinova_field_1794503295166.jpg"
              alt="AgriNova Precision Agriculture Farm with IoT Telemetry Nodes"
              referrerPolicy="no-referrer"
              className="absolute inset-0 w-full h-full object-cover"
              onError={(e) => {
                // Fallback styled background
                e.currentTarget.style.display = "none";
              }}
            />
            {/* Measured contrast scrim */}
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/60 to-transparent"></div>

            <div className="relative p-6 z-10 space-y-3">
              <div className="flex items-center gap-2 text-xs text-stone-300">
                <span className="font-semibold text-emerald-400">AgriNova Sensor Grid</span>
                <span>·</span>
                <span>Greenfield Basin Cluster</span>
                <span>·</span>
                <span className="font-mono text-emerald-300">Live 4G Telemetry</span>
              </div>
              <h3 className="text-xl font-bold text-white">
                Autonomous Micro-Climate &amp; Root Zone Monitoring
              </h3>
              <p className="text-xs text-stone-300 line-clamp-2">
                1,420 soil sensors measuring volumetric water content, NPK ions, soil pH, and
                micro-climate humidity to prevent disease outbreaks before symptoms appear.
              </p>
            </div>
          </div>
        </div>

        {/* Full-width 4-Column KPI Metric Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-5 bg-stone-900/80 border border-stone-800 rounded-xl">
          <div className="space-y-1">
            <div className="text-xs text-stone-400 font-medium">Farmers Supported</div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono tabular-nums">
              500<span className="text-emerald-400 text-lg sm:text-xl">+</span>
            </div>
            <div className="text-xs text-stone-400">Early decisions enabled</div>
          </div>

          <div className="space-y-1">
            <div className="text-xs text-stone-400 font-medium">Marketplace Ledger</div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono tabular-nums">
              200<span className="text-emerald-400 text-lg sm:text-xl">+</span>
            </div>
            <div className="text-xs text-stone-400">Active transactions on Vercel</div>
          </div>

          <div className="space-y-1">
            <div className="text-xs text-stone-400 font-medium">Active IoT Probes</div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono tabular-nums">
              1,420
            </div>
            <div className="text-xs text-stone-400">NPK, pH &amp; moisture nodes</div>
          </div>

          <div className="space-y-1">
            <div className="text-xs text-stone-400 font-medium">AI Pathology Engine</div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono tabular-nums">
              &lt; 2.8s
            </div>
            <div className="text-xs text-stone-400">Diagnostics turnaround time</div>
          </div>
        </div>
      </div>
    </section>
  );
};
