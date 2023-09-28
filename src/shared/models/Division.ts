import Model from "./Model";

export const defaultDivision: IDivision = {
  id: "",
  name: "",
  department: "",
  departmentName: "",
  businessUnit: "",
};

export interface IDivision {
  id: string;
  name: string;
  department: string;
  departmentName: string;
  businessUnit: string;
}

export default class Division extends Model<IDivision> {
  update(): void {}

  edit(): void {}

  async remove() {
    if (!window.confirm("Continue to delete?")) return;
  }
}
