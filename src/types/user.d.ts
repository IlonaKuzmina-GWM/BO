import type { Merchant } from '~/types/merchant';

export type User = {
    id: number;
    email: string;
    emailVerified: boolean;
    firstName: string;
    merchant: Merchant;
    createdAt: string;
    lastName: string;
    role: string;
    disabled: boolean;
}