import Image from "next/image";
import { KeyboardEvent, useEffect, useRef, useState } from "react";
import Paragraph from "../../Paragraph";

interface IEnable2faModalProps {
  setIs2FAEnabled: (code: string) => void;
  QRCode: string;
}

const Enable2faModal = ({ setIs2FAEnabled, QRCode }: IEnable2faModalProps) => {
  const [inputValues, setInputValues] = useState<string[]>(Array(6).fill(""));
  const inputRefs = useRef<HTMLInputElement[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    const newValues = [...inputValues];

    if (value === "") {
      newValues[index] = "";
      setInputValues(newValues);
    } else if (/^\d$/.test(value)) {
      newValues[index] = value;
      setInputValues(newValues);

      if (index < 5 && value !== "") {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (
    index: number,
    event: KeyboardEvent<HTMLInputElement>,
  ) => {
    const { key } = event;

    if (key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (key === "Backspace" && !inputValues[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const enteredCode = inputValues.join("");
    if (enteredCode.length === 6) {
      setIs2FAEnabled(enteredCode);
    } else {
      console.error("Code is incomplete");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-[32px] p-[20px] text-center text-main">
      <div className="flex flex-col">
        <Paragraph text="1.Scan this qr code in a code app (For example, google authenticator):" />
        <div className="mx-auto w-10/12 max-w-[250px]">
          <Image
            src={QRCode}
            alt="qr code"
            width={294}
            height={290}
            className="h-auto w-full"
          />
        </div>
      </div>

      <div className="flex flex-col items-center">
        <Paragraph
          text="2.After you scan the qr, enter the code from your app below:"
          className="pb-8"
        />

        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center gap-8"
        >
          <div className="flex flex-row gap-[4px]">
            {inputValues.map((value, index) => (
              <input
                key={index}
                type="text"
                maxLength={1}
                value={value}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                ref={(el) => {
                  if (el) inputRefs.current[index] = el;
                }}
                className="h-[40px] w-[30px] rounded-[12px] border border-secondary text-center text-xl"
              />
            ))}
          </div>

          <button
            type="submit"
            className="w-full rounded-sm bg-blue500 px-8 py-4 text-[20px] font-semibold capitalize leading-normal text-white"
          >
            Enable 2FA
          </button>
        </form>
      </div>
    </div>
  );
};

export default Enable2faModal;
