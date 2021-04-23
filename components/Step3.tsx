import React, {
  Dispatch,
  SetStateAction,
  FC,
  useState,
  useEffect,
} from "react";
import { GenericObject } from "../utils/projectInterfaces";
import { useHotkeys } from "react-hotkeys-hook";
import styled from "styled-components";
interface Step3Props {
  currentStep: number;
  finalWorksheet: GenericObject[];
  setFinalWorksheet: Dispatch<SetStateAction<GenericObject[]>>;
}

const Step3: FC<Step3Props> = ({
  currentStep,
  finalWorksheet,
  setFinalWorksheet,
}) => {
  const [currentCardIndex, setCurrentCardIndex] = useState<number>(0);
  const [currentOrder, setCurrentOrder] = useState<GenericObject>({});
  const [orderObjectKeys, setOrderObjectKeys] = useState<string[]>([]);

  useEffect(() => {
    //we do this check because step 3 is loaded on site load so we need to check for updates on fianl worksheet to properly create our state
    // if (finalWorksheet.length > 0) {
    setCurrentOrder(finalWorksheet[0]);
    setOrderObjectKeys(Object.keys(finalWorksheet[0]));
    // }
    console.log("FINAL WORKSHEET", finalWorksheet.length);
    console.log(typeof finalWorksheet);
  }, []);

  useEffect(() => {
    if (finalWorksheet.length > 0) {
      setCurrentOrder(finalWorksheet[currentCardIndex]);
      setOrderObjectKeys(Object.keys(finalWorksheet[currentCardIndex]));
    }
  }, [currentCardIndex]);

  const increment = () => {
    setCurrentCardIndex((prevAmount) => {
      var newState = prevAmount + 1;

      if (newState === finalWorksheet.length) {
        return 0;
      } else {
        return newState;
      }
    });
    // console.log("increment", currentCardIndex);
  };

  const decrement = () => {
    setCurrentCardIndex((prevAmount) => {
      var newState = prevAmount - 1;

      if (newState == -1) {
        return finalWorksheet.length - 1;
      } else {
        return newState;
      }
    });
  };

  useHotkeys("right", increment);
  useHotkeys("left", decrement);
  if (currentStep != 3) {
    return null;
  }

  return (
    <CardWrapper>
      <div>
        <h1>{currentCardIndex + "/" + 52}</h1>
        {orderObjectKeys.map((key) => {
          if (key === "Completed") {
            return (
              <p id="completed" key={key}>
                Completed:
                <input
                  type="checkbox"
                  checked={currentOrder["Completed"]}
                  onChange={() => {
                    var updateOrders = [...finalWorksheet];
                    updateOrders[currentCardIndex]["Completed"] = !updateOrders[
                      currentCardIndex
                    ]["Completed"];
                    setFinalWorksheet(updateOrders);
                  }}
                />
              </p>
            );
          }
          return (
            <p>
              <span id="key">{key + ": "}</span> {currentOrder[key]["value"]}
            </p>
          );
        })}
      </div>
      <button id="back" onClick={decrement}>
        Back
      </button>
      <button id="next" onClick={increment}>
        Forward
      </button>
    </CardWrapper>
  );
};

const CardWrapper = styled.div`
  position: relative;
  width: 500px;
  height: 300px;

  h1 {
    color: hsl(200, 90%, 55%);
  }
  #key {
    font-weight: bold;
  }
  div {
    background: hsl(0, 0%, 90%);
    width: 500px;
    padding: 20px;
    border-radius: 20px;
  }
  p {
    padding: 0;
    margin: 0;
  }

  #back {
    position: absolute;
    top: 100px;
    left: -200px;
  }

  #next {
    position: absolute;
    top: 100px;
    left: 600px;
  }

  #completed {
    color: hsl(123.17460317460318, 81.11587982832617%, 45.68627450980392%);
    font-weight: bold;
  }
`;

export default Step3;
