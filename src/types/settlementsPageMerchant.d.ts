import type { Transaction } from '~/types/Transaction';

export type settlementsPageMerchant = {
    transactions: Transaction[];
    transactionsCount: number;
    totalAmount: number;
    totalAmountAfterFee: number;
    merchantsPercent: string;
    merchantsFixedFee: string;
    totalAfterSettlement: string | number | null;
    settlementFee: string | number | null;
    payoutFee: string | number | null;
}