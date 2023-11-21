import { observer } from "mobx-react-lite";
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Dropdown from "../../shared/components/dropdown/Dropdown";
import ErrorBoundary from "../../shared/components/error-boundary/ErrorBoundary";
import { useAppContext } from "../../shared/functions/Context";
import showModalFromId from "../../shared/functions/ModalShow";
import useMailer from "../../shared/hooks/useMailer";
import { fullPerspectiveName, ALL_TAB, MAP_TAB, FINANCIAL_TAB, CUSTOMER_TAB, PROCESS_TAB, GROWTH_TAB, } from "../../shared/interfaces/IPerspectiveTabs";
import { IPerspectiveWeights, IScorecardMetadata, } from "../../shared/models/ScorecardMetadata";
import { IScorecardReview } from "../../shared/models/ScorecardReview";
import Measure, { IMeasure } from "../../shared/models/Measure";
import Objective, { IObjective } from "../../shared/models/Objective";
import EmptyError from "../admin-settings/EmptyError";
import MODAL_NAMES from "../dialogs/ModalName";
import Tabs from "../shared/components/tabs/Tabs";
import Toolbar from "../shared/components/toolbar/Toolbar";
import WeightError from "../shared/components/weight-error/WeightError";
import NoMeasures from "./NoMeasures";
import StrategicMap from "./strategic-map/StrategicMap";
import { dataFormat } from "../../shared/functions/Directives";
import { faFilePdf, faFileExcel, faCheck, faPaperPlane, faHistory, faPencilAlt, faArrowRightLong, faCopy } from "@fortawesome/free-solid-svg-icons";
import { faCommentDots } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { MAIL_SCORECARD_DRAFT_SUBMITTED_MANAGER, MAIL_SCORECARD_DRAFT_SUBMITTED_ME } from "../../shared/functions/mailMessages";
import Modal from "../../shared/components/Modal";
import ViewObjectiveDraftCommentModal from "../dialogs/objective/ViewObjectiveDraftCommentModal";

interface IMoreButtonProps {
  agreement: IScorecardMetadata;
  agreementError: boolean;
}

