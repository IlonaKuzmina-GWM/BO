import CustomCheckbox from "@/components/UI/CustomCheckbox";
import { CSV } from "@/types";
import { use, useEffect, useState } from "react";

interface ICSVRowProps {
  cSV: CSV;
  checkAll: boolean;
  index: number;
  deleteEntry: (index: number) => void;
  downloadPDF: (index: number) => void;
}

const CSVRows = ({
  cSV,
  checkAll,
  index,
  deleteEntry,
  downloadPDF,
}: ICSVRowProps) => {
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    setIsChecked(checkAll);
  }, [checkAll]);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };
  const dateStyle =
    "bg-hoverBg text-center p-1 border border-hoverBg rounded-[4px]";
  return (
    <>
      <td className="pl-3 pr-2 lg:pl-8">
        <div className="relative flex-shrink-0">
          <CustomCheckbox
            isChecked={isChecked}
            handleCheckboxChange={handleCheckboxChange}
          />
        </div>
      </td>
      <td className="pr-2 text-center">{cSV.id}</td>
      <td className="pr-2">{cSV.name}</td>
      <td className="pr-2">{cSV.surname}</td>
      <td className="pr-2">{cSV.iban}</td>
      <td className="pr-2 font-semibold">€{cSV.amount}</td>
      <td className="pr-2">
        <div className={dateStyle}>{cSV.created}</div>
      </td>
      <td className="pr-2 font-semibold">
        <button onClick={() => downloadPDF(index)}>Download CSV</button>
      </td>
      <td className="pr-3 font-semibold text-[--error] lg:pr-8">
        <button onClick={() => deleteEntry(index)}>Delete</button>
      </td>
    </>
  );
};

export default CSVRows;
