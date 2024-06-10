import { useState } from "react";

interface Props {
  dataFile: File | undefined;
  headers: string[];
  rows: string[][];
}

const PreviewPanel = ({ dataFile, headers, rows }: Props) => {
  const [showCnt, setShowCnt] = useState<number>(20);

  function downloadCSV(filename: string, data: any[][]) {
    const csv = convertToCSV(data);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function convertToCSV(data: any[][]) {
    const rows = [];
    for (const row of data) {
      const values = [];
      for (const value of row) {
        values.push(`"${value}"`);
      }
      rows.push(values.join(","));
    }
    return rows.join("\n");
  }

  return (
    <div className="bg-base-200">
      {dataFile && (
        <div>
          <div
            className="overflow-x-scroll overflow-y-auto"
            style={{ height: "90vh" }}
          >
            <table className="table table-sm table-pin-rows table-pin-cols">
              <thead>
                <tr>
                  {headers.map((header) => (
                    <th key={header}>{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.slice(0, showCnt).map((row, i) => (
                  <tr key={i}>
                    {row.map((cell, j) => (
                      <td className="whitespace-nowrap" key={j}>
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex">
            <div className="font-bold mt-3 text-secondary">
              Showing only{" "}
              <select
                className="select select-sm select-primary w-auto"
                onChange={(e) => {
                  setShowCnt(parseInt(e.target.value));
                }}
                value={showCnt}
              >
                <option value="20">20</option>
                {rows.length > 20 && (
                  <option value={Math.min(100, rows.length)}>
                    {Math.min(100, rows.length)}
                  </option>
                )}
                {rows.length > 100 && (
                  <option value={Math.min(500, rows.length)}>
                    {Math.min(500, rows.length)}
                  </option>
                )}
                {rows.length > 500 && (
                  <option value={Math.min(5000, rows.length)}>
                    {Math.min(5000, rows.length)}
                  </option>
                )}
                {rows.length > 5000 && (
                  <option value={rows.length}>{rows.length}</option>
                )}
              </select>{" "}
              rows
            </div>
            <button
              className="btn btn-secondary btn-sm mt-3 ms-5"
              onClick={() => {
                const finalData = [headers, ...rows];
                downloadCSV("converted_data.csv", finalData);
              }}
            >
              Download Now
            </button>
          </div>
        </div>
      )}
      {!dataFile && (
        <div className="flex items-center justify-center h-screen">
          <div>
            <h2 className="alert alert-error">
              Data File is not selected yet.
            </h2>
          </div>
        </div>
      )}
    </div>
  );
};

export default PreviewPanel;
