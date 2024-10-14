import { User } from "@/types/user";
import { autorun, makeAutoObservable, runInAction } from "mobx";

export class AuthStore {
  logged = false;
  role: string | null = null;
  secondRole: null | string = null;
  user: null | User = null;

  constructor() {
    makeAutoObservable(this);
    this.hydrate();

    if (typeof window !== "undefined") {
      autorun(() => {
        this.saveState();
      });
    }
  }

  setLogged(payload: any) {
    this.logged = true;
    this.role = payload.role.toLowerCase();
    this.secondRole = payload.role.toLowerCase();
    this.user = payload;

    // Store userId in a cookie
    // cookies().set("userId", `${payload.id}`);

    // response.cookies.set("authToken", token, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === "production",
    //   sameSite: "lax",
    //   path: "/",
    // });

    console.log("setLogged", payload);
  }

  setLogOut() {
    this.logged = false;
    this.role = null;
    this.secondRole = null;
    this.user = null;

    // here we shoul to delete cookies (userId, authToken, auth)
    // cookies().delete("userId");
  }

  setSecondRole(role: string) {
    if (this.role === "developer") {
      this.secondRole = this.secondRole === role ? "developer" : role;
      return this.secondRole === role;
    }
    return false;
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

  hydrate() {
    if (typeof window !== "undefined") {
      const logged = localStorage.getItem("logged");
      const role = localStorage.getItem("role");
      const secondRole = localStorage.getItem("secondRole");
      const user = localStorage.getItem("user");

      runInAction(() => {
        this.logged = logged === "true";
        this.role = role || null;
        this.secondRole = secondRole || null;
        this.user = user ? JSON.parse(user) : null;
      });
    }
  }

  saveState() {
    if (typeof window !== "undefined") {
      localStorage.setItem("logged", String(this.logged));
      localStorage.setItem("role", this.role || "");
      localStorage.setItem("secondRole", this.secondRole || "");
      localStorage.setItem("user", JSON.stringify(this.user));
    }
  }
}
