export type txFilters = {
    userId: number | undefined;
    searchInput: null | string;
	amountSort: boolean | number;
    createdSort: boolean | number;
    updatedSort: boolean | number;
    statusSort: Array[];
    createdDateRange: boolean | [number, number] | null;
    updatedDateRange: boolean | [number, number] | null;
    paginationPage: number;
    paginationPerPage: number;
    merchIds: Array[];
    providerIds: Array[];
}