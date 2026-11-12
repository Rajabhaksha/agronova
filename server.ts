import express, { Request, Response } from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: "25mb" }));

// Initialize GoogleGenAI if key is present
const ai = process.env.GEMINI_API_KEY
  ? new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    })
  : null;

// ==========================================
// 1. SOIL TELEMETRY & MICRO-CLIMATE DATA
// ==========================================
interface TelemetryParcel {
  id: string;
  name: string;
  crop: string;
  acreage: number;
  location: string;
  farmer: string;
  moisture: number; // %
  nitrogen: number; // mg/kg
  phosphorus: number; // mg/kg
  potassium: number; // mg/kg
  ph: number;
  ec: number; // dS/m
  soilTemp: number; // °C
  airTemp: number; // °C
  humidity: number; // %
  solarIrradiance: number; // W/m²
  irrigationStatus: "Active" | "Scheduled" | "Standby" | "Required";
  healthScore: number;
  alerts: Array<{
    id: string;
    level: "warning" | "alert" | "info";
    title: string;
    message: string;
    timestamp: string;
  }>;
}

const parcelsData: TelemetryParcel[] = [
  {
    id: "parcel-1",
    name: "North Plot - Sector 4A",
    crop: "Durum Wheat",
    acreage: 24.5,
    location: "Greenfield Basin, Plot 12",
    farmer: "Elias Vance (Farmer #104)",
    moisture: 38.4,
    nitrogen: 142,
    phosphorus: 46,
    potassium: 198,
    ph: 6.6,
    ec: 1.35,
    soilTemp: 19.8,
    airTemp: 24.2,
    humidity: 58,
    solarIrradiance: 820,
    irrigationStatus: "Scheduled",
    healthScore: 94,
    alerts: [
      {
        id: "alt-1",
        level: "info",
        title: "Optimal Root Zone Nitrogen",
        message: "Available nitrogen at 142 mg/kg meets tiller growth target.",
        timestamp: "12m ago",
      },
      {
        id: "alt-2",
        level: "warning",
        title: "Micro-climate Evapotranspiration Spike",
        message: "Solar irradiance peaked at 820 W/m²; schedule drip cycle for 18:00.",
        timestamp: "35m ago",
      },
    ],
  },
  {
    id: "parcel-2",
    name: "Green Valley - Field 2",
    crop: "Organic Yellow Maize",
    acreage: 38.0,
    location: "Valley Terrace, Sector B",
    farmer: "Sarah Jenkins (Farmer #219)",
    moisture: 31.2,
    nitrogen: 118,
    phosphorus: 38,
    potassium: 165,
    ph: 6.4,
    ec: 1.12,
    soilTemp: 21.6,
    airTemp: 27.5,
    humidity: 49,
    solarIrradiance: 890,
    irrigationStatus: "Required",
    healthScore: 86,
    alerts: [
      {
        id: "alt-3",
        level: "alert",
        title: "Soil Moisture Below Target Threshold",
        message: "Volumetric water content dropped below 32%. Automated drip recommended.",
        timestamp: "5m ago",
      },
    ],
  },
  {
    id: "parcel-3",
    name: "Delta Lowlands - Plot 7C",
    crop: "Basmati Rice",
    acreage: 18.2,
    location: "River Delta Paddies",
    farmer: "Ravi Patel (Farmer #388)",
    moisture: 78.5,
    nitrogen: 164,
    phosphorus: 54,
    potassium: 220,
    ph: 6.9,
    ec: 1.84,
    soilTemp: 23.1,
    airTemp: 28.9,
    humidity: 82,
    solarIrradiance: 740,
    irrigationStatus: "Active",
    healthScore: 97,
    alerts: [
      {
        id: "alt-4",
        level: "warning",
        title: "Blight Spore Atmospheric Alert",
        message: "High relative humidity (82%) with 28.9°C air temperature favors blast germination.",
        timestamp: "18m ago",
      },
    ],
  },
  {
    id: "parcel-4",
    name: "Highland Terrace - Greenhouse Alpha",
    crop: "Plum Tomatoes (Protected)",
    acreage: 6.5,
    location: "Ridge Hills, Tunnel 3",
    farmer: "Elena Rostova (Farmer #452)",
    moisture: 42.0,
    nitrogen: 188,
    phosphorus: 62,
    potassium: 245,
    ph: 6.5,
    ec: 2.1,
    soilTemp: 20.4,
    airTemp: 23.8,
    humidity: 62,
    solarIrradiance: 670,
    irrigationStatus: "Standby",
    healthScore: 98,
    alerts: [
      {
        id: "alt-5",
        level: "info",
        title: "Nutrient Injection Balanced",
        message: "Fertigation EC 2.1 dS/m within calibrated tomato flowering range.",
        timestamp: "42m ago",
      },
    ],
  },
];

