import { faCheck, faCommentDots, faFileExcel, faFilePdf, faPaperPlane, faCopy, faArrowRightLong, faPencilAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { observer } from "mobx-react-lite";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Dropdown from "../../shared/components/dropdown/Dropdown";
import ErrorBoundary from "../../shared/components/error-boundary/ErrorBoundary";
import { useAppContext } from "../../shared/functions/Context";
import { dataFormat } from "../../shared/functions/Directives";
import showModalFromId from "../../shared/functions/ModalShow";
import { ALL_TAB, CUSTOMER_TAB, FINANCIAL_TAB, fullPerspectiveName, GROWTH_TAB, MAP_TAB, PROCESS_TAB } from "../../shared/interfaces/IPerspectiveTabs";
import MeasureCompany from "../../shared/models/MeasureCompany";
import ObjectiveCompany from "../../shared/models/ObjectiveCompany";
import { IPerspectiveWeights, IScorecardMetadata } from "../../shared/models/ScorecardMetadata";
import { IScorecardReview } from "../../shared/models/ScorecardReview";
import EmptyError from "../admin-settings/EmptyError";
import NoMeasures from "../no-measures/NoMeasures";
import MODAL_NAMES from "../dialogs/ModalName";
import AgreementError from "../shared/components/agreement-error/AgreementError";
import Tabs from "../shared/components/tabs/Tabs";
import Toolbar from "../shared/components/toolbar/Toolbar";
import WeightError from "../shared/components/weight-error/WeightError";
import { sortByPerspective } from "../shared/utils/utils";
import CompanyStrategicMap from "./strategic-map/CompanyStrategicMap";
import ViewObjectiveCompanyDraftCommentModal from "../dialogs/objective-company/ViewObjectiveCompanyDraftCommentModal";
import Modal from "../../shared/components/Modal";
import { DuplicationModal } from "./DuplicationModal";
import { IObjective } from "../../shared/models/Objective";
import { IMeasure } from "../../shared/models/Measure";

interface IMoreButtonProps {
  agreement: IScorecardMetadata;
  isEmptyObjectiveError: boolean;
  isWeightError: boolean;
}
const MoreButton = observer((props: IMoreButtonProps) => {
  const { agreement, isEmptyObjectiveError, isWeightError } = props;
  const { api, ui, store } = useAppContext();

  const me = store.auth.meJson;

  const objectives = store.companyObjective.all;
  const measures = store.companyMeasure.all;
  const measureAudits = store.companyMeasureAudit.all;
  const reviewApi = api.companyScorecardReview.draft;
  const scorecard = store.scorecard.active;

  const isDisabled = useMemo(() => !scorecard || scorecard.draftReview.status !== "in-progress", [scorecard]);
  const status = useMemo(() => agreement.agreementDraft.status || "pending", [agreement.agreementDraft.status]);

  const onSubmitScorecardDraftForApproval = async () => {
    if (!me) return;

    const _objectives = objectives.map((o) => o.asJson);
    const _measures = measures.map((m) => m.asJson);
    const _measureAudits = measureAudits.map((m) => m.asJson);

    const $review = reviewApi.transform(me, _objectives, _measures, _measureAudits);

    const $agreement = agreement;
    $agreement.agreementDraft.status = "submitted";
    $agreement.agreementDraft.submittedOn = new Date().toDateString();

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
        message: "Submitted company scorecard for approval.",
        type: "success",
      });
    } catch (error) {
      ui.snackbar.load({
        id: Date.now(),
        message: "Error! Failed to submit company scorecard for approval.",
        type: "danger",
      });
    }
  };

  return (
    <ErrorBoundary>
      {status === "pending" && (
        <button
          className="kit-dropdown-btn"
          onClick={onSubmitScorecardDraftForApproval}
        // disabled={isDisabled || isEmptyObjectiveError || isWeightError}
        >
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
  measure: MeasureCompany;
}
const MeasureTableItem = observer((props: IMeasureTableItemProps) => {
  const { store } = useAppContext();
  const measure = props.measure.asJson;

  const dataType = measure.dataType;
  const dataSymbol = measure.dataSymbol || "";

  const handleEditComments = () => {
    store.companyMeasure.select(measure); // select measure
    showModalFromId(MODAL_NAMES.EXECUTION.MEASURE_COMMENTS_COMPANY_MODAL);
  };

  return (
    <tr className="row">
      <td>{measure.description}
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
  measures: MeasureCompany[];
}
const MeasureTable = (props: IMeasureTableProps) => {
  const { measures } = props;

  return (
    <div className="measure-table">
      {measures.length !== 0 && (
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
              <ErrorBoundary key={measure.asJson.id}>
                <MeasureTableItem measure={measure} />
              </ErrorBoundary>
            ))}
          </tbody>
        </table>
      )}

      {measures.length === 0 && <NoMeasures />}
    </div>
  );
};

interface IObjectiveItemProps {
  isEditing: boolean;
  hasAccess: boolean;
  objective: ObjectiveCompany;
  children?: React.ReactNode;
  totalNoOfMeasures: number;
}
const ObjectiveItem = observer((props: IObjectiveItemProps) => {
  const { api, store } = useAppContext();
  const { hasAccess, isEditing, children, objective, totalNoOfMeasures } = props;
  const { description, perspective, weight, draftComment } = objective.asJson;

  const navigate = useNavigate();

  const handleView = () => {
    navigate(`${objective.asJson.id}`);
  };

  const viewComments = () => {
    store.companyObjective.select(objective.asJson);
    showModalFromId(MODAL_NAMES.EXECUTION.VIEW_OBJECTIVE_COMPANY_DRAFT_COMMENT_MODAL);
  };

  const handleEdit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    store.companyObjective.select(objective.asJson);
    showModalFromId(MODAL_NAMES.EXECUTION.OBJECTIVE_MODAL);
  };

  const handleRemove = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.stopPropagation();
    if (!window.confirm("Remove objective?")) return;
    await removeAllMeasures();
    await api.companyObjective.delete(objective.asJson);
  };

  const removeAllMeasures = async () => {
    for (const measure of store.companyMeasure.all) {
      if (measure.asJson.objective === objective.asJson.id) {
        await api.companyMeasure.delete(measure.asJson);
      }
    }
  };

  return (
    <div className="objective uk-card uk-card-default uk-card-small uk-card-body uk-margin">
      <div className="uk-flex uk-flex-middle">
        <h3 className="objective-name uk-width-1-1">
          <span>{description} </span>
          <div className="uk-margin-small-top" />
          <span className="objective-persepctive">
            {fullPerspectiveName(perspective)}
          </span>
          <span className="objective-weight">Weight: {weight || 0}%</span>
          {draftComment !== "" && (
            <button
              style={{ marginLeft: ".5rem" }}
              title="comments"
              className="comments-btn btn-text uk-margin-small-left"
              onClick={viewComments}
              data-uk-icon="icon: comments; ratio: 0.8"
            ></button>
          )}
        </h3>
        {hasAccess && (
          <ErrorBoundary>
            <button className="btn-icon">
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
                <button className="kit-dropdown-btn" onClick={handleEdit}
                // disabled={!isEditing}
                >
                  <span
                    className="uk-margin-small-right"
                    data-uk-icon="pencil"
                  ></span>
                  Edit Objective
                </button>
              </li>
              <li>
                <button className="kit-dropdown-btn" onClick={handleRemove}
                // disabled={!isEditing}
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
        )}
      </div>
      <div className="uk-margin">{children}</div>
    </div>
  );
});

