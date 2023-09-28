import Store from "./Store";
import AppStore from "./AppStore";
import { runInAction } from "mobx";
import Division, { IDivision } from "../models/Division";

export default class DivisionStore extends Store<IDivision, Division> {
  items = new Map<string, Division>();

  constructor(store: AppStore) {
    super(store);
    this.store = store;
  }

  load(items: IDivision[] = []) {
    runInAction(() => {
      items.forEach((item) =>
        this.items.set(item.id, new Division(this.store, item))
      );
    });
  }
}
