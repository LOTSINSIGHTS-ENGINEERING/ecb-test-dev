import Store from "./Store";
import AppStore from "./AppStore";
import { runInAction } from "mobx";
import ScorecardArchive, { IScorecardArchive } from "../models/ScorecardArchive";

export default class ScorecardArchiveStore extends Store<IScorecardArchive, ScorecardArchive> {
  items = new Map<string, ScorecardArchive>();

  constructor(store: AppStore) {
    super(store);
    this.store = store;
  }

  load(items: IScorecardArchive[] = []) {
    runInAction(() => {
      items.forEach((item) =>
        this.items.set(item.uid, new ScorecardArchive(this.store, item))
      );
    });
  }

  getById(id: string) {
    return this.items.get(id);
  }
}