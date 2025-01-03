import { Header } from "@/types";

export const TransactionsTableHeader: Header[] = [
  { key: "id", title: "ID", width: "7%", centered: true },
  { key: "status", title: "Status", width: "8%" },
  { key: "amount", title: "Amount", width: "8%" },
  { key: "currency", title: "Currency", width: "4%" },
  { key: "name", title: "Name", width: "10%" },
  { key: "email", title: "Email", width: "15%" },
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
  { title: "ID", key: "id", width: "9%" },
  { title: "Name", key: "name", width: "20%" },
  { title: "Surname", key: "surname", width: "20%" },
  { title: "IBAN", key: "iban", width: "20%" },
  { title: "Amount", key: "amount", width: "9%" },
  { title: "Created", key: "created", width: "13%" },
  { title: "Action", key: "delete", width: "9%", centered: true },
];

export const ManagerMerchantsTableHeader: Header[] = [
  { title: "ID", key: "id", width: "5%" },
  { title: "Name", key: "name", width: "15%" },
  { title: "Store", key: "store", width: "13%", centered: true },
  { title: "Label", key: "label", width: "15%" },
  { title: "Link", key: "host", width: "14%" },
  { title: "Setl. Amount", key: "amount", width: "7%", centered: true },
  { title: "Active Providers", key: "providers", width: "13%" },
  { title: "Sandbox", key: "sandbox", width: "6%" },
  { title: "", key: "action", width: "3%" },
  { title: "Disabled", key: "disabled", width: "6%" },
  { title: "", key: "disabled-p", width: "3%" },
];

export const OtherMerchantsTableHeader: Header[] = [
  { title: "ID", key: "id", width: "11%" },
  { title: "Name", key: "name", width: "22%" },
  { title: "Label (api slug)", key: "label", width: "22%" },
  { title: "Manager internal id", key: "internal", width: "22%" },
  { title: "Sandbox", key: "sandbox", width: "10%",centered: true  },
  { title: "Status", key: "status", width: "10%", centered: true },
  { title: "", key: "disabled-p", width: "3%" },
];

export const ManagerAllUsersTableHeader: Header[] = [
  { title: "ID", key: "id", width: "7%" },
  { title: "First name", key: "firstName", width: "11%" },
  { title: "Last name", key: "lastName", width: "11%" },
  { title: "Email", key: "email", width: "17%" },
  {
    title: "Email verification",
    key: "isEmailVerified",
    width: "10%",
    centered: true,
  },
  { title: "Merchant (label)", key: "merchant", width: "15%", centered: true },
  { title: "Role", key: "role", width: "8%", centered: true },
  { title: "Created at", key: "created", width: "12%", centered: true },
  { title: "Disabled", key: "isDisabled", width: "8%", centered: true },
];

export const ManagerKYCUserTableHeader: Header[] = [
  { title: "Name", key: "name", width: "10%" },
  { title: "Surname", key: "surname", width: "10%" },
  { title: "Email", key: "email", width: "25%" },
  { title: "Check Passed", key: "isCHeckPassed", width: "11%" },
  { title: "Check Required", key: "isCHeckRequired", width: "11%" },
  { title: "Create", key: "created", width: "15%", centered: true },
  { title: "Updated", key: "updated", width: "15%", centered: true },
];

export const SettingsRulesTableHeaader: Header[] = [
  { title: "Merchant", key: "merchant", width: "12%" },
  { title: "Provider", key: "provider", width: "13%" },
  { title: "Rule Type", key: "ruleType", width: "9%" },
  { title: "Limit Type", key: "limitType", width: "11%" },
  { title: "Action", key: "action", width: "12%" },
  { title: "Limit Value", key: "limitValue", width: "10%" },
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

export const LogsTableHeader: Header[] = [
  { title: "Person", key: "person", width: "24%" },
  { title: "Action", key: "action", width: "24%" },
  { title: "Created at", key: "createdAt", width: "15%" },
  { title: "Type", key: "type", width: "24%", centered: true },
];
