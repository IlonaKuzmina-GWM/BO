"use client";

import { useEffect, useState } from "react";
import Paragraph from "../Paragraph";
import UserRows from "./UserRows";

import DataLimitsSeter from "../DataLimitsSeter";
import { ManagerAllUsersTableHeader } from "@/constants/tableHeaders";
import LoadingAllUsersSkeleton from "../LoadingUISkeletons/LoadingAllUsersSkeleton";
import { User } from "@/types/user";
import { useStore } from "@/stores/StoreProvider";
import { Merchant } from "@/types/merchant";
import PaginationComponent from "../PaginationComponent";
import Search from "../Search";

const AllUser = () => {
  const { alertStore } = useStore();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);

  const [inputSearchQueryValue, setInputSearchQueryValue] =
    useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState<number>(10);

  const [merchantsList, setMerchantsList] = useState<Merchant[]>([]);

  const fetchAllUsersData = async () => {
    try {
      const response = await fetch("/api/get-all-users-data", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const res = await response.json();

        setUsers(res);

        console.log(res)

      } else {
        alertStore.setAlert("warning", "Data feching failed.");
      }
    } catch (error) {
      alertStore.setAlert("error", `Oops! Something went wrong: ${error}`);
    }
  };

  const fetchMerchantsListData = async () => {
    try {
      const response = await fetch("/api/post-merchants", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ search: "" }),
      });

      if (response.ok) {
        const res = await response.json();
        console.log(res)

        setMerchantsList(res);
      } else {
        alertStore.setAlert("warning", "All merchants fetching failed.");
      }
    } catch (error) {
      alertStore.setAlert("error", `Oops! Something went wrong: ${error}`);
    }
  };

  useEffect(() => {
    fetchAllUsersData();
    fetchMerchantsListData();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  }, []);

  const filteredUsers = users.filter((user) => {
    const query = searchQuery.toLowerCase();
    return (
      user.lastName.toLowerCase().includes(query) ||
      user.firstName.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      user.role.toLowerCase().includes(query)
    );
  });

  const updateMerchant = async (id: number, merchantLabel: string) => {
    try {
      const response = await fetch("/api/post-manager-update-merchant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: id, merchantLabel }),
      });

      if (response.ok) {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === id ? { ...user, merchant: merchantLabel } : user,
          ),
        );
      } else {
        alertStore.setAlert("warning", "All merchants fetching failed.");
      }
    } catch (error) {
      alertStore.setAlert("error", `Oops! Something went wrong: ${error}`);
    }
  };

  const totalPages = Math.ceil(filteredUsers.length / limit);

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * limit,
    currentPage * limit,
  );

  useEffect(() => {
    const handler = setTimeout(() => {
      setLoading(false);
      setSearchQuery(inputSearchQueryValue);
    }, 1000);
    setLoading(true);
    return () => clearTimeout(handler);
  }, [inputSearchQueryValue]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setCurrentPage(1);
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchQuery(inputSearchQueryValue);
    }, 1000);

    return () => clearTimeout(handler);
  }, [inputSearchQueryValue]);

  const handleSearchChange = (value: string) => {
    setInputSearchQueryValue(value);
  };

  return (
    <div>
      <div className="rounded-bl-[4px] rounded-br-[4px] rounded-tr-[4px] bg-white pt-[20px]">
        <div className="flex justify-between px-[20px] pb-[16px]">
          <Paragraph text="All Users" />
          <Search
            placeholder="Enter name, host, label"
            aditionalClass="max-w-[302px]"
            onSearch={handleSearchChange}
            searchValue={inputSearchQueryValue}
            searchIcon
          />
        </div>

        <table className="min-w-full table-auto border-y border-hoverBg text-left text-sm leading-[18px] text-main">
          <thead className="h-[50px] bg-hoverBg font-semibold">
            <tr>
              {ManagerAllUsersTableHeader.map((col, index) => (
                <th
                  key={col.key}
                  className={`${
                    index === 0 ? "pl-3 lg:pl-8" : ""
                  } ${index === ManagerAllUsersTableHeader.length - 1 ? "pr-3 lg:pr-8" : ""} ${
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
              <LoadingAllUsersSkeleton />
            ) : paginatedUsers.length > 0 ? (
              paginatedUsers.map((user) => (
                <tr
                  className="h-[50px] border-b border-hoverBg last:border-none"
                  key={user.id}
                >
                  <UserRows
                    user={user}
                    updateMerchant={updateMerchant}
                    merchantsList={merchantsList}
                  />
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={ManagerAllUsersTableHeader.length}
                  className="py-4 text-center"
                >
                  No users available
                </td>
              </tr>
            )}
          </tbody>
        </table>
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

export default AllUser;
