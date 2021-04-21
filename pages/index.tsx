import React, { useState, useEffect } from "react";
import Step1 from "../components/Step1";
import Step2 from "../components/Step2";
import XLSX from "xlsx";
import { HeaderType } from "../utils/projectInterfaces";
export default function Home() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [worksheet, setWorksheet] = useState<XLSX.WorkSheet>({});
  const [worksheetHeaders, setWorksheetHeaders] = useState<HeaderType[]>([]);
  const [finalWorksheet, setFinalWorkheet] = useState<object>({});

  useEffect(() => {
    if (worksheet) {
      getHeaders();
    }
  }, [worksheet]);
  // useEffect(() => {
  //   if (worksheetHeaders.length > 0) {
  //     console.log("Headers", worksheetHeaders);
  //   }
  // }, [worksheetHeaders]);

  //Save worksheet on upload
  const onFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return; //have to insure the program that files wont be null
    const selectedFile = e.target.files[0];
    var reader = new FileReader();
    reader.onload = (event) => {
      if (!event.target) return;
      var data = event.target.result;
      var workbook = XLSX.read(data, {
        type: "binary",
      });
      setWorksheetHeaders([]); //reseting headers on new file upload
      //get the first worksheet on the file and convert it into our formats
      var firstWorkheet = workbook.SheetNames[0];
      var tempWorksheet: XLSX.WorkSheet = workbook.Sheets[firstWorkheet];

      setWorksheet(tempWorksheet);
    }; //end of file reader

    reader.onerror = (event) => {
      console.log("ERROR", event!.target!.error!.code);
    };
    reader.readAsBinaryString(selectedFile);
    setCurrentStep(2);
  };

  //grabs the first row of the worksheet and creates an array of the column names
  const getHeaders = () => {
    //regular expression pattern for headers
    let re = /([A-Z])+1$/;

    var columnNames: HeaderType[] = [];
    var cells = Object.keys(worksheet);

    for (var i = 0; i < Object.keys(cells).length; i++) {
      //regular expression to check for a pattern of letters and then a 1
      if (re.test(cells[i])) {
        columnNames.push({
          value: worksheet[cells[i]].v,
          cellName: cells[i],
          hidden: false,
        }); //Contails all column names
      }
    }
    setWorksheetHeaders(columnNames);
  };

  return (
    <div>
      <div>{currentStep}</div>
      <button
        onClick={() => {
          setCurrentStep((prevCount) => {
            return prevCount - 1;
          });
        }}
      >
        Go Back
      </button>
      <button
        onClick={() => {
          setCurrentStep((prevCount) => {
            return prevCount + 1;
          });
        }}
      >
        Next
      </button>

      <Step1 currentStep={currentStep} onFileUpload={onFileUpload} />
      <Step2
        currentStep={currentStep}
        worksheet={worksheet}
        worksheetHeaders={worksheetHeaders}
        setWorksheetHeaders={setWorksheetHeaders}
        setFinalWorkheet={setFinalWorkheet}
      />
    </div>
  );
}
