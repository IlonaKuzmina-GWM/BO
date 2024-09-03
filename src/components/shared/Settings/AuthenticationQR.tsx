import { useState, useEffect, RefObject, KeyboardEvent } from "react";
import Paragraph from "../Paragraph";
import QRCode from "./QRCode";
import Dashbutton from "../DashButton";
import SixDigitInput from "./SixDigitInput";

interface IAuthenticationQRProps {
  setIs2FAEnabled: () => void;
}

const AuthenticationQR = ({ setIs2FAEnabled }: IAuthenticationQRProps) => {
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
      setIs2FAEnabled();
    }
  };

  const isCodeComplete = inputValues.every((val) => val !== "");
  const isCodeMatch = inputValues.join("") === randomCode;

  return (
    <div className="flex flex-col justify-center text-center p-[20px] text-main">
      <p>Scan QR Code in Google App</p>
      <p>Authentication App</p>
      <div className="flex flex-col items-center gap-[32px]">
        <QRCode randomCode={randomCode} />
        <div className="flex flex-col justify-center">
          <Paragraph text="Enter code from app" />
          <SixDigitInput
            inputValues={inputValues}
            handleChange={handleChange}
            handleKeyDown={handleKeyDown}
          />
        </div>
        <Dashbutton
          name="Enable 2FA"
          type="filled"
          disabled={!isCodeComplete || !isCodeMatch}
          onClickHandler={handleSubmit}
        />
      </div>
    </div>
  );
};

export default AuthenticationQR;
