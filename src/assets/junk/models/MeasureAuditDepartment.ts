import { runInAction } from "mobx";
// import Model from "../../../shared/models/Model";

// export const defaultMeasureAuditDepartment: IMeasureAuditDepartment = {
//   id: "",
//   uid: "",
//   userName: "",
//   objective: "",
//   department: "",
//   perspective: "",
//   measure: "",
//   comments: "",
//   baseline: 0,
//   quarter1Target: 0,
//   quarter2Target: 0,
//   quarter3Target: 0,
//   quarter4Target: 0,
//   rating1: 0,
//   rating2: 0,
//   rating3: 0,
//   rating4: 0,
//   rating5: 0,
//   targetDate: "",
//   annualTarget: 0,
//   annualActual: 0,
//   rating: 0,
//   weight: 0,
//   month: 0,
//   year: 0,
//   timestamp: 0,
//   symbolPos: "prefix",
// };

// export interface IMeasureAuditDepartment {
//   id: string;
//   uid: string;
//   userName: string;
//   objective: string;
//   department: string;
//   perspective: string; // Finacial, Customer, Operational, Learning & Growth,
//   measure: string;
//   comments: string;
//   quarter1Target: number | null;
//   quarter2Target: number | null;
//   quarter3Target: number | null;
//   quarter4Target: number | null;
//   baseline: number | null;
//   rating1: number | null; // required field
//   rating2: number | null; // required field
//   rating3: number | null; // required field
//   rating4: number | null;
//   rating5: number | null;
//   annualTarget: number | null;
//   annualActual: number | null;
//   targetDate: number | string;
//   rating: number;
//   weight: number; // percentage
//   month: number;
//   year: number;
//   symbolPos: "prefix" | "suffix"; // prefix / suffix
//   timestamp: number;
// }

// export default class MeasureAuditDepartment extends Model<IMeasureAuditDepartment> {
//   update(): void { }

//   edit(): void { }

//   async remove() {
//     if (!window.confirm("Continue to delete?")) return;
//   }
// }
