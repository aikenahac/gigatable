const { faker } = require("@faker-js/faker");
const fs = require("fs");
const path = require("path");

// Constants from strains.tsx
const storageOptions = {
  banked: "banked",
  unbanked: "unbanked",
};

const projects = {
  project_zero: "Project Zero",
  super_project: "Super Project",
  gen_revolution: "Gen Revolution",
  quantum_flora: "Quantum Flora",
  biopioneer: "BioPioneer",
  future_brew: "Future Brew",
};

// Helper functions to generate realistic data
function getRandomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

const plasmids = [
  "pUC19",
  "pBR322",
  "pET28a",
  "pGEX-4T",
  "pCMV",
  "pYES2",
  "pRS316",
  "pRS425",
];
const markers = [
  "AmpR",
  "KanR",
  "ChlR",
  "TetR",
  "His3",
  "Trp1",
  "Ura3",
  "Leu2",
];
const media = [
  "YPD",
  "SD",
  "SC",
  "LB",
  "M9",
  "YNB",
  "YEPD",
  "Synthetic Complete",
];
const ethanolTolerances = ["Low", "Medium", "High", "Very High"];
const flocculations = ["Low", "Medium", "High", "Very High"];
const stressResistances = ["Poor", "Fair", "Good", "Excellent"];
const contaminations = ["None", "Low", "Medium", "High"];
const geneticStabilities = ["Stable", "Moderately Stable", "Unstable"];
const enzymicActivities = ["Low", "Medium", "High", "Very High"];
const proteinExpressions = ["Low", "Medium", "High", "Overexpressed"];
const carbSources = [
  "Glucose",
  "Fructose",
  "Sucrose",
  "Galactose",
  "Maltose",
  "Xylose",
];
const nitrogenSources = [
  "Ammonium Sulfate",
  "Peptone",
  "Yeast Extract",
  "Casamino Acids",
];
const biomarkers = ["GFP", "RFP", "YFP", "CFP", "mCherry", "Venus", "Cerulean"];
const storageConditions = [
  "-80°C",
  "-20°C",
  "4°C",
  "Room Temperature",
  "Liquid Nitrogen",
];
const applications = [
  "Research",
  "Production",
  "Fermentation",
  "Biotech",
  "Pharmaceutical",
];
const riskAssessments = ["Low Risk", "Medium Risk", "High Risk", "Contained"];
const complianceStatuses = [
  "Compliant",
  "Under Review",
  "Non-Compliant",
  "Pending",
];
const statuses = [
  "Active",
  "Archived",
  "Under Development",
  "Deprecated",
  "Quality Control",
];

const suppliers = ["BioSupply", "LabCorp", "ScienceCo", "GeneTech", "BioPure"];
const countries = [
  "USA",
  "Germany",
  "Japan",
  "Canada",
  "UK",
  "France",
  "China",
];
const methods = ["HPLC", "GC-MS", "PCR", "ELISA", "Spectrophotometry"];
const protocols = ["ISO9001", "GMP", "ISO17025", "FDA", "ASTM"];
const approvals = ["Approved", "Pending", "Rejected", "Conditional"];
const reviews = ["Passed", "Failed", "Pending", "Skipped"];
const geneMarkers = [
  "ACT1",
  "TEF1",
  "GAPDH",
  "RPL3",
  "HXT1",
  "MAL12",
  "URA3",
  "LEU2",
  "HIS3",
  "TRP1",
];
const assayResults = [
  "Pass",
  "Fail",
  "Pending",
  "Retest",
  "Validated",
  "Inconclusive",
  "Outlier",
];

function roundedFloat(min, max, multipleOf, precision) {
  return parseFloat(
    faker.number.float({ min, max, multipleOf }).toFixed(precision),
  );
}

function generateNumberedFields(prefix, generateValue) {
  return Array.from({ length: 20 }, (_, index) => {
    const suffix = String(index + 1).padStart(2, "0");
    return [`${prefix}${suffix}`, generateValue(index, suffix)];
  }).reduce((fields, [key, value]) => {
    fields[key] = value;
    return fields;
  }, {});
}

