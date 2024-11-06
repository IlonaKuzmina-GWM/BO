import type { Store } from "@/types/store";
import type { User } from "@/types/user";

export type Merchant = {
  id: number;
  name: string;
  host: string;
  label: string;
  webhookUrl: string;
  returnUrl: string;
  store: Store;
  disabled: boolean;
  sandbox: boolean;
  managerId?: string;
  settlementFee?: number;
  settlementFixedFee?: number;
  payoutFee?: number;
  settlementedAmount: number;
  users: User[];
};

export type MerchantStats = {
  paymentAcceptedCount: string;
  paymentAcceptedPercentage: string;
  paymentAmlBlockedCount: string;
  paymentAmlBlockedPercentage: string;
  paymentCancelledCount: string;
  paymentCancelledPercentage: string;
  paymentDeclinedCount: string;
  paymentDeclinedPercentage: string;
  paymentFailedCount: string;
  paymentFailedPercentage: string;
  paymentProcessingCount: string;
  paymentProcessingPercentage: string;
  paymentSuccessCount: string;
  paymentSuccessPercentage: string;
  paymentCompleteCount: string;
  paymentCompletePercentage: string;
  paymentTimeoutCount: string;
  paymentTimeoutPercentage: string;
  paymentTransferringCount: string;
  paymentTransferringPercentage: string;
  totalTransactions: string;
  totalSuccessAmount: string;
  totalCompleteAmount: string;
  totalAcceptedAmount: string;
  totalTransferringAmount: string;
};
