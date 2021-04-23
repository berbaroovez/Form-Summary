import React, { FC, Dispatch, SetStateAction } from "react";
import styled from "styled-components";
interface LayoutProps {
  currentStep: number;
  setCurrentStep: Dispatch<SetStateAction<number>>;
}
const Layout: FC<LayoutProps> = ({ children, currentStep, setCurrentStep }) => {
  return (
    <LayoutWrapper>
      {currentStep === 3 ? (
        <EditorButton
          onClick={() => {
            setCurrentStep(2);
          }}
        >
          Back to Editor
        </EditorButton>
      ) : null}

      <ResetWrapper>
        <ResetButton
          onClick={() => {
            localStorage.clear();
            setCurrentStep(1);
          }}
        >
          Reset
        </ResetButton>
        <p>This button will wipe all the data and let you start fresh</p>
      </ResetWrapper>
      {children}
    </LayoutWrapper>
  );
};

const LayoutWrapper = styled.div`
  position: relative;
  height: 100vh;
  /* background: blue; */
  display: grid;
  justify-content: center;
  align-content: center;
`;

const ResetButton = styled.button`
  &:hover {
    background: hsl(5, 67%, 56%);
  }
`;

const EditorButton = styled.button`
  position: absolute;
  top: 50px;
  left: 50px;
  width: auto;
`;
const ResetWrapper = styled.div`
  position: absolute;
  top: 50px;
  right: 50px;
  text-align: right;
`;

export default Layout;
