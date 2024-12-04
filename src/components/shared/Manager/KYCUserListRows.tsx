import { formatDateTime } from "@/helpers/dateFormater";
import { KYCUser } from "@/types/kyc";

interface IKYCUserRowProps {
  user: KYCUser;
}

const KYCUserListRows = ({ user }: IKYCUserRowProps) => {
  
  return (
    <>
      <td className="pl-3 lg:pl-8">{user.name}</td>
      <td className="pr-2">{user.surname}</td>
      <td className="pr-2">{user.email}</td>
      <td className="pr-2">{user.checkRequired ? "True" : "False"}</td>
      <td className="pr-2">{user.checkPassed ? "True" : "False"}</td>
      <td className="pe-2">
        <span className="flex flex-wrap items-center justify-center gap-x-1 rounded-sm bg-hoverBg px-2 py-1 text-center text-[12px] leading-4">
          <span>{formatDateTime(user.createdAt).date}</span>
          <span>{formatDateTime(user.createdAt).time}</span>
        </span>
      </td>
      <td className="pe-2">
        <span className="flex flex-wrap items-center justify-center gap-x-1 rounded-sm bg-hoverBg px-2 py-1 text-center text-[12px] leading-4">
          <span>{formatDateTime(user.updatedAt).date}</span>
          <span>{formatDateTime(user.updatedAt).time}</span>
        </span>
      </td>
    </>
  );
};

export default KYCUserListRows;
