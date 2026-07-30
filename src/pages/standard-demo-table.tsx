import type { CSSProperties } from "react";
import { columns } from "../columns";
import { Gigatable, themes, useGigatable } from "../gigatable";
import type { PasteResult } from "../gigatable";
import { strains } from "../strains";

export function StandardDemoTable() {
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
    columns,
    data: strains,
    enableColumnResizing: true,
    columnResizeMode: "onChange",
    history: true,
  });

  const handlePasteComplete = (result: PasteResult) => {
    console.log(`Paste completed: ${result.totalChanges} cells changed`);
  };

  return (
    <>
      <div className="mb-3 flex justify-end gap-2">
        <button
          type="button"
          onClick={undo}
          disabled={!canUndo}
          className="inline-flex h-8 items-center rounded-md border border-[#cfd8e5] bg-white px-3 text-xs font-semibold text-[#334155] shadow-sm transition-colors hover:border-[#94a3b8] hover:bg-[#f8fafc] disabled:cursor-not-allowed disabled:opacity-45"
        >
          Undo
        </button>
        <button
          type="button"
          onClick={redo}
          disabled={!canRedo}
          className="inline-flex h-8 items-center rounded-md border border-[#cfd8e5] bg-white px-3 text-xs font-semibold text-[#334155] shadow-sm transition-colors hover:border-[#94a3b8] hover:bg-[#f8fafc] disabled:cursor-not-allowed disabled:opacity-45"
        >
          Redo
        </button>
      </div>
      <div
        className="demo-table-shell"
        style={{ "--gt-table-height": "calc(100vh - 248px)" } as CSSProperties}
      >
        <Gigatable
          theme={themes.light}
          table={table}
          allowCellSelection
          allowRangeSelection
          allowQuickEdit
          allowHistory
          allowPaste
          allowFillHandle
          fillDirection="both"
          allowColumnResizing
          allColumnsEditable
          paste={paste}
          applyFill={applyFill}
          applyHorizontalFill={applyHorizontalFill}
          onPasteComplete={handlePasteComplete}
          undo={undo}
          redo={redo}
        />
      </div>
    </>
  );
}
