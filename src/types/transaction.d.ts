import type { Merchant } from '~/types/merchant';
import type { Provider } from '~/types/provider';

export type InitialRequestData = {
	firstName: string;
	lastName: string;
	email: string;
	store: string;
}

export type Transaction<T = InitialRequestData> = {
	id: number;
	status: string;
	amount: string;
	provider: Provider;
	updatedAt: string;
	createdAt: string;
	isSettled: boolean;
	settlementAmount: number;
	settlementDate: string;
	txId: string;
	initialRequest: T;
	merchant: Merchant;
}