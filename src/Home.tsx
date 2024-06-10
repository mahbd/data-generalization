import DataFileInput from "./components/DataFileInput";
import NumericGeneralization from "./components/NumGeneralization";
import SetPrivacyCol from "./components/SetPrivacyCol";
import { ChangeEvent, useState } from "react";
import PreviewPanel from "./components/Preview";
import CatGeneralization from "./components/CatGeneralization";

export default function Home() {
  const [dataFile, setDataFile] = useState<File | undefined>(undefined);
  const [headers, setHeaders] = useState<string[]>([]);
  const [rows, setRows] = useState<string[][]>([]);
  const [column, setColumn] = useState<number | undefined>(undefined);
  const [privacyCol, setPrivacyCol] = useState<number | undefined>(undefined);
  const [genType, setGenType] = useState<"numeric" | "categorical" | undefined>(
    undefined
  );

  const clearColType = () => {
    (document.getElementById("column-select") as HTMLSelectElement).value = "";
    (document.getElementById("gen-type-select") as HTMLSelectElement).value =
      "";
    setColumn(undefined);
    setGenType(undefined);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];
    setDataFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const lines = content.split("\n");
      const headers = lines[0].split(",");
      setHeaders(headers);
      const rows = lines
        .slice(1)
        .map((line) => line.split(",").map((cell) => cell.trim()));
      rows.filter((row) => row.length > 1);
      setRows(rows);
    };
    reader.readAsText(file);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div>
        <DataFileInput
          dataFile={dataFile}
          handleFileChange={handleFileChange}
        />
        <SetPrivacyCol
          dataFile={dataFile}
          headers={headers}
          privacyCol={privacyCol}
          setPrivacyCol={setPrivacyCol}
        />
        <div className={`${privacyCol !== undefined ? "" : "hidden"} mt-5`}>
          <div className="flex">
            <p>Privacy Column: {privacyCol}</p>
            <button
              className="btn btn-xs btn-error ms-3"
              onClick={() => setPrivacyCol(undefined)}
            >
              Reset
            </button>
          </div>
          <p>Choose columns to generalize.</p>
          <div className="grid grid-cols-2 gap-4 mt-5">
            <div className="flex flex-col">
              <label>Select Column</label>
              <select
                id="column-select"
                onChange={(e) => {
                  setColumn(parseInt(e.target.value));
                }}
                className="select select-md select-primary"
              >
                <option value={""}>Select Column</option>
                {headers.map((header, i) => (
                  <option key={i} value={i}>
                    {i} -&gt; {header}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col">
              <label>Generalization Type</label>
              <select
                id="gen-type-select"
                onChange={(e) => {
                  setGenType(e.target.value as "numeric" | "categorical");
                }}
                className="select select-md select-primary"
              >
                <option value={""}>Select Type</option>
                <option value={"numeric"}>Numeric</option>
                <option value={"categorical"}>Categorical</option>
              </select>
            </div>
          </div>
          {genType === "numeric" && (
            <NumericGeneralization
              column={column}
              rows={rows}
              setRows={setRows}
              privacyCol={privacyCol}
              clearColType={clearColType}
            />
          )}
          {genType === "categorical" && (
            <CatGeneralization
              column={column}
              rows={rows}
              setRows={setRows}
              privacyCol={privacyCol}
              clearColType={clearColType}
            />
          )}
        </div>
      </div>
      <PreviewPanel dataFile={dataFile} headers={headers} rows={rows} />
    </div>
  );
}
