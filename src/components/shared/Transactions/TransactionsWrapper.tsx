"use client";

import { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";
import DashSelect from "../DashSelect";
import DatePickerWithRange from "../DatePickerWithRange";
import Search from "../Search";

import { ROLES } from "@/constants/roles";
import { TransactionsTableHeader } from "@/constants/tableHeaders";
import { useTransactionContext } from "@/context/TransactionContext";
import { getStartDateForInterval } from "@/helpers/getStartDateForInterval";
import { useStore } from "@/stores/StoreProvider";
import { MerchantList } from "@/types/merchant";
import { ProviderList } from "@/types/provider";
import { Transaction } from "@/types/transaction";
import createCurrencyFilters from "@/utils/createCurrencyFilters";
import createFilters from "@/utils/createStatusFilters";
import { exportExcelTransactions } from "@/utils/export-utils";
import { observer } from "mobx-react-lite";
import DashButton from "../DashButton";
import DashIntervalSelect from "../DashIntervalSelect";
import DashSelectValueNumber from "../DashSelectValueNumber";
import DataLimitsSeter from "../DataLimitsSeter";
import ExportButton from "../ExportButton";
import PaginationComponent from "../PaginationComponent";
import CustomTransactionTable from "./CustomTransactionTable";
import StatusFilteringBadgeWrapper from "./StatusFilteringBadgeWrapper";

const TransactionsWrapper = observer(() => {
  const { authStore } = useStore();
  const { alertStore } = useStore();
  const { checkedTransactions } = useTransactionContext();
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

  const [paymentIds, setPaymentIds] = useState<string[]>([]);
  const [txList, setTxList] = useState<string[]>([]);

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

  const getDateRanges = () => {
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

    return {
      createdDateRange,
      updatedDateRange,
    };
  };

  const getSearchInput = () => {
    let search: string;

    if (paymentIds.length > 0 || txList.length > 0) {
      search = "";
    } else {
      search = searchQuery || "";
    }

    return search;
  };

  const getRequestBody = (
    search: string,
    createdDateRange: [number, number] | boolean,
    updatedDateRange: [number, number] | boolean,
  ) => {
    return {
      userId: userId,
      searchInput: search,
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
      txList: checkedTransactions.length > 0 ? checkedTransactions : txList,
      paymentIds,
      countryCode: searchCountryCodeQuery || "",
    };
  };

  const fetchTransactionsData = async () => {
    setLoading(true);

    const { createdDateRange, updatedDateRange } = getDateRanges();
    const search = getSearchInput();

    try {
      const response = await fetch("/api/post-filtered-transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          getRequestBody(search, createdDateRange, updatedDateRange),
        ),
      });

      if (response.ok) {
        const res = await response.json();

        setPaginatedTransactions(res.transactions);
        setTotalPages(res.totalPages);
        setAllStats(res.stats);
        setTotalTransactionsCount(res.totalTransactionsCount);
      } else {
        alertStore.setAlert("warning", "Transactions data response failed.");
      }
    } catch (error) {
      alertStore.setAlert("error", `Oops! Something went wrong: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const sendExportTransactionsData = async (exportType: "excel") => {
    const { createdDateRange, updatedDateRange } = getDateRanges();
    const search = getSearchInput();

    try {
      const response = await fetch("/api/post-export-transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          getRequestBody(search, createdDateRange, updatedDateRange),
        ),
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
  ]);

  const statusFilters = createFilters();

  const currencyFilters = createCurrencyFilters();

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
    }, 1500);
    return () => clearTimeout(handler);
  }, [inputSearchQueryValue, inputCountryCodeQueryValue]);

  const handleSearchChange = (value: string) => {
    setInputSearchQueryValue(value);

    const regex =
      /\b(\d+|[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}|[a-fA-F0-9]{32})\b/g;

    const ids = value.match(regex);

    if (ids) {
      const paymentIds = ids.filter((id) => /^\d+$/.test(id)).map(String);

      if (paymentIds) {
        setPaymentIds(paymentIds);
      }

      const txIds = ids.filter((id) => !/^\d+$/.test(id)).map(String);

      if (txIds) {
        setTxList(txIds);
      }
    } else {
      setTxList([]);
      setPaymentIds([]);
    }
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

  const handleStatusChange = (status: string, txId: string) => {
    const updatedTransactions = paginatedTransactions.map((transaction) => {
      if (transaction.txId === txId) {
        return { ...transaction, status };
      }

      return transaction;
    });

    setPaginatedTransactions(updatedTransactions);
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

        <div className="flex flex-wrap justify-end gap-5 xl:flex-nowrap">
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
        handleStatusChange={handleStatusChange}
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
