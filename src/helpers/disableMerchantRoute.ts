export function disableMerchantRoute (role: string) {
    if (role === 'developer' || role === 'admin') {
        return '/admin/merchants/disable';
    } else if (role === 'manager') {
        return '/manager/merchants/disable';
    }
}