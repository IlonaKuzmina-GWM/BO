"use client";

import Input from "@/components/UI/Input";
import { InputField } from "@/types";
import { ChangeEvent, useState } from "react";
import DashSelect from "../DashSelect";
import { Merchant, MerchantList } from "@/types/merchant";
import DashSelectValueNumber from "../DashSelectValueNumber";

interface InfoProps {
  title: string;
  inputFields: InputField[];
  formData: { [key: string]: string };
  handleInputChange: (event: ChangeEvent<HTMLInputElement>) => void;
  validationErrors: string[];
  onMerchantChange?: (selectedValues: number[]) => void;
  merchantsList?: Merchant[];
  selectedMerchants?: number[];
}

const Info = ({
  title,
  inputFields,
  formData,
  handleInputChange,
  onMerchantChange = () => {},
  validationErrors,
  merchantsList = [],
  selectedMerchants  = [],
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
              <DashSelectValueNumber
                value={selectedMerchants}
                label={"Select Merchants"}
                items={merchantsList.map((merchant) => ({
                  value: merchant.id,
                  label: merchant.label,
                }))}
                searchInput
                searchContext="merchant"
                onSelectHandler={onMerchantChange}
                width="full"
                isMulti
                isInvalid={validationErrors.includes(field.name)}
              />

              {/* <DashSelect
                value={[]}
                label={"All Merchants"}
                items={merchantsList.map((merchant) => ({
                  value: merchant.merchant_id.toString(),
                  label: merchant.merchant_name,
                }))}
                searchInput
                searchContext="merchant"
                onSelectHandler={onMerchantChange}
                width="full"
                isMulti
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
