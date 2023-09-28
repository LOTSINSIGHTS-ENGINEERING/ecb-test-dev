import { useEffect, useRef, useState } from "react";
import useTitle from "../../shared/hooks/useTitle";
import Modal from "../../shared/components/Modal";
import MODAL_NAMES from "../dialogs/ModalName";
import { observer } from "mobx-react-lite";
import { useAppContext } from "../../shared/functions/Context";
import { LoadingEllipsis } from "../../shared/components/loading/Loading";
import { useNavigate, useParams } from "react-router-dom";
import useBackButton from "../../shared/hooks/useBack";
import { SCORECARD_TAB, QUARTER2_TAB, QUARTER4_TAB, } from "../../shared/interfaces/IReviewCycleTabs";
import { IReviewCycleStatus, IReviewCycleType, IScorecardBatch, } from "../../shared/models/ScorecardBatch";
import useIndividualScorecard from "../../shared/hooks/useIndividualScorecard";
import EmployeeQ4ReviewCycle from "./EmployeeQ4ReviewCycle";
import EmployeeQ2ReviewCycle from "./EmployeeQ2ReviewCycle";
import EmployeeDraftCycle from "./EmployeeDraftCycle";
import ErrorBoundary from "../../shared/components/error-boundary/ErrorBoundary";
import useEmployeeScorecard from "../../shared/hooks/useEmployeeScorecard";
import { generateIndividualPerformanceAgreementPDF } from "../../shared/functions/scorecard-pdf/GeneratePerformaneAgreementPDF";
import { exportEmployeeExcelScorecard } from "../shared/functions/Excel";
import MeasureCommentsModal from "../dialogs/measure-comments/MeasureCommentsModal";
import MeasureCommentsAssessmentModal from "../dialogs/measure-comments-assessment/MeasureCommentsAssessmentModal";
import MeasureCommentsMidtermModal from "../dialogs/measure-comments-midterm/MeasureCommentsMidtermModal";
import MeasureReadOnlyModal from "../dialogs/measure-read-only-modal/MeasureReadOnlyModal";
import { IMeasure } from "../../shared/models/Measure";
import { IObjective } from "../../shared/models/Objective";

interface IStepStageProps {
  open?: boolean;
  status?: IReviewCycleStatus;
  index: number;
  title: IReviewCycleType;
  setCycle: React.Dispatch<React.SetStateAction<IReviewCycleType>>;
}
const StepStage = (props: IStepStageProps) => {
  const status = props.status || "pending";
  const open = props.open ? "open" : "closed";
  const className = `step--stage step--stage__${status} step--stage__${open}`;

  return (
    <button className={className} onClick={() => props.setCycle(props.title)}>
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
  );
};

interface IReviewStepProps {
  batch: IScorecardBatch;
  cycle: IReviewCycleType;
  setCycle: React.Dispatch<React.SetStateAction<IReviewCycleType>>;
}
const ReviewCycles = observer((props: IReviewStepProps) => {
  const { cycle, setCycle, batch } = props;
  const { uid } = useParams();
  const { agreement } = useEmployeeScorecard(uid);
  const { agreementDraft, quarter2Review, quarter4Review } = agreement;

  const firstRender = useRef(true);

  // check unsaved changes
  useEffect(() => {
    if (!firstRender.current) return;
    firstRender.current = false;

    // if first render, open the stage after complete.
    (batch.draftReview.status === "approved" ||
      batch.draftReview.status === "cancelled") &&
      setCycle("Midterm Reviews");
    (batch.quarter1Review.status === "approved" ||
      batch.quarter1Review.status === "cancelled") &&
      setCycle("Midterm Reviews");
    (batch.midtermReview.status === "approved" ||
      batch.midtermReview.status === "cancelled") &&
      setCycle("Assessment");
    (batch.quarter3Review.status === "approved" ||
      batch.quarter3Review.status === "cancelled") &&
      setCycle("Assessment");

    // if first render, open the stage with status in-progress.
    agreementDraft.status === "in-progress" && setCycle("Scorecard");
    quarter2Review.status === "in-progress" && setCycle("Midterm Reviews");
    quarter4Review.status === "in-progress" && setCycle("Assessment");
  }, [
    agreementDraft.status,
    batch,
    quarter2Review.status,
    quarter4Review.status,
    cycle,
    setCycle,
  ]);

  return (
    <div className="step">
      <StepStage
        index={1}
        title={SCORECARD_TAB.name}
        status={agreementDraft.status}
        open={cycle === SCORECARD_TAB.name}
        setCycle={setCycle}
      />
      <StepStage
        index={2}
        title={QUARTER2_TAB.name}
        status={quarter2Review.status}
        open={cycle === QUARTER2_TAB.name}
        setCycle={setCycle}
      />
      <StepStage
        index={3}
        title={QUARTER4_TAB.name}
        status={quarter4Review.status}
        open={cycle === QUARTER4_TAB.name}
        setCycle={setCycle}
      />
    </div>
  );
});


