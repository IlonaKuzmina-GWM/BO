"use client";

import React, { useEffect, useState } from "react";
import Search from "../Search";
import { DateRange } from "react-day-picker";
import DashSelect from "../DashSelect";
import DatePickerWithRange from "../DatePickerWithRange";
import { LoadingSpiner } from "../LoadingUI/LoadingSpiner";
import { Transaction } from "@/types";
import { TransactionsTableHeader } from "@/utils/tableHeaders";
import DataLimitsSeter from "../DataLimitsSeter";
import PaginationComponent from "../PaginationComponent ";
import CustomTransactionTable from "./CustomTransactionTable";
import DashIntervalSelect from "../DashIntervalSelect";
import { getStartDateForInterval } from "@/helpers/getStartDateForInterval";
import { useStore } from "@/stores/StoreProvider";
import ExportButton from "../ExportButton";
import { exportExcelTransactions } from "@/utils/export-utils";
import DashSelectValueNumber from "../DashSelectValueNumber";
import StatusFilteringBadgeWrapper from "../StatusFilter/StatusFilteringBadgeWrapper";

interface Merchant {
  merchant_id: number;
  merchant_name: string;
}

interface Provider {
  provider_id: number;
  provider_name: string;
}

const TransactionsWrapper = () => {
  const { authStore } = useStore();
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

  const [merchantsList, setMerchantsList] = useState<Merchant[]>([]);
  const [providersList, setProvidersList] = useState<Provider[]>([]);

  const [selectedMerchants, setSelectedMerchants] = useState<number[]>([]);
  const [selectedProviders, setSelectedProviders] = useState<number[]>([]);

  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [selectedCurrency, setSelectedCurrency] = useState<string[]>([]);

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

        // console.log("filterss data", res);

        setMerchantsList(res.merchants);
        setProvidersList(res.providers);
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
        console.log("transactions in trasnactions page", res.transactions);
      } else {
        // console.log("Transactions response failed");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const sendExportTransactionsData = async (
    exportType:  "excel",
  ) => {
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
          statusSort: [],
          createdDateRange,
          updatedDateRange,
          paginationPage: currentPage,
          paginationPerPage: limit,
          merchIds: [],
          providerIds: [],
          currency: [],
          txList: [],
          paymentIds: [],
          countryCode: "",
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
      } else {
        console.log("Transactions response failed");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
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
  ]);

  const statusFilters = [
    {
      label: 'Processing',
      value: 'PAYMENT_PROCESSING',
  },
  {
      label: 'Transferring',
      value: 'PAYMENT_TRANSFERRING',
  },
  {
      label: 'Success',
      value: 'PAYMENT_SUCCESS',
  },
  {
      label: 'Complete',
      value: 'PAYMENT_COMPLETE',
  },
  {
      label: 'Accepted',
      value: 'PAYMENT_ACCEPTED',
  },
  {
      label: 'Failed',
      value: 'PAYMENT_FAILED',
  },
  {
      label: 'Timeout',
      value: 'TIMEOUT',
  },
  {
      label: 'Aml blocked',
      value: 'AML_BLOCKED',
  },
  {
      label: 'Cancelled',
      value: 'PAYMENT_CANCELLED',
  },
  {
      label: 'Refunded',
      value: 'REFUNDED',
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
    // console.log(status);
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

          {userRole !== "merchant" && (
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
      />

      <div className="relative">
        <DataLimitsSeter onChange={handleLimitChange} defaultValue={limit}/>
        <PaginationComponent
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default TransactionsWrapper;
