"use client";

import React, { useEffect, useState } from "react";
import Search from "../Search";
import { DateRange } from "react-day-picker";
import DashSelect from "../DashSelect";
import DatePickerWithRange from "../DatePickerWithRange";

import DataLimitsSeter from "../DataLimitsSeter";
import PaginationComponent from "../PaginationComponent";
import CustomTransactionTable from "./CustomTransactionTable";
import DashIntervalSelect from "../DashIntervalSelect";
import { getStartDateForInterval } from "@/helpers/getStartDateForInterval";
import { useStore } from "@/stores/StoreProvider";
import { observer } from "mobx-react-lite";
import ExportButton from "../ExportButton";
import { exportExcelTransactions } from "@/utils/export-utils";
import DashSelectValueNumber from "../DashSelectValueNumber";
import StatusFilteringBadgeWrapper from "./StatusFilteringBadgeWrapper";
import { ROLES } from "@/constants/roles";
import { Transaction } from "@/types/transaction";
import { MerchantList } from "@/types/merchant";
import { ProviderList } from "@/types/provider";
import DashButton from "../DashButton";
import { TransactionsTableHeader } from "@/constants/tableHeaders";

const TransactionsWrapper = observer(() => {
  const { authStore } = useStore();
  const { alertStore } = useStore();
  const userId = authStore.user?.id;
  const userRole = authStore.role;

  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState(true);

  const [inputSearchQueryValue, setInputSearchQueryValue] =
    useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [inputCountryCodeQueryValue, setInputCountryCodeQueryValue] =
    useState<string>("");
  const [searchCountryCodeQuery, setSearchCountryCodeQuery] =
    useState<string>("");

  const [limit, setLimit] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalTransactionsCount, setTotalTransactionsCount] =
    useState<number>(0);

  const [selectedCreatedInterval, setSelectedCreatedInterval] = useState("");
  const [selectedCreatedDateRange, setSelectedCreatedDateRange] = useState<
    DateRange | undefined
  >(undefined);

  const [selectedUpdatedInterval, setSelectedUpdatedInterval] = useState("");
  const [selectedUpdatedDateRange, setSelectedUpdatedDateRange] = useState<
    DateRange | undefined
  >(undefined);

  const [activeStatusBadge, setActiveStatusBadge] = useState<string>("all");
  const [paginatedTransactions, setPaginatedTransactions] = useState<
    Transaction[]
  >([]);
  const [allStats, setAllStats] = useState({});

  const [merchantsList, setMerchantsList] = useState<MerchantList[]>([]);
  const [providersList, setProvidersList] = useState<ProviderList[]>([]);

  const [selectedMerchants, setSelectedMerchants] = useState<number[]>([]);
  const [selectedProviders, setSelectedProviders] = useState<number[]>([]);

  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [selectedCurrency, setSelectedCurrency] = useState<string[]>([]);

  const [changedTransactionStatus, setChangedTransactionStatus] = useState("");

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

        setMerchantsList(res.merchants);
        setProvidersList(res.providers);
      } else {
        alertStore.setAlert("warning", "Get filters response failed.");
      }
    } catch (error) {
      alertStore.setAlert("error", `Oops! Something went wrong: ${error}`);
    }
  };

  useEffect(() => {
    if (userRole !== ROLES.MERCHANT) {
      fetchFiltersData();
    }
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  }, []);

  const fetchTransactionsData = async () => {
    setLoading(true);

    let createdDateRange: [number, number] | boolean = false;

    if (selectedCreatedDateRange?.from && selectedCreatedDateRange.to) {
      const adjustedToDate = new Date(selectedCreatedDateRange.to);
      adjustedToDate.setHours(23, 59, 59, 999);
      createdDateRange = [
        selectedCreatedDateRange.from.getTime(),
        adjustedToDate.getTime(),
      ];
    }

    let updatedDateRange: [number, number] | boolean = false;

    if (selectedUpdatedDateRange?.from && selectedUpdatedDateRange.to) {
      const adjustedToDate = new Date(selectedUpdatedDateRange.to);
      adjustedToDate.setHours(23, 59, 59, 999);
      updatedDateRange = [
        selectedUpdatedDateRange.from.getTime(),
        adjustedToDate.getTime(),
      ];
    }

    try {
      const response = await fetch("/api/post-filtered-transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
          searchInput: searchQuery || "",
          amountSort: false,
          createdSort: false,
          updatedSort: false,
          statusSort: selectedStatus,
          createdDateRange,
          updatedDateRange,
          paginationPage: currentPage,
          paginationPerPage: limit,
          merchIds: selectedMerchants,
          providerIds: selectedProviders,
          currency: selectedCurrency,
          txList: [],
          paymentIds: [],
          countryCode: searchCountryCodeQuery || "",
        }),
      });

      if (response.ok) {
        const res = await response.json();

        setPaginatedTransactions(res.transactions);
        setTotalPages(res.totalPages);
        setAllStats(res.stats);
        setTotalTransactionsCount(res.totalTransactionsCount);
        setLoading(false);
        console.log(res);
      } else {
        alertStore.setAlert("warning", "Transactions data response failed.");
      }
    } catch (error) {
      alertStore.setAlert("error", `Oops! Something went wrong: ${error}`);
    }
  };

  const sendExportTransactionsData = async (exportType: "excel") => {
    let createdDateRange: [number, number] | boolean = false;

    if (selectedCreatedDateRange?.from && selectedCreatedDateRange.to) {
      const adjustedToDate = new Date(selectedCreatedDateRange.to);
      adjustedToDate.setHours(23, 59, 59, 999);
      createdDateRange = [
        selectedCreatedDateRange.from.getTime(),
        adjustedToDate.getTime(),
      ];
    }

    let updatedDateRange: [number, number] | boolean = false;

    if (selectedUpdatedDateRange?.from && selectedUpdatedDateRange.to) {
      const adjustedToDate = new Date(selectedUpdatedDateRange.to);
      adjustedToDate.setHours(23, 59, 59, 999);
      updatedDateRange = [
        selectedUpdatedDateRange.from.getTime(),
        adjustedToDate.getTime(),
      ];
    }

    try {
      const response = await fetch("/api/post-export-transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
          searchInput: searchQuery || "",
          amountSort: false,
          createdSort: false,
          updatedSort: false,
          statusSort: selectedStatus,
          createdDateRange,
          updatedDateRange,
          paginationPage: currentPage,
          paginationPerPage: limit,
          merchIds: selectedMerchants,
          providerIds: selectedProviders,
          currency: selectedCurrency,
          txList: [],
          paymentIds: [],
          countryCode: searchCountryCodeQuery || "",
        }),
      });

      if (response.ok) {
        const res = await response.json();

        const transactionData = res;
        // console.log(transactionData);

        if (exportType === "excel") {
          // console.log("exporting excel", transactionData);
          exportExcelTransactions(transactionData);
        } else if (exportType === "csv") {
          //      exportCsvTransactions(transactionData);
        } else if (exportType === "pdf") {
          //       exportPdfTransactions(transactionData);
        }
        alertStore.setAlert(
          "success",
          `Transactions data exported successfully!`,
        );
      } else {
        alertStore.setAlert("warning", "Transactions response failed.");
      }
    } catch (error) {
      alertStore.setAlert("error", `Oops! Something went wrong: ${error}`);
    }
  };

  useEffect(() => {
    fetchTransactionsData();
  }, [
    selectedCreatedDateRange,
    selectedUpdatedDateRange,
    limit,
    searchQuery,
    currentPage,
    selectedMerchants,
    selectedProviders,
    activeStatusBadge,
    selectedStatus,
    selectedCurrency,
    searchCountryCodeQuery,
    changedTransactionStatus,
  ]);

  const statusFilters = [
    {
      label: "Processing",
      value: "PAYMENT_PROCESSING",
    },
    {
      label: "Transferring",
      value: "PAYMENT_TRANSFERRING",
    },
    {
      label: "Success",
      value: "PAYMENT_SUCCESS",
    },
    {
      label: "Complete",
      value: "PAYMENT_COMPLETE",
    },
    {
      label: "Accepted",
      value: "PAYMENT_ACCEPTED",
    },
    {
      label: "Failed",
      value: "PAYMENT_FAILED",
    },
    {
      label: "Timeout",
      value: "TIMEOUT",
    },
    {
      label: "Aml blocked",
      value: "AML_BLOCKED",
    },
    {
      label: "Initiated",
      value: "PAYMENT_INITIATED",
    },
    {
      label: "Cancelled",
      value: "PAYMENT_CANCELLED",
    },
    {
      label: "Refunded",
      value: "REFUNDED",
    },
    {
      label: "Declined",
      value: "PAYMENT_DECLINED",
    },
  ];

  const currencyFilters = [
    {
      label: "EUR",
      value: "eur",
    },
    {
      label: "GBP",
      value: "gbp",
    },
  ];

  const activeFilterBageHandler = (name: string) => {
    if (name === "all") {
      setSelectedStatus([]);
      setActiveStatusBadge("all");
    } else {
      setSelectedStatus([name]);
      setActiveStatusBadge(name);
    }
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setLoading(false);
      setSearchQuery(inputSearchQueryValue);
      setSearchCountryCodeQuery(inputCountryCodeQueryValue);
    }, 1500);
    setLoading(true);
    return () => clearTimeout(handler);
  }, [inputSearchQueryValue, inputCountryCodeQueryValue]);

  const handleSearchChange = (value: string) => {
    setInputSearchQueryValue(value);
  };

  const handleCountrySearchChange = (value: string) => {
    setInputCountryCodeQueryValue(value);
  };

  const handleCreatedIntervalChange = (interval: string) => {
    setCurrentPage(1);

    setSelectedCreatedInterval(interval);
    setSelectedCreatedDateRange(undefined);

    setSelectedUpdatedInterval("");
    setSelectedUpdatedDateRange(undefined);

    const startDate = getStartDateForInterval(interval);
    const now = new Date();

    if (startDate) {
      setSelectedCreatedDateRange({ from: startDate, to: now });
    }
  };

  const handleCreatedDateRangeChange = (range: DateRange | undefined) => {
    setSelectedCreatedDateRange(range);
    setSelectedUpdatedDateRange(undefined);
    setSelectedCreatedInterval("");
  };

  const handleUpdatedIntervalChange = (interval: string) => {
    setCurrentPage(1);

    setSelectedUpdatedInterval(interval);
    setSelectedUpdatedDateRange(undefined);

    setSelectedCreatedInterval("");
    setSelectedCreatedDateRange(undefined);

    const startDate = getStartDateForInterval(interval);
    const now = new Date();

    if (startDate) {
      setSelectedUpdatedDateRange({ from: startDate, to: now });
    }
  };

  const handleUpdatedDateRangeChange = (range: DateRange | undefined) => {
    setSelectedUpdatedDateRange(range);
    setSelectedCreatedDateRange(undefined);
    setSelectedUpdatedInterval("");
  };

  const handleMerchantSelect = (merchants: number[]) => {
    setSelectedMerchants(merchants);
  };

  const handleProviderSelect = (providers: number[]) => {
    setSelectedProviders(providers);
  };

  const handleCurrencySelect = (currencies: string[]) => {
    setSelectedCurrency(currencies);
  };

  const handleStatusSelect = (status: string[]) => {
    setSelectedStatus(status);
    setActiveStatusBadge("all");
  };

  const handleStatusChange = (status: string) => {
    setChangedTransactionStatus(status);
    fetchTransactionsData();
  };

  const handleLimitChange = (limit: number) => {
    setLimit(limit);
  };

  const handleResetFilters = () => {
    setInputSearchQueryValue("");
    setSearchQuery("");
    setInputCountryCodeQueryValue("");
    setSearchCountryCodeQuery("");

    setSelectedCreatedInterval("");
    setSelectedCreatedDateRange(undefined);

    setSelectedUpdatedInterval("");
    setSelectedUpdatedDateRange(undefined);

    setSelectedMerchants([]);
    setSelectedProviders([]);

    setSelectedStatus([]);
    setSelectedCurrency([]);

    setActiveStatusBadge("all");
    setCurrentPage(1);
    setLimit(10);

    // fetchTransactionsData();
  };

  return (
    <div className="">
      <div className="flex flex-row justify-between gap-6">
        <div className="flex flex-row flex-wrap gap-3">
          <Search
            placeholder="Enter name, email, provider"
            aditionalClass="max-w-[302px] min-w-[250px]"
            onSearch={handleSearchChange}
            searchValue={inputSearchQueryValue}
            searchIcon
          />

          <div className="flex">
            <DashIntervalSelect
              value={
                selectedCreatedInterval
                  ? selectedCreatedInterval
                  : "Created Interval"
              }
              label="No Interval"
              onIntervalChange={handleCreatedIntervalChange}
            />
            <DatePickerWithRange
              initialDate={selectedCreatedDateRange}
              onDateChange={handleCreatedDateRangeChange}
              name="Created date range"
            />
          </div>

          <div className="flex">
            <DashIntervalSelect
              value={
                selectedUpdatedInterval
                  ? selectedUpdatedInterval
                  : "Updated Interval"
              }
              label="No Interval"
              onIntervalChange={handleUpdatedIntervalChange}
            />
            <DatePickerWithRange
              initialDate={selectedUpdatedDateRange}
              onDateChange={handleUpdatedDateRangeChange}
              name="Updated date range"
            />
          </div>

          {userRole !== ROLES.MERCHANT && (
            <>
              <DashSelectValueNumber
                value={selectedMerchants}
                label={"Select Merchants"}
                items={merchantsList.map((merchant) => ({
                  value: merchant.merchant_id,
                  label: merchant.merchant_name,
                }))}
                onSelectHandler={handleMerchantSelect}
              />

              <DashSelectValueNumber
                value={selectedProviders}
                label={"Select Providers"}
                items={providersList.map((provider) => ({
                  value: provider.provider_id,
                  label: provider.provider_name,
                }))}
                onSelectHandler={handleProviderSelect}
              />
            </>
          )}

          <DashSelect
            value={selectedStatus}
            label={"Select Status"}
            items={statusFilters.map((status) => ({
              value: status.value,
              label: status.label,
            }))}
            searchInput
            onSelectHandler={handleStatusSelect}
          />

          <DashSelect
            value={selectedCurrency}
            label={"Select Currency"}
            items={currencyFilters.map((currency) => ({
              value: currency.value,
              label: currency.label,
            }))}
            searchInput
            onSelectHandler={handleCurrencySelect}
          />

          <Search
            placeholder={"Country Code"}
            aditionalClass="max-w-[150px] min-w-[100px]"
            onSearch={handleCountrySearchChange}
            searchValue={inputCountryCodeQueryValue}
          />
        </div>

        <div className="flex flex-wrap xl:flex-nowrap gap-5 justify-end">
          <DashButton
            name={"Reset"}
            type={"empty"}
            onClickHandler={handleResetFilters}
            additionalStyle="w-[115px]"
          />

          <ExportButton
            // onSelect={(exportType: "pdf" | "csv" | "excel") => {
            onSelect={(exportType: "excel") => {
              sendExportTransactionsData(exportType);
            }}
            disabled={loading}
            additionalStyle="w-[115px]"
          />
        </div>
      </div>

      <StatusFilteringBadgeWrapper
        statusList={allStats}
        activeStatusBadge={activeStatusBadge}
        totalTransactionsCount={totalTransactionsCount}
        onClickHandler={activeFilterBageHandler}
      />

      <CustomTransactionTable
        paginatedTransactions={paginatedTransactions}
        columns={TransactionsTableHeader}
        handleStatusChangeToFetchActualeTRansaction={handleStatusChange}
        isLoading={loading}
      />

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
});

export default TransactionsWrapper;
