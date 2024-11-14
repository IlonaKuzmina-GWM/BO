import { Merchant } from "./merchant";
import { Webhook } from "./webhook";


export interface Rule {
  merchant: string;
  ruleType: string;
  limitType: string;
  action: string;
  limitValue: string;
  comment: string;
  provider?: string;
}

export interface RuleRow {
  selectLabel: string;
  label: string;
  description: string;
  items: { value: string; label: string }[];
  field: string;
  value?: string;
}

export interface Header {
  title: string;
  key: string;
  width: string;
  centered?: boolean;
}

export interface APIKey {
  merchant: string;
  headerKey: string;
  signatureKey: string;
}

export interface InputField {
  label: string;
  name: string;
  type: string;
  placeholder: string;
  inputWidth?: string;
}

export interface CSV {
  name: string;
  surname: string;
  id: string;
  iban: string;
  amount: string;
  details: string;
  created: string;
}


export interface DashTableData {
  name: string;
  amount: string;
}
