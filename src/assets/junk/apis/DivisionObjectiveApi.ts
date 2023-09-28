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
// import { IObjective } from "../models/Objective";
// import AppStore from "../stores/AppStore";
// import AppApi, { apiPathScorecardLevel } from "./AppApi";

// export default class DivisionObjectiveApi {
//   path: string = "";

//   constructor(private api: AppApi, private store: AppStore) {}

//   // private getPath() {
//   //   return this.path;
//   // }

//   // private setPath(id: string) {
//   //   this.path = this.path = apiPathScorecardLevel(id, "divisionObjectives");
//   // }

//   private getPath() {
//     if (!this.store.scorecard.activeId) return null;
//     return apiPathScorecardLevel(this.store.scorecard.activeId, "divisionObjectives");
//   }

//   async getAll(batchId: string, depId?: string) {
//     // set path
//     // this.setPath(batchId);

//     // get the db path
//     const path = this.getPath();
//     if (!path) return;

//     // remove all items from store
//     this.store.divisionObjective.removeAll();

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
//           const items: IObjective[] = [];
//           querySnapshot.forEach((doc) => {
//             items.push({ id: doc.id, ...doc.data() } as IObjective);
//           });

//           this.store.divisionObjective.load(items);
//           resolve(unsubscribe);
//         },
//         // onError
//         (error) => {
//           reject();
//         }
//       );
//     });
//   }

//   async getAllByParent(batchId: string, parent: string) {
//     // set path
//     // this.setPath(batchId);

//     // get the db path
//     const path = this.getPath();
//     if (!path) return;

//     // remove all items from store
//     this.store.divisionObjective.removeAll();

//     // create the query
//     const $query = query(collection(db, path), where("parent", "==", parent));

//     // new promise
//     return await new Promise<Unsubscribe>((resolve, reject) => {
//       // on snapshot
//       const unsubscribe = onSnapshot(
//         $query,
//         // onNext
//         (querySnapshot) => {
//           const items: IObjective[] = [];
//           querySnapshot.forEach((doc) => {
//             items.push({ id: doc.id, ...doc.data() } as IObjective);
//           });

//           this.store.divisionObjective.load(items);
//           resolve(unsubscribe);
//         },
//         // onError
//         (error) => {
//           reject();
//         }
//       );
//     });
//   }

//   async getById(id: string) {
//     const path = this.getPath();
//     if (!path) return;

//     const unsubscribe = onSnapshot(doc(db, path, id), (doc) => {
//       if (!doc.exists) return;
//       const item = { id: doc.id, ...doc.data() } as IObjective;

//       this.store.divisionObjective.load([item]);
//     });

//     return unsubscribe;
//   }

//   // create objective
//   async create(item: IObjective) {
//     const path = this.getPath();
//     if (!path) return;

//     const itemRef = doc(collection(db, path));
//     item.id = itemRef.id;
//     // create in db
//     try {
//       await setDoc(itemRef, item, {
//         merge: true,
//       });

//       this.store.divisionObjective.load([item]); // create in store
//     } catch (error) {
//       // console.log(error);
//     }
//   }

//   // update item
//   async update(item: IObjective) {
//     const path = this.getPath();
//     if (!path) return;

//     // update in db
//     try {
//       await updateDoc(doc(db, path, item.id), {
//         ...item,
//       });
//       // update in store
//       this.store.divisionObjective.load([item]);
//     } catch (error) {
//       // console.log(error);
//     }
//   }

//   // delete objective
//   async delete(item: IObjective) {
//     const path = this.getPath();
//     if (!path) return;

//     // remove from db
//     try {
//       await deleteDoc(doc(db, path, item.id));
//       // remove from store
//       this.store.divisionObjective.remove(item.id); // Remove from memory
//     } catch (error) {
//       // console.log(error);
//     }
//   }
// }
import { runInAction } from "mobx";