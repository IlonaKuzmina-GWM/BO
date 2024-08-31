import { useState, useEffect, RefObject, KeyboardEvent } from "react";
import Paragraph from "../Paragraph";
import QRCode from "./QRCode";
import Dashbutton from "../DashButton";
import SixDigitInput from "./SixDigitInput";

const Authentication = () => {
  const [randomCode, setRandomCode] = useState<string>("");
  const [inputValues, setInputValues] = useState<string[]>(Array(6).fill(""));

  useEffect(() => {
    generateRandomCode();
  }, []);

  const generateRandomCode = () => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setRandomCode(code);
  };

  const handleChange = (
    index: number,
    value: string,
    refs: RefObject<(HTMLInputElement | null)[]>,
  ) => {
    if (/^\d$/.test(value)) {
      const newInputValues = [...inputValues];
      newInputValues[index] = value;
      setInputValues(newInputValues);

      if (index < 5 && value && refs.current) {
        refs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (
    index: number,
    event: KeyboardEvent,
    refs: RefObject<(HTMLInputElement | null)[]>,
  ) => {
    if (event.key === "Backspace") {
      const newInputValues = [...inputValues];
      if (inputValues[index]) {
        newInputValues[index] = "";
      } else if (index > 0) {
        newInputValues[index - 1] = "";
        if (refs.current) {
          refs.current[index - 1]?.focus();
        }
      }
      setInputValues(newInputValues);
    } else if (event.key === "Enter") {
      if (isCodeComplete && isCodeMatch) {
        handleSubmit();
      }
    }
  };

  const handleSubmit = () => {
    const enteredCode = inputValues.join("");
    if (enteredCode === randomCode) {
      alert("2FA enabled successfully!");
    } else {
      alert("Invalid code. Please try again.");
    }
  };

  const isCodeComplete = inputValues.every((val) => val !== "");
  const isCodeMatch = inputValues.join("") === randomCode;

  return (
    <div className="bg-white pb-[20px] pt-[20px]">
      <div className="pl-[20px]">
        <Paragraph text="Protect your account with two-step verification codes" />
        <Paragraph text="Scan QR code in app" />
        <div className="flex gap-[42px]">
          <QRCode randomCode={randomCode} />
          <div className="flex flex-col justify-center">
            <Paragraph text="Enter code from app" />
            <div className="flex flex-row gap-[16px]">
              <SixDigitInput
                inputValues={inputValues}
                handleChange={handleChange}
                handleKeyDown={handleKeyDown}
              />
              <Dashbutton
                name="Enable 2FA"
                type="filled"
                disabled={!isCodeComplete || !isCodeMatch}
                onClickHandler={handleSubmit}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Authentication;
