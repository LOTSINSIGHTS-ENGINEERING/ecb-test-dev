import {
  query,
  collection,
  onSnapshot,
  setDoc,
  deleteDoc,
  doc,
} from "@firebase/firestore";
import { Unsubscribe } from "firebase/firestore";
import { db } from "../config/firebase-config";
import { IMeasure } from "../models/Measure";
import { IMeasureAudit } from "../models/MeasureAudit";
import { IObjective } from "../models/Objective";
import { defaultArchive, IScorecardArchive, } from "../models/ScorecardArchive";
import { IUser } from "../models/User";
import AppStore from "../stores/AppStore";
import AppApi, { apiPathScorecardLevel } from "./AppApi";

export default class ScorecardArchiveApi {
  constructor(private api: AppApi, private store: AppStore) { }

  private getPath() {
    if (!this.store.scorecard.activeId) return null;
    return apiPathScorecardLevel(this.store.scorecard.activeId, "scorecardArchives");
  }


  async getByUid(id: string) {
    const path = this.getPath();
    if (!path) return;

    const unsubscribe = onSnapshot(doc(db, path, id), (doc) => {
      if (!doc.exists) return;
      const item = { uid: doc.id, ...doc.data() } as IScorecardArchive;
      this.store.scorecardArchiveStore.load([item]);
    });

    return unsubscribe;
  }

  async getAll() {
    const path = this.getPath();
    if (!path) return;

    const $query = query(collection(db, path));

    // new promise
    return await new Promise<Unsubscribe>((resolve, reject) => {
      // on snapshot
      const unsubscribe = onSnapshot(
        $query,
        // onNext
        (querySnapshot) => {
          const items: IScorecardArchive[] = [];
          querySnapshot.forEach((doc) => {
            items.push({
              uid: doc.id,
              ...doc.data(),
            } as IScorecardArchive);
          });

          this.store.scorecardArchiveStore.load(items);
          resolve(unsubscribe);
        },
        // onError
        (error) => {
          reject();
        }
      );
    });
  }

  // create scorecardBatch
  async create(item: IScorecardArchive) {
    const path = this.getPath();
    if (!path) return;

    try {
      await setDoc(doc(db, path, item.uid), item, {
        merge: true,
      });
      this.store.scorecardArchiveStore.load([item]);
    } catch (error) {
      console.log(error);
    }
  }


  async delete(item: IScorecardArchive) {
    const path = this.getPath();
    if (!path) return;
    try {
      await deleteDoc(doc(db, path, item.uid));
      this.store.scorecardArchiveStore.remove(item.uid); // Remove from memory
    } catch (error) {
      // console.log(error);
    }
  }

  archive = (
    user: IUser,
    objectives: IObjective[],
    measures: IMeasure[],
    measureAudits: | IMeasureAudit[]
  ): IScorecardArchive => {
    const archive: IScorecardArchive = {
      ...defaultArchive,
      objectives,
      measures,
      measureAudits,
    };

    return archive;
  };


}
