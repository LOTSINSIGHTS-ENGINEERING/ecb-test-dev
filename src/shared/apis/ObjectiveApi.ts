import {
  query,
  collection,
  onSnapshot,
  setDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "@firebase/firestore";
import { Unsubscribe, where } from "firebase/firestore";
import { db } from "../config/firebase-config";
import { IObjective } from "../models/Objective";
import AppStore from "../stores/AppStore";
import AppApi, { apiPathScorecardLevel } from "./AppApi";

export default class ObjectiveApi {
  // path: string | null = null;

  constructor(private api: AppApi, private store: AppStore) {}

  private getPath() {
    if (!this.store.scorecard.activeId) return null;
    return apiPathScorecardLevel(this.store.scorecard.activeId, "objectives");
  }

  private currentPath() {
    if (!this.store.scorecard.currentId) return;
    return apiPathScorecardLevel(this.store.scorecard.currentId, "objectives");
  }

  async getAllObjectives() {
    // get the db path
    const path = this.getPath();
    if (!path) return;
    // remove all items from store
    this.store.objective.removeAll();

    // create the query
    const $query = query(collection(db, path));
    // new promise
    return await new Promise<Unsubscribe>((resolve, reject) => {
      const unsubscribe = onSnapshot(
        $query,
        (querySnapshot) => {
          const items: IObjective[] = [];
          querySnapshot.forEach((doc) => {
            items.push({ id: doc.id, ...doc.data() } as IObjective);
          });
          this.store.objective.load(items);
          resolve(unsubscribe);
        },
        (error) => {
          reject();
        }
      );
    });
  }
  async getAll(uid?: string) {
    // get the db path
    const path = this.getPath();
    if (!path) return;

    this.store.objective.removeAll();

    // create the query
    const $query = uid
      ? query(collection(db, path), where("uid", "==", uid))
      : query(collection(db, path));
    // new promise
    return await new Promise<Unsubscribe>((resolve, reject) => {
      // on snapshot
      const unsubscribe = onSnapshot(
        $query,
        // onNext
        (querySnapshot) => {
          const items: IObjective[] = [];
          querySnapshot.forEach((doc) => {
            items.push({ id: doc.id, ...doc.data() } as IObjective);
          });
          this.store.objective.load(items);
          resolve(unsubscribe);
        },
        // onError
        (error) => {
          reject();
        }
      );
    });
  }
  async getAllScore(sid: string, uid?: string) {
    // get the db path

    apiPathScorecardLevel(sid, "objectives");
    const path = this.getPath();
    if (!path) return;

    this.store.objective.removeAll();

    // create the query
    const $query = uid
      ? query(collection(db, path), where("uid", "==", uid))
      : query(collection(db, path));
    // new promise
    return await new Promise<Unsubscribe>((resolve, reject) => {
      // on snapshot
      const unsubscribe = onSnapshot(
        $query,
        // onNext
        (querySnapshot) => {
          const items: IObjective[] = [];
          querySnapshot.forEach((doc) => {
            items.push({ id: doc.id, ...doc.data() } as IObjective);
          });
          this.store.objective.load(items);
          resolve(unsubscribe);
        },
        // onError
        (error) => {
          reject();
        }
      );
    });
  }

  async getById(id: string) {
    const path = this.getPath();
    if (!path) return;

    const unsubscribe = onSnapshot(doc(db, path, id), (doc) => {
      if (!doc.exists) return;
      const item = { id: doc.id, ...doc.data() } as IObjective;

      this.store.objective.load([item]);
    });
    return unsubscribe;
  }

  // create objective
  async create(item: IObjective) {
    const path = this.getPath();
    if (!path) return;

    const itemRef = doc(collection(db, path));
    item.id = itemRef.id;
    // create in db
    try {
      await setDoc(itemRef, item, { merge: true });
      this.store.objective.load([item]);
    } catch (error) {}
  }

  // duplicate objective
  async duplicate(item: IObjective) {
    const path = this.currentPath();
    if (!path) return;

    const itemRef = doc(collection(db, path), item.id);
    // console.log(itemRef.id);
    // console.log(item);

    // create in db
    try {
      await setDoc(itemRef, item, { merge: true });
      this.store.objective.load([item]);
      alert("success");
      console.log("error: ", item);
    } catch (error) {
      console.log("error: ", error);
    }
  }

  // update item
  async update(item: IObjective) {
    const path = this.getPath();
    if (!path) return;

    // update in db
    try {
      await updateDoc(doc(db, path, item.id), {
        ...item,
      });
      // update in store
      this.store.objective.load([item]);
    } catch (error) {
      console.log("error api", error);
    }
  }

  // delete objective
  async delete(item: IObjective) {
    const path = this.getPath();
    if (!path) return;

    try {
      await deleteDoc(doc(db, path, item.id));
      // remove from store
      this.store.objective.remove(item.id);
    } catch (error) {}
  }
}
