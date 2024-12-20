import Paragraph from "../Paragraph";
import Dashbutton from "../DashButton";
import { useState } from "react";
import Modal from "../Modal";
import RuleRows from "./RuleRows";
import { Rule } from "@/types";
import PaginationComponent from "../PaginationComponent";
import { SettingsRulesTableHeaader } from "@/constants/tableHeaders";
import DataLimitsSeter from "../DataLimitsSeter";
import CreateNewRule from "./CreateNewRule";

const Rules = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rules, setRules] = useState<Rule[]>([
    {
      merchant: "Apple",
      provider: "Provider 1",
      ruleType: "Country",
      limitType: "Per Day",
      action: "Block",
      limitValue: "10",
      comment: "This is a comment",
    },
  ]);
  const handleAddNewRule = (newRule: Rule) => {
    const newRuleWithMerchant = { ...newRule, merchant: selectedValues[0] };
    setRules((prevRules) => [...prevRules, newRuleWithMerchant]);
    setSelectedValues([]);
    setIsModalOpen(false);
  };

  const items = [
    { value: "apple", label: "Apple" },
    { value: "banana", label: "Banana" },
    { value: "blueberry", label: "Blueberry" },
    { value: "grapes", label: "Grapes" },
    { value: "pineapple", label: "Pineapple" },
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
    <RuleRows
      rule={rule}
      index={index}
      openModal={openModal}
      deleteEntry={deleteEntry}
    />
  );

  const totalPages = Math.ceil(rules.length / 10);

  return (
    <div className="rounded-bl-[4px] rounded-br-[4px] rounded-tr-[4px] bg-white pt-[20px]">
      <div className="bg-white">
        <div className="pb-[16px] pl-[20px]">
          <Paragraph text="Limits with Flexible Rules and Actions" />
          <div className="flex flex-row gap-[15px]">
            {/* <DashSelect
              value={selectedValues.length > 0 ? selectedValues[0] : "Select Merchant"}
              label={"All Merchants"}
              items={items}
              searchInput
              searchContext="merchant"
              isMulti={false}
              onSelectHandler={setSelectedValues}
              width="200px"
            /> */}
            <Dashbutton
              name="Add new rule"
              type="empty"
              disabled={selectedValues.length === 0}
              onClickHandler={() => openModal()}
            />
          </div>
        </div>

        <table className="min-w-full table-auto border-y border-hoverBg text-left text-sm leading-[18px] text-main">
          <thead className="h-[50px] bg-hoverBg font-semibold">
            <tr>
              {SettingsRulesTableHeaader.map((col, index) => (
                <th
                  key={col.key}
                  className={`${
                    index === 0 ? "pl-3 lg:pl-8" : ""
                  } ${index === SettingsRulesTableHeaader.length - 1 ? "pr-3 lg:pr-8" : ""} ${
                    col.centered ? "text-center" : ""
                  } pr-2`}
                  style={{ width: col.width }}
                >
                  {col.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rules.length > 0 ? (
              rules.map((rule, index) => (
                <tr
                  className="h-[50px] border-b border-hoverBg last:border-none"
                  key={index}
                >
                  <RuleRows
                    rule={rule}
                    index={index}
                    openModal={openModal}
                    deleteEntry={deleteEntry}
                  />
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={SettingsRulesTableHeaader.length}
                  className="py-4 text-center"
                >
                  No rules available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="relative">
        <DataLimitsSeter />
        <PaginationComponent
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title="Creating a new Rule"
        closeIcon={true}
      >
        <CreateNewRule onAddNewRule={handleAddNewRule} />
      </Modal>
    </div>
  );
};
export default Rules;
