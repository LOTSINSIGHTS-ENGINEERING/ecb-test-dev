import { IMeasure } from "./Measure";
import Model from "./Model";

export const defaultMeasureAudit: IMeasureAudit = {
  month: 0,
  year: 0,
  timestamp: 0,
  id: "",
  measure: "",
  uid: "",
  userName: "",
  objective: "",
  department: "",
  perspective: "",
  description: "",
  comments: "",
  midtermComments: "",
  assessmentComments: "",
  activities: "",
  baseline: 0,
  rating1: 0,
  rating2: 0,
  rating3: 0,
  rating4: 0,
  rating5: 0,

  quarter1Actual: 0,
  quarter2Actual: 0,
  quarter3Actual: 0,
  quarter4Actual: 0,

  annualTarget: 0,
  annualActual: 0,
  targetDate: "",

  autoRating: 0,
  autoRating2: 0,

  supervisorRating: null,
  supervisorRating2: 0,

  finalRating: null,
  finalRating2: 0,

  weight: 0,
  dataType: "",
  dataSymbol: "",
  sourceOfEvidence: "",
  symbolPos: "prefix",

};

export interface IMeasureAudit extends IMeasure {
  measure: string;
  month: number;
  year: number;
  timestamp: number;
}

export default class MeasureAudit extends Model<IMeasureAudit> {
  update(): void { }

  edit(): void { }

  async remove() {
    if (!window.confirm("Continue to delete?")) return;
  }
}
