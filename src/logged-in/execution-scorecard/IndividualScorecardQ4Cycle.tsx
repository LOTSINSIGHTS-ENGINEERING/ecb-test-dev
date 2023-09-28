import { observer } from "mobx-react-lite";
import React, { useEffect, useMemo, useState } from "react";
import Dropdown from "../../shared/components/dropdown/Dropdown";
import { useAppContext } from "../../shared/functions/Context";
import showModalFromId from "../../shared/functions/ModalShow";
import useMailer from "../../shared/hooks/useMailer";
import { ALL_TAB, fullPerspectiveName, MAP_TAB, } from "../../shared/interfaces/IPerspectiveTabs";
import { IScorecardMetadata } from "../../shared/models/ScorecardMetadata";
import { IScorecardReview } from "../../shared/models/ScorecardReview";
import MODAL_NAMES from "../dialogs/ModalName";
import Tabs from "../shared/components/tabs/Tabs";
import Toolbar from "../shared/components/toolbar/Toolbar";
import StrategicMap from "./strategic-map/StrategicMap";
import ErrorBoundary from "../../shared/components/error-boundary/ErrorBoundary";
import { faPaperPlane, faCheck, faHistory, faFilePdf, faFileExcel, faCommentDots, faCopy } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import NoScorecardData from "../shared/components/no-scorecard-data/NoScorecardData";
import { MAIL_SCORECARD_Q4_SUBMITTED_MANAGER, MAIL_SCORECARD_Q4_SUBMITTED_ME } from "../../shared/functions/mailMessages";
import Measure, { IMeasure } from "../../shared/models/Measure";
import Objective, { IObjective } from "../../shared/models/Objective";
import EmptyError from "../admin-settings/EmptyError";
import { q4EmpRating, q4FinalRating, q4SuperRating, rateColor } from "../shared/functions/Scorecard";
import { dataFormat } from "../../shared/functions/Directives";
import NoMeasures from "./NoMeasures";
import Rating from "../shared/components/rating/Rating";
import Modal from "../../shared/components/Modal";
import MeasureUpdateActualQ4Modal from "../dialogs/measure-update-q4-actual/MeasureUpdateActualQ4Modal";
import ViewObjectiveQ4CommentModal from "../dialogs/objective/ViewObjectiveQ4CommentModal";


interface IMoreButtonProps {
  agreement: IScorecardMetadata;
}
const MoreButton = observer((props: IMoreButtonProps) => {
  const { api, ui, store } = useAppContext();
  const { mailSupervisor, mailMe } = useMailer();
  const { agreement } = props;

  const me = store.auth.meJson;
  const objectives = store.objective.allMe;
  const measures = store.measure.allMe;
  const measureAudits = store.measureAudit.allMe;
  const asssessmentApi = api.individualScorecardReview.quarter4;
  const scorecard = store.scorecard.active;

  const status = useMemo(() => agreement.quarter4Review.status, [agreement.quarter4Review.status]);
  const isDisabled = useMemo(() => !scorecard || scorecard.finalAssessment.status !== "in-progress", [scorecard]);

  const onSubmitScorecardForAssessment = async () => {
    if (!me || !window.confirm("Confirm Submission ?")) return;
    const _objectives = objectives.map((o) => o.asJson);
    const _measures = measures.map((m) => m.asJson);
    const _measureAudits = measureAudits.map((m) => m.asJson);

    const $review = asssessmentApi.transform(me, _objectives, _measures, _measureAudits);

    const $agreement = agreement;
    $agreement.quarter4Review.status = "submitted";
    $agreement.quarter4Review.submittedOn = new Date().toDateString();
    const { SUBJECT, BODY } = MAIL_SCORECARD_Q4_SUBMITTED_MANAGER(me.displayName);
    const { MY_SUBJECT, MY_BODY } = MAIL_SCORECARD_Q4_SUBMITTED_ME(me.displayName);

    await onUpdate($agreement, $review);
    await mailSupervisor(SUBJECT, BODY);
    await mailMe(MY_SUBJECT, MY_BODY);
  };

  const onUpdate = async (agreement: IScorecardMetadata, review: IScorecardReview) => {
    try {
      await asssessmentApi.create(review);
      await api.individualScorecard.create(agreement);
      ui.snackbar.load({
        id: Date.now(),
        message: "Submitted assessment progress for review.",
        type: "success",
      });
    } catch (error) {
      ui.snackbar.load({
        id: Date.now(),
        message: "Error! Failed to submit your assessment progress for review.",
        type: "danger",
      });
    }
  };


  return (
    <ErrorBoundary>
      {status === "in-progress" && (
        <button
          className="kit-dropdown-btn"
          onClick={onSubmitScorecardForAssessment}
          disabled={isDisabled}
        >
          <FontAwesomeIcon
            icon={faPaperPlane}
            className="icon uk-margin-small-right"
          />
          Submit Assesssment Progress for Review
        </button>
      )}
      {status === "submitted" && (
        <button className="kit-dropdown-btn" disabled>
          <FontAwesomeIcon
            icon={faCheck}
            className="icon icon--success uk-margin-small-right"
          />
          Submitted Assesssment Progress for Review
        </button>
      )}
      {status === "approved" && (
        <button className="kit-dropdown-btn" disabled>
          <FontAwesomeIcon
            icon={faCheck}
            className="icon icon--success uk-margin-small-right"
          />
          Scorecard Approved
        </button>
      )}
    </ErrorBoundary>
  );
});

