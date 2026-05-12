import { Gigatable, useGigatable, PasteResult, themes } from "./gigatable";
import { columns } from "./columns";
import { strains } from "./strains";

export default function App() {
  const { table, paste, applyFill, undo, redo } = useGigatable({
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
      <Gigatable
        theme={themes.light}
        table={table}
        allowCellSelection
        allowRangeSelection
        allowHistory
        allowPaste
        allowFillHandle
        allColumnsEditable
        paste={paste}
        applyFill={applyFill}
        onPasteComplete={handlePasteComplete}
        undo={undo}
        redo={redo}
      />
    </div>
  );
}
