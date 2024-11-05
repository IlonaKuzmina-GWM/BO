export function getUsersRoute(role: string | undefined): string {
  if (!role) {
    throw new Error("Role is undefined");
  }
  if (role === "developer" || role === "admin") {
    return "/admin/users";
  } else if (role === "manager") {
    return "/manager/users";
  } else {
    throw new Error(`Unknown role: ${role}`);
  }
}
