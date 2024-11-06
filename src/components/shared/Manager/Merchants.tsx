"use client";

import { ManagerMerchantsTableHeader } from "@/utils/tableHeaders";
import { useEffect, useState } from "react";
import CustomTable from "../CustomTable/CustomTable";
import DataLimitsSeter from "../DataLimitsSeter";
import PaginationComponent from "../PaginationComponent ";
import Paragraph from "../Paragraph";
import Search from "../Search";
import MerchantRows from "./MerchantRows";
import { useStore } from "@/stores/StoreProvider";
import { Merchant } from "@/types/merchant";

const Merchants = () => {
  const { alertStore, authStore } = useStore();
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [allMerchants, setAllMerchants] = useState<Merchant[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState<number>(10);

  const fetchAllMerchantsData = async () => {
    try {
      let allMerchants: Merchant[] = [];

      if (authStore.role?.toLowerCase() === "agent") {
        const response = await fetch("/api/get-merchants", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const res = await response.json();
          allMerchants = res || [];
        } else {
          alertStore.setAlert(
            "warning",
            "Failed to fetch merchants for agent.",
          );
        }
      } else {
        const response = await fetch("/api/post-merchants", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ search: "" }),
        });

        if (response.ok) {
          const res = await response.json();
          allMerchants = res;
        } else {
          alertStore.setAlert("warning", "All merchants fetching failed.");
        }
      }

      const processedMerchants = allMerchants.map((merchant) => ({
        ...merchant,
        store: merchant.store || { id: "-", name: "-", host: "-" },
      }));

      setAllMerchants(processedMerchants);
      // console.log("Fetched and processed merchants:", processedMerchants);

      // setAllMerchants(allMerchants);
      // console.log("Fetched and processed merchants:", allMerchants);
    } catch (error) {
      alertStore.setAlert("error", `Oops! Something went wrong: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllMerchantsData();
  }, []);

  // const toggleStatus = (id: string) => {
  //   setAllMerchants((prevMerchants) =>
  //     prevMerchants.map((merchant) =>
  //       merchant.id === id
  //         ? {
  //             ...merchant,
  //             status: merchant.status === "Enabled" ? "Disabled" : "Enabled",
  //           }
  //         : merchant,
  //     ),
  //   );
  // };

  // const updateProvider = (id: string, provider: string) => {
  //   setMerchants((prevMerchants) =>
  //     prevMerchants.map((merchant) =>
  //       merchant.id === id ? { ...merchant, providers: provider } : merchant,
  //     ),
  //   );
  // };

  // const items = [
  //   { value: "apple", label: "Apple" },
  //   { value: "banana", label: "Banana" },
  //   { value: "blueberry", label: "Blueberry" },
  //   { value: "grapes", label: "Grapes" },
  //   { value: "pineapple", label: "Pineapple" },
  // ];

  const renderRow = (merchant: Merchant, index: number) => (
    <MerchantRows key={merchant.id} merchant={merchant} />
  );

  const totalPages = Math.ceil(allMerchants.length / limit);

  const paginatedMerchants = allMerchants.slice(
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
        <div className="flex justify-between pb-[16px] pl-[20px]">
          <Paragraph text="List of Merchants" />
          {/* <Search
            placeholder="Enter name, host, label"
            aditionalClass="max-w-[302px]"
            onSearch={handleSearch}
          /> */}
        </div>
        <CustomTable
          columns={ManagerMerchantsTableHeader}
          dataName="merchants"
          data={paginatedMerchants}
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

export default Merchants;
