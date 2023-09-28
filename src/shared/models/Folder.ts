import Model from "./Model";

export const defaultFolder: IFolder = {
  id: "",
  name: "",
  department: "",
  supervisor: "",
  parentId: "root",
  type: "Other",
  path: ["root"],
  createdBy: "",
  createdAt: Date.now(),
};

export interface IFolder {
  id: string;
  name: string;
  parentId: string;
  type: "Root" | "Department" | "User" | "FY" | "Perspective" | "Other";
  department: string;
  supervisor: string;
  path: string[];
  createdBy: string;
  createdAt: number;
}

export default class Folder extends Model<IFolder> {
  update(): void {}

  edit(): void {}

  async remove() {
    if (!window.confirm("Continue to delete?")) return;
  }
}
