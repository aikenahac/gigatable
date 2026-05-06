import { DataTable, useDataTable, PasteResult } from "./data-table";
import { columns } from "./columns";
import { strains } from "./strains";

export default function App() {
  const { table, paste, applyFill, undo, redo } = useDataTable({
    columns,
    data: strains,
    history: true,
  });

  const handlePasteComplete = (result: PasteResult) => {
    console.log(`Paste completed: ${result.totalChanges} cells changed`);
    console.log(JSON.stringify(result.changes));
  };

  return (
    <div className="max-w-full mx-auto py-10">
      <DataTable
        table={table}
        allowCellSelection={true}
        allowRangeSelection={true}
        allowHistory={true}
        allowPaste={true}
        allowFillHandle={true}
        paste={paste}
        applyFill={applyFill}
        onPasteComplete={handlePasteComplete}
        undo={undo}
        redo={redo}
      />
    </div>
  );
}
