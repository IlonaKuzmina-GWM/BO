"use client";

import {
  ManagerMerchantsTableHeader,
  OtherMerchantsTableHeader,
} from "@/constants/tableHeaders";
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
import { ROLES } from "@/constants/roles";
import LoadingAgentMerchantsSkeleton from "../LoadingUISkeletons/LoadingAgentMerchantsSkeleton";

const Merchants = () => {
  const { alertStore, authStore } = useStore();
  const userRole = authStore.role;
  const [loading, setLoading] = useState(true);

  const [inputSearchQueryValue, setInputSearchQueryValue] =
    useState<string>("");
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
          body: JSON.stringify({ search: searchQuery }),
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
      console.log(processedMerchants);
      // console.log("Fetched and processed merchants:", processedMerchants);

      // setAllMerchants(allMerchants);
      // console.log("Fetched and processed merchants:", allMerchants);
    } catch (error) {
      alertStore.setAlert("error", `Oops! Something went wrong: ${error}`);
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
        setStoresList(res);
      } else {
        alertStore.setAlert("warning", "Get store response failed.");
      }
    } catch (error) {
      alertStore.setAlert("error", `Oops! Something went wrong: ${error}`);
    }
  };

  useEffect(() => {
    fetchAllMerchantsData();
    fetchFiltersData();
    fetchStoresListData();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  }, []);

  useEffect(() => {
    fetchAllMerchantsData();
  }, [searchQuery]);

  const toggleStatus = (type: 'sandbox' | 'disabled', merchantId: number) => {
    setAllMerchants((prevMerchants) =>
      prevMerchants.map((merchant) =>
        merchant.id === merchantId
          ? { ...merchant, [type]: !merchant[type] }
          : merchant,
      ),
    );
  };

  const updateMerchant = async (type: 'providerId' | 'storeId' | 'sandbox' | 'disabled', merchantId: number, value: number | boolean) => {
    try {
      const response = await fetch("/api/post-admin-update-merchant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          field: type,
          id: merchantId,
          value
        })
      });

      const res = await response.json();

      if (response.ok && res.success) {
        if (type === 'sandbox' || type === 'disabled') {
          toggleStatus(type, merchantId);    
        }

        alertStore.setAlert(
          "success",
          "Merchant successfully updated.",
        );
      } else {
        alertStore.setAlert(
          "warning",
          "Failed to update merchant.",
        );
      }
    } catch (error) {
      alertStore.setAlert(
        "error",
        "Failed to send request.",
      );
    }
  }

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

  useEffect(() => {
    const handler = setTimeout(() => {
      setLoading(false);
      setSearchQuery(inputSearchQueryValue);
    }, 1000);
    setLoading(true);
    return () => clearTimeout(handler);
  }, [inputSearchQueryValue]);

  const handleSearchChange = (value: string) => {
    setInputSearchQueryValue(value);
  };
  // admin, owner, developer includes roles kā stringus norādīt

  return (
    <div>
      <div className="rounded-bl-[4px] rounded-br-[4px] rounded-tr-[4px] bg-white pt-[20px]">
        <div className="flex justify-between px-[20px] pb-[16px]">
          <Paragraph text="List of Merchants" />
          {userRole !== ROLES.AGENT && (
            <Search
              placeholder="Enter name, host, label"
              aditionalClass="max-w-[302px]"
              onSearch={handleSearchChange}
              searchValue={inputSearchQueryValue}
              searchIcon
            />
          )}
        </div>

        {userRole !== ROLES.ADMIN ? (
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
                      className="border-e border-hoverBg px-2"
                      // onClick={openMerchantCongigBar}
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
                        onSelectNumberHandler={(selectedStoreId) =>
                          updateMerchant('storeId', merchant.id, selectedStoreId)
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
                        // onSelectNumberHandler={(selectedProviderId) =>
                        //   updateMerchant('providerId', merchant.id, selectedProviderId)
                        // }
                      />
                    </td>

                    <td className="px-2">
                      <div
                        className={`flex justify-center rounded-[4px] px-[4px] py-[8px] ${
                          merchant.sandbox
                            ? "bg-successBg text-success"
                            : "bg-errorBg text-error"
                        }`}
                      >
                        {merchant.sandbox ? "Enabled" : "Disabled"}
                      </div>
                    </td>
                    <td className="px-2 text-[--error] lg:pr-8">
                      <Switcher
                        id={`switcher-${merchant.label}`}
                        checked={merchant.sandbox}
                        onChange={() => updateMerchant('sandbox', merchant.id, !merchant.sandbox)}
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
                        onChange={() => updateMerchant('disabled', merchant.id, !merchant.disabled)}
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
        ) : (
          <table className="min-w-full table-auto border-y border-hoverBg text-left text-sm leading-[18px] text-main">
            <thead className="h-[50px] bg-hoverBg font-semibold">
              <tr>
                {OtherMerchantsTableHeader.map((col, index) => (
                  <th
                    key={col.key}
                    className={`${
                      index === 0 ? "pl-3 lg:pl-8" : ""
                    } ${index === OtherMerchantsTableHeader.length - 1 ? "pr-3 lg:pr-8" : ""} ${
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
                <LoadingAgentMerchantsSkeleton />
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
                    <td className="border-e border-hoverBg px-2">
                      {merchant.label}
                    </td>

                    <td className="border-e border-hoverBg px-2">
                      {merchant.managerId}
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
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={OtherMerchantsTableHeader.length}
                    className="py-4 text-center"
                  >
                    No merchants available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
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
