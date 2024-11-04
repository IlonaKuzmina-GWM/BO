import { Webhook } from "./webhook";

// types.ts
export interface InitialRequest {
  email: string;
  firstName: string;
  lastName: string;
  merchantId: string;
  countryCode: string;
}

// export interface Merchant {
//   name: string;
//   host: string;
//   label: string;
// }

export interface Provider {
  name: string;
  apiSlug: string;
}

export interface Transaction {
  id: number;
  txId: string;
  countryCode:string;
  txReferenceId: string;
  providerId: number;
  additionalInfo: string | null;
  amount: string;
  status: string;
  initialRequest: InitialRequest;
  returnUrl: string | null;
  webhookUrl: string | null;
  rawStatus: string;
  createdAt: string;
  updatedAt: string;
  sandbox: boolean;
  isSettled: boolean;
  settlementDate: string | null;
  settlementAmount: string;
  statusChecks: number;
  merchant: Merchant;
  provider: Provider;
  webhooks: Webhook[];
}

export interface Rule {
  merchant: string;
  ruleType: string;
  limitType: string;
  action: string;
  limitValue: string;
  comment: string;
  provider?: string;
}

export interface RuleRow {
  selectLabel: string;
  label: string;
  description: string;
  items: { value: string; label: string }[];
  field: string;
  value?: string;
}

export interface Header {
  title: string;
  key: string;
  width: string;
  centered?: boolean;
}

export interface APIKey {
  merchant: string;
  headerKey: string;
  signatureKey: string;
}

export interface InputField {
  label: string;
  name: string;
  type: string;
  placeholder: string;
  inputWidth?: string;
}

export interface Merchant {
  id: string;
  name: string;
  host: string;
  label: string;
  store: string;
  feePercent: string;
  feeEur: string;
  setl: string;
  amount: string;
  providers: string;
  status: string;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  isEmailVerified: boolean;
  merchant: string;
  role: string;
  created: string;
  isDisabled: boolean;
}

export interface CSV {
  name: string;
  surname: string;
  id: string;
  iban: string;
  amount: string;
  details: string;
  created: string;
}

export interface Siin {
  additionalInfo: string | null;
  amount: number;
  createdAt: string;
  id: number;
  initialRequest: InitialRequest;
  isSettled: number;
  merchantId: number;
  providerId: number;
  rawStatus: string | null;
  referenceCode: string;
  returnUrl: string | null;
  sandbox: number;
  senderBankCountry: string;
  senderIban: string;
  senderName: string;
  settlementAmount: number;
  settlementDate: string | null;
  status: string;
  statusChecks: number;
  transactionId: string;
  transaction: Transaction;
  txId: string;
  txReferenceId: string | null;
  updatedAt: string;
  webhookUrl: string | null;
}

export interface DashTableData {
  name: string;
  amount: string;
}
