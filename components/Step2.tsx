import React, { Dispatch, SetStateAction } from "react";
import XLSX from "xlsx";
import styled from "styled-components";
import { HeaderType } from "../utils/projectInterfaces";
interface Step2Props {
  currentStep: number;
  worksheetHeaders: HeaderType[];
  setWorksheetHeaders: Dispatch<SetStateAction<HeaderType[]>>;
  updateSheetAndCreateObject: () => void;
}

//trying out typing a function without using an arrow function
const Step2: React.FC<Step2Props> = ({
  currentStep,
  worksheetHeaders,
  setWorksheetHeaders,
  updateSheetAndCreateObject,
}) => {
  const onHeaderUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
    //On Change handler for if the info should be hidden
    const updatedHeaders: HeaderType[] = [...worksheetHeaders];

    if (e.target.dataset.idx != null) {
      var headerIndex: number = parseInt(e.target.dataset.idx);

      //updates hidden
      if (e.target.className === "hidden") {
        updatedHeaders[headerIndex].hidden = !updatedHeaders[headerIndex]
          .hidden;
      } else {
        updatedHeaders[headerIndex].value = e.target.value;
      }
    }
    setWorksheetHeaders(updatedHeaders);
  };

  if (currentStep != 2) {
    return null;
  }

  return (
    <HeaderEditorWrapper>
      <Heading>
        <h1>Edit your header names</h1>
        <p>
          Click the checkbox to hide that column from appearing on your order
          cards. Also take a second to rename your longer headers to a short
          more readable name.
        </p>
      </Heading>
      <EditorWrapper>
        {worksheetHeaders.map((Header, idx) => (
          <HeaderRow key={Header.cellName}>
            <input
              id="hidden"
              type="checkbox"
              checked={Header.hidden}
              onChange={onHeaderUpdate}
              className="hidden"
              data-idx={idx}
            />
            <input
              className="value"
              type="text"
              value={Header.value}
              onChange={onHeaderUpdate}
              disabled={Header.hidden}
              data-idx={idx}
            />
          </HeaderRow>
        ))}
      </EditorWrapper>
      <UpdateButton onClick={updateSheetAndCreateObject}>Advance</UpdateButton>
    </HeaderEditorWrapper>
  );
};

const HeaderEditorWrapper = styled.div`
  width: 600px;
  /* margin: 0 auto; */
`;
const Heading = styled.div`
  margin-bottom: 20px;
`;
const EditorWrapper = styled.div`
  display: grid;
  justify-content: center;
`;
const HeaderRow = styled.div`
  input {
    margin-right: 60px;
  }
`;

const UpdateButton = styled.button``;
export default Step2;
