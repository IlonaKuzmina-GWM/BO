interface IManagerFormInputProps {
  label: string;
  name: string;
  type: string;
  value: string;
  placeholder: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isInvalid?: boolean;
}

const ManagerFormInput = ({
  label,
  name,
  type,
  value,
  placeholder,
  onChange,
  isInvalid = false,
}: IManagerFormInputProps) => {
  return (
    <div className="mt-[10px]">
      <label className="block">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`py[12px] h-[40px] w-[279px] rounded-[4px] border px-[10px] ${
          isInvalid ? "border-error" : "border-divider"
        }`}
      />
      {isInvalid && (
        <div className="text-[12px] text-error">This field is required.</div>
      )}
    </div>
  );
};

export default ManagerFormInput;
