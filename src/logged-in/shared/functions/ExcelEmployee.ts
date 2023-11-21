import writeXlsxFile from "write-excel-file";
import { dataFormat } from "../../../shared/functions/Directives";
import { IEmployeeTableRowItem } from "../../../shared/functions/scorecard-pdf/IndividualPerformanceAgreementDocument";
import { fullPerspectiveName } from "../../../shared/interfaces/IPerspectiveTabs";
import { IMeasure } from "../../../shared/models/Measure";
import { IObjective } from "../../../shared/models/Objective";

const EMPLOYEE_HEADER_ROW: any = [
  {
    value: "Perspectives",
    fontWeight: "bold",
    backgroundColor: "#F4B084",
  },
  {
    value: "Contributory Departmental Objective",
    fontWeight: "bold",
    backgroundColor: "#FFCC00",
    wrap: true,
  },
  {
    value: "Individual Scorecard Contribution",
    fontWeight: "bold",
    backgroundColor: "#FFCC00",
    wrap: true,
  },
  {
    value: "Weight",
    fontWeight: "bold",
    backgroundColor: "#FFCC00",
  },
  // 
  {
    value: "Draft Comments",
    fontWeight: "bold",
    backgroundColor: "#FFCC00",
  },
  {
    value: "Midterm Comments",
    fontWeight: "bold",
    backgroundColor: "#FFCC00",
  },
  {
    value: "Assesment Comment",
    fontWeight: "bold",
    backgroundColor: "#FFCC00",
  },
  // 
  {
    value: "Measures/KPI",
    fontWeight: "bold",
    backgroundColor: "#FFCC00",
  },
  {
    value: "Baseline",
    fontWeight: "bold",
    backgroundColor: "#FFCC00",
  },
  {
    value: "Annual Target",
    fontWeight: "bold",
    backgroundColor: "#FFCC00",
  },
  {
    value: "Rating Scale 1-5",
    fontWeight: "bold",
    backgroundColor: "#FFCC00",
  },
  {
    value: "Key Initiatives",
    fontWeight: "bold",
    backgroundColor: "#FFCC00",
  },
  {
    value: "Target Date",
    fontWeight: "bold",
    backgroundColor: "#FFCC00",
  },
  {
    value: "Source of Evidence",
    fontWeight: "bold",
    backgroundColor: "#FFCC00",
    wrap: true,
  },
  {
    value: "Comments",
    fontWeight: "bold",
    backgroundColor: "#FFCC00",
  },
  {
    value: "Midterm E Rating",
    fontWeight: "bold",
    backgroundColor: "#FFCC00",
    wrap: true,
  },
  {
    value: "Midterm S Rating",
    fontWeight: "bold",
    backgroundColor: "#FFCC00",
    wrap: true,
  },
  {
    value: "Midterm F Rating",
    fontWeight: "bold",
    backgroundColor: "#FFCC00",
    wrap: true,
  },
  {
    value: "Assessment E Rating",
    fontWeight: "bold",
    backgroundColor: "#FFCC00",
    wrap: true,
  },
  {
    value: "Assessment S Rating",
    fontWeight: "bold",
    backgroundColor: "#FFCC00",
    wrap: true,
  },
  {
    value: "Assessment F Rating",
    fontWeight: "bold",
    backgroundColor: "#FFCC00",
    wrap: true,
  },
];

const SCORECARD_COLUMNS = [
  { width: 10 }, // Perspectives
  { width: 40 }, // Objectives
  { width: 40 }, // Contributory Objectives
  { width: 10 }, // Weight
  // 
  { width: 40 }, // Draft Comments
  { width: 40 }, // Mid Comments
  { width: 40 }, // Assesssment Comments
  // 
  { width: 25 }, // Measures/KPI
  { width: 15 }, // Baseline
  { width: 15 }, // Annual Target
  { width: 15 }, // Rating Scale 1-5
  { width: 40 }, // Key Initiatives
  { width: 15 }, // Target Date
  { width: 25 }, // Source of Evidence
  { width: 40 }, // Comments
  { width: 15 }, // E
  { width: 15 }, // S
  { width: 15 }, // F
  { width: 15 }, // E
  { width: 15 }, // S
  { width: 15 }, // F
];

