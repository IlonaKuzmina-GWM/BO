"use client";

import { Header } from "@/types";
import { useEffect, useState } from "react";
import CustomTable from "../CustomTable";
import Paragraph from "../Paragraph";
import UserRows from "./UserRows";

import DataLimitsSeter from "../DataLimitsSeter";
import { ManagerAllUsersTableHeader } from "@/utils/tableHeaders";
import LoadingAllUsersSkeleton from "../LoadingUISkeletons/LoadingAllUsersSkeleton";
import { User } from "@/types/user";
import { useStore } from "@/stores/StoreProvider";
import { observable } from "mobx";
import { MerchantList } from "@/types/merchant";
import PaginationComponent from "../PaginationComponent";

const AllUser = () => {
  const { alertStore } = useStore();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState<number>(10);

  const [merchantsList, setMerchantsList] = useState<MerchantList[]>([]);

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
        console.log("users data", res);
      } else {
        alertStore.setAlert("warning", "Data feching failed.");
      }
    } catch (error) {
      alertStore.setAlert("error", `Oops! Something went wrong: ${error}`);
    } finally {
      setLoading(false);
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
        setMerchantsList(res);
      } else {
        alertStore.setAlert("warning", "All merchants fetching failed.");
      }
    } catch (error) {
      alertStore.setAlert("error", `Oops! Something went wrong: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllUsersData();
    fetchMerchantsListData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderRow = (user: User) => (
    <UserRows
      key={user.id}
      user={user}
      updateMerchant={updateMerchant}
      merchantsList={merchantsList}
    />
  );

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
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(users.length / limit);

  const paginatedUsers = users.slice(
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
          <Paragraph text="All Users" />
        </div>
        <CustomTable
          loading={loading}
          loadingSkeleton={<LoadingAllUsersSkeleton />}
          columns={ManagerAllUsersTableHeader}
          dataName="users"
          data={paginatedUsers}
          renderRow={renderRow}
        />
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
