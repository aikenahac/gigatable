import { EditableCell } from "./gigatable";
import type { EditableCellInputProps } from "./gigatable/data-table/editable-cell";
import { Strain } from "./strains";
import { ColumnDef } from "@tanstack/react-table";
import "./gigatable/types/react-table";
import React from "react";

// Memoized input components to prevent re-renders
const TextInput = React.memo(
  ({ value, onChange, onBlur, onKeyDown }: EditableCellInputProps<unknown>) => (
    <input
      type="text"
      autoFocus
      value={value as string}
      onChange={onChange}
      onBlur={onBlur}
      onKeyDown={onKeyDown}
    />
  ),
);
TextInput.displayName = "TextInput";

const NumberInput = React.memo(
  ({
    value,
    onChange,
    onBlur,
    onKeyDown,
    step,
  }: EditableCellInputProps<unknown> & { step?: string | number }) => (
    <input
      type="number"
      autoFocus
      step={step}
      value={value as number}
      onChange={onChange}
      onBlur={onBlur}
      onKeyDown={onKeyDown}
    />
  ),
);
NumberInput.displayName = "NumberInput";

// Wrapper to pass step prop
const createNumberInput = (step?: string | number) => {
  const SteppedNumberInput = React.memo(
    (props: EditableCellInputProps<unknown>) => (
      <NumberInput {...props} step={step} />
    ),
  );
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
  {
    accessorKey: "geneMarker01",
    header: "Gene Marker 01",
    cell: ({ row }) => row.getValue("geneMarker01"),
    size: 120,
  },
  {
    accessorKey: "geneMarker02",
    header: "Gene Marker 02",
    cell: ({ row }) => row.getValue("geneMarker02"),
    size: 120,
  },
  {
    accessorKey: "geneMarker03",
    header: "Gene Marker 03",
    cell: ({ row }) => row.getValue("geneMarker03"),
    size: 120,
  },
  {
    accessorKey: "geneMarker04",
    header: "Gene Marker 04",
    cell: ({ row }) => row.getValue("geneMarker04"),
    size: 120,
  },
  {
    accessorKey: "geneMarker05",
    header: "Gene Marker 05",
    cell: ({ row }) => row.getValue("geneMarker05"),
    size: 120,
  },
  {
    accessorKey: "geneMarker06",
    header: "Gene Marker 06",
    cell: ({ row }) => row.getValue("geneMarker06"),
    size: 120,
  },
  {
    accessorKey: "geneMarker07",
    header: "Gene Marker 07",
    cell: ({ row }) => row.getValue("geneMarker07"),
    size: 120,
  },
  {
    accessorKey: "geneMarker08",
    header: "Gene Marker 08",
    cell: ({ row }) => row.getValue("geneMarker08"),
    size: 120,
  },
  {
    accessorKey: "geneMarker09",
    header: "Gene Marker 09",
    cell: ({ row }) => row.getValue("geneMarker09"),
    size: 120,
  },
  {
    accessorKey: "geneMarker10",
    header: "Gene Marker 10",
    cell: ({ row }) => row.getValue("geneMarker10"),
    size: 120,
  },
  {
    accessorKey: "geneMarker11",
    header: "Gene Marker 11",
    cell: ({ row }) => row.getValue("geneMarker11"),
    size: 120,
  },
  {
    accessorKey: "geneMarker12",
    header: "Gene Marker 12",
    cell: ({ row }) => row.getValue("geneMarker12"),
    size: 120,
  },
  {
    accessorKey: "geneMarker13",
    header: "Gene Marker 13",
    cell: ({ row }) => row.getValue("geneMarker13"),
    size: 120,
  },
  {
    accessorKey: "geneMarker14",
    header: "Gene Marker 14",
    cell: ({ row }) => row.getValue("geneMarker14"),
    size: 120,
  },
  {
    accessorKey: "geneMarker15",
    header: "Gene Marker 15",
    cell: ({ row }) => row.getValue("geneMarker15"),
    size: 120,
  },
  {
    accessorKey: "geneMarker16",
    header: "Gene Marker 16",
    cell: ({ row }) => row.getValue("geneMarker16"),
    size: 120,
  },
  {
    accessorKey: "geneMarker17",
    header: "Gene Marker 17",
    cell: ({ row }) => row.getValue("geneMarker17"),
    size: 120,
  },
  {
    accessorKey: "geneMarker18",
    header: "Gene Marker 18",
    cell: ({ row }) => row.getValue("geneMarker18"),
    size: 120,
  },
  {
    accessorKey: "geneMarker19",
    header: "Gene Marker 19",
    cell: ({ row }) => row.getValue("geneMarker19"),
    size: 120,
  },
  {
    accessorKey: "geneMarker20",
    header: "Gene Marker 20",
    cell: ({ row }) => row.getValue("geneMarker20"),
    size: 120,
  },
  {
    accessorKey: "geneCopyNumber01",
    header: "Gene Copy # 01",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInputDefault} />,
    size: 120,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "geneCopyNumber02",
    header: "Gene Copy # 02",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInputDefault} />,
    size: 120,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "geneCopyNumber03",
    header: "Gene Copy # 03",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInputDefault} />,
    size: 120,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "geneCopyNumber04",
    header: "Gene Copy # 04",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInputDefault} />,
    size: 120,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "geneCopyNumber05",
    header: "Gene Copy # 05",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInputDefault} />,
    size: 120,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "geneCopyNumber06",
    header: "Gene Copy # 06",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInputDefault} />,
    size: 120,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "geneCopyNumber07",
    header: "Gene Copy # 07",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInputDefault} />,
    size: 120,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "geneCopyNumber08",
    header: "Gene Copy # 08",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInputDefault} />,
    size: 120,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "geneCopyNumber09",
    header: "Gene Copy # 09",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInputDefault} />,
    size: 120,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "geneCopyNumber10",
    header: "Gene Copy # 10",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInputDefault} />,
    size: 120,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "geneCopyNumber11",
    header: "Gene Copy # 11",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInputDefault} />,
    size: 120,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "geneCopyNumber12",
    header: "Gene Copy # 12",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInputDefault} />,
    size: 120,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "geneCopyNumber13",
    header: "Gene Copy # 13",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInputDefault} />,
    size: 120,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "geneCopyNumber14",
    header: "Gene Copy # 14",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInputDefault} />,
    size: 120,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "geneCopyNumber15",
    header: "Gene Copy # 15",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInputDefault} />,
    size: 120,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "geneCopyNumber16",
    header: "Gene Copy # 16",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInputDefault} />,
    size: 120,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "geneCopyNumber17",
    header: "Gene Copy # 17",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInputDefault} />,
    size: 120,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "geneCopyNumber18",
    header: "Gene Copy # 18",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInputDefault} />,
    size: 120,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "geneCopyNumber19",
    header: "Gene Copy # 19",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInputDefault} />,
    size: 120,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "geneCopyNumber20",
    header: "Gene Copy # 20",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInputDefault} />,
    size: 120,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "expressionLevel01",
    header: "Expression Level 01",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInput001} />,
    size: 130,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "expressionLevel02",
    header: "Expression Level 02",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInput001} />,
    size: 130,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "expressionLevel03",
    header: "Expression Level 03",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInput001} />,
    size: 130,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "expressionLevel04",
    header: "Expression Level 04",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInput001} />,
    size: 130,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "expressionLevel05",
    header: "Expression Level 05",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInput001} />,
    size: 130,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "expressionLevel06",
    header: "Expression Level 06",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInput001} />,
    size: 130,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "expressionLevel07",
    header: "Expression Level 07",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInput001} />,
    size: 130,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "expressionLevel08",
    header: "Expression Level 08",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInput001} />,
    size: 130,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "expressionLevel09",
    header: "Expression Level 09",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInput001} />,
    size: 130,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "expressionLevel10",
    header: "Expression Level 10",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInput001} />,
    size: 130,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "expressionLevel11",
    header: "Expression Level 11",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInput001} />,
    size: 130,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "expressionLevel12",
    header: "Expression Level 12",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInput001} />,
    size: 130,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "expressionLevel13",
    header: "Expression Level 13",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInput001} />,
    size: 130,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "expressionLevel14",
    header: "Expression Level 14",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInput001} />,
    size: 130,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "expressionLevel15",
    header: "Expression Level 15",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInput001} />,
    size: 130,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "expressionLevel16",
    header: "Expression Level 16",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInput001} />,
    size: 130,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "expressionLevel17",
    header: "Expression Level 17",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInput001} />,
    size: 130,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "expressionLevel18",
    header: "Expression Level 18",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInput001} />,
    size: 130,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "expressionLevel19",
    header: "Expression Level 19",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInput001} />,
    size: 130,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "expressionLevel20",
    header: "Expression Level 20",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInput001} />,
    size: 130,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "enzymeActivityUml01",
    header: "Enzyme U/mL 01",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInput001} />,
    size: 120,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "enzymeActivityUml02",
    header: "Enzyme U/mL 02",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInput001} />,
    size: 120,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "enzymeActivityUml03",
    header: "Enzyme U/mL 03",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInput001} />,
    size: 120,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "enzymeActivityUml04",
    header: "Enzyme U/mL 04",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInput001} />,
    size: 120,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "enzymeActivityUml05",
    header: "Enzyme U/mL 05",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInput001} />,
    size: 120,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "enzymeActivityUml06",
    header: "Enzyme U/mL 06",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInput001} />,
    size: 120,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "enzymeActivityUml07",
    header: "Enzyme U/mL 07",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInput001} />,
    size: 120,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "enzymeActivityUml08",
    header: "Enzyme U/mL 08",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInput001} />,
    size: 120,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "enzymeActivityUml09",
    header: "Enzyme U/mL 09",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInput001} />,
    size: 120,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "enzymeActivityUml10",
    header: "Enzyme U/mL 10",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInput001} />,
    size: 120,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "enzymeActivityUml11",
    header: "Enzyme U/mL 11",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInput001} />,
    size: 120,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "enzymeActivityUml12",
    header: "Enzyme U/mL 12",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInput001} />,
    size: 120,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "enzymeActivityUml13",
    header: "Enzyme U/mL 13",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInput001} />,
    size: 120,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "enzymeActivityUml14",
    header: "Enzyme U/mL 14",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInput001} />,
    size: 120,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "enzymeActivityUml15",
    header: "Enzyme U/mL 15",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInput001} />,
    size: 120,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "enzymeActivityUml16",
    header: "Enzyme U/mL 16",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInput001} />,
    size: 120,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "enzymeActivityUml17",
    header: "Enzyme U/mL 17",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInput001} />,
    size: 120,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "enzymeActivityUml18",
    header: "Enzyme U/mL 18",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInput001} />,
    size: 120,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "enzymeActivityUml19",
    header: "Enzyme U/mL 19",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInput001} />,
    size: 120,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "enzymeActivityUml20",
    header: "Enzyme U/mL 20",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInput001} />,
    size: 120,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "metaboliteMgL01",
    header: "Metabolite mg/L 01",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInput01} />,
    size: 130,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "metaboliteMgL02",
    header: "Metabolite mg/L 02",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInput01} />,
    size: 130,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "metaboliteMgL03",
    header: "Metabolite mg/L 03",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInput01} />,
    size: 130,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "metaboliteMgL04",
    header: "Metabolite mg/L 04",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInput01} />,
    size: 130,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "metaboliteMgL05",
    header: "Metabolite mg/L 05",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInput01} />,
    size: 130,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "metaboliteMgL06",
    header: "Metabolite mg/L 06",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInput01} />,
    size: 130,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "metaboliteMgL07",
    header: "Metabolite mg/L 07",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInput01} />,
    size: 130,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "metaboliteMgL08",
    header: "Metabolite mg/L 08",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInput01} />,
    size: 130,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "metaboliteMgL09",
    header: "Metabolite mg/L 09",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInput01} />,
    size: 130,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "metaboliteMgL10",
    header: "Metabolite mg/L 10",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInput01} />,
    size: 130,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "metaboliteMgL11",
    header: "Metabolite mg/L 11",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInput01} />,
    size: 130,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "metaboliteMgL12",
    header: "Metabolite mg/L 12",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInput01} />,
    size: 130,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "metaboliteMgL13",
    header: "Metabolite mg/L 13",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInput01} />,
    size: 130,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "metaboliteMgL14",
    header: "Metabolite mg/L 14",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInput01} />,
    size: 130,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "metaboliteMgL15",
    header: "Metabolite mg/L 15",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInput01} />,
    size: 130,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "metaboliteMgL16",
    header: "Metabolite mg/L 16",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInput01} />,
    size: 130,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "metaboliteMgL17",
    header: "Metabolite mg/L 17",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInput01} />,
    size: 130,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "metaboliteMgL18",
    header: "Metabolite mg/L 18",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInput01} />,
    size: 130,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "metaboliteMgL19",
    header: "Metabolite mg/L 19",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInput01} />,
    size: 130,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "metaboliteMgL20",
    header: "Metabolite mg/L 20",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInput01} />,
    size: 130,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "cultureTempC01",
    header: "Culture Temp C 01",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInput01} />,
    size: 120,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "cultureTempC02",
    header: "Culture Temp C 02",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInput01} />,
    size: 120,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "cultureTempC03",
    header: "Culture Temp C 03",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInput01} />,
    size: 120,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "cultureTempC04",
    header: "Culture Temp C 04",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInput01} />,
    size: 120,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "cultureTempC05",
    header: "Culture Temp C 05",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInput01} />,
    size: 120,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "cultureTempC06",
    header: "Culture Temp C 06",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInput01} />,
    size: 120,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "cultureTempC07",
    header: "Culture Temp C 07",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInput01} />,
    size: 120,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "cultureTempC08",
    header: "Culture Temp C 08",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInput01} />,
    size: 120,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "cultureTempC09",
    header: "Culture Temp C 09",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInput01} />,
    size: 120,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "cultureTempC10",
    header: "Culture Temp C 10",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInput01} />,
    size: 120,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "cultureTempC11",
    header: "Culture Temp C 11",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInput01} />,
    size: 120,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "cultureTempC12",
    header: "Culture Temp C 12",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInput01} />,
    size: 120,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "cultureTempC13",
    header: "Culture Temp C 13",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInput01} />,
    size: 120,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "cultureTempC14",
    header: "Culture Temp C 14",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInput01} />,
    size: 120,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "cultureTempC15",
    header: "Culture Temp C 15",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInput01} />,
    size: 120,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "cultureTempC16",
    header: "Culture Temp C 16",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInput01} />,
    size: 120,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "cultureTempC17",
    header: "Culture Temp C 17",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInput01} />,
    size: 120,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "cultureTempC18",
    header: "Culture Temp C 18",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInput01} />,
    size: 120,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "cultureTempC19",
    header: "Culture Temp C 19",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInput01} />,
    size: 120,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "cultureTempC20",
    header: "Culture Temp C 20",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInput01} />,
    size: 120,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "culturePh01",
    header: "Culture pH 01",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInput01} />,
    size: 100,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "culturePh02",
    header: "Culture pH 02",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInput01} />,
    size: 100,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "culturePh03",
    header: "Culture pH 03",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInput01} />,
    size: 100,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "culturePh04",
    header: "Culture pH 04",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInput01} />,
    size: 100,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "culturePh05",
    header: "Culture pH 05",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInput01} />,
    size: 100,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "culturePh06",
    header: "Culture pH 06",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInput01} />,
    size: 100,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "culturePh07",
    header: "Culture pH 07",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInput01} />,
    size: 100,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "culturePh08",
    header: "Culture pH 08",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInput01} />,
    size: 100,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "culturePh09",
    header: "Culture pH 09",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInput01} />,
    size: 100,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "culturePh10",
    header: "Culture pH 10",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInput01} />,
    size: 100,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "culturePh11",
    header: "Culture pH 11",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInput01} />,
    size: 100,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "culturePh12",
    header: "Culture pH 12",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInput01} />,
    size: 100,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "culturePh13",
    header: "Culture pH 13",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInput01} />,
    size: 100,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "culturePh14",
    header: "Culture pH 14",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInput01} />,
    size: 100,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "culturePh15",
    header: "Culture pH 15",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInput01} />,
    size: 100,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "culturePh16",
    header: "Culture pH 16",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInput01} />,
    size: 100,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "culturePh17",
    header: "Culture pH 17",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInput01} />,
    size: 100,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "culturePh18",
    header: "Culture pH 18",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInput01} />,
    size: 100,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "culturePh19",
    header: "Culture pH 19",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInput01} />,
    size: 100,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "culturePh20",
    header: "Culture pH 20",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInput01} />,
    size: 100,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "assayResult01",
    header: "Assay Result 01",
    cell: ({ row }) => row.getValue("assayResult01"),
    size: 120,
  },
  {
    accessorKey: "assayResult02",
    header: "Assay Result 02",
    cell: ({ row }) => row.getValue("assayResult02"),
    size: 120,
  },
  {
    accessorKey: "assayResult03",
    header: "Assay Result 03",
    cell: ({ row }) => row.getValue("assayResult03"),
    size: 120,
  },
  {
    accessorKey: "assayResult04",
    header: "Assay Result 04",
    cell: ({ row }) => row.getValue("assayResult04"),
    size: 120,
  },
  {
    accessorKey: "assayResult05",
    header: "Assay Result 05",
    cell: ({ row }) => row.getValue("assayResult05"),
    size: 120,
  },
  {
    accessorKey: "assayResult06",
    header: "Assay Result 06",
    cell: ({ row }) => row.getValue("assayResult06"),
    size: 120,
  },
  {
    accessorKey: "assayResult07",
    header: "Assay Result 07",
    cell: ({ row }) => row.getValue("assayResult07"),
    size: 120,
  },
  {
    accessorKey: "assayResult08",
    header: "Assay Result 08",
    cell: ({ row }) => row.getValue("assayResult08"),
    size: 120,
  },
  {
    accessorKey: "assayResult09",
    header: "Assay Result 09",
    cell: ({ row }) => row.getValue("assayResult09"),
    size: 120,
  },
  {
    accessorKey: "assayResult10",
    header: "Assay Result 10",
    cell: ({ row }) => row.getValue("assayResult10"),
    size: 120,
  },
  {
    accessorKey: "assayResult11",
    header: "Assay Result 11",
    cell: ({ row }) => row.getValue("assayResult11"),
    size: 120,
  },
  {
    accessorKey: "assayResult12",
    header: "Assay Result 12",
    cell: ({ row }) => row.getValue("assayResult12"),
    size: 120,
  },
  {
    accessorKey: "assayResult13",
    header: "Assay Result 13",
    cell: ({ row }) => row.getValue("assayResult13"),
    size: 120,
  },
  {
    accessorKey: "assayResult14",
    header: "Assay Result 14",
    cell: ({ row }) => row.getValue("assayResult14"),
    size: 120,
  },
  {
    accessorKey: "assayResult15",
    header: "Assay Result 15",
    cell: ({ row }) => row.getValue("assayResult15"),
    size: 120,
  },
  {
    accessorKey: "assayResult16",
    header: "Assay Result 16",
    cell: ({ row }) => row.getValue("assayResult16"),
    size: 120,
  },
  {
    accessorKey: "assayResult17",
    header: "Assay Result 17",
    cell: ({ row }) => row.getValue("assayResult17"),
    size: 120,
  },
  {
    accessorKey: "assayResult18",
    header: "Assay Result 18",
    cell: ({ row }) => row.getValue("assayResult18"),
    size: 120,
  },
  {
    accessorKey: "assayResult19",
    header: "Assay Result 19",
    cell: ({ row }) => row.getValue("assayResult19"),
    size: 120,
  },
  {
    accessorKey: "assayResult20",
    header: "Assay Result 20",
    cell: ({ row }) => row.getValue("assayResult20"),
    size: 120,
  },
  {
    accessorKey: "qcScore01",
    header: "QC Score 01",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInput01} />,
    size: 100,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "qcScore02",
    header: "QC Score 02",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInput01} />,
    size: 100,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "qcScore03",
    header: "QC Score 03",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInput01} />,
    size: 100,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "qcScore04",
    header: "QC Score 04",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInput01} />,
    size: 100,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "qcScore05",
    header: "QC Score 05",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInput01} />,
    size: 100,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "qcScore06",
    header: "QC Score 06",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInput01} />,
    size: 100,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "qcScore07",
    header: "QC Score 07",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInput01} />,
    size: 100,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "qcScore08",
    header: "QC Score 08",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInput01} />,
    size: 100,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "qcScore09",
    header: "QC Score 09",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInput01} />,
    size: 100,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "qcScore10",
    header: "QC Score 10",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInput01} />,
    size: 100,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "qcScore11",
    header: "QC Score 11",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInput01} />,
    size: 100,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "qcScore12",
    header: "QC Score 12",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInput01} />,
    size: 100,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "qcScore13",
    header: "QC Score 13",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInput01} />,
    size: 100,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "qcScore14",
    header: "QC Score 14",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInput01} />,
    size: 100,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "qcScore15",
    header: "QC Score 15",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInput01} />,
    size: 100,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "qcScore16",
    header: "QC Score 16",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInput01} />,
    size: 100,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "qcScore17",
    header: "QC Score 17",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInput01} />,
    size: 100,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "qcScore18",
    header: "QC Score 18",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInput01} />,
    size: 100,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "qcScore19",
    header: "QC Score 19",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInput01} />,
    size: 100,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "qcScore20",
    header: "QC Score 20",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInput01} />,
    size: 100,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "stabilityIndex01",
    header: "Stability Index 01",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInput0001} />,
    size: 120,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "stabilityIndex02",
    header: "Stability Index 02",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInput0001} />,
    size: 120,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "stabilityIndex03",
    header: "Stability Index 03",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInput0001} />,
    size: 120,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "stabilityIndex04",
    header: "Stability Index 04",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInput0001} />,
    size: 120,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "stabilityIndex05",
    header: "Stability Index 05",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInput0001} />,
    size: 120,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "stabilityIndex06",
    header: "Stability Index 06",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInput0001} />,
    size: 120,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "stabilityIndex07",
    header: "Stability Index 07",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInput0001} />,
    size: 120,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "stabilityIndex08",
    header: "Stability Index 08",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInput0001} />,
    size: 120,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "stabilityIndex09",
    header: "Stability Index 09",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInput0001} />,
    size: 120,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "stabilityIndex10",
    header: "Stability Index 10",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInput0001} />,
    size: 120,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "stabilityIndex11",
    header: "Stability Index 11",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInput0001} />,
    size: 120,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "stabilityIndex12",
    header: "Stability Index 12",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInput0001} />,
    size: 120,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "stabilityIndex13",
    header: "Stability Index 13",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInput0001} />,
    size: 120,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "stabilityIndex14",
    header: "Stability Index 14",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInput0001} />,
    size: 120,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "stabilityIndex15",
    header: "Stability Index 15",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInput0001} />,
    size: 120,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "stabilityIndex16",
    header: "Stability Index 16",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInput0001} />,
    size: 120,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "stabilityIndex17",
    header: "Stability Index 17",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInput0001} />,
    size: 120,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "stabilityIndex18",
    header: "Stability Index 18",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInput0001} />,
    size: 120,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "stabilityIndex19",
    header: "Stability Index 19",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInput0001} />,
    size: 120,
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "stabilityIndex20",
    header: "Stability Index 20",
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInput0001} />,
    size: 120,
    meta: {
      editable: true,
    },
  },
];
