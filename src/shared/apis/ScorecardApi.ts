import { query, collection, onSnapshot, setDoc, updateDoc, deleteDoc, doc, Unsubscribe, getDocs } from "@firebase/firestore";
import { where } from "firebase/firestore";
import { db } from "../config/firebase-config";
import { IFolder } from "../models/Folder";
import { IScorecardBatch } from "../models/ScorecardBatch";
import AppStore from "../stores/AppStore";
import AppApi, { apiPathCompanyLevel } from "./AppApi";

export default class ScorecardApi {
  constructor(private api: AppApi, private store: AppStore) { }

  private getPath() {
    return apiPathCompanyLevel("scorecards");
  }

  async getActive() {
    const path = this.getPath();
    if (!path) return;
    const $query = query(collection(db, path), where("active", "==", true));
    try {
      const docsSnap = await getDocs($query);
      if (docsSnap.empty) {
        this.store.scorecard.clearActive();
      } else {
        const item = {
          id: docsSnap.docs[0].id,
          ...docsSnap.docs[0].data(),
        } as IScorecardBatch;
        this.store.scorecard.setActive(item); // set active in store
        this.createOrUpdateFYFolder(item); // create/update FY folder in drive
      }
    } catch (error) { }
  }


  // for dublicating testing, duplicatess to the curent scorecard
  async getCurrent() {
    const path = this.getPath();
    if (!path) return;
    const $query = query(collection(db, path), where("current", "==", true));
    try {
      const docsSnap = await getDocs($query);
      if (docsSnap.empty) {
        this.store.scorecard.clearCurrent();
      } else {
        const item = {
          id: docsSnap.docs[0].id,
          ...docsSnap.docs[0].data(),
        } as IScorecardBatch;
        this.store.scorecard.setCurrent(item); // set current in store
        // console.log(item);
        
      }
    } catch (error) { }
  }


  async getAll() {
    const path = this.getPath();
    if (!path) return;

    const $query = query(collection(db, path));

    // new promise
    return await new Promise<Unsubscribe>((resolve, reject) => {
      // on snapshot
      const unsubscribe = onSnapshot($query, (querySnapshot) => {
        const items: IScorecardBatch[] = [];
        querySnapshot.forEach((doc) => {
          items.push({ id: doc.id, ...doc.data() } as IScorecardBatch);
        });
        this.store.scorecard.load(items);
        resolve(unsubscribe);
      }, (error) => {
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
      const item = { id: doc.id, ...doc.data() } as IScorecardBatch;

      this.store.scorecard.load([item]);
    });

    return unsubscribe;
  }

  // create scorecardBatch
  async create(item: IScorecardBatch) {
    const path = this.getPath();
    if (!path) return;

    const itemRef = doc(collection(db, path));
    item.id = itemRef.id;

    // create in db
    try {
      await setDoc(itemRef, item, { merge: true });
      // create in store
      this.store.scorecard.load([item]);
    } catch (error) { }
  }

  // update item
  async update(item: IScorecardBatch) {
    const path = this.getPath();
    if (!path) return;

    // update in db
    try {
      await updateDoc(doc(db, path, item.id), {
        ...item,
      });
      // update in store
      this.store.scorecard.load([item]);
    } catch (error) { }
  }

  // delete scorecard batch
  async delete(item: IScorecardBatch) {
    const path = this.getPath();
    if (!path) return;

    // remove from db
    try {
      await deleteDoc(doc(db, path, item.id));
      // remove from store
      this.store.scorecard.remove(item.id); // Remove from memory
    } catch (error) { }
  }


  // create/update department root folder in drive
  private async createOrUpdateFYFolder(item: IScorecardBatch) {
    const user = this.store.auth.meJson;
    if (!user) return; // TODO: handle no user error.

    const fyFolder: IFolder = {
      id: `${user.uid}_${item.id}`,
      name: `FY ${item.description}`,
      type: "FY",
      department: user.department,
      parentId: user.uid,
      path: ["root", user.department, user.uid],
      createdBy: "auto",
      createdAt: Date.now(),
      supervisor: user.supervisor,
    };

    const financialPerspectiveFolder: IFolder = {
      id: `financial_${user.uid}_${item.id}`,
      name: `Financial Sustainability`,
      type: "Perspective",
      department: user.department,
      parentId: `${user.uid}_${item.id}`,
      path: ["root", user.department, user.uid, `${user.uid}_${item.id}`],
      createdBy: "auto",
      createdAt: Date.now(),
      supervisor: user.supervisor,
    };

    const learningPerspectiveFolder: IFolder = {
      id: `learning_${user.uid}_${item.id}`,
      name: `Human Capital & Transformation`,
      type: "Perspective",
      department: user.department,
      parentId: `${user.uid}_${item.id}`,
      path: ["root", user.department, user.uid, `${user.uid}_${item.id}`],
      createdBy: "auto",
      createdAt: Date.now(),
      supervisor: user.supervisor,
    };

    const processPerspectiveFolder: IFolder = {
      id: `process_${user.uid}_${item.id}`,
      name: `Operational Excellence & Governance`,
      type: "Perspective",
      department: user.department,
      parentId: `${user.uid}_${item.id}`,
      path: ["root", user.department, user.uid, `${user.uid}_${item.id}`],
      createdBy: "auto",
      createdAt: Date.now(),
      supervisor: user.supervisor,
    };

    const customerPerspectiveFolder: IFolder = {
      id: `customer_${user.uid}_${item.id}`,
      name: `Stakeholder Value Addition`,
      type: "Perspective",
      department: user.department,
      parentId: `${user.uid}_${item.id}`,
      path: ["root", user.department, user.uid, `${user.uid}_${item.id}`],
      createdBy: "auto",
      createdAt: Date.now(),
      supervisor: user.supervisor,
    };

    // create in db
    try {
      await this.api.folder.autoCreateFolder(fyFolder);
      // create sub folders
      await this.api.folder.autoCreateFolder(financialPerspectiveFolder);
      await this.api.folder.autoCreateFolder(learningPerspectiveFolder);
      await this.api.folder.autoCreateFolder(processPerspectiveFolder);
      await this.api.folder.autoCreateFolder(customerPerspectiveFolder);
    } catch (error) {
      // console.log(error);
    }
  }
}