interface IMeasureTableItemProps {
  measure: Measure;
  canUpdate: boolean;
  isApproved: boolean;
  uploadEvidence: (measure: IMeasure) => void;
}
const MeasureTableItem = (props: IMeasureTableItemProps) => {
  const { store } = useAppContext();
  const { uploadEvidence, canUpdate, isApproved } = props;
  const measure = props.measure.asJson;
  const [ratingCss, setRatingCss] = useState("");

  const isSupervRated = measure.supervisorRating2 !== 0;
  const isFinalRated = measure.finalRating2 !== 0;

  const dataType = measure.dataType;
  const dataSymbol = measure.dataSymbol;

  const onUploadFile = () => {
    uploadEvidence(measure);
  };

  const handleUpdateProgress = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    store.measure.select(measure); // select measure
    showModalFromId(MODAL_NAMES.EXECUTION.MEASURE_UPDATE_Q4_ACTUAL_MODAL);
  };

  const handleEditComments = () => {
    store.measure.select(measure); // select measure
    showModalFromId(MODAL_NAMES.EXECUTION.MEASURE_COMMENTS_ASSESSMENT_MODAL);
  };

  const measureReadOnly = () => {
    store.measure.select(measure); // select measure
    showModalFromId(MODAL_NAMES.EXECUTION.MEASURE_READ_ONLY_MODAL);
  };

  useEffect(() => {
    if (measure.finalRating2) {
      const rateCss = rateColor(Number(measure.finalRating2), measure.isUpdated);
      setRatingCss(rateCss);
    } else if (measure.supervisorRating2) {
      const ratingCss = rateColor(Number(measure.supervisorRating2), measure.isUpdated);
      setRatingCss(ratingCss);
    } else {
      const ratingCss = rateColor(measure.autoRating2, measure.isUpdated);
      setRatingCss(ratingCss);
    }
  }, [measure]);

  return (
    <ErrorBoundary>
      <tr className="row" onDoubleClick={measureReadOnly} title="Double click to view more">
        <td>
          <div className={`status ${ratingCss}`}></div>
        </td>
        <td>{measure.description}
          <button
            title="Comments"
            className="comments-btn btn-text uk-margin-small-left"
            onClick={handleEditComments}
            data-uk-icon="icon: comments; ratio: 0.7"
          ></button>
        </td>
        <td className="no-whitespace">
          {dataFormat(dataType, measure.rating1, dataSymbol)}
        </td>
        <td className="no-whitespace">
          {dataFormat(dataType, measure.rating2, dataSymbol)}
        </td>
        <td className="no-whitespace">
          {dataFormat(dataType, measure.rating3, dataSymbol)}
        </td>
        <td className="no-whitespace">
          {dataFormat(dataType, measure.rating4, dataSymbol)}
        </td>
        <td className="no-whitespace">
          {dataFormat(dataType, measure.rating5, dataSymbol)}
        </td>
        <td className="no-whitespace">
          {dataFormat(dataType, measure.annualActual, dataSymbol)}
        </td>
        <td className={`no-whitespace actual-value ${ratingCss}`}>
          {measure.autoRating2}
        </td>
        {!canUpdate && (
          <>
            {isSupervRated ? (
              <td className={`no-whitespace actual-value ${ratingCss}`}>
                {measure.supervisorRating2}
              </td>
            ) : (
              <td>-</td>
            )}
            {isFinalRated ? (
              <td className={`no-whitespace actual-value ${ratingCss}`}>
                {measure.finalRating2}
              </td>
            ) : (
              <td>-</td>
            )}
          </>
        )}
        {canUpdate && (
          <td>
            <div className="controls">
              <button className="btn-icon" onClick={handleUpdateProgress}>
                <span data-uk-icon="pencil"></span>
              </button>
              <button className="btn-icon" onClick={onUploadFile}>
                <span uk-icon="upload"></span>
              </button>
            </div>
          </td>
        )}
      </tr>
    </ErrorBoundary>
  );
};

