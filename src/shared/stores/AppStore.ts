import AuthStore from "./AuthStore";
import BusinessUnitStore from "./BusinessUnitStore";
import CompanyMeasureAuditStore from "./CompanyMeasureAuditStore";
import CompanyMeasureStore from "./CompanyMeasureStore";
import CompanyObjectiveStore from "./CompanyObjectiveStore";
import DepartmentStore from "./DepartmentStore";
import FolderFileStore from "./FolderFileStore";
import FolderStore from "./FolderStore";
import IndividualScorecardStore from "./IndividualScorecardStore";
import IndividualScorecardReviewStore from "./IndividualScorecardReviewStore";
import MeasureAuditStore from "./MeasureAuditStore";
import MeasureStore from "./MeasureStore";
import ObjectiveStore from "./ObjectiveStore";
import ReportStore from "./ReportStore";
import ScorecardStore from "./ScorecardStore";
import StrategicThemeStore from "./StrategicThemeStore";
import UploadManagerStore from "./UploadManagerStore";
import UserStore from "./UserStore";
import CompanyScorecardMetadataStore from "./CompanyScorecardMetadataStore";
import CompanyScorecardReviewStore from "./CompanyScorecardReviewStore";
import { MainApp } from "../models/App";
import DivisionStore from "./DivsionStore";
import PortfolioStore from "./PortfolioStore";
import ProjectManagementStore from "./ProjectManagementStore";
import ProjectRiskStore from "./ProjectRiskStore";
import ProjectTaskStore from "./ProjectTaskStore";
import ProjectStatusStore from "./ProjectStatusStore";
import FeedbackStore from "./FeedbackStore";
import ProjectLogsStore from "./ProjectLogsStore";
import GeneralTaskStore from "./GeneralTaskStore";
import ScorecardArchiveStore from "./ScorecardArchiveStore";

export default class AppStore {
  app: MainApp;

  auth = new AuthStore(this);
  user = new UserStore(this);

  scorecard = new ScorecardStore(this);
  individualScorecard = new IndividualScorecardStore(this);
  individualScorecardReview = new IndividualScorecardReviewStore(this);

  objective = new ObjectiveStore(this);
  measure = new MeasureStore(this);
  measureAudit = new MeasureAuditStore(this);
  strategicTheme = new StrategicThemeStore(this);

  companyObjective = new CompanyObjectiveStore(this);
  companyMeasure = new CompanyMeasureStore(this);
  companyMeasureAudit = new CompanyMeasureAuditStore(this);
  companyScorecardMetadata = new CompanyScorecardMetadataStore(this);
  companyScorecardReview = new CompanyScorecardReviewStore(this);


  // scorecard arechive impletmentation
  scorecardArchiveStore = new ScorecardArchiveStore(this);


  division = new DivisionStore(this);
  department = new DepartmentStore(this);
  businessUnit = new BusinessUnitStore(this);
  report = new ReportStore(this);
  folder = new FolderStore(this);
  folderFile = new FolderFileStore(this);

  // upload manager
  uploadManager = new UploadManagerStore(this);

  // project Management Stores
  portfolio = new PortfolioStore(this);
  projectManagement = new ProjectManagementStore(this);
  projectTask = new ProjectTaskStore(this);
  projectRisk = new ProjectRiskStore(this);
  projectStatus = new ProjectStatusStore();
  projectLogs = new ProjectLogsStore(this);

  generalTask = new GeneralTaskStore(this)

  // feedback Store
  feedback = new FeedbackStore(this);

  constructor(app: MainApp) {
    this.app = app;
  }
}
