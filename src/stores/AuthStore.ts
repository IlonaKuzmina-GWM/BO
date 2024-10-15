import { User } from "@/types/user";
import { autorun, makeAutoObservable, runInAction } from "mobx";
import { cookies } from "next/headers";

export class AuthStore {
  logged = false;
  role: string | null = null;
  secondRole: null | string = null;
  user: null | User = null;

  constructor() {
    makeAutoObservable(this);
  }

  setLogged(payload: any) {
    this.logged = true;
    this.role = payload.role.toLowerCase();
    this.secondRole = payload.role.toLowerCase();
    this.user = payload;

    // console.log("setLogged", payload);
    console.log(
      "setLogged two",
      this.logged,
      this.role,
      this.secondRole,
      this.user,
    );
  }

  setLogOut() {
    this.logged = false;
    this.role = null;
    this.secondRole = null;
    this.user = null;

    console.log(
      "setLogOut",
      this.logged,
      this.role,
      this.secondRole,
      this.user,
    );
  }

  // setSecondRole(role: string) {
  //   if (this.role === "developer") {
  //     this.secondRole = this.secondRole === role ? "developer" : role;
  //     return this.secondRole === role;
  //   }
  //   return false;
  // }

  setSecondRole(role: string) {
    if (this.role === "developer") {
      if (this.secondRole === role) {
        this.secondRole = "developer";
      } else {
        this.secondRole = role;
      }
    }
  }

  setSecondRoleAdmin() {
    return this.setSecondRole("admin");
  }

  setSecondRoleMerchant() {
    return this.setSecondRole("merchant");
  }

  setSecondRoleManager() {
    return this.setSecondRole("manager");
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

  get userId() {
    return this.user ? this.user.id : null;
  }

  get isLogged() {
    return this.logged;
  }

  get userRole() {
    return this.role;
  }

  get userSecondRole() {
    return this.secondRole;
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
}
