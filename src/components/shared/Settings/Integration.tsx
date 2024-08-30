import { APIKey, Header } from "@/types";
import { useState } from "react";
import CustomTable from "../CustomTable/CustomTable";
import Dashbutton from "../DashButton";
import Paragraph from "../Paragraph";
import IntegrationRows from "./IntegrationRows";
//TODO: Blur
const Integration = () => {
  const [apiKeys, setApiKeys] = useState<APIKey[]>([
    {
      merchant: "IDEAL",
      headerKey: "5fd43163-0b1b-4114-b217-d676119e5ee6",
      signatureKey: "4e39f955-05f5-4f63-9e18-7316e72d9adf",
    },
    {
      merchant: "AliExpress",
      headerKey: "Status",
      signatureKey: "Status",
    },
    {
      merchant: "Tesla",
      headerKey: "Status",
      signatureKey: "Status",
    },
    {
      merchant: "Headspace",
      headerKey: "Status",
      signatureKey: "Status",
    },
  ]);

  const deleteEntry = (index: number) => {
    const newRules = [...apiKeys];
    newRules.splice(index, 1);
    setApiKeys(newRules);
  };
  
  const copyEntry = (index: number) => {
    const newRules = [...apiKeys];
    const entry = newRules[index];
    const text = `Merchant: ${entry.merchant}\nHeader Key: ${entry.headerKey}\nSignature Key: ${entry.signatureKey}`;
    navigator.clipboard.writeText(text);
  };

  const renderRow = (apiKey: APIKey, index: number) => (
    <IntegrationRows apiKey={apiKey} index={index} deleteEntry={deleteEntry} copyEntry={copyEntry}/>
  );

  const header: Header[] = [
    { title: "MerchantID", key: "MerchantID", width: "29%" },
    { title: "Your header key", key: "HeaderKey", width: "29%" },
    { title: "Your signature key", key: "SignatureKey", width: "29%" },
    { title: "Action", key: "show", width: "13%" },
  ];

  const generateKey = () => {};

  return (
    <div className="h-full bg-white pt-[20px]">
      <div className="pb-[16px] pl-[20px]">
        <Paragraph text="Generate API Keys: Secure Access to Your Application" />
        <div className="flex flex-row gap-[2px]">
          <Dashbutton
            name="Add new rule"
            type="filled"
            onClickHandler={generateKey}
          />
        </div>
      </div>
      <CustomTable columns={header} data={apiKeys} renderRow={renderRow} />
    </div>
  );
};
export default Integration;
