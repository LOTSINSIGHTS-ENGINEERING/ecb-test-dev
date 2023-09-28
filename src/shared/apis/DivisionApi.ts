import {
  query,
  collection,
  onSnapshot,
  setDoc,
  updateDoc,
  deleteDoc,
  doc,
  Unsubscribe,
} from "@firebase/firestore";
import { db } from "../config/firebase-config";
import { IDivision } from "../models/Division";
import { IFolder } from "../models/Folder";
import AppStore from "../stores/AppStore";
import AppApi, { apiPathCompanyLevel } from "./AppApi";

export default class DivisionApi {
  constructor(private api: AppApi, private store: AppStore) { }

  private getPath() {
    return apiPathCompanyLevel("divisions");
  }

  async getAll() {
    // get the db path
    const path = this.getPath();
    if (!path) return;

    // remove all items from store
    this.store.division.removeAll();

    // create the query
    const $query = query(collection(db, path)); // query

    // new promise
    return await new Promise<Unsubscribe>((resolve, reject) => {
      // on snapshot
      const unsubscribe = onSnapshot($query, (querySnapshot) => {
        const items: IDivision[] = [];
        querySnapshot.forEach((doc) => {
          items.push({ id: doc.id, ...doc.data() } as IDivision);
        });

        this.store.division.load(items);
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

    const unsubscribe = onSnapshot(doc(db, path, id), (doc) => {
      if (!doc.exists) return;
      const item = { id: doc.id, ...doc.data() } as IDivision;

      this.store.division.load([item]);
    });

    return unsubscribe;
  }

  // create division
  async create(item: IDivision) {
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
      this.store.division.load([item]);
      // this.createOrUpdateDivisionFolder(item); // create folder
    } catch (error) {
      // console.log(error);
    }
  }

  // update item
  async update(item: IDivision) {
    const path = this.getPath();
    if (!path) return;

    // update in db
    try {
      await updateDoc(doc(db, path, item.id), {
        ...item,
      });
      // update in store
      this.store.division.load([item]);
      // this.createOrUpdateDivisionFolder(item); // create folder
    } catch (error) {
      // console.log(error);
    }
  }

  // delete division
  async delete(item: IDivision) {
    const path = this.getPath();
    if (!path) return;

    // remove from db
    try {
      await deleteDoc(doc(db, path, item.id));
      // remove from store
      this.store.division.remove(item.id); // Remove from memory
      // await this.api.folder.delete(item.id); // delete root folder
    } catch (error) {
      // console.log(error);
    }
  }

  // create/update division root folder in drive
  private async createOrUpdateDivisionFolder(item: IDivision) {
    const user = this.store.auth.meJson;
    if (!user) return;
    const folder: IFolder = {
      id: item.id,
      name: item.name,
      type: "Root",
      department: item.id,
      parentId: "root",
      path: ["root"],
      createdBy: "auto",
      createdAt: Date.now(),
      supervisor: user.supervisor,
    };
    // create in db
    try {
      await this.api.folder.autoCreateFolder(folder);
    } catch (error) {
      // console.log(error);
    }
  }
}
