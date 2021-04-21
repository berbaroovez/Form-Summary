import React from "react";
interface Step1Props {
  currentStep: number;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
const Step1: React.FC<Step1Props> = ({ currentStep, onFileUpload }) => {
  if (currentStep != 1) {
    return null;
  }

  return (
    <div>
      <input
        type="file"
        id="fileUploader"
        name="fileUploader"
        accept=".xls, .xlsx"
        onChange={onFileUpload}
      />
    </div>
  );
};

export default Step1;
