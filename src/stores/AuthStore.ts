import { User } from "@/types/user";
import { makeAutoObservable } from "mobx";

export class AuthStore {
  logged = false;
  role: string | null = null;
  secondRole: null | string = null;
  user: null | User = null;
  userId: null | string = null;

  constructor() {
    makeAutoObservable(this);
    this.loadState();
  }

  setLogged(payload: any) {
    this.logged = true;
    this.role = payload.role.toLowerCase();
    this.secondRole = payload.role.toLowerCase();
    this.user = payload;
    this.userId = payload.id;

    this.saveState();
  }

  setLogOut() {
    this.logged = false;
    this.role = null;
    this.secondRole = null;
    this.user = null;
    this.userId = null;

    this.saveState();
  }

  setSecondRole(role: string) {
    if (this.role === "developer") {
      if (this.secondRole === role) {

        this.secondRole = "developer";
      } else {
        this.secondRole = role;
      }
      this.saveState();
    }
  }

  get userRole() {
    return this.role;
  }

  get effectiveRole() {
    return (this.role === "developer" && this.secondRole)
      ? this.secondRole
      : this.role || "";
  }

  // get userId() {
  //   return this.userId;
  // }

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
      const secondRoleString = localStorage.getItem("secondRole");
      const secondRole = secondRoleString ? secondRoleString : null;
      const user = localStorage.getItem("user");

      if (logged && user) {
        this.logged = true;
        this.role = role;
        this.secondRole = secondRole;
        this.user = JSON.parse(user);
      } else {
        this.logged = false;
        this.role = null;
        this.secondRole = null;
        this.user = null;
      }
    }
  }
}
