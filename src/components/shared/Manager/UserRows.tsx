import TableRowSelect from "@/components/UI/TableRowSelect";
import { User } from "@/types";

interface IUserRowProps {
  user: User;
  merchants: { value: string; label: string }[];
  updateProvider: (id: string, provider: string) => void;
}

const UserRows = ({ user, merchants, updateProvider }: IUserRowProps) => {
  const getSuccessAndErrorClass = (is: boolean) => {
    return is === false ? "text-success bg-successBg" : "text-error bg-errorBg";
  };

  const setSelectedValues = (selectedValue: string) => {
    updateProvider(user.id, selectedValue);
  };

  return (
    <>
      <td className="pl-3 pr-2 lg:pl-8">{user.id}</td>
      <td className="pr-2">{user.firstName}</td>
      <td className="pr-2">{user.lastName}</td>
      <td className="pr-2">{user.email}</td>
      <td className="pr-2">
        <div
          className={`flex justify-center rounded-[4px] px-[4px] py-[8px] ${getSuccessAndErrorClass(!user.isEmailVerified)}`}
        >
          {user.isEmailVerified ? "Verified" : "Not verified"}
        </div>
      </td>
      <td className="flex py-2 pr-2">
        <TableRowSelect
          value={user.merchant}
          label={"All Merchants"}
          items={merchants}
          searchInput
          onSelectHandler={setSelectedValues}
        />
      </td>
      <td className="pr-2">{user.role}</td>
      <td className="pr-2">{user.created}</td>
      <td className="pr-3 lg:pr-8">
        <div
          className={`flex justify-center rounded-[4px] px-[4px] py-[8px] ${getSuccessAndErrorClass(user.isDisabled)}`}
        >
          {user.isDisabled ? "Disabled" : "Enabled"}
        </div>
      </td>
    </>
  );
};

export default UserRows;
