import UserPerformanceData from "../../models/Report";
import { marginTopBottom, header, sectionHeader } from "./DocDefition";
import { brandLogo } from "./ImageDefinition";

type Row = [string, string, string | number];

const tableWidths: Row = ["auto", "auto", "auto"];

const tableHeader: Row = ["Employee Name", "Department", "Rating"];

export interface IQ2ReportTableRowItem {
  userName: string;
  department: string;
  rating: number | string;
}

export interface IQ4ReportTableRowItem {
  userName: string;
  department: string;
  rating2: number | string;
}

const q2DocumentDefinition = (data: UserPerformanceData[]) => {
  const q2tableRows: IQ2ReportTableRowItem[] = data.map((d) => {
    const row: IQ2ReportTableRowItem = {
      userName: d.asJson.userName,
      department: d.asJson.departmentName,
      rating: d.asJson.rating.toFixed(2),
    };
    return row;
  });
  return q2tableRows;
};

const q4DocumentDefinition = (data: UserPerformanceData[]) => {
  const q1tableRows: IQ4ReportTableRowItem[] = data.map((d) => {
    const row: IQ4ReportTableRowItem = {
      userName: d.asJson.userName,
      department: d.asJson.departmentName,
      rating2: d.asJson.rating2.toFixed(2),
    };
    return row;
  });
  return q1tableRows;
};

export const ReportPDF = async (q2best: UserPerformanceData[], q2worst: UserPerformanceData[],
  q4best: UserPerformanceData[], q4worst: UserPerformanceData[]) => {

  const logo = await brandLogo();

  const q2brows: IQ2ReportTableRowItem[] = q2DocumentDefinition(q2best);
  const q2wrows: IQ2ReportTableRowItem[] = q2DocumentDefinition(q2worst);

  const q4brows: IQ4ReportTableRowItem[] = q4DocumentDefinition(q4best);
  const q4wrows: IQ4ReportTableRowItem[] = q4DocumentDefinition(q4worst);

  const q2bestMappedRows: Row[] = q2brows.map((row) => {
    return [row.userName, row.department, row.rating];
  });
  const q2WorstmappedRows: Row[] = q2wrows.map((row) => {
    return [row.userName, row.department, row.rating];
  });

  const q4bestMappedRows: Row[] = q4brows.map((row) => {
    return [row.userName, row.department, row.rating2];
  });
  const q4WorstmappedRows: Row[] = q4wrows.map((row) => {
    return [row.userName, row.department, row.rating2];
  });

  const q2bestBody = [tableHeader, ...q2bestMappedRows];
  const q2worstBody = [tableHeader, ...q2WorstmappedRows];

  const q4bestBody = [tableHeader, ...q4bestMappedRows];
  const q4worstBody = [tableHeader, ...q4WorstmappedRows];

  return {
    pageSize: "A2",
    pageOrientation: "landscape",
    content: [
      logo,
      marginTopBottom(),
      header("Company Performance Report"),
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

      header("Midterm Best Performers"),
      marginTopBottom(),
      {
        layout: "lightHorizontalLines", // optional
        table: {
          headerRows: 1,
          widths: tableWidths,
          body: q2bestBody,
        },
      },
      marginTopBottom(),
      marginTopBottom(),
      header("Midterm Worst Performers"),
      {
        layout: "lightHorizontalLines", // optional
        table: {
          headerRows: 1,
          widths: tableWidths,
          body: q2worstBody,
        },
      },
      marginTopBottom(),
      marginTopBottom(),
      header("Assessment Best Performers"),
      {
        layout: "lightHorizontalLines", // optional
        table: {
          headerRows: 1,
          widths: tableWidths,
          body: q4bestBody,
        },
      },
      marginTopBottom(),
      marginTopBottom(),
      header("Assessment Worst Performers"),
      {
        layout: "lightHorizontalLines", // optional
        table: {
          headerRows: 1,
          widths: tableWidths,
          body: q4worstBody,
        },
      },
    ],
  };
};
