import CustomCheckbox from "@/components/UI/CustomCheckbox";
import { CSV } from "@/types";
import { use, useEffect, useState } from "react";

interface ICSVRowProps {
  cSV: CSV;
  checkAll: boolean;
}

const CSVRows = ({ cSV, checkAll }: ICSVRowProps) => {
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    setIsChecked(checkAll);
  }, [checkAll]);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

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
      <td className="pr-2">{cSV.id}</td>
      <td className="pr-2">{cSV.name}</td>
      <td className="pr-2">{cSV.surname}</td>
      <td className="pr-2">{cSV.iban}</td>
      <td className="pr-2">{cSV.amount}</td>
      <td className="pr-2">{cSV.created}</td>
      <td className="pr-2">Download CSV</td>
      <td className="pr-3 text-[--error] lg:pr-8">Delete</td>
    </>
  );
};

export default CSVRows;
