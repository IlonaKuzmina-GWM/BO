export function getCreateMerchantsRoute(role: string | undefined) {
  if (!role) {
    throw new Error("Role is undefined");
  }
  if (role === "developer" || role === "admin") {
    return "/admin/merchant";
  } else if (role === "manager") {
    return "/manager/merchant";
  } else {
    throw new Error(`Unknown role: ${role}`);
  }
}
