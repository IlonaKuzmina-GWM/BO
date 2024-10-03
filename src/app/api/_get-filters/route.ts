// const fillFiltersData = async () => {
//     await api('/filters', { method: 'GET' })
//     .then((res: any) => {
//         merchantsNames.value = res.merchants.map((record: any) => ({
//             label: record.merchant_name,
//             value: record.merchant_id,
//         }));
//         providersNames.value = res.providers.map((record: any) => ({
//             label: record.provider_name,
//             value: record.provider_id,
//         }));
//     })
//     .catch(error => {
//         message.error(`Oops! Something went wrong: ${error.message}`)
//     })
// };
