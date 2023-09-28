import { faFilePdf, faFileExcel, faCheck, faPaperPlane, faCommentDots, faCopy } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { observer } from "mobx-react-lite";
import React, { useEffect, useMemo, useState } from "react";
import Dropdown from "../../shared/components/dropdown/Dropdown";
import ErrorBoundary from "../../shared/components/error-boundary/ErrorBoundary";
import Modal from "../../shared/components/Modal";
import { useAppContext } from "../../shared/functions/Context";
import { dataFormat } from "../../shared/functions/Directives";
import showModalFromId from "../../shared/functions/ModalShow";
import { ALL_TAB, fullPerspectiveName, MAP_TAB } from "../../shared/interfaces/IPerspectiveTabs";
import MeasureCompany from "../../shared/models/MeasureCompany";
import ObjectiveCompany from "../../shared/models/ObjectiveCompany";
import { IReviewCycleStatus } from "../../shared/models/ScorecardBatch";
import { IScorecardMetadata } from "../../shared/models/ScorecardMetadata";
import { IScorecardReview } from "../../shared/models/ScorecardReview";
import EmptyError from "../admin-settings/EmptyError";
import MeasureCompanyUpdateQ2ActualModal from "../dialogs/measure-company-q2-update/MeasureCompanyUpdateQ2ActualModal";
import MODAL_NAMES from "../dialogs/ModalName";
import ViewObjectiveCompanyQ2CommentModal from "../dialogs/objective-company/ViewObjectiveCompanyQ2CommentModal";
import NoScorecardData from "../shared/components/no-scorecard-data/NoScorecardData";
import Rating from "../shared/components/rating/Rating";
import Tabs from "../shared/components/tabs/Tabs";
import Toolbar from "../shared/components/toolbar/Toolbar";
import { rateColor } from "../shared/functions/Scorecard";
import { sortByPerspective } from "../shared/utils/utils";
import NoMeasures from "./NoMeasures";
import CompanyStrategicMap from "./strategic-map/CompanyStrategicMap";

interface IMoreButtonProps {
  agreement: IScorecardMetadata;
}
const MoreButton = observer((props: IMoreButtonProps) => {
  const { agreement } = props;

  const { api, ui, store } = useAppContext();
  const [status, setStatus] = useState<IReviewCycleStatus>("pending");

  const me = store.auth.meJson; // TODO: issue!
  const objectives = store.companyObjective.all;
  const measures = store.companyMeasure.all;
  const measureAudits = store.companyMeasureAudit.all;
  const reviewApi = api.companyScorecardReview.quarter2;
  const scorecard = store.scorecard.active;

  const enableEditing = () => {
    if (!scorecard) return true; // disabled
    const isEditing = scorecard.midtermReview.status === "in-progress"; // enabled if in progress
    return !isEditing;
  };

  const onSubmitQ2Review = async () => {
    if (!me) return;
    const _objectives = objectives.map((o) => o.asJson);
    const _measures = measures.map((m) => m.asJson);
    const _measureAudits = measureAudits.map((m) => m.asJson);

    const $review = reviewApi.transform(me, _objectives, _measures, _measureAudits);
    const $agreement = agreement;
    $agreement.quarter2Review.status = "submitted";
    $agreement.quarter2Review.submittedOn = new Date().toDateString();

    await onUpdate($agreement, $review);
  };

  const onUpdate = async (
    agreement: IScorecardMetadata,
    review: IScorecardReview
  ) => {
    try {
      await reviewApi.create(review);
      await api.companyScorecardMetadata.create(agreement);
      ui.snackbar.load({
        id: Date.now(),
        message: "Submitted midterm progress for review.",
        type: "success",
      });
    } catch (error) {
      console.log(error);
      ui.snackbar.load({
        id: Date.now(),
        message: "Error! Failed to submit your midterm progress for review.",
        type: "danger",
      });
    }
  };

  useEffect(() => {
    const $status = agreement.quarter2Review.status;
    setStatus($status);
  }, [agreement.quarter2Review.status]);

  return (
    <ErrorBoundary>
      {status === "in-progress" && (
        <button
          className="kit-dropdown-btn"
          onClick={onSubmitQ2Review}
          disabled={enableEditing()}
        >
          <FontAwesomeIcon
            icon={faPaperPlane}
            className="icon uk-margin-small-right"
          />
          Submit Midterm for Review
        </button>
      )}
      {status === "submitted" && (
        <button className="kit-dropdown-btn" disabled>
          <FontAwesomeIcon
            icon={faCheck}
            className="icon icon--success uk-margin-small-right"
          />
          Submitted Midterm for Review
        </button>
      )}
    </ErrorBoundary>
  );
});

