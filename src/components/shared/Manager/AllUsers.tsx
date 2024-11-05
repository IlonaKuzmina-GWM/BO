"use client";

import { Header } from "@/types";
import { useEffect, useState } from "react";
import CustomTable from "../CustomTable/CustomTable";
import Paragraph from "../Paragraph";
import UserRows from "./UserRows";
import PaginationComponent from "../PaginationComponent ";
import DataLimitsSeter from "../DataLimitsSeter";
import { ManagerAllUsersTableHeader } from "@/utils/tableHeaders";
import LoadingAllUsersSkeleton from "../LoadingUI/LoadingAllUsersSkeleton";
import { User } from "@/types/user";

const AllUser = () => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState<number>(10);

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
        // console.log("Filters response failed");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // const fetchAllMerchantsData = async () => {
  //   try {
  //     const response = await fetch("/api/post-merchants", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ search: "" }),
  //     });

  //     if (response.ok) {
  //       const res = await response.json();

  //       console.log("all merchants data", res);
  //     } else {
  //       // console.log("Filters response failed");
  //     }
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  useEffect(() => {
    fetchAllUsersData();
    // fetchAllMerchantsData();
  }, []);

  //   onBeforeMount(async () => {
  //     try {
  // 		loading.value = true;
  //         const response = await api(`${getUsersRoute(role)}`, { method: 'GET' }) as User[];
  // 		if (response) {
  // 			users.value = response;
  // 			loading.value = false;
  // 		} else {
  // 			loading.value = false;
  // 		}
  // 	} catch (error) {
  // 		console.error ('error: ', error)
  // 	}
  // })

  const merchants = [
    { value: "Merchant", label: "Merchant" },
    { value: "cogito", label: "Cogito" },
    { value: "testMerchant", label: "Test Merchant" },
  ];

  console.log("state", users);

  const renderRow = (user: User, index: number) => (
    <UserRows
      key={user.id}
      user={user}
      merchants={merchants}
      updateProvider={updateMerchant}
    />
  );

  const updateMerchant = (id: number, merchant: string) => {
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
      <div className="rounded-bl-[4px] rounded-br-[4px] rounded-tr-[4px] bg-white pt-[20px]">
        <div className="pb-[16px] pl-[20px]">
          <Paragraph text="All Users" />
        </div>
        <CustomTable
          loading={loading}
          loadingSkeleton={<LoadingAllUsersSkeleton />}
          columns={ManagerAllUsersTableHeader}
          dataName="users"
          data={users}
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
export default AllUser;
