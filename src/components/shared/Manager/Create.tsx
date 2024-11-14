import Spinner from "@/components/UI/Spinner";
import { InputField } from "@/types";
import { ChangeEvent, useState } from "react";
import DashButton from "../DashButton";
import { formattedValueForMoney } from "../Functions/formattedValueForMoney";
import Info from "./Info";
import SelectAccount from "./SelectAccount";

const Create = () => {
  const [formData, setFormData] = useState({
    selectedAccount: "merchant",
    name: "",
    host: "",
    label: "",
    email: "",
    firstName: "",
    lastName: "",
    password: "",
    merchants: "",
    settlementFee: "",
    settlementFixingFee: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const [selectedMerchants, setSelectedMerchants] = useState<number[]>([]);

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

  const handleSubmit = () => {
    let relevantInputFields: InputField[] = [];

    switch (formData.selectedAccount) {
      case "merchant":
        relevantInputFields = merchantGeneralInfoInputFields;
        break;
      case "agent":
        relevantInputFields = agentGeneralInfoInputFields;
        break;
      case "support":
      case "manager":
      case "user":
        relevantInputFields = generalInfoInputFields;
        break;
      default:
        relevantInputFields = [];
    }

    relevantInputFields = [...relevantInputFields, ...feesInputFields];

    const errors = relevantInputFields
      .filter(
        (field) => formData[field.name as keyof typeof formData].trim() === "",
      )
      .map((field) => field.name);

    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }

    setFormData({
      selectedAccount: "merchant",
      name: "",
      host: "",
      label: "",
      email: "",
      firstName: "",
      lastName: "",
      password: "",
      merchants: "",
      settlementFee: "",
      settlementFixingFee: "",
    });
    setSubmitted(true);
    setValidationErrors([]);
    setTimeout(() => {
      setSubmitted(false);
    }, 3000);
  };

  const setManager = (selectedValues: string[]) => {
    setFormData((prevData) => ({
      ...prevData,
      merchants: selectedValues.join(", "),
    }));
  };

  const accountTypes = ["merchant", "support", "manager", "user", "agent"];

  const submitName = submitted ? "Account created" : "Create new account";

  const merchantGeneralInfoInputFields: InputField[] = [
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

  const generalInfoInputFields: InputField[] = [
    {
      label: "Email",
      name: "email",
      type: "email",
      placeholder: "Enter email",
    },
    {
      label: "Fist name",
      name: "firstName",
      type: "text",
      placeholder: "Enter first name",
    },
    {
      label: "Last name",
      name: "lastName",
      type: "text",
      placeholder: "Enter last name",
    },
    {
      label: "Password",
      name: "password",
      type: "text",
      placeholder: "Enter password",
    },
  ];

  const agentGeneralInfoInputFields: InputField[] = [
    ...generalInfoInputFields,
    {
      label: "Select merchant(-s)",
      name: "merchants",
      type: "",
      placeholder: "",
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

  const handleMerchantSelect = (merchants: number[]) => {
    setSelectedMerchants(merchants);
  };

  const merchants = [
    { merchant_id: 1, merchant_name: "Apple" },
    { merchant_id: 2, merchant_name: "Banana" },
    { merchant_id: 3, merchant_name: "Blueberry" },
    { merchant_id: 4, merchant_name: "Grapes" },
    { merchant_id: 5, merchant_name: "Pineapple" },
  ];

  return (
    <div className="rounded-bl-[4px] rounded-br-[4px] rounded-tr-[4px] bg-white">
      <div className="ml-[20px] max-w-[630px] pb-[72px] pt-[24px]">
        <form onSubmit={handleSubmit}>
          <SelectAccount
            accountTypes={accountTypes}
            selectedAccount={formData.selectedAccount}
            onAccountChange={handleAccountChange}
            isInvalid={validationErrors.includes("selectedAccount")}
          />
          <div className="flex flex-row gap-[72px]">
            {formData.selectedAccount === "merchant" && (
              <Info
                title="General Information"
                inputFields={merchantGeneralInfoInputFields}
                formData={formData}
                handleInputChange={handleInputChange}
                validationErrors={validationErrors}
              />
            )}
            {formData.selectedAccount === "agent" && (
              <Info
                title="General Information"
                inputFields={agentGeneralInfoInputFields}
                formData={formData}
                merchants={merchants}
                onMerchantChange={handleMerchantSelect}
                handleInputChange={handleInputChange}
                validationErrors={validationErrors}
              />
            )}
            {(formData.selectedAccount === "support" ||
              formData.selectedAccount === "manager" ||
              formData.selectedAccount === "user") && (
              <Info
                title="General Information"
                inputFields={generalInfoInputFields}
                formData={formData}
                handleInputChange={handleInputChange}
                validationErrors={validationErrors}
              />
            )}
            <div>
              {formData.selectedAccount !== "user" && (
                <Info
                  title="Fees information"
                  inputFields={feesInputFields}
                  formData={formData}
                  handleInputChange={handleInputChange}
                  validationErrors={validationErrors}
                />
              )}

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
