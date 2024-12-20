"use client";

import { ManagerKYCUserTableHeader } from "@/constants/tableHeaders";
import { useEffect, useState } from "react";
import DataLimitsSeter from "../DataLimitsSeter";
import PaginationComponent from "../PaginationComponent";
import Paragraph from "../Paragraph";
import KYCUserListRows from "./KYCUserListRows";
import { KYCUser } from "@/types/kyc";
import LoadingKYCUserListSkeleton from "../LoadingUISkeletons/LoadingKYCUserListSkeleton";
import { useStore } from "@/stores/StoreProvider";

const KYCUserList = () => {
  const { alertStore } = useStore();
  const [loading, setLoading] = useState(true);
  const [kycUsersList, setKYCUsersList] = useState<KYCUser[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState<number>(10);

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

        setKYCUsersList(res);
      } else {
        alertStore.setAlert("warning", "Analytics data response failed.");
      }
    } catch (error) {
      alertStore.setAlert("error", `Oops! Something went wrong: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKycUsersData();
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  }, []);

  const totalPages = Math.ceil(kycUsersList.length / limit);

  const paginatedKycUsers = kycUsersList.slice(
    (currentPage - 1) * limit,
    currentPage * limit,
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setCurrentPage(1);
  };

  return (
    <div>
      <div className="rounded-bl-[4px] rounded-br-[4px] rounded-tr-[4px] bg-white pt-[20px]">
        <div className="pb-[16px] pl-[20px]">
          <Paragraph text="KYC User List: Identity Verification and Data Validation" />
        </div>

        <div className="">
          <table className="min-w-full table-auto border-y border-hoverBg text-left text-sm leading-[18px] text-main">
            <thead className="h-[50px] bg-hoverBg font-semibold">
              <tr>
                {ManagerKYCUserTableHeader.map((col, index) => (
                  <th
                    key={col.key}
                    className={`${
                      index === 0 ? "pl-3 lg:pl-8" : ""
                    } ${index === ManagerKYCUserTableHeader.length - 1 ? "pr-3 lg:pr-8" : ""} ${
                      col.centered ? "text-center" : ""
                    } pr-2`}
                    style={{ width: col.width }}
                  >
                    {col.title}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <LoadingKYCUserListSkeleton />
              ) : paginatedKycUsers.length > 0 ? (
                paginatedKycUsers.map((user, index) => (
                  <KYCUserListRows user={user} key={index} />
                ))
              ) : (
                <tr className="h-[50px] border-b border-hoverBg last:border-none">
                  <td
                    colSpan={ManagerKYCUserTableHeader.length}
                    className="py-4 text-center"
                  >
                    No users available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="relative">
        <DataLimitsSeter onChange={handleLimitChange} defaultValue={limit} />
        <PaginationComponent
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default KYCUserList;
