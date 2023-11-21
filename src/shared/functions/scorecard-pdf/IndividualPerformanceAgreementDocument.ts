import { fullPerspectiveName } from "../../interfaces/IPerspectiveTabs";
import { IMeasure } from "../../models/Measure";
import { IObjective } from "../../models/Objective";
import { dataFormat } from "../Directives";
import { marginTopBottom, header, sectionHeader } from "./DocDefition";
import { brandLogo, footerStripes } from "./ImageDefinition";

type RowSpan = {
  text: string | any;
  rowSpan?: number;
  style?: string;
};

const tableWidths: Row = [
  100,
  "*",
  "*",
  "auto",
  "auto",
  "auto",
  "auto",
  "auto",
  "auto",
  // 
  "auto",
  "auto",
  "auto",
  // 
  "auto",
  "auto",
  "auto",
  "auto",
  "auto",
  "auto",
  "auto",
  "auto",
  "auto",
];

const tableHeader: Row = [
  "Perspective",
  "Contributory Objective",
  "Individual  Scorecard Contribution",
  "Weight (%)",
  // 
  "Draft Comment",
  "Midterm Comment",
  "Assessment Comment",
  //
  "Measures/KPI",
  "Baseline",
  "Annual Target",
  "Rating Scale 1-5",
  "Key Initiatives",
  "Target Date",
  "Source of Evidence",
  "KPI Comments",
  "Midterm E Rating",
  "Midterm S Rating",
  "Midterm F Rating",
  "Assessment E Rating",
  "Assessment S Rating",
  "Assessment F Rating",
];

type Row = [
  string | number | RowSpan,
  string | RowSpan,
  string | RowSpan,
  string | number | RowSpan,
  // 
  string | number | RowSpan,
  string | number | RowSpan,
  string | number | RowSpan,
  // 
  string | number | RowSpan,
  string | number | RowSpan,
  string | number | RowSpan,
  string | RowSpan,
  string | number | RowSpan,
  string | number | RowSpan,
  string | RowSpan,
  string | RowSpan,
  string | number | RowSpan, //   "E",
  string | number | RowSpan, //   "S",
  string | number | RowSpan, //   "F",
  string | number | RowSpan, //   "E",
  string | number | RowSpan, //   "S",
  string | number | RowSpan //   "F",
];

export interface IEmployeeTableRowItem {
  perspective: string; // "Perspective",
  strategicObjective: string; // "Strategic Objectives",
  contributoryObjective: string; // "Contributory Departmental Objective",
  weight: number; // "Weight (%)",

  draftComment: string; // "Draft Comment",
  midComment: string; // "Midterm Comment",
  assessComment: string; // "Assessment Comment",

  measure: string | number; // "Measures/KPI",
  baseline: string | number; // "Baseline",
  annualTarget: string | number; // "Annual Target",
  ratingScale: string; // "Annual Target",
  keyInitiatives: string | number; // "Key Initiatives",
  targetDate: string | number; // "Target Date",
  sourceOfEvidence: string; // "Source of Evidence",
  comments: string; // "Comments",
  dataType?: string; // "Data type"
  dataSymbol?: string; // "Symbol"
  autoRating: number,
  supervisorRating: number | null,
  finalRating: number | null,
  autoRating2: number,
  supervisorRating2: number | null,
  finalRating2: number | null,
}

const ConvertToTableRowItem = (
  strategicObjectives: IObjective[],
  contributoryObjectives: IObjective[],
  measures: IMeasure[]
) => {
  const tableRows: IEmployeeTableRowItem[] = measures.map((m) => {
    // get contributory objective
    const contributory = contributoryObjectives.find((o) => o.id === m.objective);

    // get strategic objective
    const strategic = strategicObjectives.find((s) => {
      if (!contributory) return false;
      return s.id === contributory.parent;
    });

    const ratingScale = () => {
      const r1 = m.rating1 ? `1 = ${dataFormat(m.dataType, m.rating1, m.dataSymbol)}` : "";
      const r2 = m.rating2 ? `2 = ${dataFormat(m.dataType, m.rating2, m.dataSymbol)}` : "";
      const r3 = m.rating3 ? `3 = ${dataFormat(m.dataType, m.rating3, m.dataSymbol)}` : "";
      const r4 = m.rating4 ? `4 = ${dataFormat(m.dataType, m.rating4, m.dataSymbol)}` : "";
      const r5 = m.rating5 ? `5 = ${dataFormat(m.dataType, m.rating5, m.dataSymbol)}` : "";
      const scale = `${r1}\n${r2}\n${r3}\n${r4}\n${r5}`;
      return scale;
    };

    const row: IEmployeeTableRowItem = {
      perspective: fullPerspectiveName(contributory ? contributory.perspective : ""),
      strategicObjective: strategic ? strategic.description : "unknown",
      contributoryObjective: contributory ? contributory.description : "unkown",
      weight: contributory ? contributory.weight || 0 : 0,
      // 
      draftComment: contributory ? contributory.draftComment : "",
      midComment: contributory ? contributory.midComment : "",
      assessComment: contributory ? contributory.assessComment : "",
      // 
      measure: m ? m.description : "unkown",
      baseline: m ? dataFormat(m.dataType, m.baseline, m.dataSymbol) : "unkown",
      annualTarget: m ? dataFormat(m.dataType, m.annualTarget, m.dataSymbol) : "unknown",
      ratingScale: ratingScale(),
      keyInitiatives: m ? m.activities : "unkown",
      targetDate: m ? m.targetDate : "unkown",
      sourceOfEvidence: m ? m.sourceOfEvidence : "unkown",
      comments: m ? m.comments : "unkown",
      dataType: m.dataType,
      dataSymbol: m.dataSymbol,
      autoRating: m.autoRating,
      supervisorRating: m.supervisorRating,
      finalRating: m.finalRating,
      autoRating2: m.autoRating2,
      supervisorRating2: m.supervisorRating2,
      finalRating2: m.finalRating2,
    };

    return row;
  });

  const sortByPerspective = (
    a: IEmployeeTableRowItem,
    b: IEmployeeTableRowItem
  ) => {
    const order = ["F", "C", "I", "L"];
    const aIndex = order.indexOf(a.perspective.charAt(0));
    const bIndex = order.indexOf(b.perspective.charAt(0));
    return (
      aIndex - bIndex ||
      a.strategicObjective.localeCompare(b.strategicObjective) ||
      a.contributoryObjective.localeCompare(b.contributoryObjective)
    );
  };
  return tableRows.sort(sortByPerspective);
};

