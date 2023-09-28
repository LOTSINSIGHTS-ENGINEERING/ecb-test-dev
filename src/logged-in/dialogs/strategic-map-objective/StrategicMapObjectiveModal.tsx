import { observer } from "mobx-react-lite";
import React, { useEffect } from "react";
import { useAppContext } from "../../../shared/functions/Context";
import { hideModalFromId } from "../../../shared/functions/ModalShow";
import { defaultObjective } from "../../../shared/models/Objective";
import MODAL_NAMES from "../ModalName";
import StrategicMapAudit from "./StrategicMapAudit";
import StrategicMapObjectiveTabs from "./StrategicMapObjectiveTabs";
import StrategicMapOverview from "./StrategicMapOverview";

const StrategicMapObjectiveModal = observer(() => {
  const { store } = useAppContext();
  const [selectedTab, setselectedTab] = React.useState("overview-tab");
  const [objective, setObjective] = React.useState(defaultObjective);

  useEffect(() => {
    if (store.objective.selected) {
      setObjective({ ...store.objective.selected });
    } else {
      setObjective({ ...defaultObjective });
      hideModalFromId(MODAL_NAMES.EXECUTION.MAP_OVERVIEW_MODAL);
    }
  }, [store.objective, store.objective.selected]);

  return (
    <div className="strategic-map-objective uk-modal-dialog uk-modal-body uk-margin-auto-vertical">
      <button
        className="uk-modal-close-default"
        type="button"
        data-uk-close
      ></button>
      <h3 className="uk-modal-title">{objective.description}</h3>
      <div className="dialog-content uk-position-relative">
        <div className="tabs">
          <StrategicMapObjectiveTabs
            selectedTab={selectedTab}
            setselectedTab={setselectedTab}
          />
        </div>
        {selectedTab === "overview-tab" && (
          <StrategicMapOverview objective={objective} />
        )}
        {selectedTab === "audit-tab" && (
          <StrategicMapAudit objective={objective} />
        )}
      </div>
    </div>
  );
});

export default StrategicMapObjectiveModal;
