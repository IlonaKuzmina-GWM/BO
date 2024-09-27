import type { Webhook } from '~/types/webhook';

export type singleTransactionData = {
    additionalInfo: null | Object;
    amount: number;
    status: string;
    txId: string;
    name: string;
    lastName: string;
    email: string;
    returnUrl: string;
    apiSlug: string;
    webhookUrl: string;
    createdAt: Date;
    updatedAt: Date;
    webhooks: Webhook[];
}