import type { Merchant } from "./merchant";
import type { Provider } from "./provider";
import type { Webhook } from "./webhook";

export type InitialRequestData = {
  firstName: string;
  lastName: string;
  email: string;
  store: string;
  merchantId: string;
  countryCode: string;
};

export type Transaction<T = InitialRequestData> = {
  id: number;
  status: string;
  amount: string;
  provider: Provider;
  merchant: Merchant;
  updatedAt: string;
  createdAt: string;
  isSettled: boolean;
  settlementAmount: number;
  settlementDate: string;
  txId: string;
  initialRequest: InitialRequestData;
  webhooks: Webhook[];
  firstName: string;
  lastName: string;
  email: string;
  store: string;
  merchantId: string;
  countryCode: string;
  webhookUrl: string | null;
  returnUrl: string | null;
};
