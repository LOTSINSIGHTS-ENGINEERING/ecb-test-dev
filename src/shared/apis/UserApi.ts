import {
  query,
  collection,
  onSnapshot,
  setDoc,
  updateDoc,
  deleteDoc,
  doc,
  where,
} from "@firebase/firestore";
import { Unsubscribe } from "firebase/firestore";
import { db } from "../config/firebase-config";
import { IFolder } from "../models/Folder";
import { IUser } from "../models/User";
import AppStore from "../stores/AppStore";
import AppApi from "./AppApi";

export default class UserApi {
  path: string | null = null;

  constructor(private api: AppApi, private store: AppStore) { }

  getPath() {
    return "users";
  }

  async getAll() {
    // get the db path
    const path = this.getPath();
    if (!path) return;

    // remove all items from store
    this.store.user.removeAll();

    // create the query
    const $query = query(collection(db, path));
    // new promise
    return await new Promise<Unsubscribe>((resolve, reject) => {
      // on snapshot
      const unsubscribe = onSnapshot(
        $query,
        // onNext
        (querySnapshot) => {
          const items: IUser[] = [];
          querySnapshot.forEach((doc) => {
            const user = { uid: doc.id, ...doc.data() } as IUser;

            const DEV_MODE =
              !process.env.NODE_ENV || process.env.NODE_ENV === "development";
            if (DEV_MODE) items.push(user);
            else if (!user.devUser) items.push(user);
          });

          this.store.user.load(items);
          resolve(unsubscribe);
        },
        // onError
        (error) => {
          reject();
        }
      );
    });
  }

  async getAllSubordinates(uid: string) {
    // get the db path
    const path = this.getPath();
    if (!path) return;

    // remove all items from store
    this.store.user.removeAll();

    // create the query
    const $query = query(collection(db, path), where("supervisor", "==", uid));
    // new promise
    return await new Promise<Unsubscribe>((resolve, reject) => {
      // on snapshot
      const unsubscribe = onSnapshot(
        $query,
        // onNext
        (querySnapshot) => {
          const items: IUser[] = [];
          querySnapshot.forEach((doc) => {
            items.push({ uid: doc.id, ...doc.data() } as IUser);
          });

          this.store.user.load(items);
          resolve(unsubscribe);
        },
        // onError
        (error) => {
          // console.log(error);

          reject(error);
        }
      );
    });
  }

  async getByDepartment(departmentId: string) {
    const path = this.getPath();
    if (!path) return;
    this.store.user.removeAll();

    const $query = query(
      collection(db, path),
      where("department", "==", departmentId)
    );
    return await new Promise<Unsubscribe>((resolve, reject) => {
      const unsubscribe = onSnapshot(
        $query,
        (querySnapshot) => {
          const items: IUser[] = [];
          querySnapshot.forEach((doc) => {
            items.push({ uid: doc.id, ...doc.data() } as IUser);
          });

          this.store.user.load(items);
          resolve(unsubscribe);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  async getByDivision(divisionId: string) {
    const path = this.getPath();
    if (!path) return;
    this.store.user.removeAll();

    const $query = query(
      collection(db, path),
      where("division", "==", divisionId)
    );
    return await new Promise<Unsubscribe>((resolve, reject) => {
      const unsubscribe = onSnapshot(
        $query,
        (querySnapshot) => {
          const items: IUser[] = [];
          querySnapshot.forEach((doc) => {
            items.push({ uid: doc.id, ...doc.data() } as IUser);
          });

          this.store.user.load(items);
          resolve(unsubscribe);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  async getByUid(id: string) {
    const path = this.getPath();
    if (!path) return;

    const unsubscribe = onSnapshot(doc(db, path, id), (doc) => {
      if (!doc.exists) return;
      const item = { uid: doc.id, ...doc.data() } as IUser;

      this.store.user.load([item]);
    });

    return unsubscribe;
  }

  // create user
  async create(item: IUser) {
    const path = this.getPath();
    if (!path) return;

    // create in db
    try {
      await setDoc(doc(collection(db, path), item.uid), item, {
        merge: true,
      });
      // create in store
      this.store.user.load([item]);
      this.createOrUpdateUserFolder(item); // create folder
    } catch (error) {
      // console.log(error);
    }
  }

  // update item
  async update(item: IUser) {
    const path = this.getPath();
    if (!path) return;

    // update in db
    try {
      await updateDoc(doc(db, path, item.uid), {
        ...item,
      });
      // update in store
      this.store.user.load([item]);
      this.createOrUpdateUserFolder(item); // create folder
    } catch (error) {
      // console.log(error);
    }
  }

  // delete user
  async delete(item: IUser) {
    const path = this.getPath();
    if (!path) return;
    // remove from db
    try {
      await deleteDoc(doc(db, path, item.uid));
      // remove from store
      this.store.user.remove(item.uid); // Remove from memory
      // this.api.folder.delete(item.uid)
      // this.api.measure.delete(item.uid)
    } catch (error) {
      // console.log(error);
    }
  }

  // create/update department root folder in drive
  private async createOrUpdateUserFolder(item: IUser) {
    const userFolder: IFolder = {
      id: item.uid,
      name: item.displayName || `${item.firstName} ${item.lastName}`,
      type: "User",
      department: item.department,
      parentId: item.department,
      path: ["root", item.department],
      createdBy: "auto",
      createdAt: Date.now(),
      supervisor: item.supervisor,
    };

    // create in db
    try {
      await this.api.folder.autoCreateFolder(userFolder);
    } catch (error) {
      // console.log(error);
    }
  }
}
