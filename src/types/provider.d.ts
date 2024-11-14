export type Provider = {
  id: number;
  apiSlug: string;
  name: string;
  description: string;
  isEnabled: boolean;
};

export type ProviderList = {
  provider_id: number;
  provider_name: string;
};
