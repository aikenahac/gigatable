import strainsData from "./data/strains.json";

export const storageOptions = {
  banked: "banked",
  unbanked: "unbanked",
} as const;

export const projects = {
  project_zero: "Project Zero",
  super_project: "Super Project",
  gen_revolution: "Gen Revolution",
  quantum_flora: "Quantum Flora",
  biopioneer: "BioPioneer",
  future_brew: "Future Brew",
} as const;

type StorageOptionsKey = keyof typeof storageOptions;
type StorageOptions = (typeof storageOptions)[StorageOptionsKey];
type ProjectsKey = keyof typeof projects;
type Projects = (typeof projects)[ProjectsKey];

export interface Strain extends Record<string, unknown> {
  id: string;
  name: string;
  parent: string | null;
  storage: StorageOptions;
  description: string;
  project: Projects;
  temperature: number;
  ph: number;
  viability: number;
  cellCount: string;
  plasmid: string;
  marker: string;
  medium: string;
  osmolarity: number;
  oxygenLevel: number;
  glucoseConc: number;
  ethanolTolerance: string;
  growthRate: number;
  flocculation: string;
  attenuation: number;
  fermentationTime: number;
  stressResistance: string;
  purityLevel: number;
  contamination: string;
  geneticStability: string;
  mutationRate: number;
  enzymicActivity: string;
  metabolicRate: number;
  proteinExpression: string;
  lipidContent: number;
  carbSource: string;
  nitrogenSource: string;
  biomarkers: string;
  generation: number;
  passage: number;
  freezeThawCycles: number;
  storageCondition: string;
  qualityScore: number;
  batchNumber: string;
  laboratoryId: string;
  notes: string;
  applications: string;
  riskAssessment: string;
  complianceStatus: string;
  lastModified: string;
  createdBy: string;
  createdOn: string;
  version: string;
  status: string;
  conductivity: number;
}

// Import generated strain data from JSON file
// To regenerate this data, run: npm run generate-data
export const strains: Array<Strain> = strainsData as Array<Strain>;
