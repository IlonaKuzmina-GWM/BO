"use client";

import { ManagerMerchantsTableHeader } from "@/utils/tableHeaders";
import { useEffect, useRef, useState } from "react";
import DataLimitsSeter from "../DataLimitsSeter";
import PaginationComponent from "../PaginationComponent";
import Paragraph from "../Paragraph";
import Search from "../Search";
import { useStore } from "@/stores/StoreProvider";
import { Merchant } from "@/types/merchant";
import MerchantConfigurationBar from "./MerchantConfigurationBar/MerchantConfigurationBar";
import { ProviderList } from "@/types/provider";
import { Store } from "@/types/store";
import LoadingMerchantsSkeleton from "../LoadingUISkeletons/LoadingMerchantsSkeleton";
import Switcher from "../Switcher";
import DropdownWithSearch from "../DropdownWithSearch";

const Merchants = () => {
  const { alertStore, authStore } = useStore();
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [allMerchants, setAllMerchants] = useState<Merchant[]>([]);
  const [merchantCongfigBarOpen, setMerchantConfigBarOpen] = useState(false);

  const [storesList, setStoresList] = useState<Store[]>([]);
  const [providersList, setProvidersList] = useState<ProviderList[]>([]);

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
      console.log("Fetched and processed merchants:", processedMerchants);

      // setAllMerchants(allMerchants);
      // console.log("Fetched and processed merchants:", allMerchants);
    } catch (error) {
      alertStore.setAlert("error", `Oops! Something went wrong: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchFiltersData = async () => {
    try {
      const response = await fetch("/api/get-filters", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const res = await response.json();

        setProvidersList(res.providers);
      } else {
        alertStore.setAlert("warning", "Get filters response failed.");
      }
    } catch (error) {
      alertStore.setAlert("error", `Oops! Something went wrong: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchStoresListData = async () => {
    try {
      const response = await fetch("/api/get-stores", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const res = await response.json();

        console.log("res", res);

        setStoresList(res);
      } else {
        alertStore.setAlert("warning", "Get store response failed.");
      }
    } catch (error) {
      alertStore.setAlert("error", `Oops! Something went wrong: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllMerchantsData();
    fetchFiltersData();
    fetchStoresListData();
  }, []);

  const toggleStatus = (id: number) => {
    setAllMerchants((prevMerchants) =>
      prevMerchants.map((merchant) =>
        merchant.id === id
          ? { ...merchant, disabled: !merchant.disabled }
          : merchant,
      ),
    );
  };

  const updateProvider = (merchantId: number, selectedProviderId: number) => {
    console.log("updateProvider", merchantId, selectedProviderId);
    // setAllMerchants((prevUsers) =>
    //   prevUsers.map((user) =>
    //     user.id === merchantId ? { ...user, merchant: selectedProviderId } : user,
    //   ),
    // );
  };

  const updateStore = (merchantId: number, storeId: number) => {
    console.log("updateStore", merchantId, storeId);
    // setAllMerchants((prevUsers) =>
    //   prevUsers.map((user) =>
    //     user.id === merchantId ? { ...user, merchant: storeId } : user,
    //   ),
    // );
  };

  const openMerchantCongigBar = () => {
    console.log("openMerchantCongigBar");
    setMerchantConfigBarOpen(!merchantCongfigBarOpen);
  };

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
        <div className="flex justify-between px-[20px] pb-[16px]">
          <Paragraph text="List of Merchants" />
          <Search
            placeholder="Enter name, host, label"
            aditionalClass="max-w-[302px]"
            onSearch={() => {}}
          />
        </div>
        <table className="min-w-full table-auto border-y border-hoverBg text-left text-sm leading-[18px] text-main">
          <thead className="h-[50px] bg-hoverBg font-semibold">
            <tr>
              {ManagerMerchantsTableHeader.map((col, index) => (
                <th
                  key={col.key}
                  className={`${
                    index === 0 ? "pl-3 lg:pl-8" : ""
                  } ${index === ManagerMerchantsTableHeader.length - 1 ? "pr-3 lg:pr-8" : ""} ${
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
              <LoadingMerchantsSkeleton />
            ) : paginatedMerchants.length > 0 ? (
              paginatedMerchants.map((merchant) => (
                <tr
                  className="h-[50px] border-b border-hoverBg last:border-none"
                  key={merchant.id}
                >
                  <td className="border-e border-hoverBg pl-3 pr-2 lg:pl-8">
                    {merchant.id}
                  </td>
                  <td
                    className="cursor-pointer border-e border-hoverBg px-2"
                    onClick={openMerchantCongigBar}
                  >
                    {merchant.name}
                  </td>
                  <td className="border-e border-hoverBg p-2">
                    <DropdownWithSearch
                      value={merchant.store.id}
                      label={merchant.store.name}
                      items={storesList.map((store) => ({
                        value: store.id,
                        label: store.name,
                      }))}
                      onSelectHandler={(selectedStoreId) =>
                        updateStore(merchant.id, selectedStoreId)
                      }
                    />
                  </td>
                  <td className="border-e border-hoverBg px-2">
                    {merchant.label}
                  </td>
                  <td className="border-e border-hoverBg px-2">
                    <a
                      href={`https://${merchant.host}`}
                      target="_blank"
                      className="text-blue500"
                    >
                      @{merchant.host}
                    </a>
                  </td>
                  <td className="border-e border-hoverBg px-2 text-center">
                    {merchant.settlementedAmount}
                  </td>
                  <td className="flex border-e border-hoverBg p-2">
                    <DropdownWithSearch
                      value={0}
                      label={"All Providers"}
                      items={providersList.map((provider) => ({
                        value: provider.provider_id,
                        label: provider.provider_name,
                      }))}
                      onSelectHandler={(selectedProviderId) =>
                        updateProvider(merchant.id, selectedProviderId)
                      }
                    />
                  </td>

                  <td className="px-2">
                    <div
                      className={`flex justify-center rounded-[4px] px-[4px] py-[8px] ${
                        merchant.disabled
                          ? "bg-successBg text-success"
                          : "bg-errorBg text-error"
                      }`}
                    >
                      {merchant.disabled ? "Enabled" : "Disabled"}
                    </div>
                  </td>
                  <td className="px-2 text-[--error] lg:pr-8">
                    <Switcher
                      id={`switcher-${merchant.id}`}
                      checked={merchant.disabled}
                      onChange={() => toggleStatus(merchant.id)}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={ManagerMerchantsTableHeader.length}
                  className="py-4 text-center"
                >
                  No merchants available
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

      {merchantCongfigBarOpen && (
        <MerchantConfigurationBar
          isOpen={merchantCongfigBarOpen}
          handleConfigBarIsOpen={openMerchantCongigBar}
        />
      )}
    </div>
  );
};

export default Merchants;
