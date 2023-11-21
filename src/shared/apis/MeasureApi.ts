import {
  query,
  collection,
  onSnapshot,
  setDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "@firebase/firestore";
import { Unsubscribe, getDocs, where } from "firebase/firestore";
import { db } from "../config/firebase-config";
import { IMeasure } from "../models/Measure";
import AppStore from "../stores/AppStore";
import AppApi, { apiPathScorecardLevel } from "./AppApi";

export default class MeasureApi {
  constructor(private api: AppApi, private store: AppStore) { }

  private getPath() {
    if (!this.store.scorecard.activeId) return null;
    return apiPathScorecardLevel(this.store.scorecard.activeId, "measures");
  }

  private currentPath() {
    if (!this.store.scorecard.currentId) return;
    return apiPathScorecardLevel(this.store.scorecard.currentId, "measures");
  }

  async getAllByObjectiveId(objectiveId: string) {
    // get the db path
    const path = this.getPath();
    if (!path) return;

    this.store.measure.removeAll();
    const $query = query(collection(db, path), where("objective", "==", objectiveId));

    // new promise
    return await new Promise<Unsubscribe>((resolve, reject) => {
      // on snapshot
      const unsubscribe = onSnapshot($query, (querySnapshot) => {
        const items: IMeasure[] = [];
        querySnapshot.forEach((doc) => {
          items.push({ id: doc.id, ...doc.data() } as IMeasure);
        });

        this.store.measure.load(items);
        resolve(unsubscribe);
      },
        // onError
        (error) => {
          reject(error);
        }
      );
    });
  }

  async getAll(uid?: string) {
    // get the db path
    const path = this.getPath();
    if (!path) return;

    // create the query
    const $query = uid ? query(collection(db, path), where("uid", "==", uid)) : query(collection(db, path));

    // new promise
    return await new Promise<Unsubscribe>((resolve, reject) => {
      // on snapshot
      const unsubscribe = onSnapshot($query, (querySnapshot) => {
        const items: IMeasure[] = [];
        querySnapshot.forEach((doc) => {
          items.push({ id: doc.id, ...doc.data() } as IMeasure);
        });
        this.store.measure.load(items);
        resolve(unsubscribe);
      },
        // onError
        (error) => {
          reject(error);
        }
      );
    });
  }

  async getAllByTargetDate(date: string, objectiveType?: "performance" | "self-development") {
    // get the db path
    const path = this.getPath();
    if (!path) return;

    // create the query
    const $query = !objectiveType ? query(collection(db, path), where("targetDate", "==", date)) : query(
      collection(db, path), where("targetDate", "==", date), where("objectiveType", "==", objectiveType));

    // new promise
    return await new Promise<Unsubscribe>((resolve, reject) => {
      // on snapshot
      const unsubscribe = onSnapshot(
        $query, (querySnapshot) => {
          const items: IMeasure[] = [];
          querySnapshot.forEach((doc) => {
            items.push({ id: doc.id, ...doc.data() } as IMeasure);
          });
          this.store.measure.load(items);
          resolve(unsubscribe);
        },
        // onError
        (error) => {
          reject(error);
        }
      );
    });
  }

  async getAllByObjectiveType(uid: string, objectiveType: "performance" | "self-development") {
    // get the db path
    const path = this.getPath();
    if (!path) return;

    const $query = query(collection(db, path), where("uid", "==", uid), where("objectiveType", "==", objectiveType));
    // new promise
    return await new Promise<Unsubscribe>((resolve, reject) => {
      // on snapshot
      const unsubscribe = onSnapshot($query, (querySnapshot) => {
        const items: IMeasure[] = [];
        querySnapshot.forEach((doc) => {
          items.push({ id: doc.id, ...doc.data() } as IMeasure);
        });

        this.store.measure.load(items);
        resolve(unsubscribe);
      },
        // onError
        (error) => {
          reject(error);
        }
      );
    });
  }

  async getById(id: string) {
    const path = this.getPath();
    if (!path) return;
    const unsubscribe = onSnapshot(doc(collection(db, path), id), (doc) => {
      if (!doc.exists) return;
      const item = { id: doc.id, ...doc.data() } as IMeasure;
      this.store.measure.load([item]);
    });

    return unsubscribe;
  }

  // create measure
  async create(item: IMeasure) {
    const path = this.getPath();
    if (!path) return;

    const itemRef = doc(collection(db, path));
    item.id = itemRef.id;

    // create in db
    try {
      await setDoc(itemRef, item, {
        merge: true,
      });
      // create in store
      this.store.measure.load([item]);
      this.api.measureAudit.update(item);
    } catch (error) {
      // console.log(error);
    }
  }

  // duplicate measure test duplicate
  async duplicate(item: IMeasure) {
    const path = this.currentPath();
    if (!path) return;
    const itemRef = doc(collection(db, path), item.id);
    try {
      await setDoc(itemRef, item, {
        merge: true,
      });
      this.store.measure.load([item]);
    } catch (error) {
      // console.log(error);
    }
  }


  // update item
  async update(item: IMeasure, fieldsUpdated?: (keyof IMeasure)[]) {
    const path = this.getPath();
    if (!path) return;

    let measure: { [k: string]: any } = {};

    // fields updated
    if (fieldsUpdated) {
      for (const index of fieldsUpdated) measure[index] = item[index];
    } else {
      measure = { ...item };
    }

    // update in db
    try {
      await updateDoc(doc(collection(db, path), item.id), {
        ...measure,
      });

      // store item
      if (!fieldsUpdated) {
        this.updateMeasureStore(item); // update measure store & audit store
      } else {
        const currItem = this.store.measure.getItemById(item.id);
        const newItem = currItem ? { ...currItem.asJson, ...measure } : item;
        this.updateMeasureStore(newItem); // update measure store & audit store
      }
    } catch (error) { }
  }

  private updateMeasureStore(item: IMeasure) {
    this.store.measure.load([item]); // update in store
    this.api.measureAudit.update(item); // update the measure audit
  }

  // delete measure
  async delete(item: IMeasure) {
    const path = this.getPath();
    if (!path) return;

    // remove from db
    try {
      await deleteDoc(doc(collection(db, path), item.id));
      // remove from store
      this.store.measure.remove(item.id); // Remove from memory
      // delete measure audit
      this.api.measureAudit.deleteAll(item);
    } catch (error) { }
  }
}
