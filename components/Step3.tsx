import React, {
  Dispatch,
  SetStateAction,
  FC,
  useState,
  useEffect,
} from "react";
import { GenericObject } from "../utils/projectInterfaces";
import { useHotkeys } from "react-hotkeys-hook";
interface Step3Props {
  currentStep: number;
  finalWorksheet: GenericObject;
  setFinalWorksheet: Dispatch<SetStateAction<GenericObject>>;
}

const Step3: FC<Step3Props> = ({
  currentStep,
  finalWorksheet,
  setFinalWorksheet,
}) => {
  const [currentCardIndex, setCurrentCardIndex] = useState<number>(1);
  const [currentOrder, setCurrentOrder] = useState<GenericObject>({});
  const [orderObjectKeys, setOrderObjectKeys] = useState<string[]>([]);

  useEffect(() => {
    //we do this check because step 3 is loaded on site load so we need to check for updates on fianl worksheet to properly create our state
    if (finalWorksheet.length > 0) {
      setCurrentOrder(finalWorksheet[0]);
      setOrderObjectKeys(Object.keys(finalWorksheet[0]));
    }
  }, [finalWorksheet]);

  useEffect(() => {
    console.log("UPDATED", currentCardIndex);
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
    <div>
      <h1>{currentCardIndex + "/" + 52}</h1>
      {orderObjectKeys.map((key) => {
        return <p>{key + ": " + currentOrder[key]["value"]}</p>;
      })}
      balls
      <button onClick={decrement}>Back</button>
      <button onClick={increment}>Forward</button>
    </div>
  );
};

export default Step3;
