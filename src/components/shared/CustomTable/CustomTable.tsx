import { Header, Rule } from "../Settings/Rules";

interface ICustomTableProps {
  columns: Header[];
  data: Rule[];
}

const CustomTable = ({ columns, data }: ICustomTableProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-left text-sm leading-[18px] text-main border-y border-hoverBg table-auto">
        <thead className="h-[50px] bg-hoverBg font-semibold">
          <tr>
            {columns.map((col, index) => (
              <th
                key={col.key}
                className={`${
                  index === 0 ? "pl-3 lg:pl-8" : ""
                } ${index === columns.length - 1 ? "pr-3 lg:pr-8" : ""} w-[${col.width}] pr-2`}
              >
                {col.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((rule: Rule, index: number) => (
            <tr className="h-[50px] border-b border-hoverBg last:border-none" key={index}>
              <td className="pl-3 lg:pl-8 pr-2">{rule.merchant}</td>
              <td className="pr-2">{rule.ruleType}</td>
              <td className="pr-2">{rule.limitType}</td>
              <td className="pr-2">{rule.action}</td>
              <td className="pr-2">{rule.limitValue}</td>
              <td className="pr-2">{rule.comment}</td>
              <td className="pr-2">Edit</td>
              <td className="lg:pr-8 pr-3 text-[--error]">Delete</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomTable;