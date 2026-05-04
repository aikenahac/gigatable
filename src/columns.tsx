import { EditableCell } from "./data-table";
import { Strain } from "./strains";
import { ColumnDef } from "@tanstack/react-table";
import "./types/react-table";
import React from "react";

// Memoized input components to prevent re-renders
const TextInput = React.memo(({ value, onChange, onBlur, onKeyDown }: any) => (
  <input
    type="text"
    autoFocus
    value={value as string}
    onChange={onChange}
    onBlur={onBlur}
    onKeyDown={onKeyDown}
  />
));
TextInput.displayName = "TextInput";

const NumberInput = React.memo(({ value, onChange, onBlur, onKeyDown, step }: any) => (
  <input
    type="number"
    autoFocus
    step={step}
    value={value as number}
    onChange={onChange}
    onBlur={onBlur}
    onKeyDown={onKeyDown}
  />
));
NumberInput.displayName = "NumberInput";

// Wrapper to pass step prop
const createNumberInput = (step?: string | number) => {
  const SteppedNumberInput = React.memo((props: any) => (
    <NumberInput {...props} step={step} />
  ));
  SteppedNumberInput.displayName = `NumberInput_${step}`;
  return SteppedNumberInput;
};

const NumberInput01 = createNumberInput("0.1");
const NumberInput001 = createNumberInput("0.01");
const NumberInput0001 = createNumberInput("0.001");
const NumberInputDefault = createNumberInput(undefined);