interface IMeasureTableItemProps {
  measure: MeasureCompany;
  canUpdate: boolean;
  isApproved: boolean;
}
const MeasureTableItem = (props: IMeasureTableItemProps) => {
  const { store } = useAppContext();
  const { canUpdate, isApproved } = props;
  const measure = props.measure.asJson;

  const dataType = measure.dataType;
  const dataSymbol = measure.dataSymbol;

  const rateCss = rateColor(
    Number(measure.rating || measure.q2FinalRating),
    measure.isUpdated
  );

  const handleUpdateMeasureProgress = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    store.companyMeasure.select(measure); // select measure
    showModalFromId(MODAL_NAMES.EXECUTION.COMPANY_MEASURE_Q2_UPDATE_MODAL);
  };

  const handleEditComments = () => {
    store.companyMeasure.select(measure); // select measure
    showModalFromId(MODAL_NAMES.EXECUTION.MEASURE_COMMENTS_COMPANY_MIDTERM_MODAL);
  };

  return (
    <tr className="row">
      <td>
        <div className={`status ${rateCss}`}></div>
      </td>
      <td>{measure.description}
        <span className="measure-sub-weight uk-margin-small-left">
          Sub-Weight: {measure.weight}%
        </span>
        <button
          title="Comments"
          className="comments-btn btn-text uk-margin-small-left"
          onClick={handleEditComments}
          data-uk-icon="icon: comments; ratio: 0.7"
        /></td>
      <td className="no-whitespace">
        {dataFormat(dataType, measure.baseline, dataSymbol)}
      </td>
      <td className="no-whitespace">
        {dataFormat(dataType, measure.annualTarget, dataSymbol)}
      </td>
      <td className="no-whitespace">
        {dataFormat(dataType, measure.quarter2Actual, dataSymbol)}
      </td>
      <td className={`no-whitespace actual-value ${rateCss}`}>
        {measure.rating}
      </td>
      {isApproved && (
        <>
          <td className={`no-whitespace actual-value ${rateCss}`}>
            {measure.q2supervisorRating || "-"}
          </td>
          <td className={`no-whitespace actual-value ${rateCss}`}>
            {measure.q2FinalRating || "-"}
          </td>
        </>
      )}
      {canUpdate && (
        <td>
          <div className="controls">
            <button className="btn-icon" onClick={handleUpdateMeasureProgress}>
              <span uk-icon="pencil"></span>
            </button>
          </div>
        </td>
      )}
    </tr>
  );
};

