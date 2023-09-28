import { useEffect, useMemo, useState } from "react";
import useTitle from "../../shared/hooks/useTitle";
import Modal from "../../shared/components/Modal";
import MODAL_NAMES from "../dialogs/ModalName";
import ObjectiveModal from "../dialogs/objective/ObjectiveModal";
import ScorecardModal from "../dialogs/view-past-scorecards/ScorecardModal";
import { observer } from "mobx-react-lite";
import { useAppContext } from "../../shared/functions/Context";
import useBackButton from "../../shared/hooks/useBack";
import { IReviewCycleStatus, IReviewCycleType } from "../../shared/models/ScorecardBatch";
import { QUARTER4_TAB, SCORECARD_TAB, QUARTER2_TAB } from "../../shared/interfaces/IReviewCycleTabs";
import useIndividualScorecard from "../../shared/hooks/useIndividualScorecard";
import IndividualScorecardQ4Cycle from "./IndividualScorecardQ4Cycle";
import IndividualScorecardQ2Cycle from "./IndividualScorecardQ2Cycle";
import IndividualScorecardDraftCycle from "./IndividualScorecardDraftCycle";
import ErrorBoundary from "../../shared/components/error-boundary/ErrorBoundary";
import PerspectiveWeightModal from "../dialogs/perspective-weight/PerspectiveWeightModal";
import MeasureFilesModal from "../dialogs/measure-files/MeasureFilesModal";
import ReadScorecardCommentModal from "../dialogs/read-scorecard-comment/ReadScorecardCommentModal";
import showModalFromId from "../../shared/functions/ModalShow";
import { generateIndividualPerformanceAgreementPDF } from "../../shared/functions/scorecard-pdf/GeneratePerformaneAgreementPDF";
import { exportEmployeeExcelScorecard } from "../shared/functions/Excel";
import MeasureCommentsModal from "../dialogs/measure-comments/MeasureCommentsModal";
import MeasureCommentsMidtermModal from "../dialogs/measure-comments-midterm/MeasureCommentsMidtermModal";
import MeasureCommentsAssessmentModal from "../dialogs/measure-comments-assessment/MeasureCommentsAssessmentModal";
import { IMeasure } from "../../shared/models/Measure";
import { IObjective } from "../../shared/models/Objective";
import MeasureReadOnlyModal from "../dialogs/measure-read-only-modal/MeasureReadOnlyModal";

