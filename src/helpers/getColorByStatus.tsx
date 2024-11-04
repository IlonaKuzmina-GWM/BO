export const getFailedColor = (status: string): boolean => {
  return [
    "PAYMENT_DECLINED",
    "PAYMENT_CANCELLED",
    "PAYMENT_FAILED",
    "TIMEOUT",
    "AML_BLOCKED",
  ].includes(status);
};

export const getSuccessColor = (status: string): boolean => {
  return ["PAYMENT_SUCCESS", "PAYMENT_COMPLETE"].includes(status);
};

export const getProcessColor = (status: string): boolean => {
  return [
    "PAYMENT_PROCESSING",
    "PAYMENT_ACCEPTED",
    "PAYMENT_CREATED",
    "TO_REFUND",
    "PAYMENT_INITIATED",
  ].includes(status);
};

export const transformStatus = (status: string) => {
  if (getFailedColor(status)) return "failed";
  if (getSuccessColor(status)) return "success";
  if (getProcessColor(status)) return "processing";
  return "default";
};

export const getStatusColorClass = (status: string) => {
  if (getFailedColor(status)) return "error";
  if (getSuccessColor(status)) return "success";
  if (getProcessColor(status)) return "warning";
  return "blue-500";
};
