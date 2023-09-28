import {
  query,
  collection,
  onSnapshot,
  setDoc,
  deleteDoc,
  doc,
  Unsubscribe,
} from "@firebase/firestore";
import { addDoc, updateDoc } from "firebase/firestore";
import { db } from "../config/firebase-config";
import AppStore from "../stores/AppStore";
import AppApi from "./AppApi";
import { IFeedback } from '../models/Feedback.model';


export default class FeedbackApi {
  constructor(private api: AppApi, private store: AppStore) { }

  private getPath() {
    return "feedbacks";
  }

  async getAll() {
    // get the db path
    const path = this.getPath();
    if (!path) return;

    // remove all items from store
    this.store.feedback.removeAll();

    // create the query
    const $query = query(collection(db, path)); // query
    // new promise
    return await new Promise<Unsubscribe>((resolve, reject) => {
      // on snapshot
      const unsubscribe = onSnapshot($query, (querySnapshot) => {
        const items: IFeedback[] = [];
        querySnapshot.forEach((doc) => {
          items.push({ id: doc.id, ...doc.data() } as IFeedback);
        });
        this.store.feedback.load(items);
        resolve(unsubscribe);
      }, (error) => {
        reject(error);
      }
      );
    });
  }

  async getById(id: string) {
    const path = this.getPath();
    if (!path) return;

    const unsubscribe = onSnapshot(doc(db, path, id), (doc) => {
      if (!doc.exists) return;
      const item = { id: doc.id, ...doc.data() } as IFeedback;

      this.store.feedback.load([item]);
    });

    return unsubscribe;
  }

  // create feedback
  async create(item: IFeedback) {
    const path = this.getPath();
    if (!path) return;

    try {
      await addDoc(collection(db, path), item);
      // create in store
      this.store.feedback.load([item]);
    } catch (error) { }
  }

  // update item
  async update(item: IFeedback) {
    const path = this.getPath();
    if (!path) return;

    // update in db
    try {
      await updateDoc(doc(db, path, item.id ?? ""), { ...item, });
      // update in store
      this.store.feedback.load([item]);
    } catch (error) { }
  }

  // delete feedback
  async delete(item: IFeedback) {
    const path = this.getPath();
    if (!path) return;

    // remove from db
    try {
      await deleteDoc(doc(db, path, item.id ?? ""));
      // remove from store
      this.store.feedback.remove(item.id ?? ""); // Remove from memory
    } catch (error) {
      // console.log(error);
    }
  }
}
