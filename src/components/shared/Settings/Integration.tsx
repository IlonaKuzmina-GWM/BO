import { APIKey, Header } from "@/types";
import { useState } from "react";
import CustomTable from "../CustomTable/CustomTable";
import Dashbutton from "../DashButton";
import Paragraph from "../Paragraph";
import IntegrationRows from "./IntegrationRows";
import PaginationComponent from "../PaginationComponent ";

const Integration = () => {
  const [currentPage, setCurrentPage] = useState(1);
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

  const [blurStates, setBlurStates] = useState<boolean[]>(apiKeys.map(() => true));

  const deleteEntry = (index: number) => {
    const newRules = [...apiKeys];
    newRules.splice(index, 1);
    setApiKeys(newRules);

    const newBlurStates = [...blurStates];
    newBlurStates.splice(index, 1);
    setBlurStates(newBlurStates);
  };

  const copyEntry = (index: number) => {
    const entry = apiKeys[index];
    const text = `Merchant: ${entry.merchant}\nHeader Key: ${entry.headerKey}\nSignature Key: ${entry.signatureKey}`;
    navigator.clipboard.writeText(text);

    const newBlurStates = [...blurStates];
    newBlurStates[index] = true;
    setBlurStates(newBlurStates);
  };

  const handleShow = (index: number) => {
    const newBlurStates = [...blurStates];
    newBlurStates[index] = false;
    setBlurStates(newBlurStates);
  };

  const generateKey = () => {
    const newKey: APIKey = {
      merchant: "New Merchant",
      headerKey: "New Header Key",
      signatureKey: "New Signature Key",
    };
    setApiKeys([newKey, ...apiKeys]);
    setBlurStates([true, ...blurStates]);
  };

  const renderRow = (apiKey: APIKey, index: number) => (
    <IntegrationRows
      apiKey={apiKey}
      index={index}
      deleteEntry={deleteEntry}
      copyEntry={copyEntry}
      isBlurred={blurStates[index]}
      handleShow={() => handleShow(index)}
    />
  );

  const header: Header[] = [
    { title: "MerchantID", key: "MerchantID", width: "27%" },
    { title: "Your header key", key: "HeaderKey", width: "27%" },
    { title: "Your signature key", key: "SignatureKey", width: "27%" },
    { title: "Action", key: "show", width: "19%" },
  ];

  const totalPages = Math.ceil(apiKeys.length / 10);

  return (
    <div className="bg-white pt-[20px] rounded-tr-[4px] rounded-br-[4px] rounded-bl-[4px]">
      <div className="pb-[16px] pl-[20px]">
        <Paragraph text="Generate API Keys: Secure Access to Your Application" />
        <div className="flex flex-row gap-[2px]">
          <Dashbutton
            name="Generate API key"
            type="filled"
            onClickHandler={generateKey}
          />
        </div>
      </div>
      <CustomTable columns={header} data={apiKeys} renderRow={renderRow} />
      <PaginationComponent
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default Integration;