import { makeAutoObservable } from "mobx";

export class AlertStore {
  alertType: "success" | "error" | "warning" | null = null;
  alertMessage: string | null = null;
  isVisible = false;

  constructor() {
    makeAutoObservable(this);
  }

  setAlert(type: "success" | "error" | "warning", message: string) {
    console.log(`Setting alert: ${type}, ${message}`);
    this.alertType = type;
    this.alertMessage = message;
    this.isVisible = true;

    setTimeout(() => {
      this.clearAlert();
    }, 5000);
  }

  clearAlert() {
    this.isVisible = false;

    setTimeout(() => {
      this.alertType = null;
      this.alertMessage = null;
    }, 300);
  }
}