const EmployeeExcelDefinition = (
  objectives: IObjective[],
  contributoryObjectives: IObjective[],
  measures: IMeasure[]
): IEmployeeTableRowItem[] => {
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

  const tableRows: IEmployeeTableRowItem[] = measures.map((m) => {
    // get contributory objective
    const contributory = contributoryObjectives.find(
      (o) => o.id === m.objective
    );

    // get strategic objective
    const strategic = objectives.find((s) => {
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
      measure: m ? m.description : "unknown",
      baseline: m ? m.baseline || 0 : "",
      annualTarget: m ? m.annualTarget || 0 : "",
      ratingScale: ratingScale(),
      keyInitiatives: m ? m.activities || "-" : "unkown",
      targetDate: m ? m.targetDate : "",
      sourceOfEvidence: m ? m.sourceOfEvidence || "-" : "unknown",
      comments: m ? m.comments : "",
      dataType: m.dataType,
      dataSymbol: m.dataSymbol,
      autoRating: m.autoRating || 0,
      supervisorRating: m.supervisorRating || 0,
      finalRating: m.finalRating || 0,
      autoRating2: m.autoRating2 || 0,
      supervisorRating2: m.supervisorRating2 || 0,
      finalRating2: m.finalRating2 || 0,
    };

    return row;
  });

  return tableRows.sort(sortByPerspective);
};

type FormatColumnParams = {
  value: any;
  type?:
  | string
  | "String"
  | "Currency"
  | "Number"
  | "Percentage"
  | "Date"
  | "Time"
  | "Custom"; //
  symbol?: string;
  backgroundColor?: string;
  rowSpan?: number;
};
const formatColumn = ({
  value,
  type = "String",
  backgroundColor,
  symbol = "",
  rowSpan,
}: FormatColumnParams) => {
  switch (type) {
    case "Currency":
      return {
        type: Number,
        format: "#,##0.00",
        value: value ? Number(value) : null,
        alignVertical: "top",
        backgroundColor: backgroundColor,
        borderColor: "#55555",
        rowSpan: rowSpan,
      };

    case "Number":
      return {
        type: Number,
        format: "#,##0",
        value: value ? Number(value) : null,
        alignVertical: "top",
        backgroundColor: backgroundColor,
        borderColor: "#55555",
        rowSpan: rowSpan,
      };

    case "Percentage":
      return {
        type: Number,
        format: "0.0%",
        value: value ? Number(value) / 100 : null,
        wrap: true,
        alignVertical: "top",
        backgroundColor: backgroundColor,
        borderColor: "#55555",
        rowSpan: rowSpan,
      };

    case "Date":
      if (!value) {
        return {
          type: String,
          value: value ? value.toString() : " - ",
          wrap: true,
          alignVertical: "top",
          backgroundColor: backgroundColor,
          borderColor: "#55555",
          rowSpan: rowSpan,
        };
      }
      return {
        type: Date,
        value: value ? new Date(value) : null,
        format: "d mmmm yyyy",
        wrap: true,
        alignVertical: "top",
        backgroundColor: backgroundColor,
        borderColor: "#55555",
        rowSpan: rowSpan,
      };

    case "Time":
      return {
        type: String,
        value: value ? value.toString() : " - ",
        wrap: true,
        alignVertical: "top",
        backgroundColor: backgroundColor,
        borderColor: "#55555",
        rowSpan: rowSpan,
      };

    case "Custom":
      return {
        type: Number,
        value: value ? Number(value) : null,
        format: "#,##0" + symbol,
        wrap: true,
        alignVertical: "top",
        backgroundColor: backgroundColor,
        borderColor: "#55555",
        rowSpan: rowSpan,
      };

    default:
      return {
        type: String,
        value: value ? value.toString() : " - ",
        wrap: true,
        alignVertical: "top",
        backgroundColor: backgroundColor,
        borderColor: "#55555",
        rowSpan: rowSpan,
      };
  }
};

export const exportEmployeeScorecardExcel = async (
  title: string,
  objectives: IObjective[],
  contributoryObjectives: IObjective[],
  measures: IMeasure[]
) => {
  // Get the rows
  const rows = EmployeeExcelDefinition(
    objectives,
    contributoryObjectives,
    measures
  );

  let perspective = "";
  let objective = "";
  let cObjective = "";

  const dataRows = rows.map((row, _, data) => {
    let perspectiveRowSpan = undefined;
    let objectiveRowSpan = undefined;
    let cObjectiveRowSpan = undefined;

    if (perspective !== row.perspective) {
      perspective = row.perspective;
      perspectiveRowSpan = data.filter((r) => r.perspective === perspective).length;
    }

    if (objective !== row.strategicObjective) {
      objective = row.strategicObjective;
      objectiveRowSpan = data.filter((r) => r.strategicObjective === objective).length;
    }

    if (cObjective !== row.contributoryObjective) {
      cObjective = row.contributoryObjective;
      cObjectiveRowSpan = data.filter((r) => r.contributoryObjective === cObjective).length;
    }

    return [
      formatColumn({
        value: row.perspective,
        backgroundColor: "#F4B084",
        rowSpan: perspectiveRowSpan || 1,
      }), // Perspectives
      formatColumn({
        value: row.strategicObjective,
        rowSpan: objectiveRowSpan || 1,
      }), // Objectives
      formatColumn({
        value: row.contributoryObjective,
        rowSpan: cObjectiveRowSpan || 1,
      }), // Contributory Objectives
      formatColumn({
        value: row.weight,
        type: "General",
        rowSpan: cObjectiveRowSpan || 1,
      }), // Weight
      // 
      formatColumn({
        value: row.draftComment,
        type: "General",
        rowSpan: cObjectiveRowSpan || 1,
      }),
      formatColumn({
        value: row.midComment,
        type: "General",
        rowSpan: cObjectiveRowSpan || 1,
      }), // Weight
      formatColumn({
        value: row.assessComment,
        type: "General",
        rowSpan: cObjectiveRowSpan || 1,
      }), // Weight
      // 
      formatColumn({ value: row.measure }), // Measures/KPI
      formatColumn({
        value: row.baseline,
        type: row.dataType, //if general, the number dates are not converted to date TO DO:
        symbol: row.dataSymbol,
      }), // Baseline //if general, the number dates are not converted to date TO DO:
      formatColumn({
        value: row.annualTarget,
        type: row.dataType,
        symbol: row.dataSymbol,
      }), // Annual Target
      formatColumn({ value: row.ratingScale }), // Rating scale 1-5
      formatColumn({ value: row.keyInitiatives }), // Key Initiatives
      formatColumn({ value: row.targetDate, type: "Date" }), // Target Date
      formatColumn({ value: row.sourceOfEvidence }), // Source of evidence
      formatColumn({ value: row.comments }), // Comments
      formatColumn({ value: row.autoRating, type: "Number" }), // E
      formatColumn({ value: row.supervisorRating, type: "Number" }), // S
      formatColumn({ value: row.finalRating, type: "Number" }), // F
      formatColumn({ value: row.autoRating2, type: "Number" }), // E
      formatColumn({ value: row.supervisorRating2, type: "Number" }), // S
      formatColumn({ value: row.finalRating2, type: "Number" }), // F
    ];
  });

  const data = [EMPLOYEE_HEADER_ROW, ...dataRows];

  await writeXlsxFile(data, {
    columns: SCORECARD_COLUMNS, // (optional) column widths, etc.
    fileName: `${title}.xlsx`,
    sheet: "Data",
    fontFamily: "Candara",
    fontSize: 12,
  });
};