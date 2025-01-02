import { CSV } from "@/types";
import { Siin } from "@/types/siin";
import { Transaction } from "@/types/transaction";
import ExcelJS from "exceljs";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as fileSaver from "file-saver";
import Papa from "papaparse";

const formatDate = (date: Date | string) => {
  if (typeof date === "string") {
    date = new Date(date);
  }
  return date.toISOString().split("T")[0];
};

const getCurrency = (countryCode: string, provider: string) => {
  if (!countryCode) return "EUR";
  if (countryCode.toLowerCase() === "gb" && provider === "Boodil") {
    return "GBP";
  } else {
    return "EUR";
  }
};

const transactionsHeaders = [
  "ID",
  "TXID",
  "STATUS",
  "PROVIDER",
  "WEBHOOK CODE DESCR",
  "DATE OF CREATION",
  "UPDATE DATE",
  "MERCHANT ID",
  "MERCHANT NAME",
  "GEO",
  "AMOUNT",
  "CURRENCY",
  "ADDITIONAL INFO",
];

const siinsHeaders = [
  "ID",
  "IBAN",
  "NAME",
  "BANK COUNTRY",
  "REFERENCE CODE",
  "AMOUNT",
  "TX ID",
  "CREATED AT",
  "UPDATED AT",
];

const today = new Date();
const formattedDate = today.toISOString().split("T")[0];

const transactionFileName = `transaction_${formattedDate}`;

const siinsFileName = `siins_${formattedDate}`;

//Excel

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

  worksheet.addRow(transactionsHeaders);

  worksheet.columns = [
    { header: "ID", key: "id", width: 10 },
    { header: "TXID", key: "txId", width: 25 },
    { header: "STATUS", key: "status", width: 25 },
    { header: "PROVIDER", key: "provider_name", width: 25 },
    { header: "WEBHOOK CODE DESCR", key: "webhook_code_descr", width: 25 },
    { header: "DATE OF CREATION", key: "date_of_creation", width: 25 },
    { header: "UPDATE DATE", key: "update_date", width: 25 },
    { header: "MERCHANT ID", key: "merchant_id", width: 15 },
    { header: "MERCHANT NAME", key: "merchant_name", width: 15 },
    { header: "GEO", key: "geo", width: 15 },
    { header: "AMOUNT", key: "amount", width: 15 },
    { header: "CURRENCY", key: "currency", width: 15 },
  ];

  data?.forEach((transaction) => {
    const rowData = [
      transaction.id,
      transaction.txId,
      transaction.status,
      transaction.provider.name,
      transaction.webhooks[transaction.webhooks.length - 1]?.originalRequest
        ?.response_code_description,
      formatDate(transaction.createdAt),
      formatDate(transaction.updatedAt),
      transaction.initialRequest.merchantId,
      ,
      transaction.merchant.name,
      transaction.initialRequest?.countryCode,
      Number(transaction.amount),
      getCurrency(
        transaction.initialRequest?.countryCode,
        transaction.provider.name,
      ).toUpperCase(),
    ];
    worksheet.addRow(rowData);
  });

  // const fileName = `transactions_${formattedDate}.xlsx`;

  workbook.xlsx.writeBuffer().then((buffer) => {
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = transactionFileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });
};

export const exportExcelSiins = (data: Siin[]) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Siins");

  worksheet.addRow(siinsHeaders);

  worksheet.columns = [
    { header: "ID", key: "id", width: 10 },
    { header: "IBAN", key: "senderIban", width: 25 },
    { header: "NAME", key: "senderName", width: 25 },
    { header: "BANK COUNTRY", key: "senderBankCountry", width: 25 },
    { header: "REFERENCE CODE", key: "referenceCode", width: 25 },
    { header: "AMOUNT", key: "amount", width: 15 },
    { header: "TX ID", key: "txId", width: 25 },
    { header: "CREATED AT", key: "createdAt", width: 25 },
    { header: "UPDATED AT", key: "updatedAt", width: 25 },
  ];

  data?.forEach((siin) => {
    const rowData = [
      siin.id,
      siin.senderIban,
      siin.senderName,
      siin.senderBankCountry,
      siin.referenceCode,
      Number(siin.amount),
      siin.transaction ? siin.transaction.txId : "",
      formatDate(siin.createdAt),
      formatDate(siin.updatedAt),
    ];
    worksheet.addRow(rowData);
  });

  workbook.xlsx.writeBuffer().then((buffer) => {
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = siinsFileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });
};

