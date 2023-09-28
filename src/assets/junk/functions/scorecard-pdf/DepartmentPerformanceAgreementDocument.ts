import { useEffect, useRef, useState } from "react";
// import { dataTypeSymbol } from "../../../../logged-in/shared/functions/Scorecard";
// import { dateFormat } from "../../../../logged-in/shared/utils/utils";
// import { fullPerspectiveName } from "../../../../shared/interfaces/IPerspectiveTabs";
// import { IMeasureDepartment } from "../../models/MeasureDepartment";
// import { IObjective } from "../../../../shared/models/Objective";
// import { dataFormat } from "../../../../shared/functions/Directives";
// import { marginTopBottom, header, sectionHeader } from "../../../../shared/functions/scorecard-pdf/DocDefition";
// import { brandLogo, footerStripes } from "../../../../shared/functions/scorecard-pdf/ImageDefinition";

// type RowSpan = {
//   text: string | any;
//   rowSpan?: number;
//   style?: string;
// };

// const tableWidths: Row = [
//   100,
//   "*",
//   "*",
//   "auto",
//   "auto",
//   "auto",
//   "auto",
//   "auto",
//   "auto",
//   "auto",
//   "auto",
//   "auto",
//   "auto",
//   "auto",
//   "auto",
//   "auto",
// ];

// const tableHeader: Row = [
//   "Perspective",
//   "Strategic Objectives",
//   "Contributory Departmental Objective",
//   "Weight (%)",
//   "Measures/KPI",
//   "Baseline",
//   "Quarterly Target , Q1",
//   "Quarterly Target , Q2",
//   "Quarterly Target , Q3",
//   "Quarterly Target , Q4",
//   "Annual Target",
//   "Rating Scale 1-5",
//   "Key Initiatives",
//   "Target Date",
//   "Source of Evidence",
//   "Comments",
// ];

// type Row = [
//   string | number | RowSpan,
//   string | RowSpan,
//   string | RowSpan,
//   string | number | RowSpan,
//   string | number | RowSpan,
//   string | number | RowSpan,
//   string | number | RowSpan,
//   string | number | RowSpan,
//   string | number | RowSpan,
//   string | number | RowSpan,
//   string | number | RowSpan,
//   string | RowSpan,
//   string | number | RowSpan,
//   string | number | RowSpan,
//   string | RowSpan,
//   string | RowSpan
// ];


// export interface IDepartmentAgreementTableRowItem {
//   perspective: string; // "Perspective",
//   strategicObjective: string; // "Strategic Objectives",
//   contributoryObjective: string; // "Contributory Departmental Objective",
//   weight: number; // "Weight (%)",
//   measure: string | number; // "Measures/KPI",
//   baseline: string | number; // "Baseline",
//   q1target: string | number; // "Quarterly Target , Q1",
//   q2target: string | number; // "Quarterly Target , Q2",
//   q3target: string | number; // "Quarterly Target , Q3",
//   q4target: string | number; // "Quarterly Target , Q4",
//   annualTarget: string | number; // "Annual Target",
//   ratingScale: string; // "Annual Target",
//   keyInitiatives: string | number; // "Key Initiatives",
//   targetDate: string | number; // "Target Date",
//   sourceOfEvidence: string; // "Source of Evidence",
//   comments: string; // "Comments",
//   dataType?: string; // "Data type"
//   dataSymbol?: string; // "Symbol"
// }

// const formatMeasureValue = (type: string, value: string | number | null) => {
//   const suffix = dataTypeSymbol(type).suffix;
//   const prefix = dataTypeSymbol(type).prefix;

//   if (!value) return "";
//   if (type === "Date") return dateFormat(Number(value));
//   if (type === "Currency")
//     return `${prefix}${Number(value).toFixed(2)}${suffix}`;

//   return `${prefix}${value}${suffix}`;
// };


// const ConvertToTableRowItem = (
//   strategicObjectives: IObjective[],
//   contributoryObjectives: IObjective[],
//   measures: IMeasureDepartment[]
// ) => {
//   const tableRows: IDepartmentAgreementTableRowItem[] = measures.map((m) => {
//     // get contributory objective
//     const contributory = contributoryObjectives.find(
//       (o) => o.id === m.objective
//     );

//     // get strategic objective
//     const strategic = strategicObjectives.find((s) => {
//       if (!contributory) return false;
//       return s.id === contributory.parent;
//     });

//     const ratingScale = () => {
//       const r1 = m.rating1 ? `1 = ${dataFormat(m.dataType, m.rating1, m.dataSymbol)}` : "";
//       const r2 = m.rating2 ? `2 = ${dataFormat(m.dataType, m.rating2, m.dataSymbol)}` : "";
//       const r3 = m.rating3 ? `3 = ${dataFormat(m.dataType, m.rating3, m.dataSymbol)}` : "";
//       const r4 = m.rating4 ? `4 = ${dataFormat(m.dataType, m.rating4, m.dataSymbol)}` : "";
//       const r5 = m.rating5 ? `5 = ${dataFormat(m.dataType, m.rating5, m.dataSymbol)}` : "";
//       const scale = `${r1}\n${r2}\n${r3}\n${r4}\n${r5}`;
//       return scale;
//     };

