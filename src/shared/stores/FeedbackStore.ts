import Store from "./Store";
import AppStore from "./AppStore";
import { runInAction } from "mobx";
import Feedback, { IFeedback } from "../models/Feedback.model";


export default class FeedbackStore extends Store<IFeedback, Feedback> {
  items = new Map<string, Feedback>();

  constructor(store: AppStore) {
    super(store);
    this.store = store;
  }

  load(items: IFeedback[] = []) {
    runInAction(() => {
      items.forEach((item) =>
        this.items.set(item.id ?? "", new Feedback(this.store, item))
      );
    });
  }
}