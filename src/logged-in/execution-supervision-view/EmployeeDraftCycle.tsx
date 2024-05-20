import { observer } from "mobx-react-lite";
import { Dispatch, useEffect, useMemo, useState } from "react";
import Dropdown from "../../shared/components/dropdown/Dropdown";
import ErrorBoundary from "../../shared/components/error-boundary/ErrorBoundary";
import { useAppContext } from "../../shared/functions/Context";
import showModalFromId from "../../shared/functions/ModalShow";
import { ALL_TAB, CUSTOMER_TAB, FINANCIAL_TAB, GROWTH_TAB, PROCESS_TAB, fullPerspectiveName, } from "../../shared/interfaces/IPerspectiveTabs";
import MODAL_NAMES from "../dialogs/ModalName";
import Tabs from "../shared/components/tabs/Tabs";
import Toolbar from "../shared/components/toolbar/Toolbar";
import NoPerformanceData from "./NoPerformanceData";
import { faArrowRightLong, faCopy, faFileExcel, faPencilAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { dataFormat } from "../../shared/functions/Directives";
import Measure, { IMeasure } from "../../shared/models/Measure";
import Objective, { IObjective } from "../../shared/models/Objective";
import EmptyError from "../admin-settings/EmptyError";
import Modal from "../../shared/components/Modal";
import { IPerspectiveWeights, IScorecardMetadata } from "../../shared/models/ScorecardMetadata";
import PerformanceAgreementApprovalModal from "../dialogs/performance-agreement-approval/PerformanceAgreementApprovalModal";
import PerformanceAgreementRejectionModal from "../dialogs/performance-agreement-rejection/PerformanceAgreementRejectionModal";
import ObjectiveDraftCommentModal from "../dialogs/objective/ObjectiveDraftCommentModal";
import WeightError from "../shared/components/weight-error/WeightError";

interface IMeasureTableItemProps {
  measure: IMeasure;
}

const MeasureTableItem = observer((props: IMeasureTableItemProps) => {
  const { store } = useAppContext();
  const measure = props.measure;

  const dataType = measure.dataType;
  const dataSymbol = measure.dataSymbol || "";

  const readMeasureComment = () => {
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
          onClick={readMeasureComment}
          data-uk-icon="icon: comments; ratio: 0.7"
          type="button"
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
        {measures.length === 0 && <NoPerformanceData title={"No Data"} />}
      </div>
    </ErrorBoundary>
  );
});

interface IObjectiveItemProps {
  objective: IObjective;
  children?: React.ReactNode;
  handleComments: () => void;
}
const ObjectiveItem = observer((props: IObjectiveItemProps) => {
  const { objective, children, handleComments } = props;
  const { perspective, description, weight } = objective;

  return (
    <ErrorBoundary>
      <div className="objective uk-card uk-card-default uk-card-small uk-card-body uk-margin">
        <div className="uk-flex uk-flex-middle">
          <h3 className="objective-name uk-width-1-1">
            {description}
            <span className="objective-persepctive uk-margin-small-left">
              {fullPerspectiveName(perspective)}
            </span>
            <span className="objective-weight">Weight: {weight || 0}%</span>
            <button
              style={{ marginLeft: ".5rem" }}
              title="Comments"
              className="comments-btn btn-text uk-margin-small-left"
              onClick={handleComments}
              data-uk-icon="icon: comment; ratio: 0.9"
            ></button>
          </h3>
        </div>
        <div className="uk-margin">{children}</div>
      </div>
    </ErrorBoundary>
  );
});

interface IStrategicListProps {
  tab: string;
  objectives: IObjective[];
  perspectiveWeights: IPerspectiveWeights;
}


const StrategicList = observer((props: IStrategicListProps) => {
  const { tab, objectives, perspectiveWeights } = props;
  const { store } = useAppContext();

  const getMeasures = (objective: IObjective): IMeasure[] => {
    return store.measure.all.filter((measure) => measure.asJson.objective === objective.id)
      .map((measure) => measure.asJson);
  };

  
  const handleComments = (objective: IObjective) => {
    store.objective.select(objective);
    showModalFromId(MODAL_NAMES.EXECUTION.OBJECTIVE_DRAFT_COMMENT_MODAL);
  };

  const handlePerspectiveWeight = () => {
    showModalFromId(MODAL_NAMES.TEAM.TEAM_PERSPECTIVE_MODAL);
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
          {/* <button
            className="btn-edit btn-primary"
            title="Edit the weight."
            onClick={handlePerspectiveWeight}
          >
            <FontAwesomeIcon icon={faPencilAlt} />
          </button> */}
        </div>

        {perpectiveObjectives.map((objective) => (
          <ErrorBoundary key={objective.id}>
            <ObjectiveItem
              objective={objective}
              key={objective.id}
              handleComments={() => handleComments(objective)}

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
// const StrategicList = observer((props: IStrategicListProps) => {
//   const { store } = useAppContext();
//   const { tab, objectives } = props;

//   const handleComments = (objective: IObjective) => {
//     store.objective.select(objective);
//     showModalFromId(MODAL_NAMES.EXECUTION.OBJECTIVE_DRAFT_COMMENT_MODAL);
//   };

//   // const _objectives = useMemo(() => {
//   //   return tab === ALL_TAB.id ? objectives : objectives.filter((o) => o.asJson.perspective === tab);
//   // }, [tab, objectives]);
//   const getMeasures = (objective: IObjective): IMeasure[] => {
//     return store.measure.all.filter((measure) => measure.asJson.objective === objective.id)
//       .map((measure) => measure.asJson);
//   };


//   const handlePerspectiveWeight = () => {
//     showModalFromId(MODAL_NAMES.TEAM.TEAM_PERSPECTIVE_MODAL);
//   };

//   const perspectiveObjectiveGroup = (name: string, filter: string, weight: number | null = 0) => {
//     const perpectiveObjectives = objectives.filter((o) => o.perspective === filter);
//     const totalWeight = perpectiveObjectives.reduce((acc, curr) => acc + (curr.weight || 0), 0);
//   }


//     return (
//       <ErrorBoundary>
//         <div className="objective-table uk-margin">
//           {/* <ErrorBoundary>
//             {_objectives.map((objective) => (
//               <ObjectiveItem
//                 key={objective.asJson.id}
//                 objective={objective}
//                 handleComments={() => handleComments(objective.asJson)}
//               >
//                 <MeasureTable measures={objective.measures} />
//               </ObjectiveItem>
//             ))}
//           </ErrorBoundary> */}
//           {perpectiveObjectives.map((objective) => (
//             <ErrorBoundary key={objective.id}>
//               <ObjectiveItem
//                 objective={objective}
//                 key={objective.id}
//                 handleComments={() => handleComments(objective)}
//               >
//                 <MeasureTable measures={getMeasures(objective)} />
//               </ObjectiveItem>
//             </ErrorBoundary>
//           ))}
//           <ErrorBoundary>
//             {objectives.length === 0 && (<EmptyError errorMessage="No objective found" />)}
//           </ErrorBoundary>
//         </div>
//       </ErrorBoundary>
//     );
//   });


interface IDraftProps {
  agreement: IScorecardMetadata;
  handleExportPDF: () => Promise<void>;
  handleExportExcel: () => Promise<void>;
  exporting: boolean;
  setExporting: Dispatch<React.SetStateAction<boolean>>;
  measures: Measure[];
  objectives: Objective[];
  handleDuplicateScorecard: () => void;
  duplicateLoading: boolean;
}

const EmployeeDraftCycle = observer((props: IDraftProps) => {
  const { store } = useAppContext();
  const { agreement, handleExportExcel, handleExportPDF, exporting, objectives } = props;

  const [tab, setTab] = useState(ALL_TAB.id);
  const isDisabled = useMemo(() => !(agreement.agreementDraft.status === "submitted"), [agreement.agreementDraft.status]);


  const handleApproval = () => {
    store.individualScorecard.select(agreement);
    showModalFromId(MODAL_NAMES.EXECUTION.PERFORMANCE_AGREEMENT_DRAFT_APPROVAL_MODAL);
  };

  const handleRejection = () => {
    store.individualScorecard.select(agreement);
    showModalFromId(MODAL_NAMES.EXECUTION.PERFORMANCE_AGREEMENT_DRAFT_REJECTION_MODAL);
  };

  // useEffect(() => {
  //   if (store.objective) store.objective.selectPeriod("draft");
  // }, [store.objective]);


  if (
    agreement.agreementDraft.status === "pending" ||
    agreement.agreementDraft.status === "in-progress"
  )
    return (
      <ErrorBoundary>
        <NoPerformanceData title="Performance scorecard not submitted." />
      </ErrorBoundary>
    );

  const sortByPerspective = (a: IObjective, b: IObjective) => {
    const order = ["F", "C", "P", "G"];
    const aIndex = order.indexOf(a.perspective.charAt(0));
    const bIndex = order.indexOf(b.perspective.charAt(0));
    return aIndex - bIndex;
  };

  const $objectives = useMemo(() => {
    const sorted = objectives.map((o) => o.asJson).sort(sortByPerspective);
    const obj = tab === ALL_TAB.id ? sorted : sorted.filter((o) => o.perspective === tab);
    return obj;
  }, [objectives, tab]);

  return (
    <ErrorBoundary>
      <div className="scorecard-page uk-section uk-section-small">
        <div className="uk-container uk-container-xlarge">
          <ErrorBoundary>
            <Toolbar
              leftControls={
                <ErrorBoundary>
                  <Tabs tab={tab} setTab={setTab} noMap />
                </ErrorBoundary>
              }
              rightControls={
                <ErrorBoundary>

                  <div className="uk-inline">
                    <button className="btn btn-primary" type="button">
                      More <span data-uk-icon="icon: more; ratio:.8"></span>
                    </button>

                    <Dropdown pos="bottom-right">
                      <li>
                        <button
                          className="kit-dropdown-btn"
                          onClick={handleApproval}
                          disabled={isDisabled}
                          type="button"
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
                          disabled={isDisabled}
                          type="button"
                        >
                          <span
                            className="icon"
                            data-uk-icon="icon: close; ratio:.8"
                          ></span>
                          Revert Performance Scorecard for Changes
                        </button>
                      </li>
                      <li>
                        <button
                          className="kit-dropdown-btn"
                          onClick={handleExportPDF}
                          title="Export scorecard as PDF."
                          disabled={exporting}
                          type="button"
                        >
                          <span data-uk-icon="icon: file-pdf; ratio:.8"></span>{" "}
                          {exporting ? "Exporting..." : "Export PDF"}
                        </button>
                      </li>
                      <li>
                        <button
                          className="kit-dropdown-btn"
                          onClick={handleExportExcel}
                          title="Export scorecard as EXCEL."
                          type="button"
                        >
                          <FontAwesomeIcon
                            icon={faFileExcel}
                            size="lg"
                            className="icon uk-margin-small-right"
                          />
                          Export Excel
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
            <StrategicList tab={tab} objectives={$objectives} perspectiveWeights={agreement.perspectiveWeights} />
          </ErrorBoundary>
          <ErrorBoundary>
            <Modal modalId={MODAL_NAMES.EXECUTION.PERFORMANCE_AGREEMENT_DRAFT_APPROVAL_MODAL}>
              <PerformanceAgreementApprovalModal />
            </Modal>
          </ErrorBoundary>
          <ErrorBoundary>
            <Modal modalId={MODAL_NAMES.EXECUTION.PERFORMANCE_AGREEMENT_DRAFT_REJECTION_MODAL}>
              <PerformanceAgreementRejectionModal />
            </Modal>
          </ErrorBoundary>
          <ErrorBoundary>
            <Modal modalId={MODAL_NAMES.EXECUTION.OBJECTIVE_DRAFT_COMMENT_MODAL}>
              <ObjectiveDraftCommentModal />
            </Modal>
          </ErrorBoundary>
        </div>
      </div>
    </ErrorBoundary>
  );
});

export default EmployeeDraftCycle;
