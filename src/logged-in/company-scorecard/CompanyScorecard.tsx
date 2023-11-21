import { useEffect, useMemo, useRef, useState } from "react";
import useTitle from "../../shared/hooks/useTitle";
import Modal from "../../shared/components/Modal";
import MODAL_NAMES from "../dialogs/ModalName";
import { observer } from "mobx-react-lite";
import { useAppContext } from "../../shared/functions/Context";
import ObjectiveCompanyModal from "../dialogs/objective-company/ObjectiveCompanyModal";
import { useNavigate, useParams } from "react-router-dom";
import useBackButton from "../../shared/hooks/useBack";
import ErrorBoundary from "../../shared/components/error-boundary/ErrorBoundary";
import { SCORECARD_TAB, QUARTER2_TAB, QUARTER4_TAB, } from "../../shared/interfaces/IReviewCycleTabs";
import { IReviewCycleStatus, IReviewCycleType, IScorecardBatch, } from "../../shared/models/ScorecardBatch";
import useCompanyScorecardMetadata from "../../shared/hooks/useCompanyScorecardMetadata";
import CompanyScorecardDraftCycle from "./CompanyScorecardDraftCycle";
import CompanyScorecardQ2Cycle from "./CompanyScorecardQ2Cycle";
import CompanyScorecardQ4Cycle from "./CompanyScorecardQ4Cycle";
import { LoadingEllipsis } from "../../shared/components/loading/Loading";
import { generateCompanyPerformanceAgreementPDF } from "../../shared/functions/scorecard-pdf/GeneratePerformaneAgreementPDF";
import { exportCompanyExcelScorecard } from "../shared/functions/Excel";
import { USER_ROLES } from "../../shared/functions/CONSTANTS";
import showModalFromId from "../../shared/functions/ModalShow";
import ReadScorecardCommentModal from "../dialogs/read-scorecard-comment/ReadScorecardCommentModal";
import MeasureCompanyAssessmentCommentsModal from "../dialogs/company-measure-comments-assesment/MeasureCompanyAssessmentCommentsModal";
import MeasureCompanyMidermCommentsModal from "../dialogs/company-measure-comments-midterm/MeasureCompanyMidermCommentsModal";
import MeasureCompanyCommentsModal from "../dialogs/company-measure-comments/MeasureCompanyCommentsModal";
import { IObjectiveCompany } from "../../shared/models/ObjectiveCompany";
import { IMeasureCompany } from "../../shared/models/MeasureCompany";

interface IStepStageProps {
  open?: boolean;
  status?: IReviewCycleStatus;
  index: number;
  title: IReviewCycleType;
  setReviewCycle: React.Dispatch<React.SetStateAction<IReviewCycleType>>;
}
const StepStage = (props: IStepStageProps) => {
  const status = props.status || "pending";
  const open = props.open ? "open" : "closed";
  const className = `step--stage step--stage__${status} step--stage__${open}`;

  return (
    <ErrorBoundary>
      <button
        className={className}
        onClick={() => props.setReviewCycle(props.title)}
      >
        <div className="step--stage__bubble">
          <div className="step--stage__bubble__content">
            {status === "pending" && (
              <span className="icon" style={{ fontSize: "1.2rem" }}>
                {" "}
                ◔
              </span>
            )}
            {status === "in-progress" && (
              <span className="icon" style={{ fontSize: "1.2rem" }}>
                {" "}
                ◔
              </span>
            )}
            {status === "submitted" && (
              <span className="icon" style={{ fontSize: "1.2rem" }}>
                {" "}
                ◔
              </span>
            )}
            {(status === "reverted" || status === "cancelled") && (
              <span className="icon" style={{ fontSize: "1.2rem" }}>
                {" "}
                ×
              </span>
            )}
            {status === "approved" && (
              <span className="icon" data-uk-icon="check"></span>
            )}
          </div>
        </div>

        <div className="step--stage__content">
          <p className="label">
            STEP {props.index} {status}
          </p>
          <h6 className="title">{props.title}</h6>
        </div>
      </button>
    </ErrorBoundary>
  );
};

interface IReviewCyleProps {
  batch: IScorecardBatch;
  reviewCycle: IReviewCycleType;
  setReviewCycle: React.Dispatch<React.SetStateAction<IReviewCycleType>>;
}
const ReviewCycleTabs = observer((props: IReviewCyleProps) => {
  const { batch, reviewCycle, setReviewCycle } = props;
  const agreement = useCompanyScorecardMetadata(batch.id);
  const { agreementDraft, quarter2Review, quarter4Review } = agreement;

  const firstRender = useRef(true);

  // check status condition and update the status progress
  useEffect(() => {
    if (!firstRender.current) return;
    firstRender.current = false;
    agreement.agreementDraft.status === "approved" &&
      setReviewCycle("Q1 Reviews");
    agreement.quarter1Review.status === "approved" &&
      setReviewCycle("Midterm Reviews");
    agreement.quarter2Review.status === "approved" &&
      setReviewCycle("Q3 Reviews");
    agreement.quarter3Review.status === "approved" &&
      setReviewCycle("Assessment");
    agreement.quarter3Review.status === "approved" &&
      setReviewCycle("Assessment");
  }, [agreement, reviewCycle, setReviewCycle]);

  return (
    <div className="step">
      <StepStage
        index={1}
        title={SCORECARD_TAB.name}
        status={agreementDraft.status}
        open={reviewCycle === SCORECARD_TAB.name}
        setReviewCycle={setReviewCycle}
      />
      <StepStage
        index={2}
        title={QUARTER2_TAB.name}
        status={quarter2Review.status}
        open={reviewCycle === QUARTER2_TAB.name}
        setReviewCycle={setReviewCycle}
      />
      <StepStage
        index={3}
        title={QUARTER4_TAB.name}
        status={quarter4Review.status}
        open={reviewCycle === QUARTER4_TAB.name}
        setReviewCycle={setReviewCycle}
      />
    </div>
  );
});

