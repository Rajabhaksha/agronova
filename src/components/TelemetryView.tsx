import React, { useState, useEffect } from "react";
import {
  Droplets,
  Thermometer,
  Sun,
  Wind,
  Layers,
  AlertTriangle,
  CheckCircle,
  Play,
  RotateCcw,
  Sliders,
  Radio,
  Users,
  Compass,
} from "lucide-react";
import { TelemetryParcel } from "../types/agrinova";

interface TelemetryViewProps {
  onNavigateToCropDoctor: () => void;
}

export const TelemetryView: React.FC<TelemetryViewProps> = ({
  onNavigateToCropDoctor,
}) => {
  const [parcels, setParcels] = useState<TelemetryParcel[]>([]);
  const [selectedParcelId, setSelectedParcelId] = useState<string>("parcel-1");
  const [loading, setLoading] = useState<boolean>(true);
  const [dripActive, setDripActive] = useState<boolean>(false);
  const [simulatedMoistureDelta, setSimulatedMoistureDelta] = useState<number>(0);
  const [simulatedTempDelta, setSimulatedTempDelta] = useState<number>(0);
  const [simulatedHumidityDelta, setSimulatedHumidityDelta] = useState<number>(0);
  const [simulationPreset, setSimulationPreset] = useState<string>("nominal");

  useEffect(() => {
    fetch("/api/telemetry")
      .then((res) => res.json())
      .then((data) => {
        if (data.parcels) {
          setParcels(data.parcels);
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const activeParcel = parcels.find((p) => p.id === selectedParcelId) || parcels[0];

  // Apply simulator adjustments
  const currentMoisture = activeParcel
    ? Math.max(10, Math.min(95, Math.round((activeParcel.moisture + simulatedMoistureDelta) * 10) / 10))
    : 38.4;
  const currentTemp = activeParcel
    ? Math.round((activeParcel.airTemp + simulatedTempDelta) * 10) / 10
    : 24.2;
  const currentHumidity = activeParcel
    ? Math.max(20, Math.min(98, Math.round(activeParcel.humidity + simulatedHumidityDelta)))
    : 58;

  // Real-time alert dynamic evaluation based on telemetry
  const dynamicAlerts = [...(activeParcel?.alerts || [])];
  if (currentMoisture < 25) {
    dynamicAlerts.unshift({
      id: "dyn-drought",
      level: "alert",
      title: "Severe Root Zone Drought Stress",
      message: `Volumetric moisture at ${currentMoisture}% is critical for ${activeParcel?.crop}. Initiate drip irrigation immediately.`,
      timestamp: "Just now",
    });
  } else if (currentHumidity > 80 && currentTemp > 24) {
    dynamicAlerts.unshift({
      id: "dyn-fungal",
      level: "warning",
      title: "Micro-Climate Fungal Spore Hazard",
      message: `High atmospheric humidity (${currentHumidity}%) and warm canopy (${currentTemp}°C) accelerate foliar spore germination.`,
      timestamp: "Just now",
    });
  }

  const applyPreset = (preset: "nominal" | "drought" | "storm" | "heatwave") => {
    setSimulationPreset(preset);
    if (preset === "nominal") {
      setSimulatedMoistureDelta(0);
      setSimulatedTempDelta(0);
      setSimulatedHumidityDelta(0);
    } else if (preset === "drought") {
      setSimulatedMoistureDelta(-18);
      setSimulatedTempDelta(6.5);
      setSimulatedHumidityDelta(-22);
    } else if (preset === "storm") {
      setSimulatedMoistureDelta(35);
      setSimulatedTempDelta(-4);
      setSimulatedHumidityDelta(30);
    } else if (preset === "heatwave") {
      setSimulatedMoistureDelta(-12);
      setSimulatedTempDelta(8.2);
      setSimulatedHumidityDelta(-15);
    }
  };

  const toggleDripValve = () => {
    setDripActive(!dripActive);
    if (!dripActive) {
      setSimulatedMoistureDelta((prev) => prev + 6);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16 text-center">
        <div className="inline-block w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-stone-400 text-sm">Connecting to 500-farmer IoT telemetry network...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-12 py-8 space-y-8">
      {/* Header & Parcel Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-stone-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-stone-400 mb-1">
            <span>Precision Telemetry</span>
            <span>·</span>
            <span>500 Farmers Connected</span>
            <span>·</span>
            <span className="text-emerald-400 font-mono">1,420 Active Probes</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Real-Time Soil Telemetry &amp; Micro-Climate Monitor
          </h2>
          <p className="text-sm text-stone-300 mt-1">
            Sub-surface NPK ions, moisture profiles, and atmospheric sensor telemetry guiding early farming decisions.
          </p>
        </div>

        {/* Parcel Selector Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-stone-900 border border-stone-800 rounded-lg">
          {parcels.map((parcel) => (
            <button
              key={parcel.id}
              onClick={() => setSelectedParcelId(parcel.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                selectedParcelId === parcel.id
                  ? "bg-emerald-500 text-stone-950 font-semibold"
                  : "text-stone-300 hover:text-white hover:bg-stone-800"
              }`}
            >
              {parcel.crop} ({parcel.name.split(" - ")[0]})
            </button>
          ))}
        </div>
      </div>

      {/* Selected Parcel Overview Metadata */}
      {activeParcel && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-stone-900/60 border border-stone-800/80 rounded-xl">
          <div>
            <div className="text-xs text-stone-400">Field Parcel</div>
            <div className="text-sm font-semibold text-white mt-0.5">{activeParcel.name}</div>
            <div className="text-xs text-stone-400">{activeParcel.location}</div>
          </div>
          <div>
            <div className="text-xs text-stone-400">Assigned Farmer &amp; Plot</div>
            <div className="text-sm font-semibold text-white mt-0.5">{activeParcel.farmer}</div>
            <div className="text-xs text-stone-400">{activeParcel.acreage} Contiguous Acres</div>
          </div>
          <div>
            <div className="text-xs text-stone-400">Target Crop Variety</div>
            <div className="text-sm font-semibold text-emerald-400 mt-0.5">{activeParcel.crop}</div>
            <div className="text-xs text-stone-400">Phenological Stage: Vegetative Fill</div>
          </div>
          <div>
            <div className="text-xs text-stone-400">Field Health Index</div>
            <div className="text-sm font-semibold text-white mt-0.5 font-mono tabular-nums">
              {activeParcel.healthScore}/100 Nominal
            </div>
            <div className="text-xs text-emerald-400">Early Warning: Active</div>
          </div>
        </div>
      )}

      {/* Primary Telemetry Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Soil Moisture */}
        <div className="p-5 bg-stone-900/90 border border-stone-800 rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-stone-400">Volumetric Moisture</span>
            <Droplets className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-bold text-white font-mono tabular-nums">
              {currentMoisture}%
            </span>
            <span
              className={`text-xs font-semibold ${
                currentMoisture < 25
                  ? "text-red-400"
                  : currentMoisture > 75
                  ? "text-blue-400"
                  : "text-emerald-400"
              }`}
            >
              {currentMoisture < 25 ? "Drought Alert" : currentMoisture > 75 ? "Waterlogged" : "Optimal"}
            </span>
          </div>
          {/* Visual Gauge Bar */}
          <div className="w-full h-2 bg-stone-800 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                currentMoisture < 25
                  ? "bg-red-500"
                  : currentMoisture > 75
                  ? "bg-blue-500"
                  : "bg-emerald-500"
              }`}
              style={{ width: `${Math.min(100, currentMoisture)}%` }}
            ></div>
          </div>
          <div className="text-xs text-stone-400 flex justify-between">
            <span>Root Depth 25cm</span>
            <span className="font-mono tabular-nums">Target: 35-45%</span>
          </div>
        </div>

        {/* NPK Macronutrient Ion Matrix */}
        <div className="p-5 bg-stone-900/90 border border-stone-800 rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-stone-400">Sub-surface N-P-K</span>
            <Layers className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="grid grid-cols-3 gap-2 pt-1">
            <div className="p-2 bg-stone-950/70 border border-stone-800/80 rounded-lg text-center">
              <div className="text-xs text-stone-400">N</div>
              <div className="text-base font-bold text-white font-mono tabular-nums">
                {activeParcel?.nitrogen || 142}
              </div>
              <div className="text-[10px] text-stone-400">mg/kg</div>
            </div>
            <div className="p-2 bg-stone-950/70 border border-stone-800/80 rounded-lg text-center">
              <div className="text-xs text-stone-400">P</div>
              <div className="text-base font-bold text-white font-mono tabular-nums">
                {activeParcel?.phosphorus || 46}
              </div>
              <div className="text-[10px] text-stone-400">mg/kg</div>
            </div>
            <div className="p-2 bg-stone-950/70 border border-stone-800/80 rounded-lg text-center">
              <div className="text-xs text-stone-400">K</div>
              <div className="text-base font-bold text-white font-mono tabular-nums">
                {activeParcel?.potassium || 198}
              </div>
              <div className="text-[10px] text-stone-400">mg/kg</div>
            </div>
          </div>
          <div className="text-xs text-stone-400 flex justify-between">
            <span>Absorption Efficiency</span>
            <span className="text-emerald-400 font-mono tabular-nums">91.4%</span>
          </div>
        </div>

        {/* Soil pH & EC Conductivity */}
        <div className="p-5 bg-stone-900/90 border border-stone-800 rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-stone-400">Soil Chemistry (pH &amp; EC)</span>
            <Compass className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="p-2.5 bg-stone-950/70 border border-stone-800/80 rounded-lg">
              <div className="text-xs text-stone-400">Soil pH</div>
              <div className="text-2xl font-bold text-white font-mono tabular-nums">
                {activeParcel?.ph || 6.6}
              </div>
              <div className="text-[10px] text-emerald-400">Neutral Loam</div>
            </div>
            <div className="p-2.5 bg-stone-950/70 border border-stone-800/80 rounded-lg">
              <div className="text-xs text-stone-400">Salinity (EC)</div>
              <div className="text-2xl font-bold text-white font-mono tabular-nums">
                {activeParcel?.ec || 1.35}
              </div>
              <div className="text-[10px] text-stone-400">dS/m Nominal</div>
            </div>
          </div>
          <div className="text-xs text-stone-400">Root ion mobility calibrated for nutrient uptake</div>
        </div>

        {/* Micro-Climate Canopy */}
        <div className="p-5 bg-stone-900/90 border border-stone-800 rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-stone-400">Canopy Micro-Climate</span>
            <Sun className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div>
              <div className="text-xs text-stone-400">Air / Soil Temp</div>
              <div className="text-xl font-bold text-white font-mono tabular-nums">
                {currentTemp}° / {activeParcel?.soilTemp || 19.8}°
              </div>
              <div className="text-[10px] text-stone-400">Celsius scale</div>
            </div>
            <div>
              <div className="text-xs text-stone-400">Relative Humidity</div>
              <div className="text-xl font-bold text-white font-mono tabular-nums">
                {currentHumidity}%
              </div>
              <div className="text-[10px] text-stone-400">Vapor deficit nominal</div>
            </div>
          </div>
          <div className="text-xs text-stone-400 flex justify-between">
            <span>Solar Irradiance:</span>
            <span className="font-mono tabular-nums text-stone-300">
              {activeParcel?.solarIrradiance || 820} W/m²
            </span>
          </div>
        </div>
      </div>

      {/* Middle Section: Micro-Climate Early Alerts & Drip Control */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 7 Cols: Micro-Climate Alerts Feed */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <h3 className="text-base font-bold text-white">
                Active Micro-Climate Alerts for Early Decision-Making
              </h3>
            </div>
            <span className="text-xs text-stone-400">
              {dynamicAlerts.length} Active Sensor Notifications
            </span>
          </div>

          <div className="space-y-3">
            {dynamicAlerts.map((alt) => (
              <div
                key={alt.id}
                className={`p-4 rounded-xl border transition-all ${
                  alt.level === "alert"
                    ? "bg-red-950/20 border-red-800/40"
                    : alt.level === "warning"
                    ? "bg-amber-950/20 border-amber-800/40"
                    : "bg-stone-900 border-stone-800"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs font-semibold ${
                          alt.level === "alert"
                            ? "text-red-400"
                            : alt.level === "warning"
                            ? "text-amber-400"
                            : "text-emerald-400"
                        }`}
                      >
                        {alt.level === "alert"
                          ? "CRITICAL HAZARD"
                          : alt.level === "warning"
                          ? "ADVISORY WARNING"
                          : "NOMINAL UPDATE"}
                      </span>
                      <span className="text-stone-600">·</span>
                      <span className="text-xs text-stone-400">{alt.timestamp}</span>
                    </div>
                    <div className="text-sm font-semibold text-white">{alt.title}</div>
                    <p className="text-xs text-stone-300 leading-relaxed">{alt.message}</p>
                  </div>

                  <button
                    onClick={onNavigateToCropDoctor}
                    className="shrink-0 text-xs px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 transition-colors font-medium"
                  >
                    Diagnose in AI Doctor →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 5 Cols: Automated Irrigation Valve & Sensor Simulator */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 bg-stone-900/90 border border-stone-800 rounded-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-white">Automated Drip Fertigation</h4>
                <p className="text-xs text-stone-400">Micro-dosing based on soil telemetry</p>
              </div>
              <button
                onClick={toggleDripValve}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  dripActive
                    ? "bg-emerald-400 text-stone-950"
                    : "bg-stone-800 hover:bg-stone-700 text-white"
                }`}
              >
                {dripActive ? "Drip Cycle Active" : "Trigger Drip Cycle"}
              </button>
            </div>

            <div className="text-xs text-stone-300 space-y-1.5 p-3 bg-stone-950/60 border border-stone-800/80 rounded-lg">
              <div className="flex justify-between">
                <span>Valve Actuator Node:</span>
                <span className="font-mono text-emerald-400">SOLENOID-VALVE-04</span>
              </div>
              <div className="flex justify-between">
                <span>Current Flow Rate:</span>
                <span className="font-mono text-stone-200">
                  {dripActive ? "14.2 L/min" : "0.0 L/min"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Scheduled Maintenance:</span>
                <span className="font-mono text-stone-400">Every 18:00 UTC</span>
              </div>
            </div>
          </div>

          {/* Interactive Micro-Climate Stress Simulator */}
          <div className="p-5 bg-stone-900/90 border border-stone-800 rounded-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-emerald-400" />
                <h4 className="text-sm font-bold text-white">Micro-Climate Scenario Simulator</h4>
              </div>
              <button
                onClick={() => applyPreset("nominal")}
                className="text-xs text-stone-400 hover:text-white flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>
            <p className="text-xs text-stone-400">
              Simulate extreme climate stressors to observe real-time sensor threshold responses.
            </p>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => applyPreset("drought")}
                className={`p-2 text-xs font-medium rounded-lg text-left transition-colors border ${
                  simulationPreset === "drought"
                    ? "bg-amber-950/30 border-amber-500/50 text-amber-300"
                    : "bg-stone-950/60 border-stone-800 text-stone-300 hover:bg-stone-800"
                }`}
              >
                Simulate Drought Stress
              </button>
              <button
                onClick={() => applyPreset("storm")}
                className={`p-2 text-xs font-medium rounded-lg text-left transition-colors border ${
                  simulationPreset === "storm"
                    ? "bg-blue-950/30 border-blue-500/50 text-blue-300"
                    : "bg-stone-950/60 border-stone-800 text-stone-300 hover:bg-stone-800"
                }`}
              >
                Simulate Torrential Rain
              </button>
              <button
                onClick={() => applyPreset("heatwave")}
                className={`p-2 text-xs font-medium rounded-lg text-left transition-colors border ${
                  simulationPreset === "heatwave"
                    ? "bg-red-950/30 border-red-500/50 text-red-300"
                    : "bg-stone-950/60 border-stone-800 text-stone-300 hover:bg-stone-800"
                }`}
              >
                Simulate Heat Wave
              </button>
              <button
                onClick={() => applyPreset("nominal")}
                className={`p-2 text-xs font-medium rounded-lg text-left transition-colors border ${
                  simulationPreset === "nominal"
                    ? "bg-emerald-950/30 border-emerald-500/50 text-emerald-300"
                    : "bg-stone-950/60 border-stone-800 text-stone-300 hover:bg-stone-800"
                }`}
              >
                Restore Nominal Calibration
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 500 Farmers Network Community Cluster Strip */}
      <div className="p-6 bg-stone-900/60 border border-stone-800 rounded-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-white">
              AgriNova 500-Farmer Network Distribution
            </h3>
          </div>
          <span className="text-xs font-mono text-emerald-400">100% Telemetry Coverage</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-3.5 bg-stone-950/70 border border-stone-800/80 rounded-lg space-y-1">
            <div className="text-xs text-stone-400">Greenfield Basin Cluster</div>
            <div className="text-lg font-bold text-white font-mono tabular-nums">148 Farmers</div>
            <div className="text-xs text-emerald-400">Wheat &amp; Barley Cultivation</div>
          </div>
          <div className="p-3.5 bg-stone-950/70 border border-stone-800/80 rounded-lg space-y-1">
            <div className="text-xs text-stone-400">River Delta Lowlands</div>
            <div className="text-lg font-bold text-white font-mono tabular-nums">124 Farmers</div>
            <div className="text-xs text-emerald-400">Paddy Rice &amp; Aquaculture</div>
          </div>
          <div className="p-3.5 bg-stone-950/70 border border-stone-800/80 rounded-lg space-y-1">
            <div className="text-xs text-stone-400">Valley Terrace Sector</div>
            <div className="text-lg font-bold text-white font-mono tabular-nums">136 Farmers</div>
            <div className="text-xs text-emerald-400">Maize &amp; Soybeans Rotation</div>
          </div>
          <div className="p-3.5 bg-stone-950/70 border border-stone-800/80 rounded-lg space-y-1">
            <div className="text-xs text-stone-400">Highland Greenhouse Terraces</div>
            <div className="text-lg font-bold text-white font-mono tabular-nums">92 Farmers</div>
            <div className="text-xs text-emerald-400">Horticulture &amp; Specialty Coffee</div>
          </div>
        </div>
      </div>
    </div>
  );
};