interface IMeasureTableProps {
  measures: Measure[];
  onUploadEvidence: (measure: IMeasure) => void;
  agreement: IScorecardMetadata;
}
const MeasureTable = observer((props: IMeasureTableProps) => {
  const { measures, onUploadEvidence, agreement } = props;

  const isApproved = useMemo(() => agreement.quarter4Review.status === "approved", [agreement]);

  const canUpdate = useMemo(() => agreement.quarter4Review.status === "in-progress", [agreement]);

  return (
    <ErrorBoundary>
      <div className="measure-table">
        {measures.length !== 0 && (
          <table className="measure-table uk-table uk-table-small uk-table-middle uk-table-hover uk-table-divider">
            <thead className="header">
              <tr>
                <th></th>
                <th className="uk-width-expand@s">Measure/KPI</th>
                <th>Rating 1</th>
                <th>Rating 2</th>
                <th>Rating 3</th>
                <th>Rating 4</th>
                <th>Rating 5</th>
                <th>Progress</th>
                <th>E-Rating</th>
                {!canUpdate && (
                  <>
                    <th>S-Rating</th>
                    <th>F-Rating</th>
                  </>
                )}
                {canUpdate && <th></th>}
              </tr>
            </thead>
            <tbody>
              {measures.map((measure) => (
                <MeasureTableItem
                  key={measure.asJson.id}
                  measure={measure}
                  uploadEvidence={onUploadEvidence}
                  canUpdate={canUpdate}
                  isApproved={isApproved}
                />
              ))}
            </tbody>
          </table>
        )}
        {measures.length === 0 && <NoMeasures />}
      </div>
    </ErrorBoundary>
  );
});

interface IObjectiveItemProps {
  objective: Objective;
  children?: React.ReactNode;
}
const ObjectiveItem = observer((props: IObjectiveItemProps) => {
  const { store } = useAppContext();
  const { objective, children } = props;
  const { weight, description, perspective, } = objective.asJson;
  const { rate, isUpdated } = objective.q4Rating;

  const viewComments = () => {
    store.objective.select(objective.asJson)
    showModalFromId(MODAL_NAMES.EXECUTION.VIEW_OBJECTIVE_Q4_COMMENT_MODAL);
  };


  return (
    <ErrorBoundary>
      <div className="objective uk-card uk-card-default uk-card-small uk-card-body uk-margin">
        <div className="uk-flex uk-flex-middle">
          <div className="uk-margin-right">
            <Rating rate={rate} isUpdated={isUpdated} />
          </div>
          <h3 className="objective-name uk-width-1-1">
            {description}
            <div className="uk-margin-small-top"></div>
            <span className="objective-persepctive uk-margin-small-left">
              {fullPerspectiveName(perspective)}
            </span>
            <span className="objective-weight">Weight: {weight || 0}%</span>
            {objective.asJson.assessComment !== "" && (
              <button
                style={{ marginLeft: ".5rem" }}
                title="Comments"
                className="comments-btn btn-text uk-margin-small-left"
                onClick={viewComments}
                data-uk-icon="icon: comments; ratio: 0.8"
              ></button>
            )}
          </h3>
        </div>
        <div className="uk-margin">{children}</div>
      </div>
    </ErrorBoundary>
  );
});

