import Image from "next/image";

interface ICustomCheckboxProps {
  isChecked?: boolean;
  handleCheckboxChange: (event:any) => void;
}

const Checkbox = ({
  isChecked,
  handleCheckboxChange,
}: ICustomCheckboxProps) => {
  return (
    <button
      type="button"
      className="relative h-[16px] w-[16px] appearance-none"
      onClick={(event) => handleCheckboxChange(event)}
      aria-label={isChecked ? "Uncheck" : "Check"} // Accessibility
    >
      <Image
        src={isChecked ? "/icons/checkbox-checked.svg" : "/icons/checkbox-not-checked.svg"}
        width={16}
        height={16}
        alt={isChecked ? "Checked" : "Unchecked"}
      />
    </button>
  );
};

export default Checkbox;
