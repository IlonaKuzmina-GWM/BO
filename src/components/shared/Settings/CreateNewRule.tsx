import { Rule, RuleRow } from "@/types";
import { useState } from "react";
import DashButton from "../DashButton";
import RowComponent from "./RowComponent";

const ruleTypes = [
  { value: "country", label: "Country" },
  { value: "provider", label: "Provider" },
  { value: "user", label: "User" },
];

const providers = [
  { value: "provider1", label: "Provider 1" },
  { value: "provider2", label: "Provider 2" },
  { value: "provider3", label: "Provider 3" },
];

const actions = [
  { value: "block", label: "Block" },
  { value: "alert", label: "Alert" },
  { value: "limit", label: "Limit" },
];

const limitTypes = [
  { value: "perDay", label: "Per Day" },
  { value: "perTransaction", label: "Per Transaction" },
];

const limitValues = [
  { value: "10", label: "10" },
  { value: "20", label: "20" },
  { value: "30", label: "30" },
];

interface CreateNewRuleProps {
  onAddNewRule: (newRule: any) => void;
}

const CreateNewRule = ({ onAddNewRule }: CreateNewRuleProps) => {
  const [rule, setRule] = useState<Partial<Rule>>({
    ruleType: "",
    provider: "",
    limitType: "",
    limitValue: "",
    action: "",
    comment: "",
  });

  const handleSelectChange = (field: string, selectedValues: string[]) => {
    setRule((prevRule) => ({
      ...prevRule,
      [field]: selectedValues[0] || "",
    }));
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setRule((prevRule) => ({
      ...prevRule,
      [name]: value,
    }));
  };

  const handleAddRule = () => {
    onAddNewRule(rule);
    setRule({
      ruleType: "",
      provider: "",
      limitType: "",
      limitValue: "",
      action: "",
      comment: "",
    });
  };

  const firstSectionRows: RuleRow[] = [
    {
      selectLabel: "Rule Types",
      label: "All Rule Types",
      description:
        "Select the type of restriction to apply, such as limiting transactions by country, provider, or user.",
      items: ruleTypes,
      field: "ruleType",
      value: rule.ruleType,
    },
    {
      selectLabel: "Providers",
      label: "All Providers",
      description: "Choose the payment provider to apply this rule to.",
      items: providers,
      field: "provider",
      value: rule.provider,
    },
    {
      selectLabel: "Limit Type",
      label: "All Limit Types",
      description:
        "Select the limit type, such as per day, or per transaction.",
      items: limitTypes,
      field: "limitType",
      value: rule.limitType,
    },
    {
      selectLabel: "Limit Value",
      label: "All Limit Values",
      description:
        "Enter the limit value, such as the maximum number of transactions or amount allowed.",
      items: limitValues,
      field: "limitValue",
      value: rule.limitValue,
    },
  ];

  const secondSectionRows: RuleRow[] = [
    {
      selectLabel: "Action",
      label: "All Actions",
      description:
        "Select the action to take when the limit is reached, such as blocking transactions, sending alerts, or applying limits.",
      items: actions,
      field: "action",
      value: rule.action,
    },
  ];

  const areFieldsEmpty = () => {
    const fields = [
      rule.ruleType,
      rule.provider,
      rule.limitType,
      rule.action,
      rule.limitValue,
    ];
    return fields.some((field) => field === "");
  };

  return (
    <div className="w-[554px] px-[20px] py-[25px] text-main">
      <h3 className="mb-[16px] font-semibold">Conditions of Execution</h3>
      {firstSectionRows.map((row, index) => (
        <RowComponent
          selectLabel={row.selectLabel}
          key={index}
          label={row.label}
          description={row.description}
          items={row.items}
          field={row.field}
          value={row.value!}
          onSelectHandler={handleSelectChange}
        />
      ))}
      <h3 className="mb-[16px] mt-[25px] font-semibold">
        Action When Limit Is Reached
      </h3>
      {secondSectionRows.map((row, index) => (
        <RowComponent
          selectLabel={row.selectLabel}
          key={index}
          label={row.label}
          description={row.description}
          items={row.items}
          field={row.field}
          value={row.value!}
          onSelectHandler={handleSelectChange}
        />
      ))}
      <div className="mb-[21px] mt-[25px] flex-col gap-[8px]">
        <div className="flex w-[340px] flex-col">
          <label className="mb-[8px] block text-[14px] text-[#333]">
            Comment (optional):
          </label>
          <textarea
            name="comment"
            value={rule.comment}
            onChange={handleInputChange}
            placeholder="Enter comment"
            className="w-full rounded border p-2"
          />
        </div>
        <div className="mt-[8px] w-[286px] self-end text-[12px] text-secondary">
          Add any additional comments or notes about this rule.
        </div>
      </div>

      <DashButton
        name="Add New Rule"
        type={"filled"}
        disabled={areFieldsEmpty()}
        onClickHandler={handleAddRule}
      />
    </div>
  );
};

export default CreateNewRule;
