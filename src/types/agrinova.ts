export interface TelemetryParcel {
  id: string;
  name: string;
  crop: string;
  acreage: number;
  location: string;
  farmer: string;
  moisture: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  ph: number;
  ec: number;
  soilTemp: number;
  airTemp: number;
  humidity: number;
  solarIrradiance: number;
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

export interface TelemetryResponse {
  success: boolean;
  farmersSupported: number;
  totalSensorsActive: number;
  telemetryUptime: string;
  activeAlertsCount: number;
  parcels: TelemetryParcel[];
  historicalAverages: Array<{
    hour: string;
    moisture: number;
    temp: number;
    humidity: number;
  }>;
}

export interface CropDiagnosis {
  condition: string;
  pathogen: string;
  confidence: number;
  severity: "Critical" | "Moderate" | "Mild" | "Healthy";
  symptomsIdentified: string[];
  immediateAction: string;
  organicTreatment: string;
  chemicalTreatment: string;
  preventativeMeasures: string[];
  soilCorrection: string;
  yieldImpactEstimate: string;
}

export interface CropRecommendationItem {
  crop: string;
  suitabilityScore: number;
  expectedYield: string;
  marketDemand: "High" | "Very High" | "Stable";
  growingDuration: string;
  waterRequirement: "Low" | "Medium" | "High";
  keyAgronomicAdvice: string;
}

export interface CropRecommendationData {
  recommendations: CropRecommendationItem[];
  soilOptimizationTip: string;
}

export interface MarketplaceListing {
  id: string;
  title: string;
  category: "Grains" | "Vegetables" | "Legumes" | "Cash Crops" | "Fruits";
  farmerName: string;
  farmLocation: string;
  rating: number;
  totalSoldKg: number;
  availableKg: number;
  pricePerKg: number;
  minOrderKg: number;
  grade: string;
  harvestDate: string;
  certifications: string[];
  image: string;
}

export interface TransactionRecord {
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
