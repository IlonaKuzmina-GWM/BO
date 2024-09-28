import { Header, KYCUser } from "@/types";
import CustomTable from "../CustomTable/CustomTable";
import Paragraph from "../Paragraph";
import KYCUserListRows from "./KYCUserListRows";
import { useState } from "react";
import PaginationComponent from "../PaginationComponent ";
import DataLimitsSeter from "../DataLimitsSeter";
import { ManagerKYCUserTableHeader } from "@/utils/tableHeaders";

const KYCUserList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState<number>(10);
  const users: KYCUser[] = [
    {
      name: "IDEAL",
      status: "5fd43163-0b1b-4",
      surname: "4e39f955-05f5",
      checkRequired: "1,11235",
      created: "30.06.2025 02:11:03",
      updated: "30.06.2025 02:11:03",
    },
    {
      name: "AliExpress",
      status: "Status",
      surname: "Status",
      checkRequired: "1,11235",
      created: "30.06.2025 02:11:03",
      updated: "30.06.2025 02:11:03",
    },
    {
      name: "Tesla",
      status: "Status",
      surname: "Status",
      checkRequired: "1,11235",
      created: "30.06.2025 02:11:03",
      updated: "30.06.2025 02:11:03",
    },
    {
      name: "Headspace",
      status: "Status",
      surname: "Status",
      checkRequired: "1,11235",
      created: "30.06.2025 02:11:03",
      updated: "30.06.2025 02:11:03",
    },
  ];

  const renderRow = (user: KYCUser, index: number) => (
    <KYCUserListRows key={index} user={user} />
  );

  const totalPages = Math.ceil(users.length / 10);
  const handleLimitChange = (limit: number) => {
    setLimit(limit);
  };

  return (
    <div>
      <div className="bg-white pt-[20px] rounded-tr-[4px] rounded-br-[4px] rounded-bl-[4px]">
        <div className="pb-[16px] pl-[20px]">
          <Paragraph text="KYC User List: Identity Verification and Data Validation" />
        </div>
        <CustomTable columns={ManagerKYCUserTableHeader} dataName="users" data={users} renderRow={renderRow} />
      </div>

      <div className="relative">
        <DataLimitsSeter onChange={handleLimitChange} />
        <PaginationComponent
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default KYCUserList;
