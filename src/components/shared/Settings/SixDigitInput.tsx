import { useRef, RefObject, KeyboardEvent } from "react";

interface ISixDigitInputProps {
  inputValues: string[];
  handleChange: (index: number, value: string, refs: RefObject<(HTMLInputElement | null)[]>) => void;
  handleKeyDown: (index: number, event: KeyboardEvent, refs: RefObject<(HTMLInputElement | null)[]>) => void;
}

const SixDigitInput = ({ inputValues, handleChange, handleKeyDown }: ISixDigitInputProps) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  return (
    <div className="flex flex-row gap-[4px]">
      {inputValues.map((value, index) => (
        <input
          key={index}
          type="text"
          maxLength={1}
          value={value}
          onChange={(e) => handleChange(index, e.target.value, inputRefs)}
          onKeyDown={(e) => handleKeyDown(index, e, inputRefs)}
          ref={(el) => {
            inputRefs.current[index] = el;
          }}
          className=" h-[40px] w-[30px] border border-secondary text-center rounded-[12px] "
        />
      ))}
    </div>
  );
};

export default SixDigitInput;