import Input from "@/components/UI/Input";
import { InputField } from "@/types";

interface InfoProps {
  title: string;
  inputFields: InputField[];
  formData: { [key: string]: string };
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  validationErrors: string[];
}

const Info = ({
  title,
  inputFields,
  formData,
  handleInputChange,
  validationErrors,
}: InfoProps) => {
  return (
    <div className="mt-[20px]">
      <p className="bg-hoverBg p-[4px] text-[16px] font-medium">{title}</p>
      {inputFields.map((field: InputField) => (
        <div key={field.name} className="mt-[16px]">
          <Input
            label={field.label}
            name={field.name}
            type={field.type}
            value={formData[field.name as keyof typeof formData]}
            placeholder={field.placeholder}
            onChange={handleInputChange}
            isInvalid={validationErrors.includes(field.name)}
          />
        </div>
      ))}
    </div>
  );
};

export default Info;
