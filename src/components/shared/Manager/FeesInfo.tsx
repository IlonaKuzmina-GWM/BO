import { ChangeEvent } from "react";
import ManagerFormInput from "./ManagerFormInput";

interface IFeesInfoProps {
  formData: {
    settlementFee: string;
    settlementFixingFee: string;
  };
  handleInputChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const FeesInfo = ({ formData, handleInputChange }: IFeesInfoProps) => {
  return (
    <div className="mt-[20px]">
      <h2 className="text-lg font-bold">Fees Information</h2>
      <ManagerFormInput
        label="Settlement Fee"
        name="settlementFee"
        type="text"
        value={formData.settlementFee}
        placeholder="Enter fee%"
        onChange={handleInputChange}
      />
      <ManagerFormInput
        label="Settlement Fixing Fee"
        name="settlementFixingFee"
        type="text"
        value={formData.settlementFixingFee}
        placeholder="Enter EUR"
        onChange={handleInputChange}
      />
    </div>
  );
};

export default FeesInfo;
