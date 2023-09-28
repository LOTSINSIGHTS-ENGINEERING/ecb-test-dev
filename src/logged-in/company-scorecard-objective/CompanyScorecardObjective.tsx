import { useEffect, useMemo, useState } from "react";
import Toolbar from "../shared/components/toolbar/Toolbar";
import Modal from "../../shared/components/Modal";
import MODAL_NAMES from "../dialogs/ModalName";
import showModalFromId from "../../shared/functions/ModalShow";
import { observer } from "mobx-react-lite";
import { useAppContext } from "../../shared/functions/Context";
import { useNavigate, useParams } from "react-router-dom";
import useTitle from "../../shared/hooks/useTitle";
import MeasureCompanyModal from "../dialogs/measure-company/MeasureCompanyModal";
import WeightError from "../shared/components/weight-error/WeightError";
import MeasureCompanyUpdateActualModal from "../dialogs/measure-company-q2-update/MeasureCompanyUpdateQ2ActualModal";
import useBackButton from "../../shared/hooks/useBack";
import MeasureStatusUpdateCompanyModal from "../dialogs/measure-status-update-company/MeasureStatusUpdateCompanyModal";
import ErrorBoundary from "../../shared/components/error-boundary/ErrorBoundary";
import Dropdown from "../../shared/components/dropdown/Dropdown";
import { dataFormat } from "../../shared/functions/Directives";
import { IMeasureCompany } from "../../shared/models/MeasureCompany";
import NoMeasures from "../no-measures/NoMeasures";
import { IObjectiveCompany } from "../../shared/models/ObjectiveCompany";

interface IMeasureTableItemProps {
  measure: IMeasureCompany;
}
const MeasureTableItem = (props: IMeasureTableItemProps) => {
  const { api, store } = useAppContext();
  const { measure } = props;

  const dataType = measure.dataType;
  const dataSymbol = measure.dataSymbol || "";

  const handleEditStatusUpdate = () => {
    store.companyMeasure.select(measure); // select measure
    showModalFromId(MODAL_NAMES.EXECUTION.COMPANY_MEASURE_STATUS_UPDATE_MODAL);
  };

  const handleEditMeasure = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    store.companyMeasure.select(measure); // select measure
    showModalFromId(MODAL_NAMES.EXECUTION.COMPANY_MEASURE_MODAL);
  };

  const handleDeleteMeasure = () => {
    if (!window.confirm("Remove measure?")) return;
    api.companyMeasure.delete(measure);
  };

  return (
    <ErrorBoundary>
      <tr className="row">
        <td>
          {measure.description}
          <button
            className="comments-btn btn-text uk-margin-small-left"
            onClick={handleEditStatusUpdate}
            data-uk-icon="icon: commenting; ratio: 1"
          ></button>
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
        <td>
          <div className="controls">
            <button className="btn-icon">
              <span uk-icon="more"></span>
            </button>
            <Dropdown>
              <li>
                <button
                  className="kit-dropdown-btn"
                  onClick={handleEditMeasure}
                >
                  <span uk-icon="pencil"></span> Edit Measure
                </button>
              </li>
              <li>
                <button
                  className="kit-dropdown-btn"
                  onClick={handleDeleteMeasure}
                >
                  <span uk-icon="trash"></span> Delete Measure
                </button>
              </li>
            </Dropdown>
          </div>
        </td>
      </tr>
    </ErrorBoundary>
  );
};

interface IMeasureTableProps {
  objective: IObjectiveCompany;
}
const MeasureTable = observer((props: IMeasureTableProps) => {
  const { store } = useAppContext();
  const { objective } = props;

  const measures = useMemo(() => {
    return store.companyMeasure.all.filter((measure) => measure.asJson.objective === objective.id).map((measure) => measure.asJson);
  }, [store.companyMeasure.all]);

  return (
    <div className="objective-measures">
      <div className="measures uk-card uk-card-default uk-card-body uk-card-small">
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
                  <th></th>
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
          )}
          {measures.length === 0 && <NoMeasures />}
        </div>
      </div>
    </div>
  );
});

const CompanyScorecardObjective = observer(() => {
  const { store } = useAppContext();
  const { fyid, objectiveId } = useParams();

  const [_, setTitle] = useTitle(); // set page title
  const [totalWeight, settotalWeight] = useState(0);
  const [objective, setObjective] = useState<IObjectiveCompany | null>(null);
  const navigate = useNavigate();
  useBackButton("/c/strategy/company/" + fyid);

  const handleNewMeasure = () => {
    store.companyMeasure.clearSelected(); // clear selected measure
    showModalFromId(MODAL_NAMES.EXECUTION.COMPANY_MEASURE_MODAL);
  };

  useEffect(() => {
    const getObjective = () => {
      const objective = store.companyObjective.all.find((objective) => objective.asJson.id === objectiveId);
      if (objective) {
        store.companyObjective.select(objective.asJson);
        setObjective(objective.asJson);
      } else navigate("/c/strategy/company/");
    };
    getObjective();
  }, [store.companyObjective, navigate, objectiveId]);

  useEffect(() => {
    const calculateTotalWeight = () => {
      const weight = store.companyObjective.all.reduce((acc, curr) => acc + (curr.asJson.weight || 0), 0);
      settotalWeight(weight);
    };
    calculateTotalWeight();
  }, [store.companyObjective.all]);

  useEffect(() => {
    const setPageTitle = () => {
      if (!objective) return;
      setTitle(objective.description);
    };

    setPageTitle();
  }, [objective, setTitle]);

  return (
    <ErrorBoundary>
      <div className="objective-page uk-section uk-section-small">
        <div className="uk-container uk-container-xlarge">
          <ErrorBoundary>
            <Toolbar
              rightControls={
                <ErrorBoundary>
                  <button
                    className="btn btn-primary"
                    onClick={handleNewMeasure} >
                    <span data-uk-icon="icon: plus-circle; ratio:.8"></span> New
                    Measure
                  </button>
                </ErrorBoundary>
              }
            />
          </ErrorBoundary>

          <ErrorBoundary>
            {!store.companyObjective.isEmpty && (<WeightError weightError={totalWeight} />)}
          </ErrorBoundary>

          <ErrorBoundary>
            {objective && <MeasureTable objective={objective} />}
          </ErrorBoundary>
        </div>
      </div>

      {/* Modals */}
      <ErrorBoundary>
        <Modal modalId={MODAL_NAMES.EXECUTION.COMPANY_MEASURE_MODAL}>
          <MeasureCompanyModal />
        </Modal>
        <Modal modalId={MODAL_NAMES.EXECUTION.COMPANY_MEASURE_UPDATE_ACTUAL_MODAL}>
          <MeasureCompanyUpdateActualModal />
        </Modal>
        <Modal modalId={MODAL_NAMES.EXECUTION.COMPANY_MEASURE_STATUS_UPDATE_MODAL}>
          <MeasureStatusUpdateCompanyModal />
        </Modal>
      </ErrorBoundary>
    </ErrorBoundary>
  );
});

export default CompanyScorecardObjective;
