import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import useTitle from "../../shared/hooks/useTitle";
import { observer } from "mobx-react-lite";
import { useAppContext } from "../../shared/functions/Context";
import useBackButton from "../../shared/hooks/useBack";
import { IReviewCycleStatus, IReviewCycleType, IScorecardBatch, } from "../../shared/models/ScorecardBatch";
import { QUARTER4_TAB, SCORECARD_TAB, QUARTER2_TAB } from "../../shared/interfaces/IReviewCycleTabs";
import useIndividualScorecard from "../../shared/hooks/useIndividualScorecard";
import IndividualScorecardTeamDraftCycle from "./IndividualScorecardTeamDraftCycle";
import ErrorBoundary from "../../shared/components/error-boundary/ErrorBoundary";
import { useParams, useNavigate } from "react-router-dom";
import Modal from "../../shared/components/Modal";
import MODAL_NAMES from "../dialogs/ModalName";
import TeamObjectiveModal from "./objective-team-modal/TeamObjectiveModal";
import NoScorecardData from "../shared/components/no-scorecard-data/NoScorecardData";
import PerspectiveTeamWeightModal from "./perspective-team-weight/PerspectiveTeamWeightModal";
import { LoadingEllipsis } from "../../shared/components/loading/Loading";
import { generateIndividualPerformanceAgreementPDF } from "../../shared/functions/scorecard-pdf/GeneratePerformaneAgreementPDF";
import { exportEmployeeExcelScorecard } from "../shared/functions/Excel";
import { IScorecardMetadata } from "../../shared/models/ScorecardMetadata";
import { IScorecardArchive } from "../../shared/models/ScorecardArchive";

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