const MoreButton = observer((props: IMoreButtonProps) => {
  const { agreement, agreementError } = props;
  const { api, ui, store } = useAppContext();
  const { mailSupervisor, mailMe } = useMailer();

  const me = store.auth.meJson;
  const objectives = store.objective.allMe;
  const measures = store.measure.allMe;
  const measureAudits = store.measureAudit.allMe;
  const scorecard = store.scorecard.active;
  const draftApi = api.individualScorecardReview.draft;

  const status = useMemo(() => agreement.agreementDraft.status || "pending", [agreement.agreementDraft.status]);
  const isDisabled = useMemo(() => !scorecard || scorecard.draftReview.status !== "in-progress", [scorecard]);

  const onUpdate = async (agreement: IScorecardMetadata, review: IScorecardReview) => {
    try {
      await draftApi.create(review);
      await api.individualScorecard.create(agreement);
      ui.snackbar.load({
        id: Date.now(),
        message: "Submitted your performance scorecard for approval.",
        type: "success",
      });
    } catch (error) {
      console.log(error);
      ui.snackbar.load({
        id: Date.now(),
        message: "Error! Failed to submit your performance scorecard for approval.",
        type: "danger",
      });
    }
  };

  const onSubmitScorecardDraftForApproval = async () => {
    if (!me || !window.confirm("Confirm Submission ?")) {
      ui.snackbar.load({
        id: Date.now(),
        type: "danger",
        message: "Cannot find the current user.",
        timeoutInMs: 10000,
      });
      return;
    };
    const _objectives = objectives.map((o) => o.asJson);
    const _measures = measures.map((m) => m.asJson);
    const _measureAudits = measureAudits.map((m) => m.asJson);

    const { MY_SUBJECT, MY_BODY } = MAIL_SCORECARD_DRAFT_SUBMITTED_ME(me.displayName);
    const { SUBJECT, BODY } = MAIL_SCORECARD_DRAFT_SUBMITTED_MANAGER(me.displayName);

    const $review = draftApi.transform(me, _objectives, _measures, _measureAudits);

    const $agreement = agreement;
    $agreement.agreementDraft.status = "submitted";
    $agreement.agreementDraft.submittedOn = new Date().toDateString();

    await onUpdate($agreement, $review);
    await mailSupervisor(SUBJECT, BODY);
    await mailMe(MY_SUBJECT, MY_BODY);
  };

  return (
    <ErrorBoundary>
      {status === "pending" && (
        <button
          className="kit-dropdown-btn"
          onClick={onSubmitScorecardDraftForApproval}
          disabled={isDisabled || agreementError}
          title={agreementError ? "The weights of all the objectives didn't add up to 100%." : ""}>
          <FontAwesomeIcon
            icon={faPaperPlane}
            className="icon uk-margin-small-right"
          />
          Submit Scorecard for Approval
        </button>
      )}
      {status === "submitted" && (
        <button className="kit-dropdown-btn" disabled>
          <FontAwesomeIcon
            icon={faCheck}
            className="icon icon--success uk-margin-small-right"
          />
          Scorecard Submitted for Approval
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
  measure: IMeasure;
}

const MeasureTableItem = observer((props: IMeasureTableItemProps) => {
  const { measure } = props;
  const { store } = useAppContext();

  const dataType = measure.dataType;
  const dataSymbol = measure.dataSymbol || "";

  const handleEditComments = () => {
    store.measure.select(measure); // select measure
    showModalFromId(MODAL_NAMES.EXECUTION.MEASURE_COMMENTS_MODAL);
  };

  const measureReadOnly = () => {
    store.measure.select(measure); // select measure
    showModalFromId(MODAL_NAMES.EXECUTION.MEASURE_READ_ONLY_MODAL);
  };

  return (
    <tr className="row" onDoubleClick={measureReadOnly} title="Double click to view more">
      <td>
        {measure.description}
        <span className="measure-sub-weight uk-margin-small-left">
          Sub-Weight: {measure.weight}%
        </span>
        <button
          title="Comments"
          className="comments-btn btn-text uk-margin-small-left"
          onClick={handleEditComments}
          data-uk-icon="icon: comments; ratio: 0.7"
        />
      </td>
      <td className="no-whitespace">
        {dataFormat(dataType, measure.baseline, dataSymbol)}
      </td>
      <td className="no-whitespace">
        {dataFormat(dataType, measure.annualTarget, dataSymbol)}
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
    </tr>
  );
});

interface IMeasureTableProps {
  measures: IMeasure[];
}
const MeasureTable = observer((props: IMeasureTableProps) => {
  const { measures } = props;

  return (
    <ErrorBoundary>
      <div className="measure-table">
        <table className="measure-table uk-table uk-table-small uk-table-middle uk-table-hover uk-table-divider">
          <thead className="header">
            <tr>
              <th className="uk-width-expand@s">Measure/KPI</th>
              <th>Baseline</th>
              <th>Annual Target</th>
              <th>Rating 1</th>
              <th>Rating 2</th>
              <th>Rating 3</th>
              <th>Rating 4</th>
              <th>Rating 5</th>
            </tr>
          </thead>
          <tbody>
            {measures.map((measure) => (
              <ErrorBoundary key={measure.id}>
                <MeasureTableItem measure={measure} />
              </ErrorBoundary>
            ))}
          </tbody>
        </table>
        {measures.length === 0 && <NoMeasures />}
      </div>
    </ErrorBoundary>
  );
});

// Draft Scorecard Content
interface IObjectiveItemProps {
  objective: IObjective;
  totalNoOfMeasures: number;
  enableEditing: () => boolean;
  children?: React.ReactNode;
}
const ObjectiveItem = observer((props: IObjectiveItemProps) => {
  const { objective, children, totalNoOfMeasures, enableEditing } = props;
  const { api, store } = useAppContext();
  const navigate = useNavigate();

  const handleView = () => {
    navigate(`/c/scorecards/my/${objective.id}`);
  };

  const handleMore = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
  };

  const handleEdit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    store.objective.select(objective);
    showModalFromId(MODAL_NAMES.EXECUTION.OBJECTIVE_MODAL); // show objective modal
  };

  const handleRemove = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    if (!window.confirm("Remove objective?")) return;
    await removeAllMeasures();
    await api.objective.delete(objective);
  };

  const removeAllMeasures = async () => {
    for (const measure of store.measure.all) {
      if (measure.asJson.objective === objective.id) {
        await api.measure.delete(measure.asJson);
      }
    }
  };

  const viewComments = () => {
    store.objective.select(objective);
    showModalFromId(MODAL_NAMES.EXECUTION.VIEW_OBJECTIVE_DRAFT_COMMENT_MODAL);
  };

  return (
    <div className="objective uk-card uk-card-default uk-card-small uk-card-body uk-margin-small">
      <div className="uk-flex uk-flex-middle">
        <h3 className="objective-name uk-width-1-1">
          {objective.description}
          <div className="uk-margin-small-top"></div>
          <span className="objective-persepctive">
            {fullPerspectiveName(objective.perspective)}
          </span>
          <span className="objective-weight">
            Weight: {objective.weight || 0}%
          </span>
          {objective.objectiveType === "self-development" && (
            <span className="objective-type">PDP</span>
          )}
          {objective.draftComment !== "" && (
            <button
              style={{ marginLeft: ".5rem" }}
              title="Comments"
              className="comments-btn btn-text uk-margin-small-left"
              onClick={viewComments}
              data-uk-icon="icon: comment; ratio: 0.9"
            ></button>
          )}
        </h3>
        <ErrorBoundary>
          <button
            title="More Options"
            className="btn-icon"
            onClick={handleMore}
            disabled={enableEditing()}
          >
            <span uk-icon="icon: more-vertical; ratio: .8"></span>
          </button>
          <Dropdown pos="bottom-right">
            <li>
              <button className="kit-dropdown-btn" onClick={handleView}>
                <span
                  className="uk-margin-small-right"
                  data-uk-icon="list"
                ></span>
                {totalNoOfMeasures ? "View Measures" : "Add Measures"}
              </button>
            </li>
            <li>
              <button
                className="kit-dropdown-btn"
                onClick={handleEdit}
                disabled={enableEditing()}
              >
                <span
                  className="uk-margin-small-right"
                  data-uk-icon="pencil"
                ></span>
                Edit Objective
              </button>
            </li>
            <li>
              <button
                className="kit-dropdown-btn"
                onClick={handleRemove}
                disabled={enableEditing()}
              >
                <span
                  className="uk-margin-small-right"
                  data-uk-icon="trash"
                ></span>
                Remove Objective
              </button>
            </li>
          </Dropdown>
        </ErrorBoundary>
      </div>
      <div className="uk-margin">{children}</div>
    </div>
  );
});

interface IStrategicListProps {
  tab: string;
  objectives: IObjective[];
  perspectiveWeights: IPerspectiveWeights;
  agreement: IScorecardMetadata;
  measures: Measure[]
}

const StrategicList = observer((props: IStrategicListProps) => {
  const { tab, objectives, measures, perspectiveWeights, agreement } = props;

  const enableEditing = () => {
    const isEditing = agreement.agreementDraft.status === "pending" || agreement.agreementDraft.status === "in-progress"
    return !isEditing;
  };

  const getMeasures = (objective: IObjective) => {
    return measures.filter((measure) => measure.asJson.objective === objective.id).map((measure) => measure.asJson);
  };

  const handlePerspectiveWeight = () => {
    showModalFromId(MODAL_NAMES.EXECUTION.PERSPECTIVE_WEIGHTS_MODAL);
  };

  const perspectiveObjectiveGroup = (name: string, filter: string, weight: number | null = 0) => {

    const perpectiveObjectives = objectives.filter((o) => o.perspective === filter);

    const totalWeight = perpectiveObjectives.reduce((acc, curr) => acc + (curr.weight || 0), 0);

    return (
      <div className="objective-group">
        <div className="perspective-weight">
          <span className="name">{name}</span>
          <span className="arrow">
            <FontAwesomeIcon icon={faArrowRightLong} />
          </span>
          <span className="weight">Weight: {weight}%</span>
          {!enableEditing() && (
            <button
              className="btn-edit btn-primary"
              title="Edit the weight."
              onClick={handlePerspectiveWeight}
            >
              <FontAwesomeIcon icon={faPencilAlt} />
            </button>
          )}
        </div>

        {perpectiveObjectives.map((objective) => (
          <ErrorBoundary key={objective.id}>
            <ObjectiveItem
              objective={objective}
              totalNoOfMeasures={getMeasures(objective).length}
              enableEditing={enableEditing}
            >
              <MeasureTable measures={getMeasures(objective)} />
            </ObjectiveItem>
          </ErrorBoundary>
        ))}

        {/* Empty */}
        {!perpectiveObjectives.length && (
          <div className="uk-margin-small">
            <EmptyError errorMessage="No objectives found for this perspective " />
          </div>
        )}

        {/* Weight Error. */}
        {perpectiveObjectives.length !== 0 && (
          <WeightError weightError={totalWeight} pos="relative">
            The weights of the objectives under {name} don't add up to
          </WeightError>
        )}
      </div>
    );
  };

  if (tab === FINANCIAL_TAB.id)
    return perspectiveObjectiveGroup(
      FINANCIAL_TAB.name,
      FINANCIAL_TAB.id,
      perspectiveWeights.financial
    );
  if (tab === CUSTOMER_TAB.id)
    return perspectiveObjectiveGroup(
      CUSTOMER_TAB.name,
      CUSTOMER_TAB.id,
      perspectiveWeights.customer
    );
  if (tab === PROCESS_TAB.id)
    return perspectiveObjectiveGroup(
      PROCESS_TAB.name,
      PROCESS_TAB.id,
      perspectiveWeights.process
    );
  if (tab === GROWTH_TAB.id)
    return perspectiveObjectiveGroup(
      GROWTH_TAB.name,
      GROWTH_TAB.id,
      perspectiveWeights.growth
    );

  return (
    <>
      <ErrorBoundary>
        {perspectiveObjectiveGroup(
          FINANCIAL_TAB.name,
          FINANCIAL_TAB.id,
          perspectiveWeights.financial
        )}
      </ErrorBoundary>
      <ErrorBoundary>
        {perspectiveObjectiveGroup(
          CUSTOMER_TAB.name,
          CUSTOMER_TAB.id,
          perspectiveWeights.customer
        )}
      </ErrorBoundary>
      <ErrorBoundary>
        {perspectiveObjectiveGroup(
          PROCESS_TAB.name,
          PROCESS_TAB.id,
          perspectiveWeights.process
        )}
      </ErrorBoundary>
      <ErrorBoundary>
        {perspectiveObjectiveGroup(
          GROWTH_TAB.name,
          GROWTH_TAB.id,
          perspectiveWeights.growth
        )}
      </ErrorBoundary>
    </>
  );
});

interface IProps {
  agreement: IScorecardMetadata;
  objectives: Objective[];
  measures: Measure[];
  handleExportPDF: () => Promise<void>;
  handleExportExcel: () => Promise<void>;
  handleFeedback: () => void;
  handleScorecards: () => void;
  exportingExcelFile: boolean;
  exportingPDFFile: boolean;
  handleDuplicateScorecard: () => void;
  duplicateLoading: boolean;
}
const IndividualScorecardDraftCycle = observer((props: IProps) => {
  const { store } = useAppContext();
  const [tab, setTab] = useState(ALL_TAB.id);
  const { agreement, objectives, measures, handleExportExcel, handleExportPDF, handleFeedback, handleScorecards, exportingExcelFile,
    duplicateLoading, handleDuplicateScorecard, exportingPDFFile } = props;

  const enableEditing = () => {
    const isEditing = agreement.agreementDraft.status === "pending" || agreement.agreementDraft.status === "in-progress";
    return !isEditing;
  };


  const handleNewObjective = () => {
    store.objective.setPerspective(tab); // set the selected tab in the store.
    store.objective.clearSelected(); // clear selected objective
    showModalFromId(MODAL_NAMES.EXECUTION.OBJECTIVE_MODAL);
  };

  const sortByPerspective = (a: IObjective, b: IObjective) => {
    const order = ["F", "C", "P", "G"];
    const aIndex = order.indexOf(a.perspective.charAt(0));
    const bIndex = order.indexOf(b.perspective.charAt(0));
    return aIndex - bIndex;
  };

  const $objectives = useMemo(() => {
    const sorted = objectives.map((o) => o.asJson).sort(sortByPerspective);
    const _objectives = tab === ALL_TAB.id ? sorted : sorted.filter((o) => o.perspective === tab);
    return _objectives;
  }, [objectives, tab]);

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
                  <button
                    className="btn btn-primary uk-margin-small-right"
                    onClick={handleNewObjective}
                    disabled={enableEditing()}
                    title="Add a new objective to your scorecard"
                  >
                    <span data-uk-icon="icon: plus-circle; ratio:.8"></span> New
                    Objective
                  </button>
                  <div className="uk-inline">
                    <button
                      className="btn btn-primary"
                      title="Submit your draft for aproval, View past scorecards, and Export to PDF."
                    >
                      <span data-uk-icon="icon: more; ratio:.8"></span>
                    </button>

                    <Dropdown pos="bottom-right">
                      <li>
                        <ErrorBoundary>
                          <MoreButton
                            agreement={agreement}
                            agreementError={objectives.length === 0 || measures.length === 0}
                          />
                        </ErrorBoundary>
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
                      <li>
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
                      </li>
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
                <StrategicList tab={tab}
                  perspectiveWeights={agreement.perspectiveWeights}
                  agreement={agreement} measures={measures} objectives={$objectives} />)}
            </div>
          </ErrorBoundary>
          <ErrorBoundary>
            <Modal modalId={MODAL_NAMES.EXECUTION.VIEW_OBJECTIVE_DRAFT_COMMENT_MODAL}>
              <ViewObjectiveDraftCommentModal />
            </Modal>
          </ErrorBoundary>
        </div>
      </div>
    </ErrorBoundary>
  );
});

export default IndividualScorecardDraftCycle;