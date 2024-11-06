import { AuthStore } from "./AuthStore";
import { AlertStore } from "./AlertStore";

export class RootStore {
  authStore: AuthStore;
  alertStore: AlertStore;

  constructor() {
    this.authStore = new AuthStore();
    this.alertStore = new AlertStore();
  }
}

export default RootStore;