function generateAdditionalStrainMetrics() {
  return {
    ...generateNumberedFields(
      "geneMarker",
      (_, suffix) => `${getRandomElement(geneMarkers)}-${suffix}`,
    ),
    ...generateNumberedFields("geneCopyNumber", () =>
      faker.number.int({ min: 1, max: 12 }),
    ),
    ...generateNumberedFields("expressionLevel", () =>
      roundedFloat(0.01, 250.0, 0.01, 2),
    ),
    ...generateNumberedFields("enzymeActivityUml", () =>
      roundedFloat(0.01, 500.0, 0.01, 2),
    ),
    ...generateNumberedFields("metaboliteMgL", () =>
      roundedFloat(0.1, 2500.0, 0.1, 1),
    ),
    ...generateNumberedFields("cultureTempC", () =>
      roundedFloat(15.0, 45.0, 0.1, 1),
    ),
    ...generateNumberedFields("culturePh", () =>
      roundedFloat(3.5, 8.5, 0.1, 1),
    ),
    ...generateNumberedFields("assayResult", () =>
      getRandomElement(assayResults),
    ),
    ...generateNumberedFields("qcScore", () =>
      roundedFloat(0.0, 100.0, 0.1, 1),
    ),
    ...generateNumberedFields("stabilityIndex", () =>
      roundedFloat(0.001, 1.0, 0.001, 3),
    ),
  };
}

