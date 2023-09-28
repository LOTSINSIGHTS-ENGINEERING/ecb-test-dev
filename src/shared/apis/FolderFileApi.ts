import {
  query,
  collection,
  onSnapshot,
  setDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "@firebase/firestore";
import { getDocs, Unsubscribe, where } from "firebase/firestore";
import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "../config/firebase-config";
import { serverTimestampInMillis } from "../functions/TimestampToDate";
import { IFolder } from "../models/Folder";
import { IFolderFile } from "../models/FolderFile";
import AppStore from "../stores/AppStore";
import AppApi, { apiPathCompanyLevel } from "./AppApi";

export default class FolderFileApi {
  path: string | null = null;

  constructor(private api: AppApi, private store: AppStore) { }

  private getPath() {
    return apiPathCompanyLevel("folderFiles");
  }

  async getAll(folderId: string) {
    // get the db path
    const path = this.getPath();
    if (!path) return;
    // create the query
    const $query = query(collection(db, path), where("folderId", "==", folderId));
    // new promise
    return await new Promise<Unsubscribe>((resolve, reject) => {
      // on snapshot
      const unsubscribe = onSnapshot($query, (querySnapshot) => {
        const items: IFolderFile[] = [];
        querySnapshot.forEach((doc) => {
          items.push({ id: doc.id, ...doc.data() } as IFolderFile);
        });

        this.store.folderFile.load(items);
        resolve(unsubscribe);
      }, (error) => {
        reject();
      }
      );
    });
  }

  async getAllByMeasure(createdBy: string, measureId: string) {
    // get the db path
    const path = this.getPath();
    if (!path) return;

    // create the query
    const $query = query(collection(db, path), where("createdBy", "==", createdBy), where("measureId", "==", measureId));
    // new promise
    return await new Promise<Unsubscribe>((resolve, reject) => {
      // on snapshot
      const unsubscribe = onSnapshot($query, (querySnapshot) => {
        const items: IFolderFile[] = [];
        querySnapshot.forEach((doc) => {
          items.push({ id: doc.id, ...doc.data() } as IFolderFile);
        });

        this.store.folderFile.load(items);
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
      const item = { id: doc.id, ...doc.data() } as IFolderFile;

      this.store.folderFile.load([item]);
    });

    return unsubscribe;
  }

  // create folderFile
  async create(item: IFolderFile, file?: File) {
    const path = this.getPath();
    if (!path) return;

    if (file)
      try {
        const url = await this.uploadFile(file, item.folderId);
        item.url = url;
        item.createdAt = serverTimestampInMillis();
      } catch (error) {
        throw new Error("Failed to upload document");
      }

    const itemRef = doc(collection(db, path));
    item.id = itemRef.id;
    // create in db
    try {
      await setDoc(itemRef, item, { merge: true, });

      this.store.folderFile.load([item]); // create in store
    } catch (error) { }
  }

  // update item
  async update(item: IFolderFile) {
    const path = this.getPath();
    if (!path) return;

    // update in db
    try {
      await updateDoc(doc(db, path, item.id), { ...item, });
      // update in store
      this.store.folderFile.load([item]);
    } catch (error) { }
  }

  // delete folderFile
  async delete(item: IFolderFile) {
    const path = this.getPath();
    if (!path) return;

    try {
      // Delete the file
      await deleteObject(ref(storage, item.url));
      // remove from db
      await deleteDoc(doc(db, path, item.id));
      // remove from store
      this.store.folderFile.remove(item.id); // Remove from memory
    } catch (error) { }
  }

  // delete folder files
  async deleteFolderFiles(folder: IFolder) {
    // get the db path
    const path = this.getPath();
    if (!path) return;

    const $query = query(collection(db, path), where("folderId", "==", folder.id));
    const querySnapshot = await getDocs($query);
    querySnapshot.forEach((doc) => {
      const item = { id: doc.id, ...doc.data() } as IFolderFile;
      this.delete(item);
    });
  }

  private async uploadFile(file: File, rootPath: string) {
    const extension = file.name.split(".").pop();
    const name = `${Date.now()}.${extension}`;

    const path = `${rootPath}/${name}`; // Path-> ScorecardId/DepartmentID/UID/filename.jpg

    const storageRef = ref(storage, path);

    try {
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);

      return downloadURL;
    } catch (error) {
      throw new Error("Failed to upload file");
    }
  }
}
