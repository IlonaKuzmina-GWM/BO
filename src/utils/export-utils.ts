import { CSV } from "@/types";
import { Transaction } from "@/types/transaction";
import ExcelJS from "exceljs";

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
    "AMOUNT",
    "STATUS",
    "CREATED",
    "SETTLED",
    "MERCHANT",
    "PROVIDER",
  ];

  worksheet.addRow(headers);

  worksheet.columns = [
    { header: "ID", key: "id", width: 10 },
    { header: "AMOUNT", key: "amount", width: 15 },
    { header: "STATUS", key: "status", width: 25 },
    { header: "CREATED", key: "created", width: 30 },
    { header: "SETTLED", key: "settled", width: 15 },
    { header: "MERCHANT_NAME", key: "merchant_name", width: 20 },
    { header: "MERCHANT_HOST", key: "merchant_host", width: 20 },
    { header: "MERCHANT_LABEL", key: "merchant_label", width: 20 },
    { header: "PROVIDER", key: "provider", width: 30 },
  ];

  data.forEach((transaction) => {
    const rowData = [
      transaction.id,
      transaction.amount,
      transaction.status,
      transaction.createdAt,
      transaction.isSettled ? "YES" : "NO",
      transaction.merchant.name,
      transaction.merchant.host,
      transaction.merchant.label,
      transaction.provider.name,
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
