import Spinner from "@/components/UI/Spinner";
import { InputField } from "@/types";
import { ChangeEvent, FormEvent, useState } from "react";
import DashButton from "../DashButton";
import { formattedValueForMoney } from "../Functions/formattedValueForMoney";
import Info from "./Info";
import SelectAccount from "./SelectAccount";

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
  const [submitted, setSubmitted] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const handleAccountChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      selectedAccount: value,
    }));
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    let formattedValue = value;

    if (name === "settlementFee") {
      formattedValue = value.replace(/[^0-9]/g, "");
    } else if (name === "settlementFixingFee") {
      formattedValue = formattedValueForMoney(value);
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: formattedValue,
    }));
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    const errors = Object.entries(formData)
      .filter(([key, value]) => value.trim() === "")
      .map(([key]) => key);

    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }

    setFormData({
      selectedAccount: "",
      name: "",
      host: "",
      label: "",
      email: "",
      settlementFee: "",
      settlementFixingFee: "",
    });
    setSubmitted(true);
    setValidationErrors([]);
    setTimeout(() => {
      setSubmitted(false);
    }, 3000);

    console.log("Form Data:", formData);
  };

  const accountTypes = ["merchant", "support", "manager", "user"];

  const submitName = submitted ? "Account created" : "Create new account";

  const generalInfoInputFields: InputField[] = [
    { label: "Name", name: "name", type: "text", placeholder: "Enter name" },
    { label: "Host", name: "host", type: "text", placeholder: "Enter host" },
    { label: "Label", name: "label", type: "text", placeholder: "Enter label" },
    {
      label: "Email",
      name: "email",
      type: "email",
      placeholder: "Enter email",
    },
  ];

  const feesInputFields: InputField[] = [
    {
      label: "Settlement Fee",
      name: "settlementFee",
      type: "text",
      placeholder: "Enter fee%",
    },
    {
      label: "Settlement Fixing Fee",
      name: "settlementFixingFee",
      type: "text",
      placeholder: "Enter EUR",
    },
  ];

  return (
    <div className="bg-white">
      <div className="ml-[20px] max-w-[590px] pb-[72px] pt-[24px]">
        <form onSubmit={handleSubmit}>
          <SelectAccount
            accountTypes={accountTypes}
            selectedAccount={formData.selectedAccount}
            onAccountChange={handleAccountChange}
            isInvalid={validationErrors.includes("selectedAccount")}
          />
          <div className="flex flex-row gap-[32px]">
            <Info
              title="General Information"
              inputFields={generalInfoInputFields}
              formData={formData}
              handleInputChange={handleInputChange}
              validationErrors={validationErrors}
            />
            <div>
              <Info
                title="Fees information"
                inputFields={feesInputFields}
                formData={formData}
                handleInputChange={handleInputChange}
                validationErrors={validationErrors}
              />
              <div className="mt-[41px] flex flex-row self-end">
                <DashButton
                  name={submitName}
                  type={"filled"}
                  disabled={submitted}
                  isFullWidth
                />
              </div>
            </div>
          </div>
        </form>
        {submitted && <Spinner />}
      </div>
    </div>
  );
};

export default Create;
