import AppStore from "../stores/AppStore";
import MailApi from "./MailApi";
import { mailApiEndpoint } from "../config/mail-api-config";
import MeasureApi from "./MeasureApi";
import BusinessUnitApi from "./BusinessUnitApi";
import DepartmentApi from "./DepartmentApi";
import ObjectiveApi from "./ObjectiveApi";
import ScorecardApi from "./ScorecardApi";
import AuthApi from "./AuthApi";
import UserApi from "./UserApi";
import MeasureAuditApi from "./MeasureAuditApi";
import FolderApi from "./FolderApi";
import FolderFileApi from "./FolderFileApi";
import UploadManagerApi from "./UploadManagerApi";
import CompanyObjectiveApi from "./CompanyObjectiveApi";
import CompanyMeasureApi from "./CompanyMeasureApi";
import CompanyMeasureAuditApi from "./CompanyMeasureAuditApi";
import CompanyScorecardMetadataApi from "./CompanyScorecardMetadataApi";
import CompanyScorecardReviewApi from "./CompanyScorecardReviewApi";
import IndividualScorecardApi from "./IndividualScorecardApi";
import StrategicThemeApi from "./StrategicThemeApi";
import IndividualScorecardReviewApi from "./IndividualScorecardReviewApi";
import DivisionApi from "./DivisionApi";
import ProjectManagementApi from "./ProjectManagementApi";
import FeedbackApi from "./FeedbackApi";
import GeneralTaskApi from "./GeneralTaskApi";
import ScorecardArchiveApi from "./ScorecardArchiveApi";

export const apiPathCompanyLevel = (
  category:
    | "projects"
    | "portfolios"
    | "scorecards"
    | "businessUnits"
    | "divisions"
    | "departments"
    | "users"
    | "folders"
    | "folderFiles"
): string => {
  return `companies/mw21n2gir3bjvUCQeQgN/${category}`;
};

export const apiPathScorecardLevel = (
  scorecardId: string,
  category:
    | "scorecardMetadata"
    | "scorecardDraftReviews"
    | "scorecardQuarter1Reviews"
    | "scorecardQuarter2Reviews"
    | "scorecardQuarter3Reviews"
    | "scorecardQuarter4Reviews"
    | "measures"
    | "measuresAudit"
    | "objectives"
    | "strategicThemes"
    | "companyObjectives"
    | "companyMeasuresAudit"
    | "companyMeasures"
    | "departmentObjectives"
    | "departmentMeasures"
    | "departmentMeasuresAudit"
    | "divisionObjectives"
    | "divisionMeasures"
    | "divisionMeasuresAudit"
    | "scorecardArchives"
): string => {
  return `${apiPathCompanyLevel("scorecards")}/${scorecardId}/${category}`;
};


export const apiPathProjectLevel = (
  projectId: string,
  category: | "tasks" | "risks" | "logs"
): string => {
  return `${"projects"}/${projectId}/${category}`;
};

export default class AppApi {
  mail: MailApi;
  auth: AuthApi;
  user: UserApi;

  objective: ObjectiveApi;
  measure: MeasureApi;
  measureAudit: MeasureAuditApi;

  scorecard: ScorecardApi;
  individualScorecard: IndividualScorecardApi;
  individualScorecardReview: IndividualScorecardReviewApi;

  strategicTheme: StrategicThemeApi;

  companyObjective: CompanyObjectiveApi;
  companyMeasure: CompanyMeasureApi;
  companyMeasureAudit: CompanyMeasureAuditApi;

  companyScorecardMetadata: CompanyScorecardMetadataApi;
  companyScorecardReview: CompanyScorecardReviewApi;

  division: DivisionApi;
  department: DepartmentApi;
  businessUnit: BusinessUnitApi;

  // scorecard archive implementation
  scorecardaArchive: ScorecardArchiveApi;


  folder: FolderApi;
  folderFile: FolderFileApi;


  uploadManager: UploadManagerApi;
  projectManagement: ProjectManagementApi;
  feedback: FeedbackApi;
  generalTask: GeneralTaskApi;

  constructor(store: AppStore) {
    this.mail = new MailApi(this, store, mailApiEndpoint);
    this.auth = new AuthApi(this, store);

    // Company Level Paths
    this.division = new DivisionApi(this, store);
    this.department = new DepartmentApi(this, store);
    this.businessUnit = new BusinessUnitApi(this, store);
    this.scorecard = new ScorecardApi(this, store);
    this.user = new UserApi(this, store);
    this.folder = new FolderApi(this, store);
    this.folderFile = new FolderFileApi(this, store);

    // File Upload Manager
    this.uploadManager = new UploadManagerApi(this, store);

    // Scorecard Level Paths
    this.individualScorecard = new IndividualScorecardApi(this, store);
    this.individualScorecardReview = new IndividualScorecardReviewApi(this, store);
    this.objective = new ObjectiveApi(this, store);
    this.measure = new MeasureApi(this, store);
    this.measureAudit = new MeasureAuditApi(this, store);
    this.strategicTheme = new StrategicThemeApi(this, store);
    this.scorecardaArchive = new ScorecardArchiveApi(this, store);

    // Company APIs
    this.companyObjective = new CompanyObjectiveApi(this, store);
    this.companyMeasure = new CompanyMeasureApi(this, store);
    this.companyMeasureAudit = new CompanyMeasureAuditApi(this, store);
    this.companyScorecardMetadata = new CompanyScorecardMetadataApi(this, store);
    this.companyScorecardReview = new CompanyScorecardReviewApi(this, store);
    // Project Managements APIs
    this.projectManagement = new ProjectManagementApi(this, store);
    // Feedback APIs
    this.feedback = new FeedbackApi(this, store);

    this.generalTask = new GeneralTaskApi(this, store);
  }
}
