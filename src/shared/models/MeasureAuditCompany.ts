import Model from "./Model";

export const defaultMeasureAuditCompany: IMeasureAuditCompany = {
  id: "",
  uid: "",
  userName: "",
  objective: "",
  department: "",
  perspective: "",
  measure: "",
  comments: "",
  baseline: 0,
  quarter1Target: 0,
  quarter2Target: 0,
  quarter3Target: 0,
  quarter4Target: 0,
  rating1: 0,
  rating2: 0,
  rating3: 0,
  rating4: 0,
  rating5: 0,
  targetDate: "",
  annualTarget: 0,
  annualActual: 0,
  midtermActual: 0,

  rating: 0,
  q2supervisorRating: null,
  q2FinalRating: null,

  q4rating: 0,
  q4supervisorRating: null,
  q4FinalRating: null,

  weight: 0,
  month: 0,
  year: 0,
  timestamp: 0,
  symbolPos: "prefix",
};

export interface IMeasureAuditCompany {
  id: string;
  uid: string;
  userName: string;
  objective: string;
  department: string;
  perspective: string; // Finacial, Customer, Operational, Learning & Growth,
  measure: string;
  comments: string;
  quarter1Target: number | null;
  quarter2Target: number | null;
  quarter3Target: number | null;
  quarter4Target: number | null;
  baseline: number | null;
  rating1: number | null; // required field
  rating2: number | null; // required field
  rating3: number | null; // required field
  rating4: number | null;
  rating5: number | null;
  annualTarget: number | null;
  annualActual: number | null;
  midtermActual?: number | null;
  targetDate: number | string;

  rating: number;
  q2supervisorRating: number | null; //
  q2FinalRating: number | null; //

  q4rating: number; //q2 auto rating
  q4supervisorRating: number | null; //
  q4FinalRating: number | null; //
  weight: number; // percentage
  month: number;
  year: number;
  timestamp: number;
  symbolPos: "prefix" | "suffix"; // prefix / suffix
}

export default class MeasureAuditCompany extends Model<IMeasureAuditCompany> {
  update(): void {}

  edit(): void {}

  async remove() {
    if (!window.confirm("Continue to delete?")) return;
  }
}
