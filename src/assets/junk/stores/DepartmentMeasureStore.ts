// import Store from "./Store";
// import AppStore from "./AppStore";
import { runInAction, toJS } from "mobx";
// import MeasureDepartment, {
//   IMeasureDepartment,
// } from "../models/MeasureDepartment";
// import { sortAlphabetically } from "../../logged-in/shared/utils/utils";

// export default class DepartmentMeasureStore extends Store<
//   IMeasureDepartment,
//   MeasureDepartment
// > {
//   items = new Map<string, MeasureDepartment>();

//   constructor(store: AppStore) {
//     super(store);

//     this.store = store;
//   }

//   load(items: IMeasureDepartment[] = []) {
//     runInAction(() => {
//       items.forEach((item) => {
//         if (item.dataType === "Date") item.annualActual = Date.now(); // for date measures set actual to today
//         this.items.set(item.id, new MeasureDepartment(this.store, item));
//       });
//     });
//   }

//   // get all measures by uid
//   getByDepartment(department: string) {
//     const all = Array.from(this.items.values());
//     return all
//       .filter((item) => item.asJson.department === department)
//       .sort((a, b) =>
//         sortAlphabetically(a.asJson.description, b.asJson.description)
//       );
//   }

//   // get all my measures
//   get allMeDepartment() {
//     const me = this.store.auth.meJson;
//     if (!me) return [];

//     return this.getByDepartment(me.department);
//   }

//   get all() {
//     return Array.from(toJS(this.items.values())).sort((a, b) =>
//       sortAlphabetically(a.asJson.description, b.asJson.description)
//     );
//   }
// }
