import type { txFilters } from "@/types/transactionsFiltersDTO";

export function createFilters(userId: number, page: number, pageLimit: number) {
  return <txFilters>({
    userId: userId,
    searchInput: "",
    amountSort: false,
    createdSort: false,
    updatedSort: false,
    statusSort: [],
    createdDateRange: false,
    updatedDateRange: false,
    paginationPage: page,
    paginationPerPage: pageLimit,
    merchIds: [],
    providerIds: [],
    currency: [],
    txList: [],
    paymentIds: [],
  });
}
