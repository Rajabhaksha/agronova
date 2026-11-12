/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { TopBar } from "./components/TopBar";
import { HeroBanner } from "./components/HeroBanner";
import { TelemetryView } from "./components/TelemetryView";
import { CropDoctorView } from "./components/CropDoctorView";
import { MarketplaceView } from "./components/MarketplaceView";
import { LiveVercelView } from "./components/LiveVercelView";
import { VercelAppModal } from "./components/VercelAppModal";
import {
  Radio,
  Stethoscope,
  Database,
  ExternalLink,
  Sprout,
  ArrowRight,
  ShieldCheck,
  Globe,
} from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [isLiveModalOpen, setIsLiveModalOpen] = useState<boolean>(false);

  return (
    <div className="min-h-screen bg-[#0c0e0d] text-stone-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-stone-950">
      {/* Top Bar adhering to Top Bar Contract */}
      <TopBar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenLiveModal={() => setIsLiveModalOpen(true)}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {activeTab === "overview" && (
          <div>
            <HeroBanner
              onSelectTab={setActiveTab}
              onOpenLiveModal={() => setIsLiveModalOpen(true)}
            />

            {/* Feature Showcase Grid Section */}
            <section className="max-w-7xl mx-auto px-6 lg:px-12 py-12 space-y-12">
              <div className="text-center max-w-3xl mx-auto space-y-3">
                <span className="text-xs font-semibold tracking-wider text-emerald-400 uppercase">
                  Engineered Agricultural Solutions
                </span>
                <h2 className="text-3xl font-extrabold text-white tracking-tight">
                  Three Pillars Powering 500 Farmers &amp; 200 Transactions
                </h2>
                <p className="text-sm text-stone-300">
                  AgriNova combines IoT field hardware, generative AI pathology, and direct commerce
                  to secure yields and eliminate predatory supply chain margins.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Pillar 1: Telemetry */}
                <div className="p-6 bg-stone-900/80 border border-stone-800 rounded-2xl flex flex-col justify-between hover:border-emerald-600/40 transition-all">
                  <div className="space-y-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-950/70 border border-emerald-800/40 flex items-center justify-center text-emerald-400">
                      <Radio className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs text-stone-400 mb-1">Pillar 01</div>
                      <h3 className="text-lg font-bold text-white">
                        Real-Time Soil Telemetry &amp; Micro-Climate
                      </h3>
                    </div>
                    <p className="text-xs text-stone-300 leading-relaxed">
                      Continuous sub-surface monitoring of volumetric moisture, N-P-K ions, pH, and
                      EC. Automated threshold alerts guide early decisions for 500 active farmers across
                      differing regional soil textures.
                    </p>
                  </div>

                  <button
                    onClick={() => setActiveTab("telemetry")}
                    className="mt-6 flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
                  >
                    <span>Inspect Soil Telemetry Hub</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Pillar 2: AI Crop Doctor */}
                <div className="p-6 bg-stone-900/80 border border-stone-800 rounded-2xl flex flex-col justify-between hover:border-emerald-600/40 transition-all">
                  <div className="space-y-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-950/70 border border-emerald-800/40 flex items-center justify-center text-emerald-400">
                      <Stethoscope className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs text-stone-400 mb-1">Pillar 02</div>
                      <h3 className="text-lg font-bold text-white">
                        AI Crop Doctor &amp; Recommendations
                      </h3>
                    </div>
                    <p className="text-xs text-stone-300 leading-relaxed">
                      Instant leaf disease diagnostics powered by Gemini 3.8 Flash, delivering
                      pathogen confirmation, 24-hour intervention protocols, and soil-matched crop
                      recommendations for maximum market profitability.
                    </p>
                  </div>

                  <button
                    onClick={() => setActiveTab("cropdoctor")}
                    className="mt-6 flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
                  >
                    <span>Launch AI Crop Doctor</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Pillar 3: Marketplace */}
                <div className="p-6 bg-stone-900/80 border border-stone-800 rounded-2xl flex flex-col justify-between hover:border-emerald-600/40 transition-all">
                  <div className="space-y-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-950/70 border border-emerald-800/40 flex items-center justify-center text-emerald-400">
                      <Database className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs text-stone-400 mb-1">Pillar 03</div>
                      <h3 className="text-lg font-bold text-white">
                        Direct Farmer-to-Buyer Marketplace
                      </h3>
                    </div>
                    <p className="text-xs text-stone-300 leading-relaxed">
                      React.js frontend and MySQL relational database deployed on Vercel, backing 200
                      active commercial transactions with escrow security, quality grading, and direct
                      wholesaler settlement.
                    </p>
                  </div>

                  <button
                    onClick={() => setActiveTab("marketplace")}
                    className="mt-6 flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
                  >
                    <span>Browse Farmer Marketplace</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Direct Link Banner */}
              <div className="p-8 bg-gradient-to-r from-stone-900 via-stone-900/90 to-emerald-950/40 border border-emerald-900/40 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                    <Globe className="w-4 h-4" />
                    <span>Live Production Web Platform</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white">
                    Access AgriNova on Vercel: agrinova-indol.vercel.app
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-300 max-w-2xl leading-relaxed">
                    View the production precision-agriculture platform live in action. Inspect the real
                    user experience, farmer onboarding flows, and active transaction listings.
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <button
                    onClick={() => setIsLiveModalOpen(true)}
                    className="px-4 py-2.5 text-xs font-semibold rounded-lg bg-stone-800 hover:bg-stone-700 text-white transition-colors"
                  >
                    Preview in Modal
                  </button>
                  <a
                    href="https://agrinova-indol.vercel.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-stone-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors shadow-sm"
                  >
                    <span>Launch Live App</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </section>
          </div>
        )}

        {activeTab === "telemetry" && (
          <TelemetryView onNavigateToCropDoctor={() => setActiveTab("cropdoctor")} />
        )}

        {activeTab === "cropdoctor" && <CropDoctorView />}

        {activeTab === "marketplace" && <MarketplaceView />}

        {activeTab === "liveapp" && <LiveVercelView />}
      </main>

      {/* Floating Modal for agrinova-indol.vercel.app */}
      <VercelAppModal
        isOpen={isLiveModalOpen}
        onClose={() => setIsLiveModalOpen(false)}
      />

      {/* Clean Editorial Footer */}
      <footer className="border-t border-stone-800/80 bg-stone-950 py-8 px-6 lg:px-12 text-xs text-stone-400">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-stone-300">
            <span className="font-bold text-white">AgriNova</span>
            <span>·</span>
            <span>Precision Agriculture &amp; Farmer Marketplace</span>
            <span>·</span>
            <span>Supporting 500 Farmers</span>
          </div>

          <div className="flex items-center gap-6">
            <a
              href="https://agrinova-indol.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-stone-300 hover:text-emerald-400 transition-colors underline"
            >
              agrinova-indol.vercel.app
            </a>
            <span>·</span>
            <span>200 Active Transactions on Vercel</span>
            <span>·</span>
            <span>MySQL &amp; React.js Platform</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
