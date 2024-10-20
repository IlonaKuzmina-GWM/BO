export function getFilteredTransactionsRoute (role: string) {
    if (['agent', 'merchant'].includes(role)) {
        return '/transactions/filter';
    } else if (role === 'developer' || role === 'admin') {
        return '/admin/validated-transactions';
    } else if (role === 'manager') {
        return '/manager/transactions';
    } else if (role === 'support') {
        return ('/support/transactions')
    }
}

export function getExportTransactionsRoute (role: string) {
    if (['agent', 'merchant'].includes(role)) {
        return '/transactions/export';
    } else if (role === 'developer' || role === 'admin') {
        return '/admin/export-transactions';
    } else if (role === 'manager') {
        return '/manager/export-transactions';
    } else if (role === 'support') {
        return ('/support/export-transactions')
    } else if (role === 'refund') { // refund isnt role, just to get correct route
        return '/admin/export-refund-transactions';
    }
}