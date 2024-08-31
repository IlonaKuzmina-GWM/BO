import { useState, ChangeEvent, FormEvent } from "react";
import SelectAccount from "./SelectAccount";
import DashButton from "../DashButton";
import GeneralInfo from "./GeneralInfo";
import FeesInfo from "./FeesInfo";

const Create = () => {
  const [formData, setFormData] = useState({
    selectedAccount: "",
    name: "",
    host: "",
    label: "",
    email: "",
    settlementFee: "",
    settlementFixingFee: "",
  });

  const handleAccountChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      selectedAccount: value,
    }));
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    console.log("Form Data:", formData);
  };

  const accountTypes = ["merchant", "support", "manager", "user"];

  return (
    <div className="bg-white">
      <div className="ml-[20px] max-w-[590px] pb-[72px] pt-[24px]">
        <form onSubmit={handleSubmit}>
          <SelectAccount
            accountTypes={accountTypes}
            selectedAccount={formData.selectedAccount}
            onAccountChange={handleAccountChange}
          />
          <div className="flex flex-row gap-[32px]">
            <GeneralInfo
              formData={formData}
              handleInputChange={handleInputChange}
            />
            <div>
              <FeesInfo
                formData={formData}
                handleInputChange={handleInputChange}
              />
              <div className="mt-[41px] flex flex-row self-end">
                <DashButton name="Create new merchant" type={"filled"} />
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Create;