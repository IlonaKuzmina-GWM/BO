"use client";

import React, { useEffect, useState } from "react";
import Search from "../Search";
import { DateRange } from "react-day-picker";
import DashSelect from "../DashSelect";
import DatePickerWithRange from "../DatePickerWithRange";

import { TransactionsTableHeader } from "@/utils/tableHeaders";
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
import StatusFilteringBadgeWrapper from "./StatusFilter/StatusFilteringBadgeWrapper";
import { ROLES } from "@/constants/roles";
import Alert from "@/components/shared/Alert";
import { Transaction } from "@/types/transaction";
import { MerchantList } from "@/types/merchant";
import { ProviderList } from "@/types/provider";

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
  const [selectedInterval, setSelectedInterval] = useState("");
  const [selectedDateRange, setSelectedDateRange] = useState<
    DateRange | undefined
  >(undefined);

  const [activeStatusBadge, setActiveStatusBadge] = useState<string>("all");
  const [paginatedTransactions, setPaginatedTransactions] = useState<
    Transaction[]
  >([]);

  const [statusList, setStatusList] = useState<{}>({});

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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiltersData();
  }, []);

  const fetchTransactionsData = async () => {
    let createdDateRange: [number, number] | boolean = false;

    if (selectedDateRange?.from && selectedDateRange.to) {
      const adjustedToDate = new Date(selectedDateRange.to);
      adjustedToDate.setHours(23, 59, 59, 999);
      createdDateRange = [
        selectedDateRange.from.getTime(),
        adjustedToDate.getTime(),
      ];
    }

    const updatedDateRange: [number, number] | boolean = false;

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
      } else {
        alertStore.setAlert("warning", "Transactions data response failed.");
      }
    } catch (error) {
      alertStore.setAlert("error", `Oops! Something went wrong: ${error}`);
    }
  };

  const sendExportTransactionsData = async (exportType: "excel") => {
    setLoading(true);

    let createdDateRange: [number, number] | boolean = false;

    if (selectedDateRange?.from && selectedDateRange.to) {
      const adjustedToDate = new Date(selectedDateRange.to);
      adjustedToDate.setHours(23, 59, 59, 999);
      createdDateRange = [
        selectedDateRange.from.getTime(),
        adjustedToDate.getTime(),
      ];
    }

    const updatedDateRange: [number, number] | boolean = false;

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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactionsData();
  }, [
    selectedDateRange,
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
      setSearchQuery(inputSearchQueryValue);
      setSearchCountryCodeQuery(inputCountryCodeQueryValue);
    }, 1000);

    return () => clearTimeout(handler);
  }, [inputSearchQueryValue, inputCountryCodeQueryValue]);

  const handleSearchChange = (value: string) => {
    setInputSearchQueryValue(value);
  };

  const handleCountrySearchChange = (value: string) => {
    setInputCountryCodeQueryValue(value);
  };

  const handleIntervalChange = (interval: string) => {
    setCurrentPage(1);
    setSelectedInterval(interval);

    const startDate = getStartDateForInterval(interval);
    const now = new Date();

    if (startDate) {
      const dateRange: DateRange = { from: startDate, to: now };
      setSelectedDateRange(dateRange);
    } else {
      setSelectedDateRange(undefined);
    }
  };

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setSelectedDateRange(range);
    setSelectedInterval("");
  };

  const handleLimitChange = (limit: number) => {
    setLimit(limit);
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
  };

  const handleStatusChange = (status: string) => {
    setChangedTransactionStatus(status);
    fetchTransactionsData();
  };

  return (
    <div className="">
      <div className="flex flex-row justify-between gap-6">
        <div className="flex flex-row flex-wrap gap-5">
          <Search
            placeholder="Enter name, email, provider"
            aditionalClass="max-w-[302px] min-w-[250px]"
            onSearch={handleSearchChange}
            searchValue={inputSearchQueryValue}
            searchIcon
          />

          <div className="flex">
            <DashIntervalSelect
              value={selectedInterval ? selectedInterval : "Select Interval"}
              label="No Interval"
              onIntervalChange={handleIntervalChange}
            />
            <DatePickerWithRange
              initialDate={selectedDateRange}
              onDateChange={handleDateRangeChange}
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
                searchInput
                searchContext="merchant"
                onSelectHandler={handleMerchantSelect}
              />

              <DashSelectValueNumber
                value={selectedProviders}
                label={"Select Providers"}
                items={providersList.map((provider) => ({
                  value: provider.provider_id,
                  label: provider.provider_name,
                }))}
                searchInput
                searchContext="provider"
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
            searchContext="status"
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
            searchContext="currency"
            onSelectHandler={handleCurrencySelect}
          />

          <Search
            placeholder={"Country Code"}
            aditionalClass="max-w-[150px] min-w-[100px]"
            onSearch={handleCountrySearchChange}
            searchValue={inputCountryCodeQueryValue}
          />
        </div>

        <ExportButton
          // onSelect={(exportType: "pdf" | "csv" | "excel") => {
          onSelect={(exportType: "excel") => {
            sendExportTransactionsData(exportType);
          }}
          disabled={loading}
        />
      </div>

      <StatusFilteringBadgeWrapper
        statusList={statusList}
        statusFilters={statusFilters}
        counter={paginatedTransactions.length.toString()}
        activeStatusBadge={activeStatusBadge}
        onClickHandler={activeFilterBageHandler}
      />

      <CustomTransactionTable
        paginatedTransactions={paginatedTransactions}
        columns={TransactionsTableHeader}
        handleStatusChangeToFetchActualeTRansaction={handleStatusChange}
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