function generateStrainData(count = 500) {
  console.log(`Generating ${count} strain entries...`);

  const projectValues = Object.values(projects);
  const storageValues = Object.values(storageOptions);

  const strains = Array.from({ length: count }, (_, i) => {
    return {
      id: `strain-${i + 1}`,
      name: `Y${String(i + 1).padStart(5, "0")}`,
      parent:
        i < 100
          ? null
          : Math.random() > 0.3
            ? `Y${String(faker.number.int({ min: 1, max: i })).padStart(5, "0")}`
            : null,
      storage: getRandomElement(storageValues),
      description: faker.lorem.sentence({ min: 4, max: 12 }),
      project: getRandomElement(projectValues),
      temperature: parseFloat(
        faker.number.float({ min: 15, max: 45, multipleOf: 0.1 }).toFixed(1),
      ),
      ph: parseFloat(
        faker.number.float({ min: 3.5, max: 8.5, multipleOf: 0.1 }).toFixed(1),
      ),
      viability: faker.number.int({ min: 70, max: 99 }),
      cellCount: faker.number
        .int({ min: 1000000, max: 50000000 })
        .toLocaleString(),
      plasmid: getRandomElement(plasmids),
      marker: getRandomElement(markers),
      medium: getRandomElement(media),
      osmolarity: faker.number.int({ min: 200, max: 400 }),
      oxygenLevel: parseFloat(
        faker.number.float({ min: 0.5, max: 21.0, multipleOf: 0.1 }).toFixed(1),
      ),
      glucoseConc: parseFloat(
        faker.number.float({ min: 0.5, max: 20.0, multipleOf: 0.1 }).toFixed(1),
      ),
      ethanolTolerance: getRandomElement(ethanolTolerances),
      growthRate: parseFloat(
        faker.number.float({ min: 0.1, max: 2.5, multipleOf: 0.01 }).toFixed(2),
      ),
      flocculation: getRandomElement(flocculations),
      attenuation: faker.number.int({ min: 60, max: 95 }),
      fermentationTime: faker.number.int({ min: 12, max: 168 }),
      stressResistance: getRandomElement(stressResistances),
      purityLevel: parseFloat(
        faker.number
          .float({ min: 85.0, max: 99.9, multipleOf: 0.1 })
          .toFixed(1),
      ),
      contamination: getRandomElement(contaminations),
      geneticStability: getRandomElement(geneticStabilities),
      mutationRate: parseFloat(
        faker.number
          .float({ min: 0.001, max: 0.1, multipleOf: 0.001 })
          .toFixed(3),
      ),
      enzymicActivity: getRandomElement(enzymicActivities),
      metabolicRate: parseFloat(
        faker.number.float({ min: 0.5, max: 5.0, multipleOf: 0.01 }).toFixed(2),
      ),
      proteinExpression: getRandomElement(proteinExpressions),
      lipidContent: parseFloat(
        faker.number.float({ min: 5.0, max: 25.0, multipleOf: 0.1 }).toFixed(1),
      ),
      carbSource: getRandomElement(carbSources),
      nitrogenSource: getRandomElement(nitrogenSources),
      biomarkers: getRandomElement(biomarkers),
      generation: faker.number.int({ min: 1, max: 50 }),
      passage: faker.number.int({ min: 1, max: 100 }),
      freezeThawCycles: faker.number.int({ min: 0, max: 20 }),
      storageCondition: getRandomElement(storageConditions),
      qualityScore: parseFloat(
        faker.number.float({ min: 6.0, max: 10.0, multipleOf: 0.1 }).toFixed(1),
      ),
      batchNumber: `B${faker.number.int({ min: 1000, max: 9999 })}`,
      laboratoryId: `LAB-${faker.number.int({ min: 100, max: 999 })}`,
      notes: faker.lorem.sentence({ min: 3, max: 8 }),
      applications: getRandomElement(applications),
      riskAssessment: getRandomElement(riskAssessments),
      complianceStatus: getRandomElement(complianceStatuses),
      lastModified: faker.date
        .recent({ days: 365 })
        .toISOString()
        .split("T")[0],
      createdBy: faker.person.fullName(),
      createdOn: faker.date.past({ years: 5 }).toISOString().split("T")[0],
      version: `v${faker.number.int({ min: 1, max: 10 })}.${faker.number.int({
        min: 0,
        max: 9,
      })}`,
      status: getRandomElement(statuses),
      conductivity: parseFloat(
        faker.number
          .float({ min: 0.5, max: 10.0, multipleOf: 0.01 })
          .toFixed(2),
      ),
      // New 50 columns
      isolationDate: faker.date.past({ years: 3 }).toISOString().split("T")[0],
      harvestDate: faker.date.past({ years: 1 }).toISOString().split("T")[0],
      expiryDate: faker.date.future({ years: 2 }).toISOString().split("T")[0],
      testDate: faker.date.recent({ days: 90 }).toISOString().split("T")[0],
      certificationDate: faker.date
        .past({ years: 2 })
        .toISOString()
        .split("T")[0],
      density: parseFloat(
        faker.number
          .float({ min: 0.8, max: 1.5, multipleOf: 0.001 })
          .toFixed(3),
      ),
      viscosity: parseFloat(
        faker.number.float({ min: 1.0, max: 50.0, multipleOf: 0.1 }).toFixed(1),
      ),
      turbidity: parseFloat(
        faker.number
          .float({ min: 0.5, max: 100.0, multipleOf: 0.1 })
          .toFixed(1),
      ),
      colorValue: faker.number.int({ min: 1, max: 100 }),
      clarityIndex: parseFloat(
        faker.number.float({ min: 1.0, max: 10.0, multipleOf: 0.1 }).toFixed(1),
      ),
      sedimentLevel: parseFloat(
        faker.number.float({ min: 0.1, max: 50.0, multipleOf: 0.1 }).toFixed(1),
      ),
      foamStability: faker.number.int({ min: 10, max: 300 }),
      yieldRate: parseFloat(
        faker.number
          .float({ min: 50.0, max: 99.0, multipleOf: 0.1 })
          .toFixed(1),
      ),
      efficiency: parseFloat(
        faker.number
          .float({ min: 70.0, max: 99.0, multipleOf: 0.1 })
          .toFixed(1),
      ),
      potency: parseFloat(
        faker.number
          .float({ min: 1.0, max: 100.0, multipleOf: 0.01 })
          .toFixed(2),
      ),
      concentration: parseFloat(
        faker.number
          .float({ min: 0.5, max: 500.0, multipleOf: 0.1 })
          .toFixed(1),
      ),
      dilutionFactor: faker.number.int({ min: 1, max: 1000 }),
      volumeMl: faker.number.int({ min: 1, max: 5000 }),
      weightGrams: parseFloat(
        faker.number
          .float({ min: 0.1, max: 1000.0, multipleOf: 0.01 })
          .toFixed(2),
      ),
      moistureContent: parseFloat(
        faker.number.float({ min: 0.5, max: 15.0, multipleOf: 0.1 }).toFixed(1),
      ),
      ashContent: parseFloat(
        faker.number.float({ min: 0.1, max: 10.0, multipleOf: 0.1 }).toFixed(1),
      ),
      proteinContent: parseFloat(
        faker.number.float({ min: 5.0, max: 80.0, multipleOf: 0.1 }).toFixed(1),
      ),
      carbContent: parseFloat(
        faker.number
          .float({ min: 10.0, max: 75.0, multipleOf: 0.1 })
          .toFixed(1),
      ),
      fatContent: parseFloat(
        faker.number.float({ min: 0.5, max: 30.0, multipleOf: 0.1 }).toFixed(1),
      ),
      fiberContent: parseFloat(
        faker.number.float({ min: 0.1, max: 15.0, multipleOf: 0.1 }).toFixed(1),
      ),
      saltContent: parseFloat(
        faker.number.float({ min: 0.1, max: 50.0, multipleOf: 0.1 }).toFixed(1),
      ),
      sugarContent: parseFloat(
        faker.number
          .float({ min: 0.5, max: 200.0, multipleOf: 0.1 })
          .toFixed(1),
      ),
      alcoholContent: parseFloat(
        faker.number.float({ min: 0.0, max: 20.0, multipleOf: 0.1 }).toFixed(1),
      ),
      acidityLevel: parseFloat(
        faker.number.float({ min: 3.0, max: 7.0, multipleOf: 0.01 }).toFixed(2),
      ),
      bitterLevel: faker.number.int({ min: 10, max: 100 }),
      aromaScore: faker.number.int({ min: 1, max: 10 }),
      flavorScore: faker.number.int({ min: 1, max: 10 }),
      textureScore: faker.number.int({ min: 1, max: 10 }),
      appearanceScore: faker.number.int({ min: 1, max: 10 }),
      overallScore: faker.number.int({ min: 1, max: 10 }),
      sampleCode: `S${faker.string.alphanumeric({ length: 6, casing: "upper" })}`,
      lotNumber: `L${faker.number.int({ min: 1000, max: 9999 })}`,
      serialNumber: `SN${faker.number.int({ min: 100000, max: 999999 })}`,
      catalogNumber: `CAT-${faker.number.int({ min: 1000, max: 9999 })}`,
      vendorCode: `V${faker.string.alphanumeric({ length: 4, casing: "upper" })}`,
      supplierName: getRandomElement(suppliers),
      manufacturerCode: `M${faker.string.alphanumeric({ length: 5, casing: "upper" })}`,
      originCountry: getRandomElement(countries),
      certificationCode: `CERT${faker.number.int({ min: 1000, max: 9999 })}`,
      analysisMethod: getRandomElement(methods),
      testProtocol: getRandomElement(protocols),
      approvalStatus: getRandomElement(approvals),
      reviewStatus: getRandomElement(reviews),
      auditDate: faker.date.recent({ days: 180 }).toISOString().split("T")[0],
      inspectionDate: faker.date
        .recent({ days: 60 })
        .toISOString()
        .split("T")[0],
      ...generateAdditionalStrainMetrics(),
    };
  });

  return strains;
}

function main() {
  let count = process.argv[2] ? parseInt(process.argv[2]) : 500;

  if (isNaN(count) || count <= 0) {
    console.error("Invalid count provided. Using default 500.");
    count = 500;
  }

  const strains = generateStrainData(count);

  // Ensure the data directory exists
  const dataDir = path.join(__dirname, "..", "src", "data");
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  // Write to JSON file
  const outputPath = path.join(dataDir, "strains.json");
  fs.writeFileSync(outputPath, JSON.stringify(strains, null, 2));

  console.log(
    `✅ Generated ${strains.length} strain entries and saved to ${outputPath}`,
  );
  console.log(
    `📊 File size: ${(fs.statSync(outputPath).size / 1024 / 1024).toFixed(
      2,
    )} MB`,
  );
}

if (require.main === module) {
  main();
}

module.exports = { generateStrainData };
