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
  