import { useEffect, useMemo, useState } from "react";
import useTitle from "../../shared/hooks/useTitle";
import { observer } from "mobx-react-lite";
import { useAppContext } from "../../shared/functions/Context";
import { useNavigate, useParams } from "react-router-dom";
import useBackButton from "../../shared/hooks/useBack";
import ErrorBoundary from "../../shared/components/error-boundary/ErrorBoundary";
import { SCORECARD_TAB, QUARTER2_TAB, QUARTER4_TAB } from "../../shared/interfaces/IReviewCycleTabs";
import { IReviewCycleStatus, IReviewCycleType } from "../../shared/models/ScorecardBatch";
import CompanyScorecardDraftCycle from "./CompanyScorecardReviewDraftCycle";
import { IScorecardMetadata } from "../../shared/models/ScorecardMetadata";
import { LoadingEllipsis } from "../../shared/components/loading/Loading";
import { exportCompanyExcelScorecard } from "../shared/functions/Excel";
import { generateCompanyPerformanceAgreementPDF } from "../../shared/functions/scorecard-pdf/GeneratePerformaneAgreementPDF";
import { USER_ROLES } from "../../shared/functions/CONSTANTS";
import CompanyScorecardQ2Cycle from "./CompanyScorecardReviewQ2Cycle";
import useCompanyScorecardMetadata from "../../shared/hooks/useCompanyScorecardMetadata";
import CompanyScorecardReviewQ4Cycle from "./CompanyScorecardReviewQ4Cycle";
import MeasureCompanyAssessmentCommentsModal from "../dialogs/company-measure-comments-assesment/MeasureCompanyAssessmentCommentsModal";
import MeasureCompanyMidermCommentsModal from "../dialogs/company-measure-comments-midterm/MeasureCompanyMidermCommentsModal";
import MeasureCompanyCommentsModal from "../dialogs/company-measure-comments/MeasureCompanyCommentsModal";
import MODAL_NAMES from "../dialogs/ModalName";
import Modal from "../../shared/components/Modal";

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
                ◔
              </span>
            )}
            {status === "in-progress" && (
              <span className="icon" style={{ fontSize: "1.2rem" }}></span>
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
  agreement: IScorecardMetadata;
  reviewCycle: IReviewCycleType;
  setReviewCycle: React.Dispatch<React.SetStateAction<IReviewCycleType>>;
}
const ReviewCycleTabs = observer((props: IReviewStepProps) => {
  const { agreement, reviewCycle, setReviewCycle } = props;

  const { agreementDraft, quarter2Review, quarter4Review } = agreement;

  const cycle: IReviewCycleType = useMemo(() => {
    const ads = agreementDraft.status;
    const q2r = quarter2Review.status;
    const q3r = quarter4Review.status;

    // Scorecard
    if (ads === "pending" || ads === "submitted") return "Scorecard";
    else if (
      ads === "approved" &&
      (q2r === "pending" || q2r === "in-progress" || q2r === "submitted")
    )
      return "Midterm Reviews";
    else if (
      q2r === "approved" &&
      (q3r === "pending" || q3r === "in-progress" || q3r === "submitted")
    )
      return "Q3 Reviews";
    else if (q3r === "approved") return "Assessment";
    else return "Scorecard";
  }, [agreementDraft.status, quarter2Review.status, quarter4Review.status]);

  useEffect(() => {
    setReviewCycle(cycle);
  }, [cycle, setReviewCycle]);

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
        index={3}
        title={QUARTER2_TAB.name}
        status={quarter2Review.status}
        open={reviewCycle === QUARTER2_TAB.name}
        setReviewCycle={setReviewCycle}
      />

      <StepStage
        index={5}
        title={QUARTER4_TAB.name}
        status={quarter4Review.status}
        open={reviewCycle === QUARTER4_TAB.name}
        setReviewCycle={setReviewCycle}
      />
    </div>
  );
});