export const columns: Array<ColumnDef<Strain>> = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => row.getValue("id"),
    size: 120,
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: (cell) => <EditableCell {...cell} renderInput={TextInput} />,
    size: 110,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "parent",
    header: "Parent",
    cell: ({ row }) => row.getValue("parent"),
    size: 100,
  },
  {
    accessorKey: "storage",
    header: "Storage",
    cell: ({ row }) => row.getValue("storage"),
    size: 100,
  },
  {
    accessorKey: "project",
    header: "Project",
    cell: ({ row }) => row.getValue("project"),
    size: 150,
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: (cell) => <EditableCell {...cell} renderInput={TextInput} />,
    size: 200,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "temperature",
    header: "Temp (°C)",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInputDefault} />,
    size: 80,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "ph",
    header: "pH",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInput01} />,
    size: 70,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "viability",
    header: "Viability (%)",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInputDefault} />,
    size: 90,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "cellCount",
    header: "Cell Count",
    cell: ({ row }) => row.getValue("cellCount"),
    size: 100,
  },
  {
    accessorKey: "plasmid",
    header: "Plasmid",
    cell: ({ row }) => row.getValue("plasmid"),
    size: 120,
  },
  {
    accessorKey: "marker",
    header: "Marker",
    cell: ({ row }) => row.getValue("marker"),
    size: 100,
  },
  {
    accessorKey: "medium",
    header: "Medium",
    cell: ({ row }) => row.getValue("medium"),
    size: 120,
  },
  {
    accessorKey: "osmolarity",
    header: "Osmolarity",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInputDefault} />,
    size: 90,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "oxygenLevel",
    header: "O2 Level",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInput01} />,
    size: 80,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "glucoseConc",
    header: "Glucose (g/L)",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInput01} />,
    size: 100,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "ethanolTolerance",
    header: "EtOH Tolerance",
    cell: ({ row }) => row.getValue("ethanolTolerance"),
    size: 120,
  },
  {
    accessorKey: "growthRate",
    header: "Growth Rate",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInput001} />,
    size: 100,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "flocculation",
    header: "Flocculation",
    cell: ({ row }) => row.getValue("flocculation"),
    size: 100,
  },
  {
    accessorKey: "attenuation",
    header: "Attenuation (%)",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInputDefault} />,
    size: 110,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "fermentationTime",
    header: "Ferment Time (h)",
    cell: ({ row }) => row.getValue("fermentationTime"),
    size: 120,
  },
  {
    accessorKey: "stressResistance",
    header: "Stress Resistance",
    cell: ({ row }) => row.getValue("stressResistance"),
    size: 130,
  },
  {
    accessorKey: "purityLevel",
    header: "Purity (%)",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInput01} />,
    size: 80,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "contamination",
    header: "Contamination",
    cell: ({ row }) => row.getValue("contamination"),
    size: 110,
  },
  {
    accessorKey: "geneticStability",
    header: "Genetic Stability",
    cell: ({ row }) => row.getValue("geneticStability"),
    size: 130,
  },
  {
    accessorKey: "mutationRate",
    header: "Mutation Rate",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInput0001} />,
    size: 100,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "enzymicActivity",
    header: "Enzymic Activity",
    cell: ({ row }) => row.getValue("enzymicActivity"),
    size: 120,
  },
  {
    accessorKey: "metabolicRate",
    header: "Metabolic Rate",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInput001} />,
    size: 110,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "proteinExpression",
    header: "Protein Expression",
    cell: ({ row }) => row.getValue("proteinExpression"),
    size: 130,
  },
  {
    accessorKey: "lipidContent",
    header: "Lipid Content (%)",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInput01} />,
    size: 120,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "carbSource",
    header: "Carbon Source",
    cell: ({ row }) => row.getValue("carbSource"),
    size: 120,
  },
  {
    accessorKey: "nitrogenSource",
    header: "Nitrogen Source",
    cell: ({ row }) => row.getValue("nitrogenSource"),
    size: 130,
  },
  {
    accessorKey: "biomarkers",
    header: "Biomarkers",
    cell: ({ row }) => row.getValue("biomarkers"),
    size: 150,
  },
  {
    accessorKey: "generation",
    header: "Generation",
    cell: ({ row }) => row.getValue("generation"),
    size: 90,
  },
  {
    accessorKey: "passage",
    header: "Passage",
    cell: ({ row }) => row.getValue("passage"),
    size: 80,
  },
  {
    accessorKey: "freezeThawCycles",
    header: "Freeze/Thaw",
    cell: ({ row }) => row.getValue("freezeThawCycles"),
    size: 100,
  },
  {
    accessorKey: "storageCondition",
    header: "Storage Condition",
    cell: ({ row }) => row.getValue("storageCondition"),
    size: 130,
  },
  {
    accessorKey: "qualityScore",
    header: "Quality Score",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInput01} />,
    size: 100,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "batchNumber",
    header: "Batch #",
    cell: ({ row }) => row.getValue("batchNumber"),
    size: 100,
  },
  {
    accessorKey: "laboratoryId",
    header: "Lab ID",
    cell: ({ row }) => row.getValue("laboratoryId"),
    size: 100,
  },
  {
    accessorKey: "notes",
    header: "Notes",
    cell: (cell) => <EditableCell {...cell} renderInput={TextInput} />,
    size: 200,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "applications",
    header: "Applications",
    cell: ({ row }) => row.getValue("applications"),
    size: 150,
  },
  {
    accessorKey: "riskAssessment",
    header: "Risk Assessment",
    cell: ({ row }) => row.getValue("riskAssessment"),
    size: 130,
  },
  {
    accessorKey: "complianceStatus",
    header: "Compliance",
    cell: ({ row }) => row.getValue("complianceStatus"),
    size: 100,
  },
  {
    accessorKey: "lastModified",
    header: "Last Modified",
    cell: ({ row }) => row.getValue("lastModified"),
    size: 120,
  },
  {
    accessorKey: "createdBy",
    header: "Created By",
    cell: ({ row }) => row.getValue("createdBy"),
    size: 120,
  },
  {
    accessorKey: "createdOn",
    header: "Created On",
    cell: ({ row }) => row.getValue("createdOn"),
    size: 100,
  },
  {
    accessorKey: "version",
    header: "Version",
    cell: ({ row }) => row.getValue("version"),
    size: 80,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => row.getValue("status"),
    size: 100,
  },
  {
    accessorKey: "conductivity",
    header: "Conductivity (mS/cm²)",
    cell: (cell) => (
      <EditableCell
        {...cell}
        renderInput={(props) => (
          <input
            type="number"
            step="0.01"
            autoFocus
            {...props}
            value={props.value as string}
          />
        )}
      />
    ),
    size: 120,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "isolationDate",
    header: "Isolation Date",
    cell: ({ row }) => row.getValue("isolationDate"),
    size: 110,
  },
  {
    accessorKey: "harvestDate",
    header: "Harvest Date",
    cell: ({ row }) => row.getValue("harvestDate"),
    size: 110,
  },
  {
    accessorKey: "expiryDate",
    header: "Expiry Date",
    cell: ({ row }) => row.getValue("expiryDate"),
    size: 110,
  },
  {
    accessorKey: "testDate",
    header: "Test Date",
    cell: ({ row }) => row.getValue("testDate"),
    size: 110,
  },
  {
    accessorKey: "certificationDate",
    header: "Cert Date",
    cell: ({ row }) => row.getValue("certificationDate"),
    size: 110,
  },
  {
    accessorKey: "density",
    header: "Density (g/mL)",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInput0001} />,
    size: 100,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "viscosity",
    header: "Viscosity (cP)",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInput01} />,
    size: 100,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "turbidity",
    header: "Turbidity (NTU)",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInput01} />,
    size: 110,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "colorValue",
    header: "Color (EBC)",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInputDefault} />,
    size: 90,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "clarityIndex",
    header: "Clarity Index",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInput01} />,
    size: 100,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "sedimentLevel",
    header: "Sediment (mg/L)",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInput01} />,
    size: 110,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "foamStability",
    header: "Foam Stability",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInputDefault} />,
    size: 110,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "yieldRate",
    header: "Yield Rate (%)",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInput01} />,
    size: 100,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "efficiency",
    header: "Efficiency (%)",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInput01} />,
    size: 100,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "potency",
    header: "Potency (U/mL)",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInput001} />,
    size: 100,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "concentration",
    header: "Conc (mg/mL)",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInput01} />,
    size: 100,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "dilutionFactor",
    header: "Dilution",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInputDefault} />,
    size: 80,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "volumeMl",
    header: "Volume (mL)",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInputDefault} />,
    size: 100,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "weightGrams",
    header: "Weight (g)",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInput001} />,
    size: 90,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "moistureContent",
    header: "Moisture (%)",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInput01} />,
    size: 100,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "ashContent",
    header: "Ash (%)",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInput01} />,
    size: 80,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "proteinContent",
    header: "Protein (%)",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInput01} />,
    size: 90,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "carbContent",
    header: "Carbs (%)",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInput01} />,
    size: 90,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "fatContent",
    header: "Fat (%)",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInput01} />,
    size: 80,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "fiberContent",
    header: "Fiber (%)",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInput01} />,
    size: 80,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "saltContent",
    header: "Salt (g/L)",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInput01} />,
    size: 90,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "sugarContent",
    header: "Sugar (g/L)",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInput01} />,
    size: 90,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "alcoholContent",
    header: "Alcohol (%)",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInput01} />,
    size: 90,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "acidityLevel",
    header: "Acidity",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInput001} />,
    size: 80,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "bitterLevel",
    header: "Bitterness (IBU)",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInputDefault} />,
    size: 110,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "aromaScore",
    header: "Aroma",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInputDefault} />,
    size: 70,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "flavorScore",
    header: "Flavor",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInputDefault} />,
    size: 70,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "textureScore",
    header: "Texture",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInputDefault} />,
    size: 70,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "appearanceScore",
    header: "Appearance",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInputDefault} />,
    size: 90,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "overallScore",
    header: "Overall",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInputDefault} />,
    size: 70,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "sampleCode",
    header: "Sample Code",
    cell: ({ row }) => row.getValue("sampleCode"),
    size: 100,
  },
  {
    accessorKey: "lotNumber",
    header: "Lot #",
    cell: ({ row }) => row.getValue("lotNumber"),
    size: 80,
  },
  {
    accessorKey: "serialNumber",
    header: "Serial #",
    cell: ({ row }) => row.getValue("serialNumber"),
    size: 90,
  },
  {
    accessorKey: "catalogNumber",
    header: "Catalog #",
    cell: ({ row }) => row.getValue("catalogNumber"),
    size: 90,
  },
  {
    accessorKey: "vendorCode",
    header: "Vendor Code",
    cell: ({ row }) => row.getValue("vendorCode"),
    size: 100,
  },
  {
    accessorKey: "supplierName",
    header: "Supplier",
    cell: ({ row }) => row.getValue("supplierName"),
    size: 100,
  },
  {
    accessorKey: "manufacturerCode",
    header: "Mfg Code",
    cell: ({ row }) => row.getValue("manufacturerCode"),
    size: 90,
  },
  {
    accessorKey: "originCountry",
    header: "Origin",
    cell: ({ row }) => row.getValue("originCountry"),
    size: 80,
  },
  {
    accessorKey: "certificationCode",
    header: "Cert Code",
    cell: ({ row }) => row.getValue("certificationCode"),
    size: 90,
  },
  {
    accessorKey: "analysisMethod",
    header: "Method",
    cell: ({ row }) => row.getValue("analysisMethod"),
    size: 90,
  },
  {
    accessorKey: "testProtocol",
    header: "Protocol",
    cell: ({ row }) => row.getValue("testProtocol"),
    size: 90,
  },
  {
    accessorKey: "approvalStatus",
    header: "Approval",
    cell: ({ row }) => row.getValue("approvalStatus"),
    size: 90,
  },
  {
    accessorKey: "reviewStatus",
    header: "Review",
    cell: ({ row }) => row.getValue("reviewStatus"),
    size: 80,
  },
  {
    accessorKey: "auditDate",
    header: "Audit Date",
    cell: ({ row }) => row.getValue("auditDate"),
    size: 100,
  },
  {
    accessorKey: "inspectionDate",
    header: "Inspect Date",
    cell: ({ row }) => row.getValue("inspectionDate"),
    size: 100,
  },
];
