export default (url) => {
    const runtimeConfig = useRuntimeConfig()
    const mode = runtimeConfig.public.URL_MODE;

    if (mode === 'staging') {
        return `http://62.72.32.2${url}`
    } else if (mode === 'development') {
        return `http://127.0.0.1:8000${url}`
    } else if (mode === 'production') {
        return `https://pay.siquro.com${url}`
    }
}
