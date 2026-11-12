import React, { useState } from "react";
import {
  Stethoscope,
  Sparkles,
  Upload,
  CheckCircle2,
  AlertOctagon,
  ShieldAlert,
  Sprout,
  ArrowRight,
  HelpCircle,
  Cpu,
  FileText,
} from "lucide-react";
import { CropDiagnosis, CropRecommendationData } from "../types/agrinova";

export const CropDoctorView: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<"diagnostics" | "recommendations">("diagnostics");

  // Diagnostics State
  const [selectedCrop, setSelectedCrop] = useState<string>("Tomato");
  const [selectedSample, setSelectedSample] = useState<string>("sample-tomato-blight");
  const [symptomsInput, setSymptomsInput] = useState<string>(
    "Irregular water-soaked brown spots on leaf margins with subtle white fungal fuzz on leaf undersides after heavy rain."
  );
  const [customImageBase64, setCustomImageBase64] = useState<string | null>(null);
  const [diagnosing, setDiagnosing] = useState<boolean>(false);
  const [diagnosisResult, setDiagnosisResult] = useState<CropDiagnosis | null>(null);
  const [diagnosticSource, setDiagnosticSource] = useState<string>("");

  // Recommendations State
  const [nitrogen, setNitrogen] = useState<number>(142);
  const [phosphorus, setPhosphorus] = useState<number>(46);
  const [potassium, setPotassium] = useState<number>(198);
  const [soilPh, setSoilPh] = useState<number>(6.6);
  const [soilTexture, setSoilTexture] = useState<string>("Loamy Soil");
  const [season, setSeason] = useState<string>("Spring / Kharif");
  const [recommending, setRecommending] = useState<boolean>(false);
  const [recommendationResult, setRecommendationResult] = useState<CropRecommendationData | null>(null);

  // Pre-configured diagnostic samples
  const samplePresets = [
    {
      id: "sample-tomato-blight",
      crop: "Tomato",
      label: "Tomato Late Blight",
      description: "Water-soaked foliar necrosis & white sporulation",
      img: "/src/assets/images/crop_healthy_sample_1794503296517.jpg",
      symptoms: "Irregular water-soaked dark lesions on foliage, white mold under leaf in high humidity.",
    },
    {
      id: "sample-rice-blast",
      crop: "Basmati Rice",
      label: "Rice Blast (Fungus)",
      description: "Spindle-shaped elliptical lesions with gray centers",
      img: "/src/assets/images/hero_agrinova_field_1794503295166.jpg",
      symptoms: "Diamond-shaped lesions with gray-white centers and brown margins on leaf blades.",
    },
    {
      id: "sample-maize-leaf-blight",
      crop: "Yellow Maize",
      label: "Northern Corn Leaf Blight",
      description: "Cigar-shaped grayish-green lesions on upper canopy",
      img: "/src/assets/images/marketplace_produce_1794503296398.jpg",
      symptoms: "Long elliptical grayish-green tan lesions parallel to leaf margins.",
    },
    {
      id: "sample-wheat-rust",
      crop: "Durum Wheat",
      label: "Wheat Stripe / Yellow Rust",
      description: "Linear yellow-orange powdery pustules along leaf veins",
      img: "/src/assets/images/sensor_telemetry_iot_1794503296895.jpg",
      symptoms: "Bright yellow linear stripes of powdery spores across upper leaf surfaces.",
    },
  ];

  const handleSelectSample = (sample: (typeof samplePresets)[0]) => {
    setSelectedSample(sample.id);
    setSelectedCrop(sample.crop);
    setSymptomsInput(sample.symptoms);
    setCustomImageBase64(null);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCustomImageBase64(reader.result as string);
        setSelectedSample("custom-upload");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRunDiagnosis = async () => {
    setDiagnosing(true);
    setDiagnosisResult(null);

    try {
      const res = await fetch("/api/crop-doctor/diagnose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cropName: selectedCrop,
          symptoms: symptomsInput,
          sampleId: selectedSample,
          imageBase64: customImageBase64,
        }),
      });

      const data = await res.json();
      if (data.diagnosis) {
        setDiagnosisResult(data.diagnosis);
        setDiagnosticSource(data.source || "gemini-3.8-flash");
      }
    } catch (err) {
      console.error("Diagnosis error:", err);
    } finally {
      setDiagnosing(false);
    }
  };

  const handleRunRecommendation = async () => {
    setRecommending(true);
    setRecommendationResult(null);

    try {
      const res = await fetch("/api/crop-doctor/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nitrogen,
          phosphorus,
          potassium,
          ph: soilPh,
          soilTexture,
          season,
        }),
      });

      const data = await res.json();
      if (data.data) {
        setRecommendationResult(data.data);
      }
    } catch (err) {
      console.error("Recommendation error:", err);
    } finally {
      setRecommending(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-12 py-8 space-y-8">
      {/* Header & Sub-Navigation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-stone-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-stone-400 mb-1">
            <span>Agronomic Intelligence</span>
            <span>·</span>
            <span>Gemini 3.8 Flash Engine</span>
            <span>·</span>
            <span className="text-emerald-400 font-mono">Real-Time Diagnostics</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            AI Crop Doctor &amp; Recommendation Engine
          </h2>
          <p className="text-sm text-stone-300 mt-1">
            Automated pathology diagnostics and soil-calibrated crop recommendations for faster, data-driven farming decisions.
          </p>
        </div>

        {/* Sub-mode Segmented Buttons */}
        <div className="flex items-center gap-1 p-1 bg-stone-900 border border-stone-800 rounded-lg">
          <button
            onClick={() => setActiveSubTab("diagnostics")}
            className={`px-4 py-2 text-xs font-semibold rounded-md whitespace-nowrap transition-colors ${
              activeSubTab === "diagnostics"
                ? "bg-emerald-500 text-stone-950 shadow-sm"
                : "text-stone-300 hover:text-white"
            }`}
          >
            Disease Diagnostics
          </button>
          <button
            onClick={() => setActiveSubTab("recommendations")}
            className={`px-4 py-2 text-xs font-semibold rounded-md whitespace-nowrap transition-colors ${
              activeSubTab === "recommendations"
                ? "bg-emerald-500 text-stone-950 shadow-sm"
                : "text-stone-300 hover:text-white"
            }`}
          >
            Crop Recommendations
          </button>
        </div>
      </div>

      {/* SUB-VIEW 1: DISEASE DIAGNOSTICS */}
      {activeSubTab === "diagnostics" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left 5 Cols: Sample Leaf & Input Form */}
          <div className="lg:col-span-5 space-y-5">
            {/* Scientific Sample Selector */}
            <div className="p-5 bg-stone-900/90 border border-stone-800 rounded-xl space-y-3">
              <label className="text-xs font-bold text-stone-300 uppercase tracking-wider block">
                Select Tested Disease Sample or Upload Leaf
              </label>

              <div className="grid grid-cols-2 gap-2.5">
                {samplePresets.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => handleSelectSample(preset)}
                    className={`p-2.5 text-left rounded-lg border transition-all ${
                      selectedSample === preset.id
                        ? "bg-emerald-950/40 border-emerald-500 text-white"
                        : "bg-stone-950/60 border-stone-800 text-stone-400 hover:border-stone-700"
                    }`}
                  >
                    <div className="text-xs font-semibold text-stone-200">{preset.label}</div>
                    <div className="text-[11px] text-stone-400 mt-0.5 line-clamp-1">
                      {preset.crop} · {preset.description}
                    </div>
                  </button>
                ))}
              </div>

              {/* Custom Photo Upload */}
              <div className="pt-2">
                <label className="flex items-center justify-center gap-2 p-3 bg-stone-950/70 border border-dashed border-stone-700 hover:border-emerald-500 rounded-lg cursor-pointer text-xs text-stone-300 transition-colors">
                  <Upload className="w-4 h-4 text-emerald-400" />
                  <span>
                    {customImageBase64 ? "Custom leaf photo attached" : "Upload leaf photo / camera capture"}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Target Crop & Observed Symptoms */}
            <div className="p-5 bg-stone-900/90 border border-stone-800 rounded-xl space-y-4">
              <div>
                <label className="text-xs font-bold text-stone-300 uppercase tracking-wider block mb-1.5">
                  Host Crop Cultivar
                </label>
                <select
                  value={selectedCrop}
                  onChange={(e) => setSelectedCrop(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-stone-950 border border-stone-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="Tomato">Tomato (Solanum lycopersicum)</option>
                  <option value="Basmati Rice">Basmati Rice (Oryza sativa)</option>
                  <option value="Durum Wheat">Durum Wheat (Triticum durum)</option>
                  <option value="Yellow Maize">Yellow Maize (Zea mays)</option>
                  <option value="Potato">Potato (Solanum tuberosum)</option>
                  <option value="Soybeans">Soybeans (Glycine max)</option>
                  <option value="Arabica Coffee">Arabica Coffee (Coffea arabica)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-300 uppercase tracking-wider block mb-1.5">
                  Observed Symptoms &amp; Telemetry Context
                </label>
                <textarea
                  value={symptomsInput}
                  onChange={(e) => setSymptomsInput(e.target.value)}
                  rows={4}
                  placeholder="Describe leaf spots, wilting, discoloration, fungal fuzz, or lesion geometry..."
                  className="w-full px-3 py-2 text-xs bg-stone-950 border border-stone-700 rounded-lg text-white focus:outline-none focus:border-emerald-500 leading-relaxed"
                />
              </div>

              <button
                onClick={handleRunDiagnosis}
                disabled={diagnosing}
                className="w-full py-3 px-4 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-stone-950 font-bold text-xs uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                {diagnosing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-stone-950 border-t-transparent rounded-full animate-spin"></div>
                    <span>Diagnosing Pathogen with Gemini AI...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Run AI Disease Pathology Diagnosis</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right 7 Cols: Diagnostic Output Card */}
          <div className="lg:col-span-7 space-y-4">
            {diagnosing && (
              <div className="p-8 bg-stone-900/60 border border-stone-800 rounded-xl text-center space-y-3">
                <div className="inline-block w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
                <div className="text-sm font-semibold text-white">
                  Executing Precision Plant Pathology Model...
                </div>
                <p className="text-xs text-stone-400 max-w-md mx-auto">
                  Cross-referencing observed lesion morphology with micro-climate humidity thresholds and agronomic treatment databases.
                </p>
              </div>
            )}

            {!diagnosing && !diagnosisResult && (
              <div className="p-8 bg-stone-900/60 border border-stone-800 rounded-xl space-y-4">
                <div className="flex items-center gap-2 text-emerald-400">
                  <Stethoscope className="w-5 h-5" />
                  <h3 className="text-base font-bold text-white">AI Crop Doctor Ready</h3>
                </div>
                <p className="text-xs text-stone-300 leading-relaxed">
                  Select one of the pre-tested disease samples on the left or upload your own leaf image,
                  then click &quot;Run AI Disease Pathology Diagnosis&quot; to receive:
                </p>
                <div className="grid grid-cols-2 gap-3 text-xs text-stone-400">
                  <div className="p-3 bg-stone-950/70 border border-stone-800 rounded-lg">
                    <span className="font-semibold text-white block">Pathogen Identification</span>
                    Fungal, bacterial, or viral causal agents with confidence scoring.
                  </div>
                  <div className="p-3 bg-stone-950/70 border border-stone-800 rounded-lg">
                    <span className="font-semibold text-white block">24-Hour Action Plan</span>
                    Immediate containment protocols before disease spreads to adjacent rows.
                  </div>
                  <div className="p-3 bg-stone-950/70 border border-stone-800 rounded-lg">
                    <span className="font-semibold text-white block">Biological &amp; Chemical Treatments</span>
                    Organic bio-fungicides and calibrated commercial applications.
                  </div>
                  <div className="p-3 bg-stone-950/70 border border-stone-800 rounded-lg">
                    <span className="font-semibold text-white block">Soil &amp; Yield Preservation</span>
                    Root zone correction and estimated yield impact mitigation.
                  </div>
                </div>
                <button
                  onClick={handleRunDiagnosis}
                  className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-xs font-semibold text-white rounded-lg transition-colors"
                >
                  Run Sample Analysis Now
                </button>
              </div>
            )}

            {!diagnosing && diagnosisResult && (
              <div className="p-6 bg-stone-900/90 border border-stone-800 rounded-xl space-y-6">
                {/* Header Lockup */}
                <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-stone-800">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-stone-400 mb-1">
                      <span>Condition Identified</span>
                      <span>·</span>
                      <span className="font-mono text-emerald-400">
                        {diagnosisResult.confidence}% Confidence
                      </span>
                      <span>·</span>
                      <span className="text-stone-400 font-mono">Engine: {diagnosticSource}</span>
                    </div>
                    <h3 className="text-xl font-extrabold text-white">
                      {diagnosisResult.condition}
                    </h3>
                    <div className="text-xs font-mono text-stone-400 mt-0.5">
                      Pathogen: {diagnosisResult.pathogen}
                    </div>
                  </div>

                  <div className="text-right">
                    <span
                      className={`inline-block px-3 py-1 text-xs font-bold rounded ${
                        diagnosisResult.severity === "Critical"
                          ? "bg-red-950/60 border border-red-800 text-red-300"
                          : diagnosisResult.severity === "Moderate"
                          ? "bg-amber-950/60 border border-amber-800 text-amber-300"
                          : "bg-emerald-950/60 border border-emerald-800 text-emerald-300"
                      }`}
                    >
                      {diagnosisResult.severity.toUpperCase()} SEVERITY
                    </span>
                    <div className="text-[11px] text-stone-400 mt-1 font-mono">
                      {diagnosisResult.yieldImpactEstimate}
                    </div>
                  </div>
                </div>

                {/* 24-Hour Urgent Action Box */}
                <div className="p-4 bg-red-950/20 border border-red-800/40 rounded-lg space-y-1">
                  <div className="text-xs font-bold text-red-400 uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>Immediate Action Within 24 Hours</span>
                  </div>
                  <p className="text-xs text-stone-200 leading-relaxed font-medium">
                    {diagnosisResult.immediateAction}
                  </p>
                </div>

                {/* Symptoms Identified List */}
                <div className="space-y-1.5">
                  <div className="text-xs font-bold text-stone-300 uppercase tracking-wider">
                    Diagnostic Pathology Markers
                  </div>
                  <ul className="space-y-1">
                    {diagnosisResult.symptomsIdentified.map((sym, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-stone-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{sym}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Treatment Regimens: Organic vs Chemical */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-stone-950/70 border border-stone-800 rounded-lg space-y-1.5">
                    <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                      Biological &amp; Organic Protocol
                    </div>
                    <p className="text-xs text-stone-300 leading-relaxed">
                      {diagnosisResult.organicTreatment}
                    </p>
                  </div>

                  <div className="p-4 bg-stone-950/70 border border-stone-800 rounded-lg space-y-1.5">
                    <div className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                      Targeted Chemical Fungicide / Control
                    </div>
                    <p className="text-xs text-stone-300 leading-relaxed">
                      {diagnosisResult.chemicalTreatment}
                    </p>
                  </div>
                </div>

                {/* Soil & Prevention Protocols */}
                <div className="space-y-3 pt-2">
                  <div className="p-3 bg-stone-950/60 border border-stone-800/80 rounded-lg">
                    <div className="text-xs font-semibold text-white">Root Zone &amp; Soil Amendment:</div>
                    <div className="text-xs text-stone-300 mt-0.5">{diagnosisResult.soilCorrection}</div>
                  </div>

                  <div>
                    <div className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-1">
                      Long-Term Agronomic Prevention
                    </div>
                    <div className="space-y-1">
                      {diagnosisResult.preventativeMeasures.map((prev, i) => (
                        <div key={i} className="text-xs text-stone-300 flex items-center gap-1.5">
                          <span className="text-emerald-400 font-bold">·</span>
                          <span>{prev}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUB-VIEW 2: SOIL-TO-CROP RECOMMENDATION ENGINE */}
      {activeSubTab === "recommendations" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left 4 Cols: Soil Chemistry Input Knobs */}
          <div className="lg:col-span-4 p-5 bg-stone-900/90 border border-stone-800 rounded-xl space-y-5">
            <div>
              <h3 className="text-base font-bold text-white">Soil Chemistry &amp; Climate Profile</h3>
              <p className="text-xs text-stone-400 mt-0.5">
                Adjust parameters from your field probes to match optimal crop cultivars.
              </p>
            </div>

            {/* Nitrogen Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-stone-300">Available Nitrogen (N)</span>
                <span className="font-mono text-emerald-400 font-semibold">{nitrogen} mg/kg</span>
              </div>
              <input
                type="range"
                min="40"
                max="240"
                value={nitrogen}
                onChange={(e) => setNitrogen(Number(e.target.value))}
                className="w-full accent-emerald-500"
              />
            </div>

            {/* Phosphorus Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-stone-300">Phosphorus (P)</span>
                <span className="font-mono text-emerald-400 font-semibold">{phosphorus} mg/kg</span>
              </div>
              <input
                type="range"
                min="15"
                max="90"
                value={phosphorus}
                onChange={(e) => setPhosphorus(Number(e.target.value))}
                className="w-full accent-emerald-500"
              />
            </div>

            {/* Potassium Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-stone-300">Potassium (K)</span>
                <span className="font-mono text-emerald-400 font-semibold">{potassium} mg/kg</span>
              </div>
              <input
                type="range"
                min="60"
                max="320"
                value={potassium}
                onChange={(e) => setPotassium(Number(e.target.value))}
                className="w-full accent-emerald-500"
              />
            </div>

            {/* pH Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-stone-300">Soil pH</span>
                <span className="font-mono text-emerald-400 font-semibold">{soilPh}</span>
              </div>
              <input
                type="range"
                min="5.0"
                max="8.5"
                step="0.1"
                value={soilPh}
                onChange={(e) => setSoilPh(Number(e.target.value))}
                className="w-full accent-emerald-500"
              />
            </div>

            {/* Soil Texture & Season */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <label className="text-xs font-semibold text-stone-300 block mb-1">
                  Soil Texture
                </label>
                <select
                  value={soilTexture}
                  onChange={(e) => setSoilTexture(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs bg-stone-950 border border-stone-700 rounded-lg text-white"
                >
                  <option value="Loamy Soil">Loamy Soil</option>
                  <option value="Sandy Loam">Sandy Loam</option>
                  <option value="Clay Loam">Clay Loam</option>
                  <option value="Silt Loam">Silt Loam</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-300 block mb-1">
                  Planting Season
                </label>
                <select
                  value={season}
                  onChange={(e) => setSeason(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs bg-stone-950 border border-stone-700 rounded-lg text-white"
                >
                  <option value="Spring / Kharif">Spring / Kharif</option>
                  <option value="Autumn / Rabi">Autumn / Rabi</option>
                  <option value="Summer / Zaid">Summer / Zaid</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleRunRecommendation}
              disabled={recommending}
              className="w-full py-2.5 px-4 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-stone-950 font-bold text-xs uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {recommending ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-stone-950 border-t-transparent rounded-full animate-spin"></div>
                  <span>Evaluating Soil Suitability...</span>
                </>
              ) : (
                <>
                  <Sprout className="w-4 h-4" />
                  <span>Generate Crop Recommendations</span>
                </>
              )}
            </button>
          </div>

          {/* Right 8 Cols: Recommendation Cards */}
          <div className="lg:col-span-8 space-y-4">
            {!recommendationResult && !recommending && (
              <div className="p-8 bg-stone-900/60 border border-stone-800 rounded-xl space-y-4">
                <div className="flex items-center gap-2 text-emerald-400">
                  <Sprout className="w-5 h-5" />
                  <h3 className="text-base font-bold text-white">
                    Data-Driven Planting Decisions
                  </h3>
                </div>
                <p className="text-xs text-stone-300 leading-relaxed">
                  AgriNova combines soil chemical sensors (NPK, pH), soil texture classification, and regional micro-climate models to recommend the crops with highest expected profit and disease resilience.
                </p>
                <button
                  onClick={handleRunRecommendation}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-stone-950 text-xs font-semibold rounded-lg transition-colors"
                >
                  Calculate Recommendations for Active Soil
                </button>
              </div>
            )}

            {recommendationResult && (
              <div className="space-y-4">
                <div className="p-4 bg-emerald-950/20 border border-emerald-800/40 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                      Agronomist Soil Tip:
                    </span>
                    <p className="text-xs text-stone-200 mt-0.5">
                      {recommendationResult.soilOptimizationTip}
                    </p>
                  </div>
                  <span className="text-xs font-mono text-emerald-400 shrink-0 ml-4">
                    pH {soilPh} · {soilTexture}
                  </span>
                </div>

                <div className="space-y-3">
                  {recommendationResult.recommendations.map((rec, i) => (
                    <div
                      key={i}
                      className="p-5 bg-stone-900/90 border border-stone-800 hover:border-emerald-600/50 rounded-xl transition-all space-y-3"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2 text-xs text-stone-400">
                            <span>Rank #{i + 1} Recommendation</span>
                            <span>·</span>
                            <span className="text-emerald-400 font-mono">
                              {rec.suitabilityScore}% Soil Match
                            </span>
                          </div>
                          <h4 className="text-lg font-bold text-white mt-0.5">{rec.crop}</h4>
                        </div>

                        <span className="px-2.5 py-1 text-xs font-semibold rounded bg-stone-800 text-stone-200 font-mono">
                          Demand: {rec.marketDemand}
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-2 py-1 text-xs">
                        <div className="p-2 bg-stone-950/60 border border-stone-800/80 rounded-lg">
                          <span className="text-stone-400 block text-[11px]">Expected Yield</span>
                          <span className="font-semibold text-white font-mono">{rec.expectedYield}</span>
                        </div>
                        <div className="p-2 bg-stone-950/60 border border-stone-800/80 rounded-lg">
                          <span className="text-stone-400 block text-[11px]">Growth Cycle</span>
                          <span className="font-semibold text-white font-mono">{rec.growingDuration}</span>
                        </div>
                        <div className="p-2 bg-stone-950/60 border border-stone-800/80 rounded-lg">
                          <span className="text-stone-400 block text-[11px]">Irrigation Need</span>
                          <span className="font-semibold text-emerald-400 font-mono">
                            {rec.waterRequirement}
                          </span>
                        </div>
                      </div>

                      <div className="text-xs text-stone-300 leading-relaxed pt-1">
                        <span className="font-semibold text-white">Agronomic Note: </span>
                        {rec.keyAgronomicAdvice}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