const CompanyScorecard = observer(() => {
  const { store, api, ui } = useAppContext();
  const { fyid } = useParams();
  const role = store.auth.role;
  const me = store.auth.meJson;
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [exportingExcelFile, setExportingExcelFile] = useState(false);
  const [exportingPDFFile, setExportingPDFFile] = useState(false);
  const [duplicateLoading, setDuplicateLoading] = useState(false);

  const [docTitle, setTitle] = useTitle();
  const [cycle, setCycle] = useState<IReviewCycleType>(SCORECARD_TAB.name);
  useBackButton("/c/strategy/company/");

  const scorecard = store.scorecard.getItemById(`${fyid}`);
  const agreement = useCompanyScorecardMetadata(`${fyid}`);
  const currentScorecardId = store.scorecard.currentId;

  const objectives = store.companyObjective.all;
  const measures = store.companyMeasure.all;

  const title = `Company Scorecard ${scorecard?.asJson.description}`;
  const strategicObjectives = objectives.map((o) => o.asJson) || [];
  const _measures = measures.map((o) => o.asJson) || [];

  const hasAccess = useMemo(() => role === USER_ROLES.HR_USER || role === USER_ROLES.MD_USER || role === USER_ROLES.GUEST_USER || role === USER_ROLES.EXECUTIVE_USER, [role]);

  const handleObjectives = async () => {
    if (!currentScorecardId || !me) {
      ui.snackbar.load({
        id: Date.now(),
        message: "Error! Invalid scorecard path.",
        type: "danger",
      });
      return;
    }
    for (const objective of objectives) {
      const $objective: IObjectiveCompany = {
        department: me.department,
        createdAt: Date.now(),
        draftComment: "",
        midComment: "",
        assessComment: "",
        id: objective.asJson.id,
        uid: me.uid!,
        userName: me.displayName!,
        parent: objective.asJson.parent,
        theme: objective.asJson.theme,
        perspective: objective.asJson.perspective,
        description: objective.asJson.description,
        division: me.division,
        weight: objective.asJson.weight
      }
      await api.companyObjective.duplicate($objective)

    }
  }

  const handleMeasures = async () => {
    if (!currentScorecardId) {
      ui.snackbar.load({
        id: Date.now(),
        message: "Error! Invalid scorecard path.",
        type: "danger",
      });
      return;
    }
    for (const measure of measures) {
      const $measure: IMeasureCompany = {
        id: "",
        uid: measure.asJson.uid,
        userName: measure.asJson.userName,
        objective: measure.asJson.objective,
        department: me!.department,
        perspective: measure.asJson.perspective,
        description: measure.asJson.description,

        comments: "",
        midtermComments: "",
        assessmentComments: "",
        activities: "",
        baseline: measure.asJson.baseline,

        rating1: measure.asJson.rating1,
        rating2: measure.asJson.rating2,
        rating3: measure.asJson.rating3,
        rating4: measure.asJson.rating4,
        rating5: measure.asJson.rating5,

        quarter1Actual: 0,
        quarter2Actual: 0,
        quarter3Actual: 0,
        quarter4Actual: 0,

        annualTarget: measure.asJson.annualTarget,
        annualActual: null,

        weight: measure.asJson.weight,
        dataType: measure.asJson.dataType,
        dataSymbol: measure.asJson.dataSymbol,
        symbolPos: measure.asJson.symbolPos,

        sourceOfEvidence: "",
        targetDate: "",

        isUpdated: false,

        statusUpdate: "",
        quarter1Target: null,
        quarter2Target: null,
        quarter3Target: null,
        quarter4Target: null,

        rating: 0,
        q2supervisorRating: null,
        q2FinalRating: null,
        q4rating: 0,
        q4supervisorRating: null,
        q4FinalRating: null
      }
      await api.companyMeasure.duplicate($measure)
    }
  }

  const handleDuplicateScorecard = async () => {
    setDuplicateLoading(true);
    try {
      await handleObjectives()
      await handleMeasures()

    } catch (error) {
      console.log(error);
      ui.snackbar.load({
        id: Date.now(),
        message: "Error! Failed to duplicate scorecard.",
        type: "danger",
      });
    }
    setDuplicateLoading(false);
  };

  const handleExportPDF = async () => {
    try {
      setExportingPDFFile(true);
      await generateCompanyPerformanceAgreementPDF(title, strategicObjectives, _measures);
      setExportingPDFFile(false);
    } catch (error) {
      ui.snackbar.load({
        id: Date.now(),
        message: "Error! Failed to export company scorecard.",
        type: "danger",
      });
    }
  };

  const handleExportExcel = async () => {
    try {
      setExportingExcelFile(true);
      await exportCompanyExcelScorecard(title, strategicObjectives, _measures);
      setExportingExcelFile(false);
    } catch (error) {
      console.log(error);
      ui.snackbar.load({
        id: Date.now(),
        message: "Error! Failed to export company scorecard in excel format.",
        type: "danger",
      });
    }
  };

  const handleFeedback = () => {
    showModalFromId(MODAL_NAMES.EXECUTION.READ_SCORECARD_COMMENT_MODAL);
  };

  useEffect(() => {
    if (scorecard) {
      setTitle(title);
      document.title = docTitle
    }
    else navigate("/c/strategy/company/");
  }, [docTitle, navigate, scorecard, setTitle, title]);

  useEffect(() => {
    const loadAll = async () => {
      if (!fyid) {
        ui.snackbar.load({
          id: Date.now(),
          message: "Error! Cannot find scorecard.",
          type: "danger",
        });
        return;
      }
      setLoading(true);
      try {
        await api.companyMeasure.getAll(fyid);
        await api.companyObjective.getAll(fyid);
      } catch (error) {
        ui.snackbar.load({
          id: Date.now(),
          message: "Error! Failed to load data.",
          type: "danger",
        });
      }
      setLoading(false);
    };

    loadAll();
  }, [api.companyMeasure, api.companyObjective, fyid, ui.snackbar]);

  if (!scorecard) return <></>;

  return (
    <ErrorBoundary>
      <ErrorBoundary>
        <div className="scorecard-page">
          <ReviewCycleTabs
            batch={scorecard.asJson}
            reviewCycle={cycle}
            setReviewCycle={setCycle}
          />
        </div>
      </ErrorBoundary>

      {!loading && (
        <ErrorBoundary>
          {cycle === SCORECARD_TAB.name && (
            <CompanyScorecardDraftCycle
              agreement={agreement}
              objectives={objectives}
              hasAccess={hasAccess}
              handleExportPDF={handleExportPDF}
              handleExportExcel={handleExportExcel}
              handleFeedback={handleFeedback}
              exportingExcelFile={exportingExcelFile}
              exportingPDFFile={exportingPDFFile}
              handleDuplicateScorecard={handleDuplicateScorecard}
              duplicateLoading={duplicateLoading}
            />
          )}
          {cycle === QUARTER2_TAB.name && (
            <CompanyScorecardQ2Cycle
              agreement={agreement}
              objectives={objectives}
              hasAccess={hasAccess}
              handleExportPDF={handleExportPDF}
              handleExportExcel={handleExportExcel}
              handleFeedback={handleFeedback}
              exportingExcelFile={exportingExcelFile}
              exportingPDFFile={exportingPDFFile}
              handleDuplicateScorecard={handleDuplicateScorecard}
              duplicateLoading={duplicateLoading}
            />
          )}
          {cycle === QUARTER4_TAB.name && (
            <CompanyScorecardQ4Cycle
              agreement={agreement}
              objectives={objectives}
              hasAccess={hasAccess}
              handleExportPDF={handleExportPDF}
              handleExportExcel={handleExportExcel}
              handleFeedback={handleFeedback}
              exportingExcelFile={exportingExcelFile}
              exportingPDFFile={exportingPDFFile}
              handleDuplicateScorecard={handleDuplicateScorecard}
              duplicateLoading={duplicateLoading}
            />
          )}
        </ErrorBoundary>
      )}
      <ErrorBoundary>{loading && <LoadingEllipsis />}</ErrorBoundary>
      <ErrorBoundary>
        <Modal modalId={MODAL_NAMES.EXECUTION.READ_SCORECARD_COMMENT_MODAL}>
          <ReadScorecardCommentModal agreement={agreement} />
        </Modal>
        <Modal modalId={MODAL_NAMES.EXECUTION.MEASURE_COMMENTS_COMPANY_MODAL}>
          <MeasureCompanyCommentsModal />
        </Modal>
        <Modal modalId={MODAL_NAMES.EXECUTION.MEASURE_COMMENTS_COMPANY_MIDTERM_MODAL}>
          <MeasureCompanyMidermCommentsModal />
        </Modal>
        <Modal modalId={MODAL_NAMES.EXECUTION.MEASURE_COMMENTS_COMPANY_ASSESSMENT_MODAL}>
          <MeasureCompanyAssessmentCommentsModal />
        </Modal>
        <Modal modalId={MODAL_NAMES.EXECUTION.OBJECTIVE_MODAL}>
          <ObjectiveCompanyModal />
        </Modal>
      </ErrorBoundary>
    </ErrorBoundary>
  );
});

export default CompanyScorecard;
