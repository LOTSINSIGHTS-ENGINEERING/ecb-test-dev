import Model from "./Model";

export const defaultDepartment: IDepartment = {
  id: "",
  name: "",
  businessUnit: "",
};

export interface IDepartment {
  id: string;
  name: string;
  businessUnit: string;
}

export default class Department extends Model<IDepartment> {
  update(): void {}

  edit(): void {}

  async remove() {
    if (!window.confirm("Continue to delete?")) return;
  }
}
