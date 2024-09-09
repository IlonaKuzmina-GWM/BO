import Image from "next/image";

interface ICustomCheckboxProps {
  isChecked: boolean;
  handleCheckboxChange: () => void;
}

const Checkbox = ({
  isChecked,
  handleCheckboxChange,
}: ICustomCheckboxProps) => {
  return (
    <button
      type="button"
      className="h-[16px] w-[16px] appearance-none relative"
      onClick={handleCheckboxChange}
    >
      {isChecked ? (
        <Image
          src="/icons/checkbox-checked.svg"
          width={16}
          height={16}
          alt="Checked"
        />
      ) : (
        <Image
          src="/icons/checkbox-not-checked.svg"
          width={16}
          height={16}
          alt="Unchecked"
        />
      )}
    </button>
  );
};
export default Checkbox;
