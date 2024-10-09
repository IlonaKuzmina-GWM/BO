import { CSV } from "@/types";
import { Transaction } from "@/types/transaction";
import ExcelJS from "exceljs";

const formatDate = (date: Date | string) => {
  if (typeof date === 'string') {
    date = new Date(date);
  }
  return date.toISOString().split("T")[0];
};

export const exportExcelPayout = (data: CSV[]) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Payouts");

  const headers = [
    "ID",
    "NAME",
    "SURNAME",
    "IBAN",
    "AMOUNT",
    "CREATED",
    "DETAILS",
  ];

  worksheet.addRow(headers);

  worksheet.columns = [
    { header: "ID", key: "id", width: 10 },
    { header: "NAME", key: "name", width: 20 },
    { header: "SURNAME", key: "surname", width: 20 },
    { header: "IBAN", key: "iban", width: 30 },
    { header: "AMOUNT", key: "amount", width: 15 },
    { header: "CREATED", key: "created", width: 20 },
    { header: "DETAILS", key: "details", width: 30 },
  ];

  data.forEach((payout) => {
    const rowData = [
      payout.id,
      payout.name,
      payout.surname,
      payout.iban,
      payout.amount,
      payout.created,
      payout.details,
    ];
    worksheet.addRow(rowData);
  });

  const today = new Date();
  const formattedDate = today.toISOString().split("T")[0];
  const fileName = `payouts_${formattedDate}.xlsx`;

  workbook.xlsx.writeBuffer().then((buffer) => {
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });
};

export const exportExcelTransactions = (data: Transaction[]) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Transactions");

  const headers = [
    "ID",
    "TXID",
    "STATUS",
    "PROVIDER",
    "WEBHOOK CODE DESCR",
    "WEBHOOK COMPOUND STATE",
    "DATE OF CREATION",
    "UPDATE DATE",
    "AMOUNT",
    "MERCHANT ID",
    "MERCHANT NAME",
  ];

  worksheet.addRow(headers);

  worksheet.columns = [
    { header: "ID", key: "id", width: 10 },
    { header: "TXID", key: "txId", width: 25 },
    { header: "STATUS", key: "status", width: 25 },
    { header: "PROVIDER", key: "provider_name", width: 25 },
    { header: "WEBHOOK CODE DESCR", key: "webhook_code_descr", width: 25 },
    {
      header: "WEBHOOK COMPOUND STATE",
      key: "webhook_compound_state",
      width: 30,
    },
    { header: "DATE OF CREATION", key: "date_of_creation", width: 25 },
    { header: "UPDATE DATE", key: "update_date", width: 25 },
    { header: "AMOUNT", key: "amount", width: 15 },
    { header: "MERCHANT ID", key: "merchant_id", width: 15 },
    { header: "MERCHANT NAME", key: "merchant_name", width: 25 },
  ];

  data?.forEach((transaction) => {
    const rowData = [
      transaction.id,
      transaction.txId,
      transaction.status,
      transaction.provider.name,
      transaction.webhooks[transaction.webhooks.length - 1]?.originalRequest
        ?.response_code_description,
      transaction.webhooks[transaction.webhooks.length - 1]?.originalRequest
        ?.compound_state,
      formatDate(transaction.createdAt),
      formatDate(transaction.updatedAt),
      Number(transaction.amount),
      transaction.merchant.merchantId,
      transaction.merchant.name,
    ];
    worksheet.addRow(rowData);
  });

  const today = new Date();
  const formattedDate = today.toISOString().split("T")[0];
  const fileName = `payouts_${formattedDate}.xlsx`;

  workbook.xlsx.writeBuffer().then((buffer) => {
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });
};
