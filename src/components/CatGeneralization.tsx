import { useEffect, useState } from "react";
import Item from "./Item";
import useItemStore from "./ItemStore";

interface NumGenProps {
  privacyCol: number | undefined;
  column: number | undefined;
  rows: string[][];
  setRows: (rows: string[][]) => void;
  clearColType: () => void;
}

const CatGeneralization = ({
  column,
  rows,
  privacyCol,
  setRows,
  clearColType,
}: NumGenProps) => {
  const [privacyLevels, setPrivacyLevels] = useState<string[] | undefined>(
    undefined
  );
  const { getHierarchyJson, loadData } = useItemStore((state) => ({
    getHierarchyJson: state.getHierarchyJson,
    loadData: state.loadData,
  }));

  useEffect(() => {
    if (privacyCol === undefined) return;
    const privacyLevels = new Set<string>();
    for (let i = 0; i < rows.length; i++) {
      privacyLevels.add(rows[i][privacyCol]);
    }
    // sort the privacy levels
    const sortedLevels = Array.from(privacyLevels).sort();
    setPrivacyLevels(sortedLevels);
  }, [privacyCol, rows]);

  useEffect(() => {
    loadData();
  }, []);

  if (column === undefined)
    return (
      <div className="alert alert-error">Please select a column first</div>
    );
  if (privacyCol === undefined)
    return (
      <div className="alert alert-error">
        Please select a privacy column first
      </div>
    );

  const generalizeColumn = () => {
    if (!privacyLevels) return;
    const hierarchy = getHierarchyJson(1);
    console.log(hierarchy);

    const output = [];
    for (let i = 0; i < rows.length; i++) {
      const invalidRows = [];
      const value = hierarchy[rows[i][column]];
      if (value === undefined) {
        invalidRows.push(i);
        output.push(rows[i]);
        continue;
      }
      rows[i][column] = value[rows[i][privacyCol]];
      output.push(rows[i]);
    }
    setRows(output);
    clearColType();
  };

  return (
    <div className="mt-2">
      <div>Set hierarchy of Data</div>
      <Item itemId={1} />
      <button
        className="btn btn-sm btn-secondary"
        onClick={() => generalizeColumn()}
      >
        Categorize Data
      </button>
    </div>
  );
};

export default CatGeneralization;