const EmployeeScorecardView = observer(() => {
  const { store, api, ui } = useAppContext();
  const { uid } = useParams();
  const [cycle, setCycle] = useState<IReviewCycleType>(SCORECARD_TAB.name);
  const [loading, setLoading] = useState(false);
  const [_, setTitle] = useTitle(""); // set page title
  const [exporting, setExporting] = useState(false);
  const [duplicateLoading, setDuplicateLoading] = useState(false);

  const objectives = store.objective.getByUid(uid!);
  const measures = store.measure.getByUid(uid!);

  const scorecard = store.scorecard.active;
  const selectedUser = store.user.selected;
  const currentUser = store.auth.meJson;
  const currentScorecardId = store.scorecard.currentId;

  const agreement = useIndividualScorecard(uid);

  useBackButton("/c/scorecards/supervision/");
  const navigate = useNavigate();

  const handleObjectives = async () => {
    if (!currentScorecardId || !selectedUser) {
      ui.snackbar.load({
        id: Date.now(),
        message: "Error! Invalid scorecard path.",
        type: "danger",
      });
      return;
    }
    for (const objective of objectives) {
      const $objective: IObjective = {
        department: selectedUser.department,
        createdAt: Date.now(),
        draftComment: "",
        midComment: "",
        assessComment: "",
        id: objective.asJson.id,
        uid: selectedUser.uid!,
        userName: selectedUser.displayName!,
        parent: objective.asJson.parent,
        theme: objective.asJson.theme,
        perspective: objective.asJson.perspective,
        description: objective.asJson.description,
        division: objective.asJson.division,
        weight: objective.asJson.weight
      }
      await api.objective.duplicate($objective)
      // console.log($objective);
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
        department: selectedUser!.department,
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
      // console.log($measure);
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


  const handleExportPDF = async () => {
    if (!scorecard || !uid) return;
    const title = `${selectedUser?.displayName} ${scorecard.description} Scorecard`;

    const strategicObjectives = [...store.companyObjective.all.map((o) => o.asJson),] || [];
    const contributoryObjectives = objectives.map((o) => o.asJson) || [];
    const allMeasures = measures.map((o) => o.asJson) || [];

    try {
      setExporting(true);
      generateIndividualPerformanceAgreementPDF(title, strategicObjectives, contributoryObjectives, allMeasures);
    } catch (error) {
      ui.snackbar.load({
        id: Date.now(),
        message:
          "Error! Failed to export.",
        type: "danger",
      });
    }
    setExporting(false);
  };

  const handleExportExcel = async () => {
    if (!scorecard || !uid) return;

    const title = `${selectedUser?.displayName} ${scorecard.description} Scorecard`;

    const strategicObjectives = [...store.companyObjective.all.map((o) => o.asJson)] || [];
    const contributoryObjectives = objectives.map((o) => o.asJson) || [];
    const allmeasures = measures.map((o) => o.asJson) || [];

    try {
      await exportEmployeeExcelScorecard(title, strategicObjectives, contributoryObjectives, allmeasures);
    } catch (error) {
      ui.snackbar.load({
        id: Date.now(),
        message:
          "Error! Failed to export.",
        type: "danger",
      });
    }
  };

  useEffect(() => {
    const setPageTitle = () => {
      if (!selectedUser) navigate("/c/scorecards/supervision/");
      else setTitle(`Scorecard for ${selectedUser.displayName}`);
    };
    setPageTitle();
  }, [navigate, setTitle, selectedUser]);

  useEffect(() => {
    const load = async () => {
      if (!uid) return;
      setLoading(true);
      await api.objective.getAll(uid);
      await api.measure.getAll(uid);
      setLoading(false);
    };
    load();
  }, [api.measure, api.objective, uid]);

  return (
    <ErrorBoundary>
      <ErrorBoundary>
        <div className="scorecard-page">
          {scorecard && (
            <div className="scorecard-page">
              <ReviewCycles
                batch={scorecard}
                cycle={cycle}
                setCycle={setCycle}
              />
            </div>
          )}
        </div>
      </ErrorBoundary>
      {!loading && (
        <ErrorBoundary>
          {cycle === SCORECARD_TAB.name &&
            <EmployeeDraftCycle
              agreement={agreement}
              handleExportExcel={handleExportExcel}
              handleExportPDF={handleExportPDF}
              measures={measures}
              objectives={objectives}
              exporting={exporting}
              setExporting={setExporting}
              handleDuplicateScorecard={handleDuplicateScorecard}
              duplicateLoading={duplicateLoading}
            />}
          {cycle === QUARTER2_TAB.name &&
            <EmployeeQ2ReviewCycle
              agreement={agreement}
              selectedUser={selectedUser!}
              currentUser={currentUser!}
              measures={measures}
              objectives={objectives}
            />}
          {cycle === QUARTER4_TAB.name &&
            <EmployeeQ4ReviewCycle
              agreement={agreement}
              selectedUser={selectedUser!}
              currentUser={currentUser!}
              measures={measures}
              objectives={objectives}
            />}
        </ErrorBoundary>
      )}
      {/* MEASURE_READ_ONLY_MODAL */}
      {loading && <LoadingEllipsis />}
      <Modal modalId={MODAL_NAMES.EXECUTION.MEASURE_READ_ONLY_MODAL}>
        <MeasureReadOnlyModal />
      </Modal>
      <Modal modalId={MODAL_NAMES.EXECUTION.MEASURE_COMMENTS_MODAL}>
        <MeasureCommentsModal />
      </Modal>
      <Modal modalId={MODAL_NAMES.EXECUTION.MEASURE_COMMENTS_MIDTERM_MODAL}>
        <MeasureCommentsMidtermModal />
      </Modal>
      <Modal modalId={MODAL_NAMES.EXECUTION.MEASURE_COMMENTS_ASSESSMENT_MODAL}>
        <MeasureCommentsAssessmentModal />
      </Modal>
    </ErrorBoundary>
  );
});

export default EmployeeScorecardView;
