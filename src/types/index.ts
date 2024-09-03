// types.ts
export interface InitialRequest {
  email: string;
  firstName: string;
  lastName: string;
  merchantId: string;
}

export interface Merchant {
  name: string;
  host: string;
  label: string;
}

export interface Provider {
  name: string;
  apiSlug: string;
}

export interface Transaction {
  id: number;
  txId: string;
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
  webhooks: any[];
}
export interface Rule {
  merchant: string;
  ruleType: string;
  limitType: string;
  action: string;
  limitValue: string;
  comment: string;
}

export interface Header {
  title: string;
  key: string;
  width: string;
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