import Model from "./Model";

export const defaultMeasureCompany: IMeasureCompany = {
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

  sourceOfEvidence: "",
  statusUpdate: "",
  activities: "",

  baseline: 0,

  quarter1Target: 0,
  quarter2Target: 0,
  quarter3Target: 0,
  quarter4Target: 0,

  quarter1Actual: 0,
  quarter2Actual: 0,
  quarter3Actual: 0,
  quarter4Actual: 0,

  rating1: 0,
  rating2: 0,
  rating3: 0,
  rating4: 0,
  rating5: 0,

  annualTarget: 0,
  annualActual: 0,

  targetDate: "",

  rating: 1,
  q2supervisorRating: null,
  q2FinalRating: null,

  q4rating: 1,
  q4supervisorRating: null,
  q4FinalRating: null,

  weight: 0,
  dataType: "Currency",
  dataSymbol: "NAD",
  symbolPos: "prefix",

};

export interface IMeasureCompany {
  id: string;
  uid: string;
  userName: string;
  objective: string;
  department: string;
  perspective: string; // Finacial, Customer, Operational, Learning & Growth,
  description: string;

  comments: string;
  midtermComments: string,
  assessmentComments: string,

  sourceOfEvidence: string;
  statusUpdate: string;
  activities: string;

  baseline: number | null;

  quarter1Target: number | null;
  quarter2Target: number | null;
  quarter3Target: number | null;
  quarter4Target: number | null;

  quarter1Actual: number | null;
  quarter2Actual: number | null;
  quarter3Actual: number | null;
  quarter4Actual: number | null;

  rating1: number | null; // required field
  rating2: number | null; // required field
  rating3: number | null; // required field
  rating4: number | null;
  rating5: number | null;

  annualTarget: number | null;
  annualActual: number | null;
  targetDate: number | string;

  rating: number; //q1 auto rating
  q2supervisorRating: number | null; //
  q2FinalRating: number | null; //

  q4rating: number; //q2 auto rating
  q4supervisorRating: number | null; //
  q4FinalRating: number | null; //

  weight: number; // percentage
  dataType: string; // Number | Text | Date | Percentage | Currency | YesNo | Rating
  dataSymbol: string; // %, $, €, £
  symbolPos: "prefix" | "suffix"; // prefix / suffix
  isUpdated?: boolean;
}

export default class MeasureCompany extends Model<IMeasureCompany> {
  update(): void { }

  edit(): void { }

  async remove() {
    if (!window.confirm("Continue to delete?")) return;
  }
}
