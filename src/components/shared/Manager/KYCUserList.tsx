import { Header, KYCUser } from "@/types";
import CustomTable from "../CustomTable/CustomTable";
import Paragraph from "../Paragraph";
import KYCUserListRows from "./KYCUserListRows";
import { useState } from "react";
import PaginationComponent from "../PaginationComponent ";

const KYCUserList = () => {
  const [currentPage, setCurrentPage] = useState(1);
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

  const header: Header[] = [
    { title: "Nme", key: "name", width: "17%" },
    { title: "Status", key: "status", width: "16%" },
    { title: "Surname", key: "surname", width: "17%" },
    { title: "Check Required", key: "isCHeckRequired", width: "16%" },
    { title: "Create", key: "created", width: "17%", centered: true },
    { title: "Updated", key: "updated", width: "17%", centered: true },
  ];

  const totalPages = Math.ceil(users.length / 10);

  return (
    <div className="bg-white pt-[20px]">
      <div className="pb-[16px] pl-[20px]">
        <Paragraph text="KYC User List: Identity Verification and Data Validation" />
      </div>
      <CustomTable columns={header} data={users} renderRow={renderRow} />
      <PaginationComponent
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default KYCUserList;
