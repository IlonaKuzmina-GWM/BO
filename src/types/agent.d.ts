export type AgentMerchant = {
    id: number;
    name: string;
}

export type Agent = {
    email: string;
    firstName: string;
    lastName: string;
    id: number;
    agentMerchants: AgentMerchant[];
}