interface IReviewStepProps {
  batch: IScorecardBatch;
  reviewCycle: IReviewCycleType;
  setReviewCycle: React.Dispatch<React.SetStateAction<IReviewCycleType>>;
  agreement: IScorecardMetadata;
}
const ReviewCycleTabs = observer((props: IReviewStepProps) => {
  const { agreement, batch, reviewCycle, setReviewCycle } = props;

  const {
    agreementDraft,
    quarter1Review,
    quarter2Review,
    quarter3Review,
    quarter4Review,
  } = agreement;

  const firstRender = useRef(true);

  // check status condition and update the status progress
  useEffect(() => {
    if (!firstRender.current) return;
    firstRender.current = false;

    // if first render, open the stage after complete.
    (batch.draftReview.status === "approved" ||
      batch.draftReview.status === "cancelled") &&
      setReviewCycle("Midterm Reviews");
    (batch.quarter1Review.status === "approved" ||
      batch.quarter1Review.status === "cancelled") &&
      setReviewCycle("Midterm Reviews");
    (batch.midtermReview.status === "approved" ||
      batch.midtermReview.status === "cancelled") &&
      setReviewCycle("Assessment");
    (batch.quarter3Review.status === "approved" ||
      batch.quarter3Review.status === "cancelled") &&
      setReviewCycle("Assessment");

    // if first render, open the stage with status in-progress.
    agreementDraft.status === "pending" && setReviewCycle("Scorecard");
    quarter1Review.status === "in-progress" &&
      setReviewCycle("Midterm Reviews");
    quarter2Review.status === "in-progress" &&
      setReviewCycle("Midterm Reviews");
    quarter3Review.status === "in-progress" && setReviewCycle("Assessment");
    quarter4Review.status === "in-progress" && setReviewCycle("Assessment");
  }, [
    agreement,
    agreementDraft.status,
    batch,
    quarter1Review.status,
    quarter2Review.status,
    quarter3Review.status,
    quarter4Review.status,
    reviewCycle,
    setReviewCycle,
  ]);

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

const IndividualScorecardTeamLoad = observer(() => {
  const [cycle, setCycle] = useState<IReviewCycleType>(SCORECARD_TAB.name);
  const { store, api, ui } = useAppContext();
  const { uid } = useParams();

  const me = store.auth.meJson;
  const user = store.user.selected;
  const scorecard = store.scorecard.active;

  const [archiving, setArchiving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [docTitle, setTitle] = useTitle("People");

  const navigate = useNavigate();
  const agreement = useIndividualScorecard(uid);

  useBackButton("/c/scorecards/people/");

  const objectives = store.objective.getByUid(uid!);
  const measures = store.measure.getByUid(uid!);
  const measureAudits = store.measureAudit.getByUid(uid!);

  const title = `${user?.displayName} ${scorecard?.description} Scorecard`;
  const strategicObjectives = [...store.companyObjective.all.map((o) => o.asJson),] || [];
  const contributoryObjectives = objectives.map((o) => o.asJson) || [];
  const allmeasures = measures.map((o) => o.asJson) || [];

  const deleteObjectives = async () => {
    for (const objective of objectives) {
      await api.objective.delete(objective.asJson);
    }
  };

  const deleteMeasures = async () => {
    for (const measure of measures) {
      await api.measure.delete(measure.asJson);
    }
  };

  const deleteMeasuresAudits = async () => {
    for (const measureAudit of measureAudits) {
      await api.measureAudit.delete(measureAudit.asJson);
    }
  };

  const onArchive = async (archive: IScorecardArchive) => {
    try {
      await api.scorecardaArchive.create(archive);
      await deleteObjectives();
      await deleteMeasures();
      await deleteMeasuresAudits();
      await api.individualScorecard.delete(agreement);
      ui.snackbar.load({
        id: Date.now(),
        message: "Scorecard Archived.",
        type: "success",
      });
    } catch (error) {
      ui.snackbar.load({
        id: Date.now(),
        message: "Error! Failed to archive scorecard.",
        type: "danger",
      });
    }
  };

  const onArchiveScorecard = async () => {
    if (!window.confirm("This action cannot be undone, the data will be moved to the archive folder.")) return;
    setArchiving(true)
    const _objectives = objectives.map((o) => o.asJson);
    const _measures = measures.map((m) => m.asJson);
    const _measureAudits = measureAudits.map((m) => m.asJson);

    const $archive: IScorecardArchive = {
      uid: user!.uid,
      displayName: user!.displayName,
      archiverUid: me!.uid,
      archiverDisplayName: me!.displayName,
      objectives: _objectives,
      measures: _measures,
      measureAudits: _measureAudits,
      isLocked: false
    };
    await onArchive($archive)
    setArchiving(false)
  };

  const enableEditing = useMemo(() => {
    const isEditing = agreement.agreementDraft.status === "pending" || agreement.agreementDraft.status === "in-progress"
    return !isEditing;
  }, [agreement.agreementDraft.status]);

  // Export reports
  const handleExportPDF = async () => {
    try {
      generateIndividualPerformanceAgreementPDF(title, strategicObjectives, contributoryObjectives, allmeasures);
    } catch (error) {
      ui.snackbar.load({
        id: Date.now(),
        message: "Error! Failed to export.",
        type: "danger",
      });
    }
  };

  const handleExportExcel = async () => {
    try {
      await exportEmployeeExcelScorecard(title, strategicObjectives, contributoryObjectives, allmeasures);
    } catch (error) {
      ui.snackbar.load({
        id: Date.now(),
        message: "Error! Failed to export.",
        type: "danger",
      });

      console.log(error);

    }
  };

  const setPageTitle = useCallback(() => {
    user ? setTitle(`Scorecard for ${user.displayName}`) : navigate("/c/scorecards/people/");
    document.title = docTitle
  }, [user, setTitle, navigate, docTitle]);

  useEffect(() => {
    const load = async () => {
      if (!uid) return;
      setLoading(true); // start loading
      await api.objective.getAll(uid); // load objectives
      await api.measure.getAll(uid); // load measures
      setLoading(false); // end loading
    };
    load();
  }, [api.measure, api.objective, uid]);

  useEffect(() => {
    setPageTitle();
  }, [setPageTitle]);

  if (!scorecard) return <></>;

  return (
    <ErrorBoundary>
      <ErrorBoundary>
        <div className="scorecard-page">
          {agreement && (
            <ReviewCycleTabs
              batch={scorecard}
              reviewCycle={cycle}
              setReviewCycle={setCycle}
              agreement={agreement}
            />
          )}
        </div>
      </ErrorBoundary>

      {!loading && (
        <ErrorBoundary>
          {uid && cycle === SCORECARD_TAB.name && (
            <IndividualScorecardTeamDraftCycle
              uid={uid}
              enableEditing={enableEditing}
              agreement={agreement}
              objectives={objectives}
              handleExportExcel={handleExportExcel}
              handleExportPDF={handleExportPDF}
              onArchiveScorecard={onArchiveScorecard}
              archiving={archiving}
            />
          )}
          {cycle === QUARTER2_TAB.name && (
            <NoScorecardData
              title="No data."
              subtitle="THIS IS FOR LOADING PURPOSES ONLY."
            />
          )}
          {cycle === QUARTER4_TAB.name && (
            <NoScorecardData
              title="No data."
              subtitle="THIS IS FOR LOADING PURPOSES ONLY."
            />
          )}
        </ErrorBoundary>
      )}
      <ErrorBoundary>{loading && <LoadingEllipsis />}</ErrorBoundary>
      <ErrorBoundary>
        <Modal modalId={MODAL_NAMES.TEAM.TEAM_OBJECTIVE_MODAL}>
          <TeamObjectiveModal />
        </Modal>
        <Modal modalId={MODAL_NAMES.TEAM.TEAM_PERSPECTIVE_MODAL}>
          <PerspectiveTeamWeightModal />
        </Modal>
      </ErrorBoundary>
    </ErrorBoundary>
  );
});

export default IndividualScorecardTeamLoad;
// Muso153324