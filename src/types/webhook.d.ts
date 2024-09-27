export type originalRequest = {
	compound_state: string;
	response_code_description: string;
	state: string;
}

export type Webhook = {
    id: number;
    txId: string;
    originalRequest: originalRequest;
    amount: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
    state: string;
    retries: number;
    transactionId: string;
}