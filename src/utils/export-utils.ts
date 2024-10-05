import { CSV } from "@/types";
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
