import UserPerformanceData from "../../models/Report";
import { marginTopBottom, header, sectionHeader } from "./DocDefition";

type Row = [string, string, string | number, string | number];

const tableWidths: Row = ["auto", "auto", "auto", "auto"];

const tableHeader: Row = [
  "Employee Name",
  "Department",
  "Midterm Rating",
  "Final Rating",
];

export interface IReportTableRowItem {
  userName: string;
  department: string;
  rating: number;
  rating2: number;
}

const ReportDocumentDefinition = (data: UserPerformanceData[]) => {
  const tableRows: IReportTableRowItem[] = data.map((d) => {
    const row: IReportTableRowItem = {
      userName: d.asJson.userName,
      department: d.asJson.departmentName,
      rating: d.asJson.rating,
      rating2: d.asJson.rating2,
    };
    return row;
  });
  return tableRows;
};

export const PerformaceReportReportPDF = async (
  title: string,
  data: UserPerformanceData[]
) => {
  const rows: IReportTableRowItem[] = ReportDocumentDefinition(data);

  const mappedRows: Row[] = rows.map((row) => {
    return [row.userName, row.department, row.rating, row.rating2];
  });

  const body = [tableHeader, ...mappedRows];

  return {
    pageSize: "A2",
    pageOrientation: "landscape",
    content: [
      marginTopBottom(),

      header(title),
      marginTopBottom(),

      sectionHeader("Mission:"),
      sectionHeader("To be the leading electricity regulator in Africa."),
      marginTopBottom(),

      sectionHeader("Vision:"),
      sectionHeader(
        `To regulate the Namibian Electricity Supply Industry in a sustainable manner, in the interest of all stakeholders
         with regard to efficiency, affordability, safety and accessibility.`
      ),
      marginTopBottom(),

      {
        layout: "lightHorizontalLines", // optional
        table: {
          headerRows: 1,
          widths: tableWidths,
          body: body,
        },
      },
    ],
  };
};
