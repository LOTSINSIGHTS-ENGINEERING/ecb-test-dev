import Store from "./Store";
import { makeObservable, runInAction } from "mobx";
import AppStore from "./AppStore";
import User, { IUser } from "../models/User";

export default class UserStore extends Store<IUser, User> {
  items = new Map<string, User>();
  loading: boolean = true;

  constructor(store: AppStore) {
    super(store);
    makeObservable(this, {
      loading: true,
    });
    this.store = store;
  }

  load(items: IUser[]) {
    runInAction(() => {
      items.forEach((item) =>
        this.items.set(item.uid, new User(this.store, item))
      );
    });
  }

  // get our departmental users
  getOurDepartment(departmentId: string) {
    const all = Array.from(this.items.values());
    return all.filter((item) => item.asJson.department === departmentId && !item.asJson.devUser);
  }

  // get all my measures
  get departmentalUsers() {
    const me = this.store.auth.meJson;
    if (!me) return [];
    return this.getOurDepartment(me.department);
  }
}
