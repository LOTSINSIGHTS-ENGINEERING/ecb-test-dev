import Model from "./Model";

export const defaultMeasure: IMeasure = {
  id: "",
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
  baseline: null,
  rating1: null,
  rating2: null,
  rating3: null,
  rating4: null,
  rating5: null,

  quarter1Actual: 0,
  quarter2Actual: 0,
  quarter3Actual: 0,
  quarter4Actual: 0,

  annualTarget: 0,
  annualActual: null,

  weight: 0,
  dataType: "Currency",
  dataSymbol: "NAD",
  symbolPos: "prefix",
  sourceOfEvidence: "",
  targetDate: "",

  autoRating: 0,
  supervisorRating: null,
  finalRating: null,

  autoRating2: 0,
  supervisorRating2: null,
  finalRating2: null,

};

export interface IMeasure {
  id: string;
  uid: string;
  userName: string;
  objective: string;
  department: string;
  perspective: string; // Finacial, Customer, Operational, Learning & Growth,
  description: string;
  comments: string;
  midtermComments: string;
  assessmentComments: string;
  activities: string;
  baseline: number | null;
  rating1: number | null; // required field
  rating2: number | null; // required field
  rating3: number | null; // required field
  rating4: number | null;
  rating5: number | null;

  quarter1Actual: number | null;
  quarter2Actual: number | null;
  quarter3Actual: number | null;
  quarter4Actual: number | null;

  annualTarget: number | null;
  annualActual: number | null;
  midtermActual?: number | null;

  targetDate: number | string;

  autoRating: number; //employee midterm rating
  supervisorRating: number | null; //supervisor midterm rating
  finalRating: number | null;//midterm final rating

  autoRating2: number; //employee assesssment rating
  supervisorRating2: number | null;//supervisor assesssment rating
  finalRating2: number | null;//final assesssment rating

  weight: number | null; // percentage
  dataType: string; // Number | Text | Date | Percentage | Currency | YesNo | Rating
  dataSymbol: string; // %, $, €, £
  symbolPos: "prefix" | "suffix"; // prefix / suffix
  sourceOfEvidence: string;
  isUpdated?: boolean;
  objectiveType?: "self-development" | "performance";
}

export default class Measure extends Model<IMeasure> {
  update(): void { }
  edit(): void { }

  async remove() {
    if (!window.confirm("Continue to delete?")) return;
  }
}
