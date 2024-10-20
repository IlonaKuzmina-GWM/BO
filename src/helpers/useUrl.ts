export const userUrl = (url: string) => {
  const mode = process.env.NEXT_PUBLIC_URL_MODE;
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
  }

  return `${baseUrl}${url}`;
};
