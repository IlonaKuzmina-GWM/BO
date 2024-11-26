interface IInputProps {
  label: string;
  name: string;
  type: string;
  value: string;
  placeholder: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isInvalid?: boolean;
  width?: string;
}

const Input = ({
  label,
  name,
  type,
  value,
  placeholder,
  onChange,
  isInvalid = false,
  width = "279px",
}: IInputProps) => {
  return (
    <div>
      <label className="block text-[14px] text-main mb-[8px]">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`text-[14px] py[12px] h-[40px] rounded-[4px] border px-[10px] ${
          isInvalid ? "border-error" : "border-divider"
        }`}
        style={{ width }}
      />
      {isInvalid && (
        <div className="text-[12px] text-error">This field is required.</div>
      )}
    </div>
  );
};

export default Input;