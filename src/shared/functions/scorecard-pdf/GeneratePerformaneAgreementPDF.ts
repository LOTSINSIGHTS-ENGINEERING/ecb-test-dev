import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import { IMeasure } from "../../models/Measure";
import { IMeasureCompany } from "../../models/MeasureCompany";
// import { IMeasureDepartment } from "../../models/MeasureDepartment";
import { IObjective } from "../../models/Objective";
import UserPerformanceData from "../../models/Report";
import { CompanyDashboardPDF } from "./CompanyDashboardPDF";
import { CompanyPerformanceAgreementDocument } from "./CompanyPerformanceAgreementDocument ";
// import { DepartmentPerformanceAgreementDocument } from "../../../assets/junk/functions/scorecard-pdf/DepartmentPerformanceAgreementDocument";
import { IndividualPerformanceAgreementDocument } from "./IndividualPerformanceAgreementDocument";
import { PerformaceReportReportPDF } from "./PerformaceReportReportPDF";
import { ReportPDF } from "./ReportPDF";

(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

export const generateCompanyPerformanceAgreementPDF = async (
  title: string,
  strategicObjectives: IObjective[],
  measures: IMeasureCompany[]
) => {
  const newWindow = window.open();
  pdfMake
    .createPdf(
      (await CompanyPerformanceAgreementDocument(
        title,
        strategicObjectives,
        measures
      )) as any
    )
    .open({}, newWindow);
};

// export const generateDepartmentPerformanceAgreementPDF = async (
//   title: string,
//   strategicObjectives: IObjective[],
//   contributoryObjectives: IObjective[],
//   measures: IMeasureDepartment[]
// ) => {
//   const newWindow = window.open();
//   pdfMake
//     .createPdf(
//       (await DepartmentPerformanceAgreementDocument(
//         title,
//         strategicObjectives,
//         contributoryObjectives,
//         measures
//       )) as any
//     )
//     .open({}, newWindow);
// };

export const generateIndividualPerformanceAgreementPDF = async (
  title: string,
  strategicObjectives: IObjective[],
  contributoryObjectives: IObjective[],
  measures: IMeasure[]
) => {
  const newWindow = window.open();
  pdfMake
    .createPdf(
      (await IndividualPerformanceAgreementDocument(
        title,
        strategicObjectives,
        contributoryObjectives,
        measures
      )) as any
    )
    .open({}, newWindow);
};

export const generatePerformaceReportReportPDF = async (
  title: string,
  data: UserPerformanceData[]
) => {
  const newWindow = window.open();
  pdfMake
    .createPdf((await PerformaceReportReportPDF(title, data)) as any)
    .open({}, newWindow);
};

export const generateReportPDF = async (
  q2best: UserPerformanceData[],
  q2worst: UserPerformanceData[],
  q4best: UserPerformanceData[],
  q4worst: UserPerformanceData[]
) => {
  const newWindow = window.open();
  pdfMake.createPdf((await ReportPDF(q2best, q2worst, q4best, q4worst)) as any).open({}, newWindow);
};


export const generateCompanyDashboardPDF = async (
  vision: string,
  mission: string,
  chartsimage: HTMLAnchorElement,

) => {
  const newWindow = window.open();
  pdfMake.createPdf((await CompanyDashboardPDF(vision, mission, chartsimage)) as any).open({}, newWindow);
};