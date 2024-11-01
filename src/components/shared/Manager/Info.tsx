import Input from "@/components/UI/Input";
import { InputField } from "@/types";
import { ChangeEvent } from "react";
import DashSelect from "../DashSelect";

interface InfoProps {
  title: string;
  inputFields: InputField[];
  formData: { [key: string]: string };
  handleInputChange: (event: ChangeEvent<HTMLInputElement>) => void;
  validationErrors: string[];
  onMerchantChange?: (selectedValues: string[]) => void;
  merchants?: { value: string; label: string }[];
}

const Info = ({
  title,
  inputFields,
  formData,
  handleInputChange,
  onMerchantChange = () => {},
  validationErrors,
  merchants = [],
}: InfoProps) => {
  return (
    <div className="mt-[20px]">
      <p className="bg-hoverBg p-[4px] text-[16px] font-medium">{title}</p>
      {inputFields.map((field: InputField) => (
        <div key={field.name} className="mt-[16px]">
          {field.name === "merchants" ? (
            <>
              <label className="mb-[8px] block text-[14px] text-[#333]">
                {field.label}
              </label>
              {/* <DashSelect
                value={merchants}
                label={"All Merchants"}
                items={merchants}
                searchInput
                searchContext="merchant"
                isMulti
                onSelectHandler={onMerchantChange}
                width="full"
                isInvalid={validationErrors.includes(field.name)}
              /> */}
            </>
          ) : (
            <Input
              label={field.label}
              name={field.name}
              type={field.type}
              value={formData[field.name as keyof typeof formData]}
              placeholder={field.placeholder}
              onChange={handleInputChange}
              isInvalid={validationErrors.includes(field.name)}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default Info;
