import { toJS } from "mobx";
import Model from "./Model";

export const defaultFolderFile: IFolderFile = {
  id: "",
  name: "File",
  folderId: "root",
  url: "",
  measureId: "",
  extension: "unknown",
  createdBy: "",
  createdAt: Date.now(),
};

export interface IFolderFile {
  id: string;
  name: string;
  folderId: string;
  url: string;
  measureId: string;
  extension: string;
  createdBy: string;
  createdAt: number;
}

export default class FolderFile extends Model<IFolderFile> {
  async remove() {
    if (!window.confirm("Delete file")) return;

    await this.api.folderFile.delete(this.item);
  }

  get asJson(): IFolderFile {
    return toJS(this.item);
  }
}