const FormatTableSpan = (_rows: IEmployeeTableRowItem[]) => {
  let perspective = "";
  let objective = "";
  let cObjective = "";

  const rows: Row[] = _rows.map((row, _, data) => {
    let perspectiveRowSpan = undefined;
    let objectiveRowSpan = undefined;
    let cObjectiveRowSpan = undefined;

    if (perspective !== row.perspective) {
      perspective = row.perspective;
      perspectiveRowSpan = data.filter(
        (r) => r.perspective === perspective
      ).length;
    }

    if (objective !== row.strategicObjective) {
      objective = row.strategicObjective;
      objectiveRowSpan = data.filter(
        (r) => r.strategicObjective === objective
      ).length;
    }

    if (cObjective !== row.contributoryObjective) {
      cObjective = row.contributoryObjective;
      cObjectiveRowSpan = data.filter(
        (r) => r.contributoryObjective === cObjective
      ).length;
    }

    return [
      {
        // rowSpan: perspectiveRowSpan || 1,
        text: row.perspective,
        fillColor: '#dedede'
      },
      {
        // rowSpan: objectiveRowSpan || 1,
        text: row.strategicObjective,
      },
      {
        // rowSpan: cObjectiveRowSpan || 1,
        text: row.contributoryObjective,
      },
      {
        // rowSpan: cObjectiveRowSpan || 1,
        text: row.weight || "-",
      },
      // 
      {
        // rowSpan: cObjectiveRowSpan || 1,
        text: row.draftComment || "-",
      },
      {
        // rowSpan: cObjectiveRowSpan || 1,
        text: row.midComment || "-",
      },
      {
        // rowSpan: cObjectiveRowSpan || 1,
        text: row.assessComment || "-",
      },
      // 
      row.measure || "-",
      row.baseline || "-",
      row.annualTarget || "-",
      row.ratingScale || "-",
      row.keyInitiatives || "-",
      row.targetDate || "-",
      row.sourceOfEvidence || "-",
      row.comments || "-",
      row.autoRating || 0,
      row.supervisorRating || 0,
      row.finalRating || 0,
      row.autoRating2 || 0,
      row.supervisorRating2 || 0,
      row.finalRating2 || 0,
    ];
  });

  return rows;
};

export const IndividualPerformanceAgreementDocument = async (
  title: string,
  strategicObjectives: IObjective[],
  contributoryObjectives: IObjective[],
  measures: IMeasure[]
) => {
  const logo = await brandLogo();
  const footer = await footerStripes();

  const rows: IEmployeeTableRowItem[] = ConvertToTableRowItem(
    strategicObjectives,
    contributoryObjectives,
    measures
  );

  const mappedRows = FormatTableSpan(rows);

  const body = [tableHeader, ...mappedRows];

  return {
    pageSize: "A2", // by default we use portrait, you can change it to landscape if you wish
    pageOrientation: "landscape",
    footer,
    content: [
      logo,
      marginTopBottom(),
      header(title),
      marginTopBottom(),
      sectionHeader("Vision:"),
      sectionHeader("To be the leading electricity regulator in Africa"),
      marginTopBottom(),
      sectionHeader("Mission:"),
      sectionHeader("To regulate the Namibian Electricity Supply Industry in a sustainable manner, in the interest of all stakeholders with regard to efficiency, affordability, safety and accessibility."),
      marginTopBottom(),
      {
        logo,
        table: {
          headerRows: 1,
          widths: tableWidths,
          body: body,
        },
      },
    ],
    styles: {
      tableHeader: {
        bold: true,
        fontSize: 12,
        color: "black",
      },
    },
  };
};