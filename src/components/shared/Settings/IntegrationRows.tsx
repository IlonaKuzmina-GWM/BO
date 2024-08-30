import { APIKey } from "@/types";


interface IIntegrationRowProps {
  apiKey: APIKey;
  index: number;
  deleteEntry: (index: number) => void;
  copyEntry: (index: number) => void;
}
const RuleRows = ({ apiKey, index, deleteEntry, copyEntry }: IIntegrationRowProps) => {

  return (
    <>
      <td className="pl-3 pr-2 lg:pl-8">{apiKey.merchant}</td>
      <td className="pr-2">{apiKey.headerKey}</td>
      <td className="pr-2">{apiKey.signatureKey}</td>
      <td className="pr-2">
        <button className="pr-8" onClick={() => {}}>Show</button>
        <button className="pr-8" onClick={() => copyEntry(index)}>Copy</button>
        <button className="pr-3 text-[--error] lg:pr-8" onClick={() => deleteEntry(index)}>Delete</button>
      </td>
    </>
  );
};

export default RuleRows;