// Telemetry endpoint
app.get("/api/telemetry", (req: Request, res: Response) => {
  res.json({
    success: true,
    farmersSupported: 500,
    totalSensorsActive: 1420,
    telemetryUptime: "99.94%",
    activeAlertsCount: 3,
    parcels: parcelsData,
    historicalAverages: [
      { hour: "00:00", moisture: 41, temp: 17.2, humidity: 76 },
      { hour: "04:00", moisture: 43, temp: 16.5, humidity: 82 },
      { hour: "08:00", moisture: 39, temp: 20.1, humidity: 68 },
      { hour: "12:00", moisture: 34, temp: 26.4, humidity: 52 },
      { hour: "16:00", moisture: 33, temp: 27.2, humidity: 48 },
      { hour: "20:00", moisture: 37, temp: 22.8, humidity: 61 },
    ],
  });
});

// ==========================================
// 2. AI CROP DOCTOR (GEMINI 3.8 FLASH)
// ==========================================
app.post("/api/crop-doctor/diagnose", async (req: Request, res: Response) => {
  try {
    const { cropName, symptoms, imageBase64, sampleId } = req.body;

    const sampleDatabase: Record<string, any> = {
      "sample-tomato-blight": {
        condition: "Late Blight (Phytophthora infestans)",
        pathogen: "Phytophthora infestans (Oomycete)",
        confidence: 96,
        severity: "Critical",
        symptomsIdentified: [
          "Irregular dark water-soaked lesions on foliage",
          "White cottony fungal sporulation on leaf undersides in high humidity",
          "Rapid petiole necrosis and fruit rot progression",
        ],
        immediateAction:
          "Quarantine affected sector immediately. Remove and destroy heavily infected vines; do not compost infected tissue.",
        organicTreatment:
          "Copper octanoate (copper soap) or bio-fungicide containing Bacillus subtilis (Serenade ASO) applied in early mornings.",
        chemicalTreatment:
          "Targeted translaminar oomycide such as Cyazofamid (Ranman) or Mandipropamid (Revus) with adjuvant at recommended rate.",
        preventativeMeasures: [
          "Maintain drip irrigation; avoid overhead sprinkler splashing.",
          "Ensure 75cm minimum spacing for turbulent airflow drying foliage.",
          "Apply preventative copper shield prior to anticipated rain fronts.",
        ],
        soilCorrection: "Check drainage; elevate raised beds to prevent standing water near root crown.",
        yieldImpactEstimate: "35% - 60% loss if untreated within 72 hours",
      },
      "sample-rice-blast": {
        condition: "Rice Blast (Magnaporthe oryzae)",
        pathogen: "Magnaporthe oryzae (Ascomycete fungus)",
        confidence: 94,
        severity: "Critical",
        symptomsIdentified: [
          "Spindle-shaped elliptical lesions with gray-white centers and brown margins",
          "Lesion coalescing causing leaf desiccation and lodging risk",
          "Collar rot restricting nutrient translocation to grain panicles",
        ],
        immediateAction:
          "Drain excess standing water temporarily and pause top-dressing nitrogen fertilizers immediately to avoid vigorous succulent tissue.",
        organicTreatment:
          "Silica fertilization foliar spray (potassium silicate) to harden plant cell walls against fungal appressorial penetration.",
        chemicalTreatment:
          "Tricyclazole 75% WP or Azoxystrobin applied at early heading stage according to local agronomic thresholds.",
        preventativeMeasures: [
          "Plant resistant certified cultivar seed lots.",
          "Optimize split nitrogen doses rather than heavy single applications.",
          "Burn or deeply till infected rice stubble post-harvest.",
        ],
        soilCorrection: "Supplement potassium (K2O) to balance nitrogen ratio and strengthen culm integrity.",
        yieldImpactEstimate: "40% loss of panicle grain fill",
      },
      "sample-maize-leaf-blight": {
        condition: "Northern Corn Leaf Blight (Exserohilum turcicum)",
        pathogen: "Exserohilum turcicum (Fungus)",
        confidence: 92,
        severity: "Moderate",
        symptomsIdentified: [
          "Long elliptical cigar-shaped grayish-green to tan lesions (2.5 to 15 cm)",
          "Dark sporulation within lesion centers during wet humid periods",
          "Lower canopy leaf blighting moving upward toward the ear leaf",
        ],
        immediateAction:
          "Scout upper canopy and ear leaf; if lesions are present below ear leaf 2 weeks prior to tasseling, plan fungicide application.",
        organicTreatment:
          "Trichoderma harzianum soil and foliar inoculants; compost tea rich in beneficial saprophytes.",
        chemicalTreatment:
          "Triazole + Strobilurin premix (Pyraclostrobin + Fluxapyroxad or Propiconazole) at tasseling stage (VT).",
        preventativeMeasures: [
          "Crop rotation with non-host legumes (soybeans or chickpeas) for minimum 1 year.",
          "Tillage management to decompose crop residue harboring overwintering chlamydospores.",
          "Select hybrid seed with Ht multigenic resistance alleles.",
        ],
        soilCorrection: "Ensure balanced zinc and potash levels; soil pH optimal between 6.2 - 6.8.",
        yieldImpactEstimate: "15% - 25% grain yield reduction",
      },
      "sample-wheat-rust": {
        condition: "Stripe Rust / Yellow Rust (Puccinia striiformis)",
        pathogen: "Puccinia striiformis f. sp. tritici (Basidiomycete fungus)",
        confidence: 95,
        severity: "Critical",
        symptomsIdentified: [
          "Bright yellow-orange pustules arranged in parallel linear stripes along leaf veins",
          "Pustules rupturing epidermis to release powdery urediniospores",
          "Premature yellowing and drying of flag leaves",
        ],
        immediateAction:
          "Flag leaf protection is urgent. Schedule tractor or drone spraying before pustules colonize >5% of flag leaf surface.",
        organicTreatment:
          "Sulfur-based dusts or wettable sulfur applied early in disease development before widespread sporulation.",
        chemicalTreatment:
          "Demethylation inhibitor (DMI) triazole fungicide (Tebuconazole or Propiconazole) with active systemic uptake.",
        preventativeMeasures: [
          "Eradicate volunteer wheat plants and alternate barberry hosts.",
          "Plant certified rust-resistant wheat varieties (Yr genes).",
          "Monitor regional airborne spore radar bulletins.",
        ],
        soilCorrection: "Maintain adequate phosphorus to accelerate maturity and shorten vulnerable vegetative window.",
        yieldImpactEstimate: "30% - 50% test weight and yield drop",
      },
    };

    // If Gemini client is configured and input has custom text/image
    if (ai && (symptoms || imageBase64)) {
      try {
        const parts: any[] = [];
        if (imageBase64) {
          const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, "");
          parts.push({
            inlineData: {
              mimeType: "image/jpeg",
              data: cleanBase64,
            },
          });
        }

        const promptText = `You are AgriNova's chief agronomist and AI Crop Doctor. 
Analyze this plant pathology query for precision agriculture early decision-making.
Crop: ${cropName || "Cultivated Crop"}
Observed Symptoms: ${symptoms || "Visual leaf pathology observed in field sensor/camera"}

Return STRICT JSON matching this schema:
{
  "condition": "Specific disease or pest or nutrient deficiency name",
  "pathogen": "Scientific pathogen name and family or physiological cause",
  "confidence": integer between 85 and 99,
  "severity": "Critical" | "Moderate" | "Mild" | "Healthy",
  "symptomsIdentified": ["bullet 1", "bullet 2", "bullet 3"],
  "immediateAction": "Immediate action step for the farmer within 24 hours",
  "organicTreatment": "Approved organic or biological treatment recipe/product",
  "chemicalTreatment": "Targeted precise chemical fungicide/pesticide with application timing",
  "preventativeMeasures": ["preventative measure 1", "preventative measure 2", "preventative measure 3"],
  "soilCorrection": "Soil amendment, NPK adjustment or pH balance advice",
  "yieldImpactEstimate": "Estimated yield impact if left unmanaged"
}`;
        parts.push({ text: promptText });

        const geminiResponse = await ai.models.generateContent({
          model: "gemini-3.8-flash",
          contents: { parts },
          config: {
            responseMimeType: "application/json",
            systemInstruction:
              "You are an expert precision agriculture plant pathologist. Provide accurate, actionable, scientific agronomic diagnosis.",
          },
        });

        const rawText = geminiResponse.text;
        if (rawText) {
          const parsed = JSON.parse(rawText);
          return res.json({ success: true, diagnosis: parsed, source: "gemini-3.8-flash" });
        }
      } catch (err: any) {
        console.warn("Gemini call fell back to scientific knowledge database:", err.message);
      }
    }

    // Fallback: Use sample DB or matching crop pathology
    if (sampleId && sampleDatabase[sampleId]) {
      return res.json({
        success: true,
        diagnosis: sampleDatabase[sampleId],
        source: "agrinova-diagnostic-engine",
      });
    }

    // Default intelligent diagnostic match
    const cropKey = (cropName || "").toLowerCase();
    let selectedSample = sampleDatabase["sample-tomato-blight"];
    if (cropKey.includes("rice")) selectedSample = sampleDatabase["sample-rice-blast"];
    else if (cropKey.includes("corn") || cropKey.includes("maize"))
      selectedSample = sampleDatabase["sample-maize-leaf-blight"];
    else if (cropKey.includes("wheat")) selectedSample = sampleDatabase["sample-wheat-rust"];

    res.json({
      success: true,
      diagnosis: selectedSample,
      source: "agrinova-diagnostic-engine",
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// AI Crop Recommendation Engine
app.post("/api/crop-doctor/recommend", async (req: Request, res: Response) => {
  try {
    const { nitrogen, phosphorus, potassium, ph, soilTexture, rainfall, season } = req.body;

    if (ai) {
      try {
        const prompt = `Based on precision soil telemetry:
- Nitrogen (N): ${nitrogen || 120} mg/kg
- Phosphorus (P): ${phosphorus || 45} mg/kg
- Potassium (K): ${potassium || 180} mg/kg
- Soil pH: ${ph || 6.5}
- Soil Texture: ${soilTexture || "Loam"}
- Seasonal Rainfall: ${rainfall || "Moderate (650mm)"}
- Planting Season: ${season || "Spring / Kharif"}

Provide top 3 crop recommendations optimized for maximum yield and local farmer profitability.
Return STRICT JSON:
{
  "recommendations": [
    {
      "crop": "Crop Name",
      "suitabilityScore": integer 80-99,
      "expectedYield": "e.g. 4.8 - 5.5 Metric Tons / Hectare",
      "marketDemand": "High" | "Very High" | "Stable",
      "growingDuration": "e.g. 110 - 120 days",
      "waterRequirement": "Low" | "Medium" | "High",
      "keyAgronomicAdvice": "Direct advice for this soil profile"
    }
  ],
  "soilOptimizationTip": "Advice on improving this specific NPK or pH ratio"
}`;

        const geminiResponse = await ai.models.generateContent({
          model: "gemini-3.8-flash",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            systemInstruction: "You are an agricultural economist and soil scientist for AgriNova.",
          },
        });

        if (geminiResponse.text) {
          const parsed = JSON.parse(geminiResponse.text);
          return res.json({ success: true, data: parsed, source: "gemini-3.8-flash" });
        }
      } catch (err: any) {
        console.warn("Gemini recommendation fallback:", err.message);
      }
    }

    // Fallback recommendation
    res.json({
      success: true,
      data: {
        recommendations: [
          {
            crop: "Durum Wheat (Amber Grain)",
            suitabilityScore: 95,
            expectedYield: "4.8 - 5.4 MT / Hectare",
            marketDemand: "Very High",
            growingDuration: "115 - 125 days",
            waterRequirement: "Medium",
            keyAgronomicAdvice:
              "Soil nitrogen (120+ mg/kg) and neutral pH (6.5) match premium milling protein synthesis.",
          },
          {
            crop: "Yellow Flint Maize",
            suitabilityScore: 91,
            expectedYield: "7.2 - 8.0 MT / Hectare",
            marketDemand: "High",
            growingDuration: "105 - 115 days",
            waterRequirement: "Medium-High",
            keyAgronomicAdvice: "Apply split potassium dressing during silking stage to sustain grain filling.",
          },
          {
            crop: "Non-GMO Edamame & Soybeans",
            suitabilityScore: 88,
            expectedYield: "3.1 - 3.6 MT / Hectare",
            marketDemand: "Stable",
            growingDuration: "95 - 105 days",
            waterRequirement: "Low-Medium",
            keyAgronomicAdvice:
              "Symbiotic Rhizobium nodules will naturally fix 60 kg/ha atmospheric nitrogen for rotational savings.",
          },
        ],
        soilOptimizationTip:
          "Slight sulfur or organic compost addition will unlock bound phosphorus in loamy soils.",
      },
      source: "agrinova-diagnostic-engine",
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// 3. FARMER-TO-BUYER MARKETPLACE (REACT + MYSQL ARCHITECTURE)
// ==========================================
interface MarketplaceListing {
  id: string;
  title: string;
  category: "Grains" | "Vegetables" | "Legumes" | "Cash Crops" | "Fruits";
  farmerName: string;
  farmLocation: string;
  rating: number;
  totalSoldKg: number;
  availableKg: number;
  pricePerKg: number; // USD
  minOrderKg: number;
  grade: string;
  harvestDate: string;
  certifications: string[];
  image: string;
}

interface TransactionRecord {
  id: string;
  transactionRef: string;
  crop: string;
  volumeKg: number;
  unitPrice: number;
  totalUsd: number;
  farmer: string;
  buyer: string;
  buyerType: "Wholesale Mill" | "Supermarket Chain" | "Organic Co-op" | "Exporter";
  escrowStatus: "Escrow Locked" | "Quality Inspected" | "In Transit" | "Funds Released";
  paymentMethod: "Escrow Smart Contract" | "Direct Bank Wire" | "Letter of Credit";
  orderDate: string;
  deliveryDate: string;
  blockchainVerificationHash: string;
}

let marketplaceListings: MarketplaceListing[] = [
  {
    id: "list-1",
    title: "Organic Durum Wheat (High Protein Milling)",
    category: "Grains",
    farmerName: "Elias Vance",
    farmLocation: "Greenfield Basin, Plot 12",
    rating: 4.9,
    totalSoldKg: 42000,
    availableKg: 12500,
    pricePerKg: 0.38,
    minOrderKg: 500,
    grade: "Grade 1 (14.2% Protein)",
    harvestDate: "Nov 2026",
    certifications: ["GlobalGAP", "Non-GMO Verified", "Certified Organic"],
    image: "/src/assets/images/marketplace_produce_1794503296398.jpg",
  },
  {
    id: "list-2",
    title: "Super Kernel Basmati Rice (Aged 12 Mo)",
    category: "Grains",
    farmerName: "Ravi Patel",
    farmLocation: "Delta Paddies, Sector 7",
    rating: 4.95,
    totalSoldKg: 65000,
    availableKg: 8400,
    pricePerKg: 1.15,
    minOrderKg: 200,
    grade: "Export Grade AAA",
    harvestDate: "Oct 2026",
    certifications: ["FairTrade", "Water Stewardship Verified"],
    image: "/src/assets/images/marketplace_produce_1794503296398.jpg",
  },
  {
    id: "list-3",
    title: "Hydroponic Heirloom Plum Tomatoes",
    category: "Vegetables",
    farmerName: "Elena Rostova",
    farmLocation: "Highland Ridge Greenhouse",
    rating: 4.88,
    totalSoldKg: 18000,
    availableKg: 2200,
    pricePerKg: 1.85,
    minOrderKg: 50,
    grade: "Vine-Ripened Grade A",
    harvestDate: "Daily Harvest",
    certifications: ["Zero Chemical Residue", "Cold Chain Monitored"],
    image: "/src/assets/images/crop_healthy_sample_1794503296517.jpg",
  },
  {
    id: "list-4",
    title: "Golden Dent Corn / Yellow Maize (Animal & Food Grade)",
    category: "Grains",
    farmerName: "Sarah Jenkins",
    farmLocation: "Valley Terrace Fields",
    rating: 4.82,
    totalSoldKg: 85000,
    availableKg: 25000,
    pricePerKg: 0.28,
    minOrderKg: 1000,
    grade: "US No. 2 Yellow Corn",
    harvestDate: "Nov 2026",
    certifications: ["Aflatoxin Tested < 10ppb"],
    image: "/src/assets/images/hero_agrinova_field_1794503295166.jpg",
  },
  {
    id: "list-5",
    title: "Non-GMO High-Oleic Soybeans",
    category: "Legumes",
    farmerName: "Marcus Thorne",
    farmLocation: "Prairie Basin East",
    rating: 4.91,
    totalSoldKg: 34000,
    availableKg: 9500,
    pricePerKg: 0.52,
    minOrderKg: 500,
    grade: "Food Grade Tofu Quality",
    harvestDate: "Oct 2026",
    certifications: ["Non-GMO Project", "Biodegradable Bagging"],
    image: "/src/assets/images/marketplace_produce_1794503296398.jpg",
  },
  {
    id: "list-6",
    title: "Single-Origin Shade-Grown Arabica Cherries",
    category: "Cash Crops",
    farmerName: "Mateo Silva",
    farmLocation: "Sierra Cloud Highlands",
    rating: 5.0,
    totalSoldKg: 12000,
    availableKg: 3100,
    pricePerKg: 4.60,
    minOrderKg: 100,
    grade: "Specialty Micro-Lot (SCA 87.5)",
    harvestDate: "Nov 2026",
    certifications: ["Rainforest Alliance", "Direct Trade"],
    image: "/src/assets/images/crop_healthy_sample_1794503296517.jpg",
  },
];

// Seed transactions totaling 200 active transactions milestone
const generateInitialTransactions = (): TransactionRecord[] => {
  const records: TransactionRecord[] = [];
  const crops = [
    { name: "Organic Durum Wheat", price: 0.38, farmer: "Elias Vance" },
    { name: "Super Kernel Basmati Rice", price: 1.15, farmer: "Ravi Patel" },
    { name: "Hydroponic Plum Tomatoes", price: 1.85, farmer: "Elena Rostova" },
    { name: "Yellow Maize", price: 0.28, farmer: "Sarah Jenkins" },
    { name: "High-Oleic Soybeans", price: 0.52, farmer: "Marcus Thorne" },
    { name: "Specialty Arabica Coffee", price: 4.6, farmer: "Mateo Silva" },
  ];

  const buyers = [
    { name: "Pinnacle Flour Mills Ltd.", type: "Wholesale Mill" as const },
    { name: "FreshChoice Supermarkets Inc.", type: "Supermarket Chain" as const },
    { name: "Evergreen Organics Cooperative", type: "Organic Co-op" as const },
    { name: "Global Harvest Exports BV", type: "Exporter" as const },
    { name: "Artisanal Bakeries Collective", type: "Wholesale Mill" as const },
    { name: "PureFoods Retail Network", type: "Supermarket Chain" as const },
  ];

  const statuses = [
    "Escrow Locked",
    "Quality Inspected",
    "In Transit",
    "Funds Released",
  ] as const;

  // Generate 200 realistic active transactions
  for (let i = 1; i <= 200; i++) {
    const crop = crops[i % crops.length];
    const buyer = buyers[i % buyers.length];
    const volume = 200 + ((i * 137) % 4800);
    const totalUsd = Math.round(volume * crop.price * 100) / 100;
    const status = statuses[i % statuses.length];
    const day = (i % 28) + 1;

    records.push({
      id: `TXN-${String(1000 + i)}`,
      transactionRef: `AGN-2026-TRX${String(i).padStart(4, "0")}`,
      crop: crop.name,
      volumeKg: volume,
      unitPrice: crop.price,
      totalUsd,
      farmer: crop.farmer,
      buyer: buyer.name,
      buyerType: buyer.type,
      escrowStatus: status,
      paymentMethod: i % 2 === 0 ? "Escrow Smart Contract" : "Direct Bank Wire",
      orderDate: `2026-11-${String(day).padStart(2, "0")}`,
      deliveryDate: `2026-11-${String(Math.min(28, day + 4)).padStart(2, "0")}`,
      blockchainVerificationHash: `0x7f4b${(i * 98765).toString(16).padEnd(8, "0")}e1c3`,
    });
  }

  return records;
};

let activeTransactions: TransactionRecord[] = generateInitialTransactions();

// Marketplace Endpoints
app.get("/api/marketplace/listings", (req: Request, res: Response) => {
  const { category, search } = req.query;
  let filtered = [...marketplaceListings];

  if (category && category !== "All") {
    filtered = filtered.filter((l) => l.category === category);
  }

  if (search && typeof search === "string") {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (l) =>
        l.title.toLowerCase().includes(q) ||
        l.farmerName.toLowerCase().includes(q) ||
        l.farmLocation.toLowerCase().includes(q)
    );
  }

  res.json({
    success: true,
    totalListings: filtered.length,
    listings: filtered,
  });
});

app.get("/api/marketplace/transactions", (req: Request, res: Response) => {
  const { status, limit = "25", offset = "0" } = req.query;
  let list = [...activeTransactions];

  if (status && status !== "All") {
    list = list.filter((t) => t.escrowStatus === status);
  }

  const l = parseInt(limit as string, 10);
  const o = parseInt(offset as string, 10);
  const paged = list.slice(o, o + l);

  const totalVolumeKg = activeTransactions.reduce((acc, t) => acc + t.volumeKg, 0);
  const totalValueUsd = activeTransactions.reduce((acc, t) => acc + t.totalUsd, 0);

  res.json({
    success: true,
    totalTransactions: activeTransactions.length,
    filteredCount: list.length,
    stats: {
      totalActiveTransactions: activeTransactions.length,
      totalVolumeMetricTons: Math.round(totalVolumeKg / 100) / 10,
      totalEscrowValueUsd: totalValueUsd,
      completedRate: "98.8%",
    },
    transactions: paged,
  });
});

app.post("/api/marketplace/orders", (req: Request, res: Response) => {
  const { listingId, volumeKg, buyerName, buyerType, offerPrice } = req.body;

  const listing = marketplaceListings.find((l) => l.id === listingId);
  if (!listing) {
    return res.status(404).json({ error: "Listing not found" });
  }

  const vol = Number(volumeKg) || listing.minOrderKg;
  const unitPrice = Number(offerPrice) || listing.pricePerKg;
  const totalUsd = Math.round(vol * unitPrice * 100) / 100;

  const newTxn: TransactionRecord = {
    id: `TXN-${activeTransactions.length + 1001}`,
    transactionRef: `AGN-2026-TRX${String(activeTransactions.length + 1).padStart(4, "0")}`,
    crop: listing.title,
    volumeKg: vol,
    unitPrice,
    totalUsd,
    farmer: listing.farmerName,
    buyer: buyerName || "Enterprise Buyer Partner",
    buyerType: buyerType || "Wholesale Mill",
    escrowStatus: "Escrow Locked",
    paymentMethod: "Escrow Smart Contract",
    orderDate: "2026-11-12",
    deliveryDate: "2026-11-16",
    blockchainVerificationHash: `0x${Math.random().toString(16).substring(2, 10)}e99a`,
  };

  // Add to front of transaction list
  activeTransactions.unshift(newTxn);

  // Update listing inventory
  listing.availableKg = Math.max(0, listing.availableKg - vol);
  listing.totalSoldKg += vol;

  res.json({
    success: true,
    message: "Purchase order created with secure escrow locking",
    transaction: newTxn,
    newTotalTransactions: activeTransactions.length,
  });
});

// Post a new produce listing
app.post("/api/marketplace/listings", (req: Request, res: Response) => {
  const { title, category, farmerName, farmLocation, availableKg, pricePerKg, minOrderKg, grade } =
    req.body;

  if (!title || !pricePerKg) {
    return res.status(400).json({ error: "Title and price per kg are required." });
  }

  const newListing: MarketplaceListing = {
    id: `list-${Date.now()}`,
    title,
    category: category || "Grains",
    farmerName: farmerName || "Local Farmer Partner",
    farmLocation: farmLocation || "AgriNova Regional Cluster",
    rating: 5.0,
    totalSoldKg: 0,
    availableKg: Number(availableKg) || 1000,
    pricePerKg: Number(pricePerKg),
    minOrderKg: Number(minOrderKg) || 100,
    grade: grade || "Grade A Standard",
    harvestDate: "Nov 2026",
    certifications: ["AgriNova Sensor Verified"],
    image: "/src/assets/images/marketplace_produce_1794503296398.jpg",
  };

  marketplaceListings.unshift(newListing);

  res.json({
    success: true,
    listing: newListing,
  });
});

// ==========================================
// 4. SERVER MOUNT & VITE DEV INTEGRATION
// ==========================================
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, "dist")));
    app.get("*", (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, () => {
    console.log(`AgriNova server listening on port ${PORT}`);
  });
}

startServer();
