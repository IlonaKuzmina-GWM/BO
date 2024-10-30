export function getFilteredTransactionsRoute(role: string | undefined): string {
  if (!role) {
    throw new Error("Role is undefined");
  }
  if (["agent", "merchant"].includes(role)) {
    return "/transactions/filter";
  } else if (role === "developer" || role === "admin") {
    return "/admin/validated-transactions";
  } else if (role === "manager") {
    return "/manager/transactions";
  } else if (role === "support") {
    return "/support/transactions";
  } else {
    throw new Error(`Unknown role: ${role}`);
  }
}

export function getExportTransactionsRoute(role: string | undefined): string {
  if (!role) {
    throw new Error("Role is undefined");
  }
  if (["agent", "merchant"].includes(role)) {
    return "/transactions/export";
  } else if (role === "developer" || role === "admin") {
    return "/admin/export-transactions";
  } else if (role === "manager") {
    return "/manager/export-transactions";
  } else if (role === "support") {
    return "/support/export-transactions";
  } else if (role === "refund") {
    // refund isnt role, just to get correct route
    return "/admin/export-refund-transactions";
  } else {
    throw new Error(`Unknown role: ${role}`);
  }
}
