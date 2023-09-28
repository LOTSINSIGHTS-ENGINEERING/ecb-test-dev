// import Store from "./Store";
// import AppStore from "./AppStore";
import { runInAction, toJS } from "mobx";
// import Objective, { IObjective } from "../models/Objective";
// import { sortAlphabetically } from "../../logged-in/shared/utils/utils";

// export default class DepartmentObjectiveStore extends Store<
//   IObjective,
//   Objective
// > {
//   items = new Map<string, Objective>();

//   constructor(store: AppStore) {
//     super(store);

//     this.store = store;
//   }

//   load(items: IObjective[] = []) {
//     runInAction(() => {
//       items.forEach((item) =>
//         this.items.set(item.id, new Objective(this.store, item))
//       );
//     });
//   }

//   // get all objectives by department
//   getByDepartment(department: string) {
//     const all = Array.from(this.items.values());
//     return all
//       .filter((item) => item.asJson.department === department)
//       .sort((a, b) =>
//         sortAlphabetically(a.asJson.description, b.asJson.description)
//       );
//   }

//   // get all my objectives
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
