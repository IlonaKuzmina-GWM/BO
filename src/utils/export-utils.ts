import { CSV } from "@/types";
import { Siin } from "@/types/siin";
import { Transaction } from "@/types/transaction";
import ExcelJS from "exceljs";

const formatDate = (date: Date | string) => {
  if (typeof date === 'string') {
    date = new Date(date);
  }
  return date.toISOString().split("T")[0];
};

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
  const fileName = `transactions_${formattedDate}.xlsx`;

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

export const exportExcelSiins = (data: Siin[]) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Siins');

  const headers = [
    'ID',
    'IBAN',
    'NAME',
    'BANK COUNTRY',
    'REFERENCE CODE',
    'AMOUNT',
    'TX ID',
    'CREATED AT',
    'UPDATED AT',
  ];

  worksheet.addRow(headers);

  worksheet.columns = [
    { header: 'ID', key: 'id', width: 10 },
    { header: 'IBAN', key: 'senderIban', width: 25 },
    { header: 'NAME', key: 'senderName', width: 25 },
    { header: 'BANK COUNTRY', key: 'senderBankCountry', width: 25 },
    { header: 'REFERENCE CODE', key: 'referenceCode', width: 25 },
    { header: 'AMOUNT', key: 'amount', width: 15 },
    { header: 'TX ID', key: 'txId', width: 25 },
    { header: 'CREATED AT', key: 'createdAt', width: 25 },
    { header: 'UPDATED AT', key: 'updatedAt', width: 25 },
  ];

  data?.forEach((siin) => {
    const rowData = [
      siin.id,
      siin.senderIban,
      siin.senderName,
      siin.senderBankCountry,
      siin.referenceCode,
      Number(siin.amount),
      siin.transaction ? siin.transaction.txId : '',
      formatDate(siin.createdAt),
      formatDate(siin.updatedAt),
    ];
    worksheet.addRow(rowData);
  });

  const today = new Date();
  const formattedDate = today.toISOString().split('T')[0];
  const fileName = `siins_${formattedDate}.xlsx`;

  workbook.xlsx.writeBuffer().then((buffer) => {
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });
};


//PDF


// export const exportPDF = (data, fileName) => {
//   const doc = new jsPDF();
//   const headers = [[
//       'ID', 
//       'TXID', 
//       'STATUS', 
//       'PROVIDER', 
//       'WEBHOOK CODE DESCR', 
//       'DATE OF CREATION', 
//       'UPDATE DATE', 
//       'MERCHANT ID',
//       'MERCHANT NAME',
//       'GEO',
//       'AMOUNT',
//       'CURRENCY'
//   ]];
//   const tableData = data.map(transaction => [
//       transaction.id,
//       transaction.txId,
//       transaction.status,
//       transaction.provider.name,
//       transaction.webhooks[transaction.webhooks.length - 1]?.originalRequest?.response_code_description,
//       formatDate(transaction.createdAt),
//       formatDate(transaction.updatedAt),
//       transaction.initialRequest.merchantId,
//       transaction.merchant.name,
//       transaction.initialRequest?.countryCode,
//       Number(transaction.amount),
//       getCurrency(transaction.initialRequest?.countryCode, transaction.provider.name).toUpperCase()
//   ]);

//   doc.autoTable({
//       head: headers,
//       body: tableData,
//       startY: 10,
//       margin: { top: 20 },
//   });

//   doc.save(fileName);
// };

// export const exportSiinPDF = (data, fileName) => {
//   const doc = new jsPDF();
//   const headers = [['ID', 'IBAN', 'NAME', 'BANK COUNTRY', 'REFERENCE CODE', 'AMOUNT', 'TX ID', 'CREATED AT', 'UPDATED AT']];

//   const tableData = data.map(siin => [
//       siin.id,
//       siin.senderIban,
//       siin.senderName,
//       siin.senderBankCountry,
//       siin.referenceCode,
//       siin.amount,
//       siin.transaction.txId,
//       formatDate(siin.createdAt),
//       formatDate(siin.updatedAt),
//   ]);

//   doc.autoTable({
//       head: headers,
//       body: tableData,
//       startY: 10,
//       margin: { top: 20 },
//   });

//   doc.save(fileName);
// };

// CSV
// export const exportCSV = (data, fileName) => {
//   const headers = [[
//       'ID', 
//       'TXID', 
//       'STATUS', 
//       'PROVIDER', 
//       'WEBHOOK CODE DESCR',  
//       'DATE OF CREATION', 
//       'UPDATE DATE',
//       'MERCHANT ID',
//       'MERCHANT NAME',
//       'GEO',
//       'AMOUNT',
//       'CURRENCY'
//   ]];

//   const tableData = data.map(transaction => [
//       transaction.id,
//       transaction.txId,
//       transaction.status,
//       transaction.provider.name,
//       transaction.webhooks[transaction.webhooks.length - 1]?.originalRequest?.response_code_description,
//       formatDate(transaction.createdAt),
//       formatDate(transaction.updatedAt),
//       transaction.initialRequest.merchantId,
//       transaction.merchant.name,
//       transaction.initialRequest?.countryCode,
//       Number(transaction.amount),
//       getCurrency(transaction.initialRequest?.countryCode, transaction.provider.name).toUpperCase()
//   ]);

//   const csvData = [headers, ...tableData];

//   const csv = Papa.unparse(csvData);

//   const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
//   fileSaver.saveAs(blob, fileName);
// };

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

// export const exportSiinCSV = (data, fileName) => {
//   const headers = ['ID', 'IBAN', 'NAME', 'BANK COUNTRY', 'REFERENCE CODE', 'AMOUNT', 'TX ID', 'CREATED AT', 'UPDATED AT'];

//   const tableData = data.map(siin => [
//       siin.id,
//       siin.senderIban,
//       siin.senderName,
//       siin.senderBankCountry,
//       siin.referenceCode,
//       siin.amount,
//       siin.transaction.txId,
//       formatDate(siin.createdAt),
//       formatDate(siin.updatedAt),
//   ]);

//   const csvData = [headers, ...tableData];

//   const csv = Papa.unparse(csvData);

//   const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
//   fileSaver.saveAs(blob, fileName);
// };