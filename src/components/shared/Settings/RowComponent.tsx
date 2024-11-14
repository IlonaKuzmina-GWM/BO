import TableRowSelect from "@/components/UI/TableRowSelect";

interface IRowComponentProps {
  selectLabel: string;
  label: string;
  description: string;
  items: { value: string; label: string }[];
  field: string;
  value: string;
  onSelectHandler: (field: string, selectedValues: string[]) => void;
}

const RowComponent = ({
  selectLabel,
  label,
  description,
  items,
  field,
  value,
  onSelectHandler,
}: IRowComponentProps) => {
  return (
    <div className="mb-[16px] flex gap-[16px]">
      <div className="flex w-[212px] flex-col gap-[8px]">
        <label className="block text-[14px] text-main">{selectLabel}</label>
        {/* <TableRowSelect
          value={value}
          label={label}
          items={items}
          searchInput
          onSelectHandler={(selectedValue) =>
            onSelectHandler(field, [selectedValue])
          }
        /> */}
      </div>
      <div className="w-[286px] self-end text-[12px] text-secondary">
        {description}
      </div>
    </div>
  );
};

export default RowComponent;
