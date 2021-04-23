import React, { useState, useEffect } from "react";
import Step1 from "../components/Step1";
import Step2 from "../components/Step2";
import Step3 from "../components/Step3";
import Layout from "../components/Layout";
import XLSX from "xlsx";
import { HeaderType, GenericObject } from "../utils/projectInterfaces";

//needed this to deal with not knowing the shape of the object that each row of the worksheet is

export default function Home() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [worksheet, setWorksheet] = useState<XLSX.WorkSheet>({});
  const [worksheetHeaders, setWorksheetHeaders] = useState<HeaderType[]>([]);
  const [finalWorksheet, setFinalWorkheet] = useState<GenericObject[]>([]);

  //update worksheet
  useEffect(() => {
    if (Object.keys(worksheet).length != 0) {
      localStorage.setItem(
        "worksheet",
        JSON.stringify(XLSX.utils.sheet_to_json(worksheet))
      );

      //if a worksheet isnt stored in localstorage run the function to get the headers
      if (worksheetHeaders.length === 0) {
        console.log("IN HERE LIKE SWIM");
        getHeaders();
      }
    }
  }, [worksheet]);

  //update worksheetHeaders
  useEffect(() => {
    if (worksheetHeaders.length != 0) {
      localStorage.setItem(
        "worksheetHeaders",
        JSON.stringify(worksheetHeaders)
      );
    }
  }, [worksheetHeaders]);

  useEffect(() => {
    if (finalWorksheet.length != 0) {
      localStorage.setItem("finalWorksheet", JSON.stringify(finalWorksheet));
    }
  }, [finalWorksheet]);

  useEffect(() => {
    console.log("LOADING");
    if (typeof window !== "undefined") {
      try {
        //getting the local storage worksheet and converting from json to sheets
        var string_json = JSON.parse(localStorage.getItem("worksheet") || "{}");
        console.log("TRRUE OR NAH", string_json);
        console.log("Length?", Object.keys(string_json).length);

        // if there is somethign actually in local storage then update worksheet otherwise do nothing
        if (Object.keys(string_json).length != 0) {
          var json_sheet = XLSX.utils.json_to_sheet(string_json);
          setWorksheet(json_sheet);
          setCurrentStep(2);
        }

        //getting the local storage headers and converting from a string back to an array
        var string_headers = JSON.parse(
          localStorage.getItem("worksheetHeaders") || "[]"
        );

        //  console.log("LOCAL STORAGE HEADERS", string_headers);
        if (string_headers.length != 0) {
          console.log("LOCAL STORAGE HEADERS", string_headers);
          setWorksheetHeaders(string_headers);
        }

        var string_finalWorksheet = JSON.parse(
          localStorage.getItem("finalWorksheet") || "[]"
        );

        if (string_finalWorksheet.length != 0) {
          setFinalWorkheet(string_finalWorksheet);
        }
        // setFinalWorkheet(string_object);
      } catch (err) {
        console.log("ERROR", err);
      }
    }
  }, []);

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
          id: i,
          value: worksheet[cells[i]].v,
          cellName: cells[i],
          hidden: false,
        }); //Contails all column names
      }
    }
    setWorksheetHeaders(columnNames);
  };

  const updateSheetAndCreateObject = () => {
    worksheetHeaders.forEach((header) => {
      worksheet[header.cellName] = {
        t: "s" /* type: string */,
        v: header.value /* value */,
      };
    });

    var worksheet_json_object: object[] = XLSX.utils.sheet_to_json(worksheet);

    worksheet_json_object.forEach((row, index) => {
      var tempRow: GenericObject = row;
      tempRow = row;
      worksheetHeaders.forEach((header) => {
        if (tempRow[header.value]) {
          var tempValue = tempRow[header.value];
          tempRow[header.value] = { value: tempValue, hidden: header.hidden };
        }
      });

      // check to see if a order object exists in localstorage so we dont override completed
      if (finalWorksheet.length > 0) {
        tempRow["Completed"] = finalWorksheet[index]["Completed"];
      } else {
        tempRow["Completed"] = false;
      }
    });

    setFinalWorkheet(worksheet_json_object);
    setCurrentStep(3);
  };

  return (
    <Layout currentStep={currentStep} setCurrentStep={setCurrentStep}>
      <div>
        {/* <div>{currentStep}</div>
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
        <button
          onClick={() => {
            console.log("WORKSHEET CHECK", worksheet);
          }}
        >
          Test
        </button> */}

        <Step1 currentStep={currentStep} onFileUpload={onFileUpload} />
        <Step2
          currentStep={currentStep}
          worksheetHeaders={worksheetHeaders}
          setWorksheetHeaders={setWorksheetHeaders}
          updateSheetAndCreateObject={updateSheetAndCreateObject}
        />

        {/* we do this check because we need to wait for finalworksheet to be filled before we load step 3   */}
        {currentStep === 3 ? (
          <Step3
            worksheetHeaders={worksheetHeaders}
            currentStep={currentStep}
            finalWorksheet={finalWorksheet}
            setFinalWorksheet={setFinalWorkheet}
          />
        ) : null}
      </div>
    </Layout>
  );
}
