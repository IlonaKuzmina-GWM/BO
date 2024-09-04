import React, { useState } from 'react';
import { Header, Merchant } from "@/types";
import CustomTable from "../CustomTable/CustomTable";
import Paragraph from "../Paragraph";
import MerchantRows from "./MerchantRows";

const Merchants = () => {
  const [merchants, setMerchants] = useState<Merchant[]>([
    {
      id: "426",
      name: "IDEAL",
      host: "5fd43163-0b1b-4",
      label: "4e39f955-05f5",
      store: "2",
      feePercent: "2%",
      feeEur: "2%",
      setl: "2",
      amount: "1,11235",
      providers: "apple",
      status: "Disabled",
    },
    {
      id: "423",
      name: "AliExpress",
      host: "Status",
      label: "Status",
      store: "2",
      feePercent: "2%",
      feeEur: "3%",
      setl: "2",
      amount: "1,11235",
      providers: "banana",
      status: "Disabled",
    },
    {
      id: "154",
      name: "Tesla",
      host: "Status",
      label: "Status",
      store: "2",
      feePercent: "2%",
      feeEur: "4%",
      setl: "2",
      amount: "1,11235",
      providers: "grapes",
      status: "Enabled",
    },
    {
      id: "492",
      name: "Headspace",
      host: "Status",
      label: "Status",
      store: "2",
      feePercent: "2%",
      feeEur: "5%",
      setl: "2",
      amount: "1,11235",
      providers: "pineapple",
      status: "Enabled",
    },
  ]);

  const header: Header[] = [
    { title: "ID", key: "id", width: "7%" },
    { title: "Name", key: "name", width: "15%" },
    { title: "Host", key: "host", width: "15%" },
    { title: "Label", key: "label", width: "15%" },
    { title: "Store", key: "store", width: "4%" },
    { title: "Fee%", key: "feePercent", width: "4%" },
    { title: "Fee€", key: "feeEur", width: "4%" },
    { title: "Setl.", key: "setl", width: "4%" },
    { title: "Setl.Amount", key: "amount", width: "7%" },
    { title: "Providers", key: "providers", width: "14%" },
    { title: "Status", key: "status", width: "7%" },
    { title: "Action", key: "action", width: "4%" },
  ];

  const toggleStatus = (id: string) => {
    setMerchants(prevMerchants =>
      prevMerchants.map(merchant =>
        merchant.id === id
          ? { ...merchant, status: merchant.status === "Enabled" ? "Disabled" : "Enabled" }
          : merchant
      )
    );
  };

  const updateProvider = (id: string, provider: string) => {
    setMerchants(prevMerchants =>
      prevMerchants.map(merchant =>
        merchant.id === id
          ? { ...merchant, providers: provider }
          : merchant
      )
    );
  };

  const items = [
    { value: "apple", label: "Apple" },
    { value: "banana", label: "Banana" },
    { value: "blueberry", label: "Blueberry" },
    { value: "grapes", label: "Grapes" },
    { value: "pineapple", label: "Pineapple" },
  ];

  const renderRow = (merchant: Merchant, index: number) => (
    <MerchantRows
      key={merchant.id}
      merchant={merchant}
      toggleStatus={toggleStatus}
      providers={items}
      updateProvider={updateProvider}
    />
  );

  return (
    <div className="bg-white pt-[20px]">
      <div className="pb-[16px] pl-[20px]">
        <Paragraph text="List of Merchants" />
      </div>
      <CustomTable columns={header} data={merchants} renderRow={renderRow} />
    </div>
  );
};

export default Merchants;