interface IStrategicListProps {
  tab: string;
  agreement: IScorecardMetadata;
  objectives: Objective[];
}
const StrategicList = observer((props: IStrategicListProps) => {
  const { store } = useAppContext();
  const { tab, objectives, agreement } = props;

  const _objectives = useMemo(() => {
    if (tab === ALL_TAB.id) return objectives;
    return objectives.filter((objective) => objective.asJson.perspective === tab);
  }, [objectives, tab]);

  const onUploadEvidence = (objective: IObjective, measure: IMeasure) => {
    store.objective.select(objective);
    store.measure.select(measure);
    showModalFromId(MODAL_NAMES.EXECUTION.MEASURE_FILES_MODAL);
  };

  return (
    <ErrorBoundary>
      <div className="objective-table uk-margin">
        {_objectives.map((objective) => (
          <ObjectiveItem key={objective.asJson.id} objective={objective}>
            <MeasureTable
              measures={objective.measures}
              agreement={agreement}
              onUploadEvidence={(measure) =>
                onUploadEvidence(objective.asJson, measure)
              }
            />
          </ObjectiveItem>
        ))}
        {!objectives.length && <EmptyError errorMessage="No objective found" />}
      </div>
    </ErrorBoundary>
  );
});



interface IRatingProps {
  measures: Measure[];
}
const ScorecardRatings = observer((props: IRatingProps) => {
  const { measures } = props;
  const $measures = measures.map((measure) => measure.asJson);

  const rating1 = q4EmpRating($measures)
  const rating2 = q4SuperRating($measures)
  const rating3 = q4FinalRating($measures)

  const q4_e_css = rateColor(rating1, true);
  const q4_s_css = rateColor(rating2, true);
  const q4_f_css = rateColor(rating3, true);

  return (
    <ErrorBoundary>
      <div className="measure-rating-table">
        <table>
          <thead className="header">
            <tr>
              <th>E-Rating</th>
              <th>S-Rating</th>
              <th>F-Rating</th>
            </tr>
          </thead>
          <tbody>
            <tr className="row">
              <td className={`value ${q4_e_css}`}>
                {rating1.toFixed(2)}
              </td>
              <td className={`value ${q4_s_css}`}>
                {rating2.toFixed(2)}
              </td>
              <td className={`value ${q4_f_css}`}>
                {rating3.toFixed(2)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </ErrorBoundary>
  );
});

// Assessment Scorecard Content
interface IProps {
  agreement: IScorecardMetadata;
  measures: Measure[];
  objectives: Objective[];
  handleExportPDF: () => Promise<void>;
  handleExportExcel: () => Promise<void>;
  handleFeedback: () => void;
  handleScorecards: () => void;
  handleDuplicateScorecard: () => void;
  duplicateLoading: boolean;
  exportingExcelFile: boolean;
  exportingPDFFile: boolean;
}
const IndividualScorecardQ4Cycle = observer((props: IProps) => {
  const [tab, setTab] = useState(ALL_TAB.id);
  const { agreement, measures, objectives, handleExportExcel, handleExportPDF, handleFeedback, handleScorecards,
    duplicateLoading, handleDuplicateScorecard, exportingExcelFile, exportingPDFFile } = props;


  if (agreement.quarter2Review.status !== "approved")
    return (
      <ErrorBoundary>
        <NoScorecardData title="Midterm performance is not approved." />
      </ErrorBoundary>
    );

  return (
    <ErrorBoundary>
      <div className="scorecard-page uk-section uk-section-small">
        <div className="uk-container uk-container-xlarge">
          <ErrorBoundary>
            <Toolbar
              leftControls={
                <ErrorBoundary>
                  <Tabs tab={tab} setTab={setTab} />
                </ErrorBoundary>
              }
              rightControls={
                <ErrorBoundary>
                  <div className="uk-inline">
                    <button className="btn btn-primary">
                      More <span data-uk-icon="icon: more; ratio:.8"></span>
                    </button>

                    <Dropdown pos="bottom-right">
                      <li>
                        <MoreButton agreement={agreement} />
                      </li>
                      <li>
                        <button
                          className="kit-dropdown-btn"
                          onClick={handleScorecards}
                          title="View the scorecards for the previous financial years."
                        >
                          <FontAwesomeIcon
                            icon={faHistory}
                            size="sm"
                            className="icon uk-margin-small-right"
                          />
                          View Past Scorecards
                        </button>
                      </li>
                      <li>
                        <button
                          className="kit-dropdown-btn"
                          onClick={handleExportPDF}
                          title="Export your scorecard as PDF."
                          disabled={exportingPDFFile}
                        >
                          <FontAwesomeIcon
                            icon={faFilePdf}
                            size="lg"
                            className="icon uk-margin-small-right"
                          />
                          Export PDF
                          {exportingPDFFile && <div data-uk-spinner="ratio: .5"></div>}
                        </button>
                      </li>
                      <li>
                        <button
                          className="kit-dropdown-btn"
                          onClick={handleExportExcel}
                          title="Export your scorecard as EXCEL."
                          disabled={exportingExcelFile}
                        >
                          <FontAwesomeIcon
                            icon={faFileExcel}
                            size="lg"
                            className="icon uk-margin-small-right"
                          />
                          Export Excel
                          {exportingExcelFile && <div data-uk-spinner="ratio: .5"></div>}
                        </button>
                      </li>
                      <li>
                        <button
                          className="kit-dropdown-btn"
                          onClick={handleFeedback}
                          title="Read Comments."
                        >
                          <FontAwesomeIcon
                            icon={faCommentDots}
                            size="lg"
                            className="icon uk-margin-small-right"
                          />
                          Feedback
                        </button>
                      </li>
                      {/* <li>
                        <button
                          className="kit-dropdown-btn"
                          onClick={handleDuplicateScorecard}
                          title="This will copy all your objectives and measures to the new financial year.">
                          <FontAwesomeIcon
                            icon={faCopy}
                            size="lg"
                            className="icon uk-margin-small-right"
                          />
                          Duplicate Scorecard
                          {duplicateLoading && <div data-uk-spinner="ratio: .5"></div>}
                        </button>
                      </li> */}
                    </Dropdown>
                  </div>
                </ErrorBoundary>
              }
            />
          </ErrorBoundary>
          <ErrorBoundary>
            <div className="uk-margin">
              {tab === MAP_TAB.id && <StrategicMap />}
              {tab !== MAP_TAB.id && (
                <div>
                  <StrategicList tab={tab} agreement={agreement} objectives={objectives} />
                  <ScorecardRatings measures={measures} />
                </div>)}
            </div>
          </ErrorBoundary>
          <ErrorBoundary>
            <Modal modalId={MODAL_NAMES.EXECUTION.MEASURE_UPDATE_Q4_ACTUAL_MODAL}>
              <MeasureUpdateActualQ4Modal />
            </Modal>
          </ErrorBoundary>
          <ErrorBoundary>
            <Modal modalId={MODAL_NAMES.EXECUTION.VIEW_OBJECTIVE_Q4_COMMENT_MODAL}>
              <ViewObjectiveQ4CommentModal />
            </Modal>
          </ErrorBoundary>
        </div>
      </div>
    </ErrorBoundary>
  );
});

export default IndividualScorecardQ4Cycle;
