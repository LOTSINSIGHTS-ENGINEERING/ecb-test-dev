import Store from "./Store";
import AppStore from "./AppStore";
import { makeObservable, runInAction, toJS } from "mobx";
import Objective, { IObjective } from "../models/Objective";
import { ALL_TAB, ITAB_ID } from "../interfaces/IPerspectiveTabs";
import { sortAlphabetically } from "../../logged-in/shared/utils/utils";

export default class ObjectiveStore extends Store<IObjective, Objective> {
  perspectiveTab: ITAB_ID = ALL_TAB.id;
  items = new Map<string, Objective>();
  selectedPeriod: string = "";

  constructor(store: AppStore) {
    super(store);
    this.store = store;
    makeObservable(this, {
      perspectiveTab: true,
      selectedPeriod: true
    });
  }

  load(items: IObjective[] = []) {
    runInAction(() => {
      items.forEach((item) =>
        this.items.set(item.id, new Objective(this.store, item))
      );
    });
  }

  selectPeriod(value: string) {
    runInAction(() => {
      this.selectedPeriod = value;
    })
  }

  // get all objectives by uid
  getByUid(uid: string) {
    return this.all.filter((item) => item.asJson.uid === uid).sort((a, b) =>
      sortAlphabetically(a.asJson.description, b.asJson.description)
    );
  }

  // get all objectives by id for loading scorecards only
  // getById(id: string) {
  //   const all = Array.from(this.items.values());
  //   return all
  //     .filter((item) => item.asJson.id === id)
  //     .sort((a, b) =>
  //       sortAlphabetically(a.asJson.description, b.asJson.description)
  //     );
  // }

  getItemById(id: string) {
    return this.items.get(id);
  }

  // get all my objectives
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

  setPerspective(tab: ITAB_ID) {
    this.perspectiveTab = tab;
  }

  get perspective() {
    return this.perspectiveTab;
  }
}
