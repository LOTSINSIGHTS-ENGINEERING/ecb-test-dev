import { faFilePdf, faFileExcel, faCommentDots, } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { observer } from "mobx-react-lite";
import { useMemo, useState } from "react";
import Dropdown from "../../shared/components/dropdown/Dropdown";
import ErrorBoundary from "../../shared/components/error-boundary/ErrorBoundary";
import showModalFromId from "../../shared/functions/ModalShow";
import { ALL_TAB, fullPerspectiveName } from "../../shared/interfaces/IPerspectiveTabs";
import MODAL_NAMES from "../dialogs/ModalName";
import Tabs from "../shared/components/tabs/Tabs";
import Toolbar from "../shared/components/toolbar/Toolbar";
import WeightError from "../shared/components/weight-error/WeightError";
import MeasureCompany from "../../shared/models/MeasureCompany";
import { dataFormat } from "../../shared/functions/Directives";
import EmptyError from "../admin-settings/EmptyError";
import NoMeasures from "./NoMeasures";
import { IScorecardMetadata } from "../../shared/models/ScorecardMetadata";
import { sortByPerspective } from "../shared/utils/utils";
import ObjectiveCompany, { IObjectiveCompany } from "../../shared/models/ObjectiveCompany";
import NoPerformanceData from "./NoPerformanceData";
import Modal from "../../shared/components/Modal";
import CompanyScorecardDraftApprovalModal from "../dialogs/company-scorecard-draft-approval/CompanyScorecardDraftApprovalModal";
import CompanyScorecardDraftRejectionModal from "../dialogs/company-scorecard-draft-rejection/CompanyScorecardDraftRejectionModal";
import { useAppContext } from "../../shared/functions/Context";
import ObjectiveCompanyDraftCommentModal from "../dialogs/objective-company/ObjectiveCompanyDraftCommentModal";

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
      <td className="uk-width-expand@s kit-sticky-column no-whitespace">
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
      <td className=" no-whitespace">
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
        {dataFormat(dataType, measure.rating2, dataSymbol)}
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
  objective: ObjectiveCompany;
  children?: React.ReactNode;
  handleComments: () => void;
}
const ObjectiveItem = observer((props: IObjectiveItemProps) => {
  const { objective, children, handleComments } = props;
  const { description, perspective, weight } = objective.asJson;

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
          <button
            style={{ marginLeft: ".5rem" }}
            title="Comments"
            className="comments-btn btn-text uk-margin-small-left"
            onClick={handleComments}
            data-uk-icon="icon: comments; ratio: 0.8"
          ></button>
        </h3>
      </div>
      <div className="uk-margin">{children}</div>
    </div>
  );
});

