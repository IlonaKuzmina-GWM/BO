import { ChangeEvent, useState } from "react";
import SelectAccount from "./SelectAccount";
import MerchantForm from "./AccountsCreationForms/MerchantForm";
import UserForm from "./AccountsCreationForms/UserForm";
import SupportForm from "./AccountsCreationForms/SupportForm";
import ManagerForm from "./AccountsCreationForms/ManagerForm";
import AgentForm from "./AccountsCreationForms/AgentForm";

const Create = () => {
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  
  const handleAccountChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setSelectedAccount(value);
  };

  return (
    <div className="mb-10 min-h-[503px] rounded-bl-[4px] rounded-br-[4px] rounded-tr-[4px] bg-white">
      <div className="ml-5 max-w-[630px] pb-10 pt-6">
        <SelectAccount
          selectedAccount={selectedAccount || ""}
          onAccountChange={handleAccountChange}
          setInitialAccount={setSelectedAccount}
        />
        {selectedAccount === "merchant" && <MerchantForm />}
        {selectedAccount === "support" && <SupportForm />}
        {selectedAccount === "manager" && <ManagerForm />}
        {selectedAccount === "user" && <UserForm />}
        {selectedAccount === "agent" && <AgentForm />}
      </div>
    </div>
  );
};

export default Create;
