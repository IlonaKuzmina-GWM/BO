export const STATUSES = {
  PAYMENT_INITIATED: "PAYMENT_INITIATED",
  PAYMENT_DECLINED: "PAYMENT_DECLINED",
  PAYMENT_PROCESSING: "PAYMENT_PROCESSING",
  PAYMENT_TRANSFERRING: "PAYMENT_TRANSFERRING",
  PAYMENT_SUCCESS: "PAYMENT_SUCCESS",
  PAYMENT_COMPLETE: "PAYMENT_COMPLETE",
  PAYMENT_ACCEPTED: "PAYMENT_ACCEPTED",
  PAYMENT_FAILED: "PAYMENT_FAILED",
  TIMEOUT: "TIMEOUT",
  AML_BLOCKED: "AML_BLOCKED",
  PAYMENT_CANCELLED: "PAYMENT_CANCELLED",
  REFUNDED: "REFUNDED",
  TO_REFUNDED: "TO_REFUNDED",
};

export const STATUS_LABELS = {
  [STATUSES.PAYMENT_INITIATED]: "Initiated",
  [STATUSES.PAYMENT_DECLINED]: "Declined",
  [STATUSES.PAYMENT_PROCESSING]: "Processing",
  [STATUSES.PAYMENT_TRANSFERRING]: "Transferring",
  [STATUSES.PAYMENT_SUCCESS]: "Success",
  [STATUSES.PAYMENT_COMPLETE]: "Complete",
  [STATUSES.PAYMENT_ACCEPTED]: "Accepted",
  [STATUSES.PAYMENT_FAILED]: "Failed",
  [STATUSES.TIMEOUT]: "Timeout",
  [STATUSES.AML_BLOCKED]: "Aml blocked",
  [STATUSES.PAYMENT_CANCELLED]: "Cancelled",
  [STATUSES.REFUNDED]: "Refunded",
  [STATUSES.TO_REFUNDED]: "To refunded",
};


export const statusFilters = [
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