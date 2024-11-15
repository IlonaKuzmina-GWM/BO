export function createStatuses() {
    return [
        {
            label: 'Processing',
            value: 'PAYMENT_PROCESSING',
        },
        {
            label: 'Transferring',
            value: 'PAYMENT_TRANSFERRING',
        },
        {
            label: 'Success',
            value: 'PAYMENT_SUCCESS',
        },
        {
            label: 'Complete',
            value: 'PAYMENT_COMPLETE',
        },
        {
            label: 'Accepted',
            value: 'PAYMENT_ACCEPTED',
        },
        {
            label: 'Failed',
            value: 'PAYMENT_FAILED',
        },
        {
            label: 'Timeout',
            value: 'TIMEOUT',
        },
        {
            label: "Initiated",
            value: "PAYMENT_INITIATED",
          },
        {
            label: 'Aml blocked',
            value: 'AML_BLOCKED',
        },
        {
            label: 'Cancelled',
            value: 'PAYMENT_CANCELLED',
        },
        {
            label: 'Refunded',
            value: 'REFUNDED',
        },
    ]
}