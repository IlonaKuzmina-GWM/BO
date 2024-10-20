import { DateRange } from "react-day-picker";

export interface FilterState {
  searchQuery: string;
  selectedInterval: string;
  selectedDateRange: DateRange | undefined;
  limit: number;
  currentPage: number;
}

export type FilterAction =
  | { type: "SET_SEARCH_QUERY"; payload: string }
  | { type: "SET_INTERVAL"; payload: string }
  | { type: "SET_DATE_RANGE"; payload: DateRange | undefined }
  | { type: "SET_LIMIT"; payload: number }
  | { type: "SET_CURRENT_PAGE"; payload: number };

export const initialFilterState: FilterState = {
  searchQuery: "",
  selectedInterval: "",
  selectedDateRange: undefined,
  limit: 10,
  currentPage: 1,
};

export function filterReducer(
  state: FilterState,
  action: FilterAction,
): FilterState {
  switch (action.type) {
    case "SET_SEARCH_QUERY":
      return { ...state, searchQuery: action.payload };
    case "SET_INTERVAL":
      return {
        ...state,
        selectedInterval: action.payload,
        selectedDateRange: undefined,
        currentPage: 1,
      };
    case "SET_DATE_RANGE":
      return {
        ...state,
        selectedDateRange: action.payload,
        selectedInterval: "",
        currentPage: 1,
      };
    case "SET_LIMIT":
      return { ...state, limit: action.payload, currentPage: 1 };
    case "SET_CURRENT_PAGE":
      return { ...state, currentPage: action.payload };
    default:
      return state;
  }
}
