import DashSelect from "../DashSelect";
import Paragraph from "../Paragraph";
import Dashbutton from "../DashButton";
import { useState } from "react";
import CustomTable from "../CustomTable/CustomTable";
import Modal from "../Modal";
import RuleRows from "./RuleRows";
import { Header, Rule } from "@/types";
import PaginationComponent from "../PaginationComponent ";

const Rules = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rules, setRules] = useState<Rule[]>([
    {
      merchant: "Aion",
      ruleType: "Limit",
      limitType: "Transactions",
      action: "Switch to provider 4",
      limitValue: "500",
      comment: "smth to clarify (it's a kind of comment)",
    },
  ]);

  const items = [
    { value: "apple", label: "Apple" },
    { value: "banana", label: "Banana" },
    { value: "blueberry", label: "Blueberry" },
    { value: "grapes", label: "Grapes" },
    { value: "pineapple", label: "Pineapple" },
  ];

  const header: Header[] = [
    { title: "Merchant", key: "merchant", width: "13%" },
    { title: "Rule Type", key: "ruleType", width: "10%" },
    { title: "Limit Type", key: "limitType", width: "12%" },
    { title: "Action", key: "action", width: "20%" },
    { title: "Limit Value", key: "limitValue", width: "12%" },
    { title: "Comment", key: "comment", width: "23%" },
    { title: "", key: "edit", width: "4%" },
    { title: "", key: "delete", width: "6%" },
  ];

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const deleteEntry = (index: number) => {
    const newRules = [...rules];
    newRules.splice(index, 1);
    setRules(newRules);
  };

  const renderRow = (rule: Rule, index: number) => (
    <RuleRows rule={rule} index={index} openModal={openModal} deleteEntry={deleteEntry} />
  );

  const totalPages = Math.ceil(rules.length / 10);

  return (
    <div className="bg-white pt-[20px]">
      <div className="pb-[16px] pl-[20px]">
        <Paragraph text="Limits with Flexible Rules and Actions" />
        <div className="flex flex-row gap-[2px]">
          <DashSelect
            value={"Select Merchant"}
            label={"All Merchants"}
            items={items}
            searchInput
            searchContext="merchant"
            isMulti={false}
            onSelectHandler={setSelectedValues}
          />
          <Dashbutton
            name="Add new rule"
            type="empty"
            disabled={selectedValues.length === 0}
            onClickHandler={() => openModal()}
          />
        </div>
      </div>
      <CustomTable columns={header} data={rules} renderRow={renderRow} />
      <PaginationComponent
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
      <Modal isOpen={isModalOpen} onClose={closeModal} title="Make new Rule">
      <p>Here you can make new rule.</p>
      </Modal>
    </div>
  );
};
export default Rules;
