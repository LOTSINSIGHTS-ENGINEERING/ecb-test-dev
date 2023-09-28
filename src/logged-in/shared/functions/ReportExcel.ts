import writeXlsxFile from "write-excel-file";
import UserPerformanceData, { IUserPerformanceData } from "../../../shared/models/Report";

export interface IEmployeeTableRowItem {
  userName: string;
  departmentName: string;
  rating: number;
  rating2: number;
}

const EMPLOYEE_HEADER_ROW: any = [
  {
    value: "Employee Name",
    fontWeight: "bold",
    backgroundColor: "#F4B084",
  },
  {
    value: "Department",
    fontWeight: "bold",
    backgroundColor: "#FFCC00",
  },
  {
    value: "Midterm Score",
    fontWeight: "bold",
    backgroundColor: "#FFCC00",
  },
  {
    value: "Assessment Score",
    fontWeight: "bold",
    backgroundColor: "#FFCC00",
  },
];

const SCORECARD_COLUMNS = [
  { width: 40 }, // Employee Name
  { width: 40 }, // Department
  { width: 20 }, // Midterm Score
  { width: 20 }, // assessment Score
];

const EmployeeExcelDefinition = (data: UserPerformanceData[]): IEmployeeTableRowItem[] => {

  const tableRows: IEmployeeTableRowItem[] = data.map((d) => {
    const row: IEmployeeTableRowItem = {
      userName: d ? d.asJson.userName : "",
      departmentName: d ? d.asJson.departmentName : "",
      rating: d ? d.asJson.rating : 0,
      rating2: d ? d.asJson.rating2 : 0,
    };
    return row;
  });
  return tableRows.sort((a, b) => b.rating2 - a.rating2);
};

type FormatColumnParams = {
  value: any;
  type?: | String | "String";
  symbol?: string;
  backgroundColor?: string;
  rowSpan?: number;
};

const formatColumn = ({ value, type = "String", backgroundColor, rowSpan }: FormatColumnParams) => {
  switch (type) {
    case "Number":
      return {
        type: Number,
        format: "#.##",
        value: Number(value) || 0,
        alignVertical: "top",
        backgroundColor: backgroundColor,
        borderColor: "#55555",
        rowSpan: rowSpan,
      };
    default:
      return {
        type: String,
        value: value.toString() || "",
        wrap: true,
        alignVertical: "top",
        backgroundColor: backgroundColor,
        borderColor: "#55555",
        rowSpan: rowSpan,
      };
  }
};

export const exportReportExcel = async (datas: UserPerformanceData[]) => {

  const rows = EmployeeExcelDefinition(datas);

  const dataRows = rows.map((row, _, data) => {
    return [
      formatColumn({ value: row.userName }),
      formatColumn({ value: row.departmentName }),
      formatColumn({ value: row.rating, type: "Number" }),
      formatColumn({ value: row.rating2, type: "Number" }),
    ];
  });

  const data = [EMPLOYEE_HEADER_ROW, ...dataRows.sort()];

  await writeXlsxFile(data, {
    columns: SCORECARD_COLUMNS,
    fileName: `Performance Report.xlsx`,
    sheet: "Data",
    fontFamily: "Candara",
    fontSize: 12,
  });
};
