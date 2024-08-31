import React from "react";
import ManagerFormInput from "./ManagerFormInput";

interface IGeneralInfoProps {
  formData: {
    name: string;
    host: string;
    label: string;
    email: string;
  };
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const GeneralInfo = ({ formData, handleInputChange }: IGeneralInfoProps) => {
  return (
    <div className="mt-[20px]">
      <h2 className="text-lg font-bold">General Information</h2>
      <ManagerFormInput
        label="Name"
        name="name"
        type="text"
        value={formData.name}
        placeholder="Enter name"
        onChange={handleInputChange}
      />
      <ManagerFormInput
        label="Host"
        name="host"
        type="text"
        value={formData.host}
        placeholder="Enter host"
        onChange={handleInputChange}
      />
      <ManagerFormInput
        label="Label"
        name="label"
        type="text"
        value={formData.label}
        placeholder="Enter label"
        onChange={handleInputChange}
      />
      <ManagerFormInput
        label="Email"
        name="email"
        type="email"
        value={formData.email}
        placeholder="Enter email"
        onChange={handleInputChange}
      />
    </div>
  );
};

export default GeneralInfo;
