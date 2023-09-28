// import {
//   query,
//   collection,
//   onSnapshot,
//   setDoc,
//   updateDoc,
//   deleteDoc,
//   doc,
// } from "@firebase/firestore";
// import { Unsubscribe, where } from "firebase/firestore";
// import { db } from "../config/firebase-config";
// import { IMeasureDivision } from "../models/MeasureDivision";
// import AppStore from "../stores/AppStore";
// import AppApi, { apiPathScorecardLevel } from "./AppApi";

// export default class DivisionMeasureApi {
//   path: string = "";

//   constructor(private api: AppApi, private store: AppStore) {}

//   // private getPath() {
//   //   return this.path;
//   // }

//   // private setPath(id: string) {
//   //   this.path = this.path = apiPathScorecardLevel(id, "divisionMeasures");
//   // }

//   private getPath() {
//     if (!this.store.scorecard.activeId) return null;
//     return apiPathScorecardLevel(this.store.scorecard.activeId, "divisionMeasures");
//   }

//   async getAll(batchId: string, depId?: string) {
//     // set path
//     // this.setPath(batchId);

//     // get the db path
//     const path = this.getPath();
//     if (!path) return;

//     // remove all items from store
//     this.store.divisionMeasure.removeAll();

//     // create the query
//     const $query = depId
//       ? query(collection(db, path), where("division", "==", depId))
//       : query(collection(db, path));

//     // new promise
//     return await new Promise<Unsubscribe>((resolve, reject) => {
//       // on snapshot
//       const unsubscribe = onSnapshot(
//         $query,
//         // onNext
//         (querySnapshot) => {
//           const items: IMeasureDivision[] = [];
//           querySnapshot.forEach((doc) => {
//             items.push({ id: doc.id, ...doc.data() } as IMeasureDivision);
//           });

//           this.store.divisionMeasure.load(items);
//           resolve(unsubscribe);
//         },
//         // onError
//         (error) => {
//           reject(error);
//         }
//       );
//     });
//   }

//   async getAllByObjectiveId(batchId: string, objectiveId: string) {
//     // set path
//     // this.setPath(batchId);

//     // get the db path
//     const path = this.getPath();
//     if (!path) return;

//     // remove all items from store
//     this.store.divisionMeasure.removeAll();

//     // create the query
//     const $query = query(
//       collection(db, path),
//       where("objective", "==", objectiveId)
//     );

//     // new promise
//     return await new Promise<Unsubscribe>((resolve, reject) => {
//       // on snapshot
//       const unsubscribe = onSnapshot(
//         $query,
//         // onNext
//         (querySnapshot) => {
//           const items: IMeasureDivision[] = [];
//           querySnapshot.forEach((doc) => {
//             items.push({ id: doc.id, ...doc.data() } as IMeasureDivision);
//           });

//           this.store.divisionMeasure.load(items);
//           resolve(unsubscribe);
//         },
//         // onError
//         (error) => {
//           reject(error);
//         }
//       );
//     });
//   }

//   async getById(id: string) {
//     const path = this.getPath();
//     if (!path) return;

//     const unsubscribe = onSnapshot(doc(collection(db, path), id), (doc) => {
//       if (!doc.exists) return;
//       const item = { id: doc.id, ...doc.data() } as IMeasureDivision;

//       this.store.divisionMeasure.load([item]);
//     });

//     return unsubscribe;
//   }

//   // create measure
//   async create(item: IMeasureDivision) {
//     const path = this.getPath();
//     if (!path) return;

//     const itemRef = doc(collection(db, path));
//     item.id = itemRef.id;

//     // create in db
//     try {
//       await setDoc(itemRef, item, {
//         merge: true,
//       });
//       // create in store
//       this.store.divisionMeasure.load([item]);
//       // update the measure audit
//       this.api.divisionMeasureAudit.update(item);
//     } catch (error) {
//       // console.log(error);
//     }
//   }

//   // update item
//   async update(
//     item: IMeasureDivision,
//     fieldsUpdated?: (keyof IMeasureDivision)[]
//   ) {
//     const path = this.getPath();
//     if (!path) return;

//     let measure: { [k: string]: any } = {};

//     // fields updated
//     if (fieldsUpdated)
//       for (const val of fieldsUpdated) measure[val] = item[val];
//     else measure = { ...item };

//     // update in db
//     try {
//       await updateDoc(doc(collection(db, path), item.id), {
//         ...measure,
//       });

//       // store item
//       if (!fieldsUpdated) {
//         this.updateMeasureStore(item); // update measure store & audit store
//       } else {
//         const currItem = this.store.divisionMeasure.getItemById(item.id);
//         const newItem = currItem ? { ...currItem.asJson, ...measure } : item;
//         this.updateMeasureStore(newItem); // update measure store & audit store
//       }
//     } catch (error) {
//       // console.log(error);
//     }
//   }

//   private updateMeasureStore(item: IMeasureDivision) {
//     this.store.divisionMeasure.load([item]); // update in store
//     this.api.divisionMeasureAudit.update(item); // update the measure audit
//   }

//   // delete measure
//   async delete(item: IMeasureDivision) {
//     const path = this.getPath();
//     if (!path) return;

//     // remove from db
//     try {
//       await deleteDoc(doc(collection(db, path), item.id));
//       // remove from store
//       this.store.divisionMeasure.remove(item.id); // Remove from memory
//       // delete measure audit
//       this.api.divisionMeasureAudit.deleteAll(item);
//     } catch (error) {
//       // console.log(error);
//     }
//   }
// }
import { runInAction } from "mobx";