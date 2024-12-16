export const transformStatus = (status: string): string => {
  const parts = status.split("_");

  if (parts.length > 1) {
    parts.shift();
  }
  const transformed = parts.join("_").toLowerCase();

  return transformed.charAt(0) + transformed.slice(1);
};