//     const row: IDepartmentAgreementTableRowItem = {
//       perspective: fullPerspectiveName(contributory ? contributory.perspective : ""),
//       strategicObjective: strategic ? strategic.description : "unknown",
//       contributoryObjective: contributory ? contributory.description : "unkown",
//       weight: contributory ? contributory.weight || 0 : 0,
//       measure: m ? m.description : "unkown",
//       baseline: m ? formatMeasureValue(m.dataType, m.baseline) : "unkown",
//       q1target: m ? formatMeasureValue(m.dataType, m.quarter1Target) : "unkown",
//       q2target: m ? formatMeasureValue(m.dataType, m.quarter2Target) : "unkown",
//       q3target: m ? formatMeasureValue(m.dataType, m.quarter3Target) : "unkown",
//       q4target: m ? formatMeasureValue(m.dataType, m.quarter4Target) : "unkown",
//       annualTarget: m ? formatMeasureValue(m.dataType, m.annualTarget) : "unknown",
//       ratingScale: ratingScale(),
//       keyInitiatives: m ? m.activities : "unkown",
//       targetDate: m ? m.targetDate : "unkown",
//       sourceOfEvidence: m ? m.sourceOfEvidence : "unkown",
//       comments: m ? m.comments : "unkown",
//       dataType: m.dataType,
//       dataSymbol: m.dataSymbol,

//     };

//     return row;
//   });

//   const sortByPerspective = (
//     a: IDepartmentAgreementTableRowItem,
//     b: IDepartmentAgreementTableRowItem
//   ) => {
//     const order = ["F", "C", "I", "L"];
//     const aIndex = order.indexOf(a.perspective.charAt(0));
//     const bIndex = order.indexOf(b.perspective.charAt(0));
//     return (
//       aIndex - bIndex ||
//       a.strategicObjective.localeCompare(b.strategicObjective) ||
//       a.contributoryObjective.localeCompare(b.contributoryObjective)
//     );
//   };
//   return tableRows.sort(sortByPerspective);
// };

// const FormatTableSpan = (_rows: IDepartmentAgreementTableRowItem[]) => {
//   let perspective = "";
//   let objective = "";
//   let cObjective = "";

//   const rows: Row[] = _rows.map((row, _, data) => {
//     let perspectiveRowSpan = undefined;
//     let objectiveRowSpan = undefined;
//     let cObjectiveRowSpan = undefined;

//     if (perspective !== row.perspective) {
//       perspective = row.perspective;
//       perspectiveRowSpan = data.filter(
//         (r) => r.perspective === perspective
//       ).length;
//     }

//     if (objective !== row.strategicObjective) {
//       objective = row.strategicObjective;
//       objectiveRowSpan = data.filter(
//         (r) => r.strategicObjective === objective
//       ).length;
//     }

//     if (cObjective !== row.contributoryObjective) {
//       cObjective = row.contributoryObjective;
//       cObjectiveRowSpan = data.filter(
//         (r) => r.contributoryObjective === cObjective
//       ).length;
//     }

//     return [
//       {
//         rowSpan: perspectiveRowSpan || 1,
//         text: row.perspective,
//         fillColor: '#dedede'
//       },
//       {
//         rowSpan: objectiveRowSpan || 1,
//         text: row.strategicObjective,
//       },
//       {
//         rowSpan: cObjectiveRowSpan || 1,
//         text: row.contributoryObjective,
//       },
//       {
//         rowSpan: cObjectiveRowSpan || 1,
//         text: row.weight || "-",
//       },
//       row.measure || "-",
//       row.baseline || "-",
//       row.q1target || "-",
//       row.q2target || "-",
//       row.q3target || "-",
//       row.q4target || "-",
//       row.annualTarget || "-",
//       row.ratingScale || "-",
//       row.keyInitiatives || "-",
//       row.targetDate || "-",
//       row.sourceOfEvidence || "-",
//       row.comments || "-",
//     ];
//   });

//   return rows;
// };

// export const DepartmentPerformanceAgreementDocument = async (
//   title: string,
//   strategicObjectives: IObjective[],
//   contributoryObjectives: IObjective[],
//   measures: IMeasureDepartment[]
// ) => {
//   const logo = await brandLogo();
//   const footer = await footerStripes();

//   const rows: IDepartmentAgreementTableRowItem[] = ConvertToTableRowItem(
//     strategicObjectives,
//     contributoryObjectives,
//     measures
//   );

//   const mappedRows = FormatTableSpan(rows);

//   const body = [tableHeader, ...mappedRows];

//   return {
//     pageSize: "A2", // by default we use portrait, you can change it to landscape if you wish
//     pageOrientation: "landscape",
//     footer,
//     content: [
//       logo,
//       marginTopBottom(),
//       header(title),
//       marginTopBottom(),
//       sectionHeader("Vision:"),
//       sectionHeader("To be the leading electricity regulator in Africa"),
//       marginTopBottom(),
//       sectionHeader("Mission:"),
//       sectionHeader("To regulate the Namibian Electricity Supply Industry in a sustainable manner, in the interest of all stakeholders with regard to efficiency, affordability, safety and accessibility."),
//       marginTopBottom(),
//       {
//         logo,
//         table: {
//           headerRows: 1,
//           widths: tableWidths,
//           body: body,
//         },
//       },
//     ],
//     styles: {
//       tableHeader: {
//         bold: true,
//         fontSize: 12,
//         color: "black",
//       },
//     },
//   };
// };