interface IStrategicListProps {
  objectives: ObjectiveCompany[];
}
const StrategicList = (props: IStrategicListProps) => {
  const { store } = useAppContext();
  const { objectives } = props;

  const handleComments = (objective: IObjectiveCompany) => {
    store.companyObjective.select(objective);
    showModalFromId(MODAL_NAMES.EXECUTION.OBJECTIVE_COMPANY_DRAFT_COMMENT_MODAL);
  };

  return (
    <div className="objective-table uk-margin">
      {objectives.map((objective) => (
        <ObjectiveItem key={objective.asJson.id} objective={objective}
          handleComments={() => handleComments(objective.asJson)}
        >
          <MeasureTable measures={objective.measures} />
        </ObjectiveItem>
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
}
const CompanyScorecardReviewDraftCycle = observer((props: IProps) => {
  const { agreement, objectives, hasAccess, handleExportExcel, handleExportPDF } = props;

  const [tab, setTab] = useState(ALL_TAB.id);

  const isActive = useMemo(() => agreement.agreementDraft.status === "submitted",
    [agreement.agreementDraft.status]
  );

  const totalWeight = useMemo(() => {
    return objectives.reduce((acc, curr) => acc + (curr.asJson.weight || 0), 0);
  }, [objectives]);

  const filteredObjectivesByPerspective = useMemo(() => {
    const sorted = objectives.sort(sortByPerspective);
    return tab === ALL_TAB.id ? sorted : sorted.filter((o) => o.asJson.perspective === tab);
  }, [objectives, tab]);

  const handleApproval = () => {
    showModalFromId(MODAL_NAMES.EXECUTION.COMPANY_DRAFT_APPROVAL_MODAL);
  }

  const handleRejection = () => {
    showModalFromId(MODAL_NAMES.EXECUTION.COMPANY_DRAFT_REJECTION_MODAL);
  }

  if (
    agreement.agreementDraft.status === "pending" ||
    agreement.agreementDraft.status === "in-progress"
  )
    return (
      <ErrorBoundary>
        <NoPerformanceData title="Performance scorecard not submitted." />
      </ErrorBoundary>
    );

  return (
    <ErrorBoundary>
      <div className="company-plan-view-page uk-section uk-section-small">
        <div className="uk-container uk-container-xlarge">
          <ErrorBoundary>
            <Toolbar
              leftControls={<Tabs tab={tab} setTab={setTab} noMap />}
              rightControls={
                <ErrorBoundary>
                  <div className="uk-inline">
                    <button
                      className="btn btn-primary"
                      title="Submit your draft for aproval, View past scorecards, and Export to PDF." >
                      More <span data-uk-icon="icon: more; ratio:.8"></span>
                    </button>
                    <Dropdown pos="bottom-right">
                      {hasAccess && (
                        <>
                          {isActive && (
                            <>
                              <li>
                                <button
                                  className="kit-dropdown-btn"
                                  onClick={handleApproval}
                                  disabled={!hasAccess}
                                >
                                  <span
                                    className="icon"
                                    data-uk-icon="icon: check; ratio:.8"
                                  ></span>
                                  Approve Performance Scorecard
                                </button>
                              </li>
                              <li>
                                <button
                                  className="kit-dropdown-btn"
                                  onClick={handleRejection}
                                  disabled={!hasAccess}
                                >
                                  <span
                                    className="icon"
                                    data-uk-icon="icon: close; ratio:.8"
                                  ></span>
                                  Revert Performance Scorecard for Changes
                                </button>
                              </li>
                            </>
                          )}
                        </>
                      )}

                      <li>
                        <button
                          className="kit-dropdown-btn"
                          onClick={handleExportPDF}
                          title="Export your scorecard as PDF."
                        >
                          <FontAwesomeIcon
                            icon={faFilePdf}
                            size="lg"
                            className="icon uk-margin-small-right"
                          />
                          Export PDF
                        </button>
                      </li>
                      <li>
                        <button
                          className="kit-dropdown-btn"
                          onClick={handleExportExcel}
                          title="Export your scorecard as EXCEL."
                        >
                          <FontAwesomeIcon
                            icon={faFileExcel}
                            size="lg"
                            className="icon uk-margin-small-right"
                          />
                          Export Excel
                        </button>
                      </li>
                    </Dropdown>
                  </div>
                </ErrorBoundary>
              }
            />
          </ErrorBoundary>

          <ErrorBoundary>
            {objectives.length !== 0 && (
              <WeightError weightError={totalWeight} />
            )}
          </ErrorBoundary>

          <ErrorBoundary>
            <div className="uk-margin">
              <StrategicList objectives={filteredObjectivesByPerspective} />
            </div>
          </ErrorBoundary>
        </div>
      </div>
      <ErrorBoundary>
        <Modal modalId={MODAL_NAMES.EXECUTION.COMPANY_DRAFT_APPROVAL_MODAL}>
          <CompanyScorecardDraftApprovalModal agreement={agreement} />
        </Modal>
      </ErrorBoundary>
      <ErrorBoundary>
        <Modal modalId={MODAL_NAMES.EXECUTION.COMPANY_DRAFT_REJECTION_MODAL}>
          <CompanyScorecardDraftRejectionModal agreement={agreement} />
        </Modal>
      </ErrorBoundary>
      <ErrorBoundary>
        <Modal modalId={MODAL_NAMES.EXECUTION.OBJECTIVE_COMPANY_DRAFT_COMMENT_MODAL}>
          <ObjectiveCompanyDraftCommentModal />
        </Modal>
      </ErrorBoundary>
    </ErrorBoundary>
  );
});

export default CompanyScorecardReviewDraftCycle;