interface IStrategicListProps {
  isEditing: boolean;
  hasAccess: boolean;
  objectives: ObjectiveCompany[];
  tab: string;
  perspectiveWeights: IPerspectiveWeights;
}

const StrategicList = observer((props: IStrategicListProps) => {
  const { tab, objectives, perspectiveWeights, isEditing, hasAccess } = props;
  const { store } = useAppContext();

  const getMeasures = (objective: IObjective): IMeasure[] => {
    return store.measure.all.filter((measure) => measure.asJson.objective === objective.id)
      .map((measure) => measure.asJson);
  };

  const handlePerspectiveWeight = () => {
    showModalFromId(MODAL_NAMES.TEAM.TEAM_PERSPECTIVE_MODAL);
  };

  const perspectiveObjectiveGroup = (name: string, filter: string, weight: number | null = 0) => {
    const perpectiveObjectives = objectives.filter((o) => o.asJson.perspective === filter);
    const totalWeight = perpectiveObjectives.reduce((acc, curr) => acc + (curr.asJson.weight || 0), 0);

    return (
      <div className="objective-group">
        <div className="perspective-weight" style={{ background: "white", color: "#0097af", padding: "4px", }}>
          <span className="name">{name}</span>
          <span className="arrow">
            <FontAwesomeIcon icon={faArrowRightLong} />
          </span>
          <span className="weight">Weight: {weight}%</span>
          {/* <button
            className="btn-edit btn-primary"
            title="Edit the weight."
            onClick={handlePerspectiveWeight}
          >
            <FontAwesomeIcon icon={faPencilAlt} />
          </button> */}
        </div>

        {perpectiveObjectives.map((objective) => (
          <ErrorBoundary key={objective.asJson.id}>
            <ObjectiveItem
              objective={objective}
              isEditing={isEditing}
              hasAccess={hasAccess}
              totalNoOfMeasures={objective.measures.length}
            >
              <MeasureTable measures={objective.measures} />
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
// const StrategicList = observer((props: IStrategicListProps) => {
//   const { hasAccess, objectives, isEditing } = props;

//   return (
//     <div className="objective-table uk-margin">
//       {objectives.map((objective) => (
//         <ErrorBoundary key={objective.asJson.id}>
//           <ObjectiveItem
//             objective={objective}
//             isEditing={isEditing}
//             hasAccess={hasAccess}
//             totalNoOfMeasures={objective.measures.length}
//           >
//             <MeasureTable measures={objective.measures} />
//           </ObjectiveItem>
//         </ErrorBoundary>
//       ))}
//       {!objectives.length && <EmptyError errorMessage="No objective found" />}
//     </div>
//   );
// });

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

const CompanyScorecardDraftCycle = observer((props: IProps) => {
  const { store } = useAppContext();
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

  const [tab, setTab] = useState(ALL_TAB.id);

  const isEditing = useMemo(() => agreement.agreementDraft.status === "pending",
    [agreement.agreementDraft.status]);

  const isEmptyObjectiveError = useMemo(() => objectives.some((o) => o.measures.length === 0),
    [objectives]
  );

  const totalWeight = useMemo(() => {
    return objectives.reduce((acc, curr) => acc + (curr.asJson.weight || 0), 0);
  }, [objectives]);

  const filteredObjectivesByPerspective = useMemo(() => {
    const sorted = objectives.sort(sortByPerspective);
    return tab === ALL_TAB.id ? sorted : sorted.filter((o) => o.asJson.perspective === tab);
  }, [objectives, tab]);

  const handleNewObjective = () => {
    store.companyObjective.clearSelected();
    showModalFromId(MODAL_NAMES.EXECUTION.OBJECTIVE_MODAL);
  };
  const handleDuplicAation = () => {
    store.companyObjective.clearSelected();
    showModalFromId(MODAL_NAMES.EXECUTION.DUPLICATION_MODAL);
  };

  return (
    <div className="company-plan-view-page uk-section uk-section-small">
      <div className="uk-container uk-container-xlarge">
        <ErrorBoundary>
          <Toolbar
            leftControls={<Tabs tab={tab} setTab={setTab} />}
            rightControls={
              <ErrorBoundary>
                <button
                  className="btn btn-primary uk-margin-small-right"
                  onClick={handleDuplicAation}
                >
                  <span data-uk-icon="icon: plus-circle; ratio:.8"></span>
                  Duplicate Company Scorecard
                </button>
                <button
                  className="btn btn-primary uk-margin-small-right"
                  onClick={handleNewObjective}
                // disabled={!isEditing}
                >
                  <span data-uk-icon="icon: plus-circle; ratio:.8"></span> New
                  Objective
                </button>
                <div className="uk-inline">
                  <button
                    className="btn btn-primary"
                    title="Submit your draft for aproval, View past scorecards, and Export to PDF."
                  >
                    More <span data-uk-icon="icon: more; ratio:.8"></span>
                  </button>
                  <Dropdown pos="bottom-right">
                    {hasAccess && (
                      <li>
                        <MoreButton
                          agreement={agreement}
                          isEmptyObjectiveError={isEmptyObjectiveError}
                          isWeightError={totalWeight !== 100}
                        />
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
          {isEmptyObjectiveError && <AgreementError />}
          {objectives.length !== 0 && <WeightError weightError={totalWeight} />}
        </ErrorBoundary>
        <ErrorBoundary>
          <div className="uk-margin">
            {tab === MAP_TAB.id && <CompanyStrategicMap />}
            {tab !== MAP_TAB.id && (<StrategicList
              isEditing={isEditing}
              hasAccess={hasAccess}
              tab={tab}
              perspectiveWeights={agreement.perspectiveWeights}
              objectives={filteredObjectivesByPerspective} />
            )}
          </div>
        </ErrorBoundary>
        <ErrorBoundary>
          <Modal modalId={MODAL_NAMES.EXECUTION.VIEW_OBJECTIVE_COMPANY_DRAFT_COMMENT_MODAL}>
            <ViewObjectiveCompanyDraftCommentModal />
          </Modal>
          <Modal modalId={MODAL_NAMES.EXECUTION.DUPLICATION_MODAL}>
            <DuplicationModal />
          </Modal>
        </ErrorBoundary>
      </div>
    </div>
  );
});

export default CompanyScorecardDraftCycle;