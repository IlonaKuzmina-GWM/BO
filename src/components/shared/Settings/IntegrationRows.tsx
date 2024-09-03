import { APIKey } from "@/types";

interface IIntegrationRowProps {
  apiKey: APIKey;
  index: number;
  deleteEntry: (index: number) => void;
  copyEntry: (index: number) => void;
  isBlurred: boolean;
  handleShow: () => void;
}

const IntegrationRows = ({
  apiKey,
  index,
  deleteEntry,
  copyEntry,
  isBlurred,
  handleShow,
}: IIntegrationRowProps) => {
  return (
    <>
      <td className={`pl-3 pr-2 lg:pl-8 ${isBlurred ? "blur-sm" : ""}`}>
        {apiKey.merchant}
      </td>
      <td className={`pr-2 ${isBlurred ? "blur-sm" : ""}`}>
        {apiKey.headerKey}
      </td>
      <td className={`pr-2 ${isBlurred ? "blur-sm" : ""}`}>
        {apiKey.signatureKey}
      </td>
      <td className="pr-2">
        <button
          className={`pr-8 font-semibold ${!isBlurred ? "text-secondary" : ""}`}
          onClick={handleShow}
        >
          Show
        </button>
        <button
          className={`pr-8 font-semibold ${isBlurred ? "text-secondary" : ""}`}
          onClick={() => copyEntry(index)}
          disabled={isBlurred}
        >
          Copy
        </button>
        <button
          className="pr-3 font-semibold text-[--error] lg:pr-8"
          onClick={() => deleteEntry(index)}
        >
          Delete
        </button>
      </td>
    </>
  );
};

export default IntegrationRows;
