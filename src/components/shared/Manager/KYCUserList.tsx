'use client'


import { ManagerKYCUserTableHeader } from "@/utils/tableHeaders";
import { useEffect, useState } from "react";
import CustomTable from "../CustomTable/CustomTable";
import DataLimitsSeter from "../DataLimitsSeter";
import PaginationComponent from "../PaginationComponent ";
import Paragraph from "../Paragraph";
import KYCUserListRows from "./KYCUserListRows";
import { KYCUser } from "@/types/kyc";

const KYCUserList = () => {
  const [limit, setLimit] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState(true);

  const [kycUsersList, setKYCUsersList] = useState<KYCUser[]>([]);

  const fetchKycUsersData = async () => {
    try {
      const response = await fetch("/api/get-kyc-users", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const res = await response.json();

        console.log("KYC data", res);

        setKYCUsersList(res);
      } else {
        // console.log("Filters response failed");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKycUsersData();
  }, []);

  const renderRow = (user: KYCUser, index: number) => (
    <KYCUserListRows key={index} user={user} />
  );

  // const totalPages = Math.ceil(users.length / 10);

  const handleLimitChange = (limit: number) => {
    setLimit(limit);
  };

  return (
    <div>
      <div className="rounded-bl-[4px] rounded-br-[4px] rounded-tr-[4px] bg-white pt-[20px]">
        <div className="pb-[16px] pl-[20px]">
          <Paragraph text="KYC User List: Identity Verification and Data Validation" />
        </div>

        <CustomTable
          columns={ManagerKYCUserTableHeader}
          dataName="users"
          data={kycUsersList}
          renderRow={renderRow}
        />
      </div>

      <div className="relative">
        <DataLimitsSeter onChange={handleLimitChange} defaultValue={limit} />
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
