// import Store from "./Store";
// import AppStore from "./AppStore";
import { runInAction, toJS } from "mobx";
// import { sortAlphabetically } from "../../logged-in/shared/utils/utils";
// import MeasureDivision, { IMeasureDivision } from "../models/MeasureDivision";

// export default class DivisionMeasureStore extends Store<
//   IMeasureDivision,
//   MeasureDivision
// > {
//   items = new Map<string, MeasureDivision>();

//   constructor(store: AppStore) {
//     super(store);

//     this.store = store;
//   }

//   load(items: IMeasureDivision[] = []) {
//     runInAction(() => {
//       items.forEach((item) => {
//         if (item.dataType === "Date") item.annualActual = Date.now(); // for date measures set actual to today
//         this.items.set(item.id, new MeasureDivision(this.store, item));
//       });
//     });
//   }

//   // get all measures by uid
//   getByDivision(division: string) {
//     const all = Array.from(this.items.values());
//     return all
//       .filter((item) => item.asJson.division === division)
//       .sort((a, b) =>
//         sortAlphabetically(a.asJson.description, b.asJson.description)
//       );
//   }

//   // get all my measures
//   get allMeDivision() {
//     const me = this.store.auth.meJson;
//     if (!me) return [];

//     return this.getByDivision(me.division);
//   }

//   get all() {
//     return Array.from(toJS(this.items.values())).sort((a, b) =>
//       sortAlphabetically(a.asJson.description, b.asJson.description)
//     );
//   }
// }
