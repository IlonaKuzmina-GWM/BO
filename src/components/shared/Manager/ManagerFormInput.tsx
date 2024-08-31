interface IManagerFormInputProps {
  label: string;
  name: string;
  type: string;
  value: string;
  placeholder: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const ManagerFormInput = ({
  label,
  name,
  type,
  value,
  placeholder,
  onChange,
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
        className="h-[40px] w-[279px] border border-divider px-[10px] py[12px] rounded-[4px]"
      />
    </div>
  );
};
export default ManagerFormInput;