const CompanyScorecardReviewView = observer(() => {
  const { api, store, ui } = useAppContext();
  const { fyid } = useParams();
  const scorecard = store.scorecard.getItemById(`${fyid}`);
  const agreement = useCompanyScorecardMetadata(`${fyid}`);
  const [_, setTitle] = useTitle();
  const [cycle, setCycle] = useState<IReviewCycleType>(SCORECARD_TAB.name);
  const [loading, setLoading] = useState(false);

  const objectives = store.companyObjective.all;
  const measures = store.companyMeasure.all;

  const title = `Company Scorecard ${scorecard?.asJson.description}`;
  const strategicObjectives = objectives.map((o) => o.asJson) || [];
  const _measures = measures.map((o) => o.asJson) || [];

  const role = store.auth.role;
  const hasAccess = useMemo(() => role === USER_ROLES.BOARD_MEMBER_USER || role === USER_ROLES.HR_USER, [role]);

  const navigate = useNavigate();
  useBackButton("/c/strategy/company-review/");

  // Export reports
  const handleExportPDF = async () => {
    try {
      generateCompanyPerformanceAgreementPDF(title, strategicObjectives, _measures);
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
      await exportCompanyExcelScorecard(title, strategicObjectives, _measures);
    } catch (error) {
      ui.snackbar.load({
        id: Date.now(),
        message: "Error! Failed to export.",
        type: "danger",
      });
    }
  };

  useEffect(() => {
    const setPageTitle = () => {
      if (scorecard)
        setTitle(`Company Scorecard ${scorecard.asJson.description}`);
      else navigate("/c/strategy/company-review/");
    };
    setPageTitle();
  }, [navigate, scorecard, setTitle]);


  useEffect(() => {
    const loadAll = async () => {
      if (!fyid) return;
      setLoading(true);
      try {
        await api.companyMeasure.getAll(fyid);
        await api.companyObjective.getAll(fyid);
      } catch (error) {
        ui.snackbar.load({
          id: Date.now(),
          message: "Error! Failed to load the company objectives.",
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
            agreement={agreement}
            reviewCycle={cycle}
            setReviewCycle={setCycle}
          />
        </div>
      </ErrorBoundary>

      {/* Loading */}
      <ErrorBoundary>{loading && <LoadingEllipsis />}</ErrorBoundary>

      {!loading && (
        <ErrorBoundary>
          {cycle === SCORECARD_TAB.name && (
            <CompanyScorecardDraftCycle
              agreement={agreement}
              objectives={objectives}
              hasAccess={hasAccess}
              handleExportExcel={handleExportExcel}
              handleExportPDF={handleExportPDF}
            />
          )}

          {cycle === QUARTER2_TAB.name && (
            <CompanyScorecardQ2Cycle
              agreement={agreement}
              objectives={objectives}
              hasAccess={hasAccess}
              handleExportExcel={handleExportExcel}
              handleExportPDF={handleExportPDF}
            />
          )}
          {cycle === QUARTER4_TAB.name && (
            <CompanyScorecardReviewQ4Cycle
              agreement={agreement}
              objectives={objectives}
              hasAccess={hasAccess}
              handleExportExcel={handleExportExcel}
              handleExportPDF={handleExportPDF}
            />
          )}
        </ErrorBoundary>

      )}

      <ErrorBoundary>
        <Modal modalId={MODAL_NAMES.EXECUTION.MEASURE_COMMENTS_COMPANY_MODAL}>
          <MeasureCompanyCommentsModal />
        </Modal>
        <Modal modalId={MODAL_NAMES.EXECUTION.MEASURE_COMMENTS_COMPANY_MIDTERM_MODAL}>
          <MeasureCompanyMidermCommentsModal />
        </Modal>
        <Modal modalId={MODAL_NAMES.EXECUTION.MEASURE_COMMENTS_COMPANY_ASSESSMENT_MODAL}>
          <MeasureCompanyAssessmentCommentsModal />
        </Modal>
      </ErrorBoundary>
    </ErrorBoundary>
  );
});

export default CompanyScorecardReviewView;



// if (!scorecard) return;
// const title = `Company Scorecard ${scorecard.asJson.description}`;
// const strategicObjectives =
//   store.companyObjective.all.map((o) => o.asJson) || [];
// const measures = store.companyMeasure.all.map((o) => o.asJson) || [];