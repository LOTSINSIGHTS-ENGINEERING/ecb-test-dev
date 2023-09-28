import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import { IProject } from "../../models/Project.model";
import { IProjectRisk } from "../../models/ProjectRisks.model";
import { IProjectTask } from "../../models/ProjectTasks.model";
import AppStore from "../../stores/AppStore";
import { ProjectDocumentPDF } from "./ProjectDocumentPDF";
import { ProjectImagePDF } from "./ProjectImagePDF";

(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

export const generateProjectPDF = async (project: IProject, milestones: IProjectTask[], tasks: IProjectTask[], risks: IProjectRisk[], store: AppStore) => {
  const newWindow = window.open();
  pdfMake.createPdf((await ProjectDocumentPDF(project, milestones, tasks, risks, store)) as any).open({}, newWindow);
};

export const generateProjectImagePDF = async (chartsimage: HTMLAnchorElement) => {
  const newWindow = window.open();
  pdfMake.createPdf((await ProjectImagePDF(chartsimage)) as any).open({}, newWindow);
};