interface IMeasureTableProps {
  measures: MeasureCompany[];
  agreement: IScorecardMetadata;
}
const MeasureTable = observer((props: IMeasureTableProps) => {
  const { measures, agreement } = props;

  const isApproved = useMemo(
    () => agreement.quarter2Review.status === "approved",
    [agreement]
  );

  const canUpdate = useMemo(() => {
    const statusCondition = agreement.quarter2Review.status === "in-progress";
    return statusCondition;
  }, [agreement.quarter2Review.status]);

  return (
    <div className="measure-table">
      {measures.length !== 0 && (
        <table className="measure-table uk-table uk-table-small uk-table-middle uk-table-hover uk-table-divider">
          <thead className="header">
            <tr>
              <th></th>
              <th className="uk-width-expand@s">Measure/KPI</th>
              <th>Baseline</th>
              <th>Annual Target</th>
              <th>Progress Update</th>
              <th>E-Rating</th>
              {canUpdate && <th></th>}
              {isApproved && (
                <>
                  <th>S-Rating</th>
                  <th>F-Rating</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {measures.map((measure) => (
              <ErrorBoundary key={measure.asJson.id}>
                <MeasureTableItem
                  key={measure.asJson.id}
                  measure={measure}
                  canUpdate={canUpdate}
                  isApproved={isApproved}
                />
              </ErrorBoundary>
            ))}
          </tbody>
        </table>
      )}

      {measures.length === 0 && <NoMeasures />}
    </div>
  );
});

interface IObjectiveItemProps {
  objective: ObjectiveCompany;
  children?: React.ReactNode;
}
const ObjectiveItem = observer((props: IObjectiveItemProps) => {
  const { store } = useAppContext();
  const { children, objective } = props;

  const { description, perspective, weight, midComment } = objective.asJson;
  const { rate, isUpdated } = objective.q2Rating;

  const viewComments = () => {
    store.companyObjective.select(objective.asJson);
    showModalFromId(MODAL_NAMES.EXECUTION.VIEW_OBJECTIVE_COMPANY_Q2_COMMENT_MODAL);
  };

  return (
    <div className="objective uk-card uk-card-default uk-card-small uk-card-body uk-margin">
      <div className="uk-flex uk-flex-middle">
        <div className="uk-margin-right">
          <Rating rate={rate} isUpdated={isUpdated} />
        </div>
        <h3 className="objective-name uk-width-1-1">
          <span>{description} </span>
          <div className="uk-margin-small-top" />
          <span className="objective-persepctive">
            {fullPerspectiveName(perspective)}
          </span>
          <span className="objective-weight">Weight: {weight || 0}%</span>
          {midComment !== "" && (
            <button
              style={{ marginLeft: ".5rem" }}
              title="comments"
              className="comments-btn btn-text uk-margin-small-left"
              onClick={viewComments}
              data-uk-icon="icon: comments; ratio: 0.8"
            ></button>
          )}
        </h3>
      </div>

      <div className="uk-margin">{children}</div>
    </div>
  );
});

interface IStrategicListProps {
  agreement: IScorecardMetadata;
  objectives: ObjectiveCompany[];
}
const StrategicList = (props: IStrategicListProps) => {
  const { agreement, objectives } = props;

  return (
    <div className="objective-table uk-margin">
      {objectives.map((objective) => (
        <ErrorBoundary key={objective.asJson.id}>
          <ObjectiveItem objective={objective}>
            <MeasureTable measures={objective.measures} agreement={agreement} />
          </ObjectiveItem>
        </ErrorBoundary>
      ))}
      {!objectives.length && <EmptyError errorMessage="No objective found" />}
    </div>
  );
};

interface IProps {
  agreement: IScorecardMetadata;
  objectives: ObjectiveCompany[];
  hasAccess: boolean;
  handleExportPDF: () => Promise<void>;
  handleExportExcel: () => Promise<void>;
  handleFeedback: () => void;
  exportingExcelFile: boolean;
  exportingPDFFile: boolean;
  handleDuplicateScorecard: () => void;
  duplicateLoading: boolean;
}

const CompanyScorecardQCycle = observer((props: IProps) => {
  const [tab, setTab] = useState(ALL_TAB.id);

  const {
    agreement,
    objectives,
    hasAccess,
    handleExportExcel,
    handleExportPDF,
    handleFeedback,
    exportingExcelFile,
    exportingPDFFile,
    handleDuplicateScorecard,
    duplicateLoading,
  } = props;

  const filteredObjectivesByPerspective = useMemo(() => {
    const sorted = objectives.sort(sortByPerspective);
    return tab === ALL_TAB.id ? sorted : sorted.filter((o) => o.asJson.perspective === tab);
  }, [objectives, tab]);

  if (agreement.agreementDraft.status !== "approved")
    return (
      <ErrorBoundary>
        <NoScorecardData title="Company draft performance scorecard is not approved." />
      </ErrorBoundary>
    );

  return (
    <ErrorBoundary>
      <div className="company-plan-view-page uk-section uk-section-small">
        <div className="uk-container uk-container-xlarge">
          <ErrorBoundary>
            <Toolbar
              leftControls={<Tabs tab={tab} setTab={setTab} />}
              rightControls={
                <ErrorBoundary>
                  <div className="uk-inline">
                    <button className="btn btn-primary">
                      More <span data-uk-icon="icon: more; ratio:.8"></span>
                    </button>

                    <Dropdown pos="bottom-right">
                      {hasAccess && (
                        <li>
                          <ErrorBoundary>
                            <MoreButton agreement={agreement} />
                          </ErrorBoundary>
                        </li>
                      )}
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
                          title="Read Comments"
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
              {tab === MAP_TAB.id && <CompanyStrategicMap />}
              {tab !== MAP_TAB.id && (
                <div>
                  <StrategicList
                    agreement={agreement}
                    objectives={filteredObjectivesByPerspective}
                  />
                </div>
              )}
            </div>
          </ErrorBoundary>
        </div>
      </div>
      <ErrorBoundary>
        <Modal modalId={MODAL_NAMES.EXECUTION.COMPANY_MEASURE_Q2_UPDATE_MODAL}>
          <MeasureCompanyUpdateQ2ActualModal />
        </Modal>
      </ErrorBoundary>
      <ErrorBoundary>
        <Modal modalId={MODAL_NAMES.EXECUTION.VIEW_OBJECTIVE_COMPANY_Q2_COMMENT_MODAL}>
          <ViewObjectiveCompanyQ2CommentModal />
        </Modal>
      </ErrorBoundary>
    </ErrorBoundary>
  );
});

export default CompanyScorecardQCycle;
