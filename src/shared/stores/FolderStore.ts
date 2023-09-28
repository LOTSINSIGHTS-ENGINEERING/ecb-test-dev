import Store from "./Store";
import AppStore from "./AppStore";
import { makeObservable, runInAction, toJS } from "mobx";
import Folder, { IFolder } from "../models/Folder";

export default class FolderStore extends Store<IFolder, Folder> {
  items = new Map<string, Folder>();
  currentFolder: IFolder | null = null;

  constructor(store: AppStore) {
    super(store);
    this.store = store;

    makeObservable(this, {
      currentFolder: true,
    });
  }

  load(items: IFolder[] = []) {
    runInAction(() => {
      items.forEach((item) =>
        this.items.set(item.id, new Folder(this.store, item))
      );
    });
  }

  setCurrentFolder(item: IFolder) {
    runInAction(() => {
      this.currentFolder = item;
    });
  }

  get currentFolderJson() {
    return toJS(this.currentFolder);
  }

  clearCurrentFolder() {
    runInAction(() => {
      this.currentFolder = null;
    });
  }
}

// import Store from "./Store";
// import AppStore from "./AppStore";
// import { makeObservable, runInAction, toJS } from "mobx";
// import Folder, { IFolder } from "../models/Folder";

// export default class FolderStore extends Store<IFolder, Folder> {
//   items = new Map<string, Folder>();
//   current: IFolder | null = null;

//   constructor(store: AppStore) {
//     super(store);
//     this.store = store;

//     makeObservable(this, {
//       current: true,
//     });
//   }

//   load(items: IFolder[] = []) {
//     runInAction(() => {
//       items.forEach((item) =>
//         this.items.set(item.id, new Folder(this.store, item))
//       );
//     });
//   }

//   setCurrent(item: IFolder) {
//     runInAction(() => {
//       this.current = item;
//     });
//   }

//   clearCurrent() {
//     runInAction(() => {
//       this.current = null;
//     });
//   }

//   // setCurrentFolder(item: IFolder) {
//   //   runInAction(() => {
//   //     this.currentFolder = item;
//   //   });
//   // }

//   get currentFolderJson() {
//     return toJS(this.current);
//   }

//   // clearCurrentFolder() {
//   //   runInAction(() => {
//   //     this.currentFolder = null;
//   //   });
//   // }
// }
