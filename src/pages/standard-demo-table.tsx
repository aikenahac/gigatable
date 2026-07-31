import type { ColumnDef } from "@tanstack/react-table";
import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
  type CSSProperties,
} from "react";
import { columns } from "../columns";
import { Gigatable, themes, useGigatable } from "../gigatable";
import { useSiteTheme } from "../site/theme";
import { strains, type Strain } from "../strains";

export const REGISTRY_SIZE_OPTIONS = [
  100, 500, 1_000, 5_000, 10_000, 100_000,
] as const;

export type RegistrySize = (typeof REGISTRY_SIZE_OPTIONS)[number];

export interface RegistryMetrics {
  preparationMs: number | null;
  commitMs: number | null;
  readyMs: number | null;
}

export function buildRegistryRows(size: RegistrySize): Array<Strain> {
  return Array.from({ length: size }, (_, index) => strains[index % strains.length]);
}

export function getRegistryRowId(index: number): string {
  return `registry-${index + 1}`;
}

function formatDuration(value: number | null): string {
  return value === null ? "Measuring…" : `${value.toFixed(1)} ms`;
}

function formatCount(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}

function LiveFpsMetric() {
  const [fps, setFps] = useState<number | null>(null);

  useEffect(() => {
    let animationFrame = 0;
    let frameCount = 0;
    let sampleStartedAt = performance.now();

    const resetSample = () => {
      frameCount = 0;
      sampleStartedAt = performance.now();
    };
    const measureFrame = (now: number) => {
      frameCount += 1;
      const elapsed = now - sampleStartedAt;
      if (elapsed >= 1_000) {
        setFps(Math.round((frameCount * 1_000) / elapsed));
        frameCount = 0;
        sampleStartedAt = now;
      }
      animationFrame = requestAnimationFrame(measureFrame);
    };

    document.addEventListener("visibilitychange", resetSample);
    animationFrame = requestAnimationFrame(measureFrame);
    return () => {
      cancelAnimationFrame(animationFrame);
      document.removeEventListener("visibilitychange", resetSample);
    };
  }, []);

  return (
    <div>
      <strong>{fps === null ? "Measuring…" : `${fps} FPS`}</strong>
      <span>Live FPS</span>
    </div>
  );
}

const registryColumns: Array<ColumnDef<Strain>> = [
  {
    id: "registryId",
    accessorFn: (_row, index) =>
      `BIO-${String(index + 1).padStart(6, "0")}`,
    header: "Registry ID",
    size: 130,
    cell: (cell) => cell.getValue(),
  },
  ...columns.slice(1),
];
export const REGISTRY_COLUMN_COUNT = registryColumns.length;

const initialRows = buildRegistryRows(1_000);

export function BiobankRegistryDemo() {
  const { resolvedTheme } = useSiteTheme();
  const [data, setData] = useState<Array<Strain>>(initialRows);
  const [selectedSize, setSelectedSize] = useState<RegistrySize>(1_000);
  const [metrics, setMetrics] = useState<RegistryMetrics>({
    preparationMs: null,
    commitMs: null,
    readyMs: null,
  });
  const [isTransitionPending, beginTransition] = useTransition();
  const containerRef = useRef<HTMLDivElement>(null);
  const measurementRef = useRef({
    startedAt: 0,
    commitStartedAt: 0,
    preparationMs: 0,
  });

  const {
    table,
    paste,
    applyFill,
    applyHorizontalFill,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useGigatable({
    columns: registryColumns,
    data,
    getRowId: (_row, index) => getRegistryRowId(index),
    enableColumnResizing: true,
    columnResizeMode: "onChange",
    history: true,
  });

  useLayoutEffect(() => {
    const commitAt = performance.now();
    const measurement = measurementRef.current;
    if (!measurement.startedAt) {
      measurement.startedAt = commitAt;
      measurement.commitStartedAt = commitAt;
    }
    const commitMs = commitAt - measurement.commitStartedAt;
    let secondFrame = 0;
    const firstFrame = requestAnimationFrame(() => {
      secondFrame = requestAnimationFrame(() => {
        setMetrics({
          preparationMs: measurement.preparationMs,
          commitMs,
          readyMs: performance.now() - measurement.startedAt,
        });
      });
    });
    return () => {
      cancelAnimationFrame(firstFrame);
      cancelAnimationFrame(secondFrame);
    };
  }, [data]);

  const handleSizeChange = (nextSize: RegistrySize) => {
    const startedAt = performance.now();
    const nextRows = buildRegistryRows(nextSize);
    const preparationMs = performance.now() - startedAt;
    measurementRef.current = {
      startedAt,
      commitStartedAt: performance.now(),
      preparationMs,
    };
    setSelectedSize(nextSize);
    setMetrics({
      preparationMs,
      commitMs: null,
      readyMs: null,
    });
    beginTransition(() => {
      setData(nextRows);
    });
  };

  const metricCards = useMemo(
    () => [
      {
        label: "Data preparation",
        value: formatDuration(metrics.preparationMs),
      },
      { label: "Table commit", value: formatDuration(metrics.commitMs) },
      { label: "Ready", value: formatDuration(metrics.readyMs) },
    ],
    [metrics],
  );

  return (
    <div className="demo-scenario-stack">
      <div className="demo-control-bar">
        <label className="demo-size-control">
          <span>Registry size</span>
          <select
            aria-label="Registry size"
            value={selectedSize}
            onChange={(event) =>
              handleSizeChange(Number(event.target.value) as RegistrySize)
            }
          >
            {REGISTRY_SIZE_OPTIONS.map((size) => (
              <option key={size} value={size}>
                {formatCount(size)} strains
              </option>
            ))}
          </select>
        </label>
        <p className="demo-live-count" aria-live="polite">
          <strong>
            {isTransitionPending
              ? "Preparing registry…"
              : `${formatCount(data.length)} strains loaded`}
          </strong>
          <span>300 biological attributes</span>
        </p>
        <div className="demo-history-actions">
          <button type="button" onClick={undo} disabled={!canUndo}>
            Undo
          </button>
          <button type="button" onClick={redo} disabled={!canRedo}>
            Redo
          </button>
        </div>
      </div>

      <div className="demo-performance-grid" aria-label="Performance indicators">
        {metricCards.map((metric) => (
          <div key={metric.label}>
            <strong>{metric.value}</strong>
            <span>{metric.label}</span>
          </div>
        ))}
        <LiveFpsMetric />
      </div>
      <p className="demo-metric-note">
        Live measurements from this browser and device. Virtualization keeps
        rendering work proportional to the viewport, not the registry size. FPS
        is a rolling browser animation-frame sample and pauses in background tabs.
      </p>

      <div
        className="demo-table-shell"
        style={{ "--gt-table-height": "58vh" } as CSSProperties}
      >
        <Gigatable
          containerRef={containerRef}
          theme={resolvedTheme === "dark" ? themes.giga : themes.light}
          table={table}
          allowCellSelection
          allowRangeSelection
          allowQuickEdit
          allowHistory
          allowPaste
          allowFillHandle
          fillDirection="both"
          allowColumnResizing
          paste={paste}
          applyFill={applyFill}
          applyHorizontalFill={applyHorizontalFill}
          undo={undo}
          redo={redo}
        />
      </div>
    </div>
  );
}

/** Backwards-compatible export for internal imports created before the scenario rename. */
export const StandardDemoTable = BiobankRegistryDemo;
