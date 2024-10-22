import { User } from "@/types/user";
import { makeAutoObservable } from "mobx";

export class AuthStore {
  logged = false;
  role: string | null = null;
  secondRole: null | string = null;
  user: null | User = null;

  constructor() {
    makeAutoObservable(this);
    this.loadState();
  }

  setLogged(payload: any) {
    this.logged = true;
    this.role = payload.role.toLowerCase();
    this.secondRole = payload.role.toLowerCase();
    this.user = payload;

    this.saveState();
  }

  setLogOut() {
    this.logged = false;
    this.role = null;
    this.secondRole = null;
    this.user = null;

    this.saveState();
  }

  setSecondRole(role: string) {
    if (this.role === "developer") {
      if (this.secondRole === role) {
        // If the selected role is already set as secondRole, reset it to "developer"
        this.secondRole = "developer";
      } else {
        // Set the new role as secondRole
        this.secondRole = role;
      }
      this.saveState();
      console.log("setSecondRole", this.secondRole);
    }
  }

  isSecondRoleOwner() {
    return this.secondRole === "owner";
  }

  isSecondRoleAdmin() {
    return this.secondRole === "admin";
  }

  isSecondRoleMerchant() {
    return this.secondRole === "merchant";
  }

  isSecondRoleManager() {
    return this.secondRole === "manager";
  }

  isSecondRoleUser() {
    return this.secondRole === "user";
  }

  isSecondRoleAgent() {
    return this.secondRole === "agent";
  }

  isSecondRoleSupport() {
    return this.secondRole === "support";
  }

  isSecondRoleFinance() {
    return this.secondRole === "finance";
  }

  isRoleGranted(roles?: string): boolean {
    if (!roles) {
      return true;
    }
    if (!this.role) {
      return false;
    }

    const arrRoles: string[] = Array.isArray(roles) ? roles : [roles];

    if (arrRoles.includes("all")) {
      return true;
    }

    return arrRoles.includes(this.role);
  }

  saveState() {
    if (typeof window !== "undefined") {
      localStorage.setItem("logged", String(this.logged));
      localStorage.setItem("role", this.role || "");
      localStorage.setItem("secondRole", this.secondRole || "");
      localStorage.setItem("user", JSON.stringify(this.user));
    }
  }

  loadState() {
    if (typeof window !== "undefined") {
      const logged = localStorage.getItem("logged") === "true";
      const role = localStorage.getItem("role");
      const secondRole = localStorage.getItem("secondRole");
      const user = localStorage.getItem("user");

      if (logged && user) {
        this.logged = true;
        this.role = role;
        this.secondRole = secondRole;
        this.user = JSON.parse(user);
      } else {
        // Ensure state is reset if no valid data is found
        this.logged = false;
        this.role = null;
        this.secondRole = null;
        this.user = null;
      }
    }
  }
}
