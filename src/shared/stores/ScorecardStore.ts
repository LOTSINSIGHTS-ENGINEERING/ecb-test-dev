import Store from "./Store";
import AppStore from "./AppStore";
import { makeObservable, runInAction } from "mobx";
import ScorecardBatch, { IScorecardBatch } from "../models/ScorecardBatch";

export default class ScorecardStore extends Store<
  IScorecardBatch,
  ScorecardBatch
> {
  current: IScorecardBatch | null = null; //test dublicate
  active: IScorecardBatch | null = null;
  loading: boolean = true; // Might rmeove it.
  items = new Map<string, ScorecardBatch>();

  constructor(store: AppStore) {
    super(store);
    this.store = store;
    makeObservable(this, {
      current: true, //tesst duplicate
      active: true,
      loading: true, // might remove it
    });
  }

  // get currrent scorecard id
  get currentId() {
    return this.current ? this.current.id : null;
  }
  // set currrent scorecard id
  setCurrent(item: IScorecardBatch) {
    runInAction(() => {
      this.current = item;
    });
  }
  clearCurrent() {
    runInAction(() => {
      this.current = null;
    });
  }



  // get active scorecard id
  get activeId() {
    return this.active ? this.active.id : null;
  }

  setActive(item: IScorecardBatch) {
    runInAction(() => {
      this.active = item;
    });
  }

  clearActive() {
    runInAction(() => {
      this.active = null;
    });
  }

  setLoading(loading: boolean) {
    runInAction(() => {
      this.loading = loading;
    });
  }

  load(items: IScorecardBatch[] = []) {
    runInAction(() => {
      items.forEach((item) =>
        this.items.set(item.id, new ScorecardBatch(this.store, item))
      );
    });
  }
}
