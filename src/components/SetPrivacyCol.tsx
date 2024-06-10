interface SetPrivacyColProps {
  dataFile: File | undefined;
  setPrivacyCol: (col: number) => void;
  privacyCol: number | undefined;
  headers: string[];
}
const SetPrivacyCol = ({
  dataFile,
  setPrivacyCol,
  privacyCol,
  headers,
}: SetPrivacyColProps) => {
  return (
    <div
      id="data-file-section"
      className={`flex items-center justify-center h-screen ${
        dataFile !== undefined && privacyCol === undefined ? "" : "hidden"
      }`}
    >
      <div className="flex flex-col">
        <label>Select Privacy Column</label>
        <select
          onChange={(e) => {
            setPrivacyCol(parseInt(e.target.value));
            e.target.value = "";
          }}
          className="select select-md select-primary"
        >
          <option value={""}>Select Something</option>
          {headers.map((header, i) => (
            <option key={i} value={i}>
              {i} -&gt; {header}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default SetPrivacyCol;