// PDF

export const exportPDFTransactions = (data: Transaction[]) => {
  const doc = new jsPDF({ orientation: "landscape" });

  const tableData = data.map((transaction) => [
    transaction.id,
    transaction.txId,
    transaction.status,
    transaction.provider.name,
    transaction.webhooks[transaction.webhooks.length - 1]?.originalRequest
      ?.response_code_description,
    formatDate(transaction.createdAt),
    formatDate(transaction.updatedAt),
    transaction.initialRequest.merchantId,
    transaction.merchant.name,
    transaction.initialRequest?.countryCode,
    Number(transaction.amount),
    getCurrency(
      transaction.initialRequest?.countryCode,
      transaction.provider.name,
    ).toUpperCase(),
  ]);

  autoTable(doc, {
    head: [transactionsHeaders],
    body: tableData,
    styles: { fillColor: [217, 234, 255], fontSize: 9 },
    headStyles: {
      fillColor: [20, 75, 225],
      fontStyle: "bold",
      textColor: "#f5f7f9",
      fontSize: 9,
    },
    startY: 10,
    margin: { top: 20 },
  });

  doc.save(transactionFileName);
};

export const exportSiinPDF = (data: Siin[]) => {
  const doc = new jsPDF({ orientation: "landscape" });
  const tableData = data.map((siin) => [
    siin.id,
    siin.senderIban,
    siin.senderName,
    siin.senderBankCountry,
    siin.referenceCode,
    siin.amount,
    siin.transaction.txId,
    formatDate(siin.createdAt),
    formatDate(siin.updatedAt),
  ]);

  autoTable(doc, {
    head: [siinsHeaders],
    body: tableData,
    styles: { fillColor: [217, 234, 255], fontSize: 9 },
    headStyles: {
      fillColor: [20, 75, 225],
      fontStyle: "bold",
      textColor: "#f5f7f9",
      fontSize: 9,
      cellWidth: "auto",
    },
    startY: 10,
    margin: { top: 20 },
  });

  doc.save(siinsFileName);
};

// CSV
export const exportCSVTransactions = (data: Transaction[]) => {
  const tableData = data.map((transaction) => [
    transaction.id,
    transaction.txId,
    transaction.status,
    transaction.provider.name,
    transaction.webhooks[transaction.webhooks.length - 1]?.originalRequest
      ?.response_code_description,
    formatDate(transaction.createdAt),
    formatDate(transaction.updatedAt),
    transaction.initialRequest.merchantId,
    transaction.merchant.name,
    transaction.initialRequest?.countryCode,
    Number(transaction.amount),
    getCurrency(
      transaction.initialRequest?.countryCode,
      transaction.provider.name,
    ).toUpperCase(),
  ]);

  const csvData = [transactionsHeaders, ...tableData];

  const csv = Papa.unparse(csvData);

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  fileSaver.saveAs(blob, transactionFileName);
};

export const exportSiinCSV = (data: Siin[]) => {
  const tableData = data.map((siin) => [
    siin.id,
    siin.senderIban,
    siin.senderName,
    siin.senderBankCountry,
    siin.referenceCode,
    siin.amount,
    siin.transaction.txId,
    formatDate(siin.createdAt),
    formatDate(siin.updatedAt),
  ]);

  const csvData = [siinsHeaders, ...tableData];

  const csv = Papa.unparse(csvData);

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  fileSaver.saveAs(blob, siinsFileName);
};

// export const exportCSVPayout = (data, fileName) => {
//   const headers = ['PAYMENT_DETAILS', 'BENEFICIARY_NAME', 'BENEFICIARY_REFERENCE', 'BENEFICIARY_IBAN', 'PAYMENT_AMOUNT', 'CURRENCY', 'REFFERENCE_ID'];

//   const tableData = data.map(payout => [
//       payout.details,
//       payout.name,
//       payout.reference,
//       payout.iban,
//       payout.amount,
//       payout.currency,
//       payout.id,
//   ]);

//   const csvData = [headers, ...tableData];

//   const csv = Papa.unparse(csvData);

//   const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
//   fileSaver.saveAs(blob, fileName);
// };
