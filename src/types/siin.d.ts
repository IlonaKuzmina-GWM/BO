import type { Transaction } from '~/types/Transaction';

export type Siin = {
    id: number;
    senderIban: string;
    senderName: string;
    senderBankCountry: string;
    referenceCode: string;
    amount: string;
    transaction: Transaction;
    createdAt: string;
    updatedAt: string;
}