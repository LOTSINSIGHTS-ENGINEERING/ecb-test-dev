import Store from "./Store";
import AppStore from "./AppStore";
import { runInAction, toJS } from "mobx";
import Measure, { IMeasure } from "../models/Measure";
import { sortAlphabetically } from "../../logged-in/shared/utils/utils";

export default class MeasureStore extends Store<IMeasure, Measure> {
  items = new Map<string, Measure>();

  constructor(store: AppStore) {
    super(store);
    this.store = store;
  }

  load(items: IMeasure[] = []) {
    runInAction(() => {
      items.forEach((item) => {
        // if (item.dataType === "Date") item.annualActual = Date.now(); // for date measures set actual to today
        this.items.set(item.id, new Measure(this.store, item));
      });
    });
  }

  // get all measures by uid
  getByUid(uid: string) {
    const all = Array.from(this.items.values());
    return all.filter((item) => item.asJson.uid === uid).sort((a, b) =>
      sortAlphabetically(a.asJson.description, b.asJson.description)
    );
  }

  // get all measures by uid
  getByUidAndObjectiveType(
    uid: string,
    objectiveType?: "performance" | "self-development"
  ) {
    const all = Array.from(this.items.values());
    const measures = all
      .filter((item) => item.asJson.uid === uid)
      .sort((a, b) =>
        sortAlphabetically(a.asJson.description, b.asJson.description)
      );

    if (objectiveType)
      return measures.filter((m) => m.asJson.objectiveType === objectiveType);

    return measures;
  }

  // get all measures by date
  getByDate(date: string, objectiveType?: "performance" | "self-development") {
    const all = Array.from(this.items.values());
    const measures = all
      .filter((item) => item.asJson.targetDate === date)
      .sort((a, b) =>
        sortAlphabetically(a.asJson.description, b.asJson.description)
      );

    if (objectiveType)
      return measures.filter((m) => m.asJson.objectiveType === objectiveType);

    return measures;
  }

  // // get all measures by id
  // getByDepartment(department: string) {
  //   const all = Array.from(this.items.values());
  //   return all.filter((item) => item.asJson.department === department).sort((a, b) => sortAlphabetically(a.asJson.description, b.asJson.description));
  // }

  // // get all my measures
  // get allMeDepartment() {
  //   const me = this.store.auth.meJson;
  //   if (!me) return [];
  //   return this.getByDepartment(me.department);
  // }




  // get all my measures
  get allMe() {
    const me = this.store.auth.meJson;
    if (!me) return [];
    return this.getByUid(me.uid); //me.uid
  }

  get all() {
    return Array.from(toJS(this.items.values())).sort((a, b) =>
      sortAlphabetically(a.asJson.description, b.asJson.description)
    );
  }
}
