import { ChangeEvent } from "react";

interface DataFileInputProps {
  dataFile: File | undefined;
  handleFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
}
const DataFileInput = ({ dataFile, handleFileChange }: DataFileInputProps) => {
  return (
    <div
      id="data-file-section"
      className={`flex items-center justify-center h-screen ${
        dataFile?.size ? "hidden" : ""
      }`}
    >
      <div>
        <input
          onChange={handleFileChange}
          type="file"
          accept=".csv"
          className="block w-full input file:p-2 file:rounded-xl file:border-0 cursor-pointer"
        />
      </div>
    </div>
  );
};

export default DataFileInput;
