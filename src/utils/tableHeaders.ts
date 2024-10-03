import { Header } from "@/types";

export const TransactionsTableHeader: Header[] = [
  { key: "id", title: "ID", width: "7%", centered: true },
  { key: "status", title: "Status", width: "8%" },
  { key: "amount", title: "Amount", width: "10%" },
  { key: "name", title: "Name", width: "10%" },
  { key: "email", title: "Email", width: "17%" },
  { key: "merchant", title: "Merchant", width: "10%" },
  { key: "provider", title: "Provider", width: "10%" },
  { key: "createdAt", title: "Created", width: "8%", centered: true },
  { key: "updatedAt", title: "Updated", width: "8%", centered: true },
  { key: "setl", title: "Setl.", width: "5%", centered: true },
];

export const SiinsTableHeader: Header[] = [
  { key: "id", title: "ID", width: "7%", centered: true },
  { key: "iban", title: "IBAN", width: "15%" },
  { key: "name", title: "Name", width: "15%" },
  { key: "country", title: "Country", width: "15%" },
  { key: "refcode", title: "Reference code", width: "15%" },
  { key: "amount", title: "Amount", width: "10%" },
  { key: "createdAt", title: "Created", width: "10%", centered: true },
  { key: "updatedAt", title: "Updated", width: "10%", centered: true },
];

export const GenerateCSVTableHeader: Header[] = [
  { title: "ID", key: "id", width: "8%" },
  { title: "Name", key: "name", width: "19%" },
  { title: "Surname", key: "surname", width: "19%" },
  { title: "IBAN", key: "iban", width: "19%" },
  { title: "Amount", key: "amount", width: "8%" },
  { title: "Created",key: "created",width: "12%",},
  { title: "Action", key: "role", width: "8%" },
  { title: "", key: "delete", width: "7%" },
];

export const ManagerMerchantsTableHeader: Header[] = [
  { title: "ID", key: "id", width: "7%" },
  { title: "Name", key: "name", width: "15%" },
  { title: "Host", key: "host", width: "15%" },
  { title: "Label", key: "label", width: "15%" },
  { title: "Store", key: "store", width: "4%", centered: true },
  { title: "Fee%", key: "feePercent", width: "4%", centered: true },
  { title: "Fee€", key: "feeEur", width: "4%", centered: true },
  { title: "Setl.", key: "setl", width: "4%", centered: true },
  { title: "Setl.Amount", key: "amount", width: "7%", centered: true },
  { title: "Providers", key: "providers", width: "14%" },
  { title: "Status", key: "status", width: "7%" },
  { title: "Action", key: "action", width: "4%" },
];

export const ManagerAllUsersTableHeader: Header[] = [
  { title: "ID", key: "id", width: "7%" },
  { title: "First name", key: "firstName", width: "11%" },
  { title: "Last name", key: "lastName", width: "11%" },
  { title: "Email", key: "email", width: "17%" },
  { title: "Email verification", key: "isEmailVerified", width: "10%" },
  { title: "Merchant (label)",key: "merchant",width: "15%",centered: true,},
  { title: "Role", key: "role", width: "8%", centered: true },
  { title: "Created at", key: "created", width: "12%", centered: true },
  { title: "Disabled", key: "isDisabled", width: "8%", centered: true },
];

export const ManagerKYCUserTableHeader: Header[] = [
  { title: "Nme", key: "name", width: "17%" },
  { title: "Status", key: "status", width: "16%" },
  { title: "Surname", key: "surname", width: "17%" },
  { title: "Check Required", key: "isCHeckRequired", width: "16%" },
  { title: "Create", key: "created", width: "17%", centered: true },
  { title: "Updated", key: "updated", width: "17%", centered: true },
];

export const SettingsRulesTableHeaader: Header[] = [
  { title: "Merchant", key: "merchant", width: "13%" },
  { title: "Rule Type", key: "ruleType", width: "10%" },
  { title: "Limit Type", key: "limitType", width: "12%" },
  { title: "Action", key: "action", width: "20%" },
  { title: "Limit Value", key: "limitValue", width: "12%" },
  { title: "Comment", key: "comment", width: "23%" },
  { title: "", key: "edit", width: "4%" },
  { title: "", key: "delete", width: "6%" },
];

export const SettingsIntegrationTableHeader: Header[] = [
  { title: "MerchantID", key: "MerchantID", width: "27%" },
  { title: "Your header key", key: "HeaderKey", width: "27%" },
  { title: "Your signature key", key: "SignatureKey", width: "27%" },
  { title: "Action", key: "show", width: "19%" },
];