interface IStepStageProps {
  open?: boolean;
  status?: IReviewCycleStatus;
  index: number;
  title: IReviewCycleType;
  tooltip?: string;
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
        title={props.tooltip || props.title}
      >
        <div className="step--stage__bubble">
          <div className="step--stage__bubble__content">
            {status === "pending" && (
              <span className="icon" style={{ fontSize: "1.2rem" }}>
                ◔
              </span>
            )}
            {status === "in-progress" && (
              <span className="icon" style={{ fontSize: "1.2rem" }}>
                ◔
              </span>
            )}
            {status === "submitted" && (
              <span className="icon" style={{ fontSize: "1.2rem" }}>
                ◔
              </span>
            )}
            {(status === "reverted" || status === "cancelled") && (
              <span className="icon" style={{ fontSize: "1.2rem" }}>
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

interface IReviewStepProps {
  reviewCycle: IReviewCycleType;
  setReviewCycle: React.Dispatch<React.SetStateAction<IReviewCycleType>>;
}
const ReviewCycleTabs = observer((props: IReviewStepProps) => {
  const { reviewCycle, setReviewCycle } = props;
  const agreement = useIndividualScorecard();
  const { agreementDraft, quarter2Review, quarter4Review } = agreement;

  const cycle: IReviewCycleType = useMemo(() => {
    const ads = agreementDraft.status;
    const ams = quarter2Review.status;

    if (ads === "pending" || ads === "submitted") return "Scorecard";
    else if (ads === "approved" && (ams === "pending" || ams === "in-progress" || ams === "submitted"))
      return "Midterm Reviews";
    else if (ams === "approved") return "Assessment";
    else return "Scorecard";
  }, [agreementDraft.status, quarter2Review.status]);

  useEffect(() => {
    setReviewCycle(cycle);
  }, [cycle, setReviewCycle]);

  return (
    <ErrorBoundary>
      <div className="step">
        <StepStage
          index={1}
          title={SCORECARD_TAB.name}
          status={agreementDraft.status}
          open={reviewCycle === SCORECARD_TAB.name}
          setReviewCycle={setReviewCycle}
          tooltip="Draft your scorecard"
        />
        <StepStage
          index={2}
          title={QUARTER2_TAB.name}
          status={quarter2Review.status}
          open={reviewCycle === QUARTER2_TAB.name}
          setReviewCycle={setReviewCycle}
          tooltip="Update your midterm progress"
        />
        <StepStage
          index={3}
          title={QUARTER4_TAB.name}
          status={quarter4Review.status}
          open={reviewCycle === QUARTER4_TAB.name}
          setReviewCycle={setReviewCycle}
          tooltip="Update your final progress"
        />
      </div>
    </ErrorBoundary>
  );
});

const IndividualScorecard = observer(() => {
  const { store, api, ui } = useAppContext();
  const [cycle, setCycle] = useState<IReviewCycleType>(SCORECARD_TAB.name);
  const [_, setTitle] = useTitle(); // set page title
  useBackButton();

  const [duplicateLoading, setDuplicateLoading] = useState(false);
  const [exportingExcelFile, setExportingExcelFile] = useState(false);
  const [exportingPDFFile, setExportingPDFFile] = useState(false);

  const me = store.auth.meJson;
  const agreement = useIndividualScorecard(me!.uid);

  const objectives = store.objective.allMe;
  const measures = store.measure.allMe;
  const scorecard = store.scorecard.active;
  const currentScorecardId = store.scorecard.currentId;

  const strategicObjectives = [...store.companyObjective.all.map((o) => o.asJson),] || [];
  const contributoryObjectives = objectives.map((o) => o.asJson) || [];
  const allMeasures = measures.map((o) => o.asJson) || [];

  const handleExportPDF = async () => {
    if (!scorecard) return;
    const title = `${me?.displayName} ${scorecard.description} Scorecard`;
    try {
      setExportingPDFFile(true);
      generateIndividualPerformanceAgreementPDF(title, strategicObjectives, contributoryObjectives, allMeasures);
      setExportingPDFFile(false);
    } catch (error) {
      setExportingPDFFile(false);
      ui.snackbar.load({
        id: Date.now(),
        message: "Error! Failed to export.",
        type: "danger",
      });
    }
  };

  const handleExportExcel = async () => {
    if (!scorecard) return;
    const title = `${me?.displayName} ${scorecard.description} Scorecard`;
    try {
      setExportingExcelFile(true);
      await exportEmployeeExcelScorecard(title, strategicObjectives, contributoryObjectives, allMeasures);
      setExportingExcelFile(false);
    } catch (error) {
      setExportingExcelFile(false);
      ui.snackbar.load({
        id: Date.now(),
        message: "Error! Failed to export.",
        type: "danger",
      });
    }
  };

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
      const $objective: IObjective = {
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
        division: objective.asJson.division,
        weight: objective.asJson.weight
      }
      await api.objective.duplicate($objective)
      await new Promise((resolve) => setTimeout(resolve, 3000));

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
      const $measure: IMeasure = {
        id: measure.asJson.id,
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

        supervisorRating: null,
        supervisorRating2: null,

        finalRating: null,
        finalRating2: null,

        autoRating: 0,
        autoRating2: 0,
        isUpdated: false,
      }
      await api.measure.duplicate($measure)
      await new Promise((resolve) => setTimeout(resolve, 3000));
    }
  }


  const handleDuplicateScorecard = async () => {
    setDuplicateLoading(true);
    try {
      await handleObjectives()
      await handleMeasures()
    } catch (error) {
      ui.snackbar.load({
        id: Date.now(),
        message: "Error! Failed to duplicate scorecard.",
        type: "danger",
      });
    }
    setDuplicateLoading(false);
  };

  const handleScorecards = () => {
    showModalFromId(MODAL_NAMES.EXECUTION.SCORECARD_MODAL);
  };

  const handleFeedback = () => {
    showModalFromId(MODAL_NAMES.EXECUTION.READ_SCORECARD_COMMENT_MODAL);
  };

  useEffect(() => {
    const setPageTitle = () => {
      scorecard ? setTitle(`My Scorecard ${scorecard.description}`) : setTitle("My Scorecard");
    };
    setPageTitle();
  }, [scorecard, setTitle]);

  return (
    <ErrorBoundary>
      <ErrorBoundary>
        <div className="scorecard-page">
          <ReviewCycleTabs reviewCycle={cycle} setReviewCycle={setCycle} />
        </div>
      </ErrorBoundary>

      <ErrorBoundary>
        {cycle === SCORECARD_TAB.name &&
          <IndividualScorecardDraftCycle
            agreement={agreement}
            objectives={objectives}
            measures={measures}
            handleExportExcel={handleExportExcel}
            handleExportPDF={handleExportPDF}
            handleFeedback={handleFeedback}
            handleScorecards={handleScorecards}
            exportingExcelFile={exportingExcelFile}
            exportingPDFFile={exportingPDFFile}
            handleDuplicateScorecard={handleDuplicateScorecard}
            duplicateLoading={duplicateLoading}
          />}
        {cycle === QUARTER2_TAB.name &&
          <IndividualScorecardQ2Cycle
            agreement={agreement}
            measures={measures}
            objectives={objectives}
            handleExportExcel={handleExportExcel}
            handleExportPDF={handleExportPDF}
            handleFeedback={handleFeedback}
            handleScorecards={handleScorecards}
            exportingExcelFile={exportingExcelFile}
            exportingPDFFile={exportingPDFFile}
            handleDuplicateScorecard={handleDuplicateScorecard}
            duplicateLoading={duplicateLoading}
          />}
        {cycle === QUARTER4_TAB.name &&
          <IndividualScorecardQ4Cycle
            agreement={agreement}
            measures={measures}
            objectives={objectives}
            handleExportExcel={handleExportExcel}
            handleExportPDF={handleExportPDF}
            handleFeedback={handleFeedback}
            handleScorecards={handleScorecards}
            exportingExcelFile={exportingExcelFile}
            exportingPDFFile={exportingPDFFile}
            handleDuplicateScorecard={handleDuplicateScorecard}
            duplicateLoading={duplicateLoading}
          />}
      </ErrorBoundary>
      <ErrorBoundary>
        <Modal modalId={MODAL_NAMES.EXECUTION.OBJECTIVE_MODAL}>
          <ObjectiveModal />
        </Modal>
        <Modal modalId={MODAL_NAMES.EXECUTION.SCORECARD_MODAL}>
          <ScorecardModal />
        </Modal>
        <Modal modalId={MODAL_NAMES.EXECUTION.PERSPECTIVE_WEIGHTS_MODAL}>
          <PerspectiveWeightModal />
        </Modal>
        <Modal modalId={MODAL_NAMES.EXECUTION.MEASURE_FILES_MODAL}>
          <MeasureFilesModal />
        </Modal>
        {/* approval/rejections comments*/}
        <Modal modalId={MODAL_NAMES.EXECUTION.READ_SCORECARD_COMMENT_MODAL}>
          <ReadScorecardCommentModal agreement={agreement} />
        </Modal>
        {/* measure comments */}
        <Modal modalId={MODAL_NAMES.EXECUTION.MEASURE_READ_ONLY_MODAL}>
          <MeasureReadOnlyModal />
        </Modal>
        <Modal modalId={MODAL_NAMES.EXECUTION.MEASURE_COMMENTS_MIDTERM_MODAL}>
          <MeasureCommentsMidtermModal />
        </Modal>
        <Modal modalId={MODAL_NAMES.EXECUTION.MEASURE_COMMENTS_ASSESSMENT_MODAL}>
          <MeasureCommentsAssessmentModal />
        </Modal>
        <Modal modalId={MODAL_NAMES.EXECUTION.MEASURE_COMMENTS_MODAL}>
          <MeasureCommentsModal />
        </Modal>
      </ErrorBoundary>
    </ErrorBoundary>
  );
});

export default IndividualScorecard;