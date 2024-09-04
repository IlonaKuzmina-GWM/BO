import { KYCUser } from "@/types";

interface IKYCUserRowProps {
  user: KYCUser;
}

const KYCUserListRows = ({ user }: IKYCUserRowProps) => {
  const dateStyle =
    "bg-hoverBg text-center p-1 border border-hoverBg rounded-[4px]";
  return (
    <>
      <td className="pl-3 pr-2 lg:pl-8">{user.name}</td>
      <td className="pr-2">{user.status}</td>
      <td className="pr-2">{user.surname}</td>
      <td className="pr-2">{user.checkRequired}</td>
      <td className="pr-2">
        <div className={dateStyle}>{user.created}</div>
      </td>
      <td className="pr-2">
        <div className={dateStyle}>{user.updated}</div>
      </td>
    </>
  );
};

export default KYCUserListRows;
