import { observer } from "mobx-react-lite";
import { useAppContext } from "../../../shared/functions/Context";
import NodeRow from "./NodeRow";
import Node from "./Node";
import { CUSTOMER_TAB, FINANCIAL_TAB, GROWTH_TAB, PROCESS_TAB, } from "../../../shared/interfaces/IPerspectiveTabs";
import { mission, vision, } from "../../../shared/components/vision-mission/VisionMission";
import ErrorBoundary from "../../../shared/components/error-boundary/ErrorBoundary";
import { useState, useEffect } from "react";
import Modal from "../../../shared/components/Modal";
import MODAL_NAMES from "../../dialogs/ModalName";
import { LoadingEllipsis } from "../../../shared/components/loading/Loading";
import StrategicMapObjectiveCompanyModal from "../../dialogs/strategic-map-objective-company/StrategicMapObjectiveCompanyModal";

const CompanyStrategicMap = observer(() => {
  const { store, api } = useAppContext();
  const [loading, setLoading] = useState(false);
  const fyid = store.scorecard.activeId;
  const getObjectivesPerPerspective = (perspective: string) => {
    return store.companyObjective.all.filter((objective) => objective.asJson.perspective === perspective).map((objective) => objective.asJson);
  };

  useEffect(() => {
    const loadAll = async () => {
      if (!fyid) return;
      setLoading(true);
      try {
        await api.companyObjective.getAll(fyid);
        await api.companyMeasure.getAll(fyid);
        await api.strategicTheme.getAll(fyid);
      } catch (error) {
      }
      setLoading(false);
    };

    loadAll();
  }, [api.strategicTheme, api.companyMeasure, api.companyObjective, fyid]);


  if (loading) return (
    <LoadingEllipsis fullHeight />
  )

  return (
    <>
      <div className="strategic-map uk-card uk-card-default uk-card-body uk-card-small uk-margin-bottom">
        <div className="map">
          <div className="uk-child-width-1-2 uk-grid-match uk-grid-small uk-margin-bottom"
            data-uk-grid>
            <div>
              <div className=" uk-child-width-1-1" data-uk-grid>
                <div>
                  <div className="vmission uk-card uk-card-body">
                    <p>{vision}</p>
                  </div>
                </div>
                <div className="uk-margin-small-top">
                  <div className=" vmission uk-card uk-card-body">
                    <p>{mission}</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div className="goals uk-card uk-card-body">
                <h3 className="uk-card-title">Strategic Goals</h3>
                <ol>
                  {store.strategicTheme.all.map((theme) => (
                    <li key={theme.asJson.id}>{theme.asJson.description}</li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
          <table className="objectives">
            <tbody>
              <NodeRow perspective={FINANCIAL_TAB.perspective}>
                {getObjectivesPerPerspective(FINANCIAL_TAB.id).map(
                  (objective) => (
                    <ErrorBoundary key={objective.id}>
                      <Node objective={objective} />
                    </ErrorBoundary>
                  )
                )}
              </NodeRow>

              <NodeRow perspective={CUSTOMER_TAB.perspective}>
                {getObjectivesPerPerspective(CUSTOMER_TAB.id).map(
                  (objective) => (
                    <ErrorBoundary key={objective.id}>
                      <Node objective={objective} />
                    </ErrorBoundary>
                  )
                )}
              </NodeRow>
              <NodeRow perspective={PROCESS_TAB.perspective}>
                {getObjectivesPerPerspective(PROCESS_TAB.id).map(
                  (objective) => (
                    <ErrorBoundary>
                      <Node objective={objective} />
                    </ErrorBoundary>
                  )
                )}
              </NodeRow>
              <NodeRow perspective={GROWTH_TAB.perspective}>
                {getObjectivesPerPerspective(GROWTH_TAB.id).map(
                  (objective) => (
                    <ErrorBoundary key={objective.id}>
                      <Node objective={objective} />
                    </ErrorBoundary>
                  )
                )}
              </NodeRow>
            </tbody>
          </table>
        </div>
      </div>
      <Modal modalId={MODAL_NAMES.EXECUTION.COMPANY_MAP_OVERVIEW_MODAL} cssClass="uk-modal-container">
        <StrategicMapObjectiveCompanyModal />
      </Modal>
    </>
  );
});

export default CompanyStrategicMap;
