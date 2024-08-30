import { Rule } from "@/types";
import React from "react";

interface IRuleRowProps {
  rule: Rule;
  index: number;
  openModal: () => void;
  deleteEntry: (index: number) => void;
}

const RuleRows = ({ rule, index, openModal, deleteEntry }: IRuleRowProps) => {
  return (
    <>
      <td className="pl-3 pr-2 lg:pl-8">{rule.merchant}</td>
      <td className="pr-2">{rule.ruleType}</td>
      <td className="pr-2">{rule.limitType}</td>
      <td className="pr-2">{rule.action}</td>
      <td className="pr-2">{rule.limitValue}</td>
      <td className="pr-2">{rule.comment}</td>
      <td className="pr-2">
        <button onClick={openModal}>Edit</button>
      </td>
      <td className="pr-3 text-[--error] lg:pr-8">
        <button onClick={() => deleteEntry(index)}>Delete</button>
      </td>
    </>
  );
};

export default RuleRows;