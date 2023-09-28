// import Store from "./Store";
// import AppStore from "./AppStore";
import { runInAction } from "mobx";
// import MeasureAuditDivision, {
//   IMeasureAuditDivision,
// } from "../models/MeasureAuditDivision";

// export default class DivisionMeasureAuditStore extends Store<
//   IMeasureAuditDivision,
//   MeasureAuditDivision
// > {
//   items = new Map<string, MeasureAuditDivision>();

//   constructor(store: AppStore) {
//     super(store);

//     this.store = store;
//   }

//   load(items: IMeasureAuditDivision[] = []) {
//     runInAction(() => {
//       items.forEach((item) =>
//         this.items.set(item.id, new MeasureAuditDivision(this.store, item))
//       );
//     });
//   }
// }
