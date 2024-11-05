export function getMerchantsRoute(role: string | undefined): string {
  if (!role) {
    throw new Error("Role is undefined");
  }
  if (role === "developer" || role === "admin") {
    return "/admin/merchants";
  } else if (role === "manager") {
    return "/manager/merchants";
  } else if (role === "agent") {
    return "/agent/merchants";
  } else {
    throw new Error(`Unknown role: ${role}`);
  }
}
