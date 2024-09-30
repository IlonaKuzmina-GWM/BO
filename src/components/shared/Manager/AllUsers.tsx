import { Header, User } from "@/types";
import { useState } from "react";
import CustomTable from "../CustomTable/CustomTable";
import Paragraph from "../Paragraph";
import UserRows from "./UserRows";
import PaginationComponent from "../PaginationComponent ";
import DataLimitsSeter from "../DataLimitsSeter";
import { ManagerAllUsersTableHeader } from "@/utils/tableHeaders";

const AllUser = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [users, setUsers] = useState<User[]>([
    {
      id: "1",
      firstName: "John",
      lastName: "Doe",
      email: "admin@siquro.com",
      isEmailVerified: true,
      merchant: "Merchant",
      role: "developer",
      created: "2015-05-16 05:50:06",
      isDisabled: false,
    },
    {
      id: "2",
      firstName: "Jane",
      lastName: "Smith",
      email: "jane.smith@siquro.com",
      isEmailVerified: true,
      merchant: "Merchant",
      role: "manager",
      created: "2016-07-20 11:30:00",
      isDisabled: false,
    },
    {
      id: "3",
      firstName: "Alice",
      lastName: "Johnson",
      email: "alice.johnson@siquro.com",
      isEmailVerified: false,
      merchant: "cogito",
      role: "designer",
      created: "2017-09-10 09:15:30",
      isDisabled: true,
    },
    {
      id: "4",
      firstName: "Bob",
      lastName: "Brown",
      email: "bob.brown@siquro.com",
      isEmailVerified: true,
      merchant: "",
      role: "developer",
      created: "2018-11-25 14:45:00",
      isDisabled: false,
    },
    {
      id: "5",
      firstName: "Charlie",
      lastName: "Davis",
      email: "charlie.davis@siquro.com",
      isEmailVerified: false,
      merchant: "testMerchant",
      role: "tester",
      created: "2019-03-05 08:20:15",
      isDisabled: true,
    },
  ]);
  const [limit, setLimit] = useState<number>(10);

  const merchants = [
    { value: "Merchant", label: "Merchant" },
    { value: "cogito", label: "Cogito" },
    { value: "testMerchant", label: "Test Merchant" },
  ];

  const renderRow = (user: User, index: number) => (
    <UserRows
      key={user.id}
      user={user}
      merchants={merchants}
      updateProvider={updateMerchant}
    />
  );

  const updateMerchant = (id: string, merchant: string) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === id ? { ...user, merchant: merchant } : user,
      ),
    );
  };

  const totalPages = Math.ceil(users.length / 10);
  const handleLimitChange = (limit: number) => {
    setLimit(limit);
  };

  return (
    <div>
      <div className="bg-white pt-[20px] rounded-tr-[4px] rounded-br-[4px] rounded-bl-[4px]">
        <div className="pb-[16px] pl-[20px]">
          <Paragraph text="All Users" />
        </div>
        <CustomTable columns={ManagerAllUsersTableHeader} dataName="users" data={users} renderRow={renderRow} />
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
export default AllUser;
