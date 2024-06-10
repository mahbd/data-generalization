import { useEffect, useState } from "react";

interface NumGenProps {
  privacyCol: number | undefined;
  column: number | undefined;
  rows: string[][];
  setRows: (rows: string[][]) => void;
  clearColType: () => void;
}

const NumericGeneralization = ({
  column,
  rows,
  privacyCol,
  setRows,
  clearColType,
}: NumGenProps) => {
  const [privacyLevels, setPrivacyLevels] = useState<string[] | undefined>(
    undefined
  );

  useEffect(() => {
    if (privacyCol === undefined) return;
    const privacyLevels = new Set<string>();
    for (let i = 0; i < rows.length; i++) {
      if (rows[i][privacyCol].length < 2) continue;
      privacyLevels.add(rows[i][privacyCol]);
    }
    // sort the privacy levels
    const sortedLevels = Array.from(privacyLevels).sort();
    setPrivacyLevels(sortedLevels);
  }, [privacyCol, rows]);

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
    const intervals: { [key: string]: number } = {};
    for (let i = 0; i < privacyLevels.length; i++) {
      const input = document.getElementById(
        `${privacyLevels[i]}-interval`
      ) as HTMLInputElement;
      if (!input) return;
      intervals[privacyLevels[i]] = parseInt(input.value);
    }

    const output = [];
    for (let i = 0; i < rows.length; i++) {
      const invalidRows = [];
      const value = parseInt(rows[i][column]);
      if (isNaN(value)) {
        invalidRows.push(i);
        continue;
      }

      console.log(intervals);

      const range = intervals[rows[i][privacyCol]];
      const lowerRange = Math.floor(value / range) * range;
      const upperRange = lowerRange + range;
      rows[i][column] = `${lowerRange}-${upperRange}`;
      output.push(rows[i]);
    }
    setRows(output);
    clearColType();
  };

  return (
    <div>
      <div id="levels-info">
        {privacyLevels &&
          privacyLevels.map((level, i) => (
            <div className="flex gap-5 mt-5" key={i}>
              <label>{level} interval</label>
              <input
                id={`${level}-interval`}
                type="number"
                className="input input-md input-primary"
              />
            </div>
          ))}
      </div>
      <div className="flex gap-5">
        <button className="btn btn-primary mt-5" onClick={generalizeColumn}>
          Generalize Column
        </button>
      </div>
    </div>
  );
};

export default NumericGeneralization;
