import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { useAppContext } from "../../../shared/functions/Context";
import { hideModalFromId } from "../../../shared/functions/ModalShow";
import { defaultMeasure, IMeasure } from "../../../shared/models/Measure";
import MODAL_NAMES from "../ModalName";
import MeasureForm, { MeasureCommentsForm } from "./ReadOnlyMeasureForm";

interface ITabsProps {
  tab: "Metrics" | "Comments";
  setTab: React.Dispatch<React.SetStateAction<"Metrics" | "Comments">>;
}
const Tabs = (props: ITabsProps) => {
  const activeClass = (tab: "Metrics" | "Comments") => {
    if (props.tab === tab) return "uk-active";
    return "";
  };

  return (
    <div className="uk-margin-small-bottom">
      <ul className="kit-tabs" data-uk-tab>
        <li
          className={activeClass("Metrics")}
          onClick={() => props.setTab("Metrics")}
        >
          <a href="#">Metrics</a>
        </li>
        <li
          className={activeClass("Comments")}
          onClick={() => props.setTab("Comments")}
        >
          <a href="#">Comments</a>
        </li>
      </ul>
    </div>
  );
};

const MeasureReadOnlyModal = observer(() => {
  const { store } = useAppContext();

  const [tab, setTab] = useState<"Metrics" | "Comments">("Metrics");
  const [measure, setMeasure] = useState<IMeasure>({ ...defaultMeasure });

  const onCancel = () => {
    store.measure.clearSelected();
    setMeasure({ ...defaultMeasure }); // reset form
    setTab("Metrics"); // reset tab
    hideModalFromId(MODAL_NAMES.EXECUTION.MEASURE_READ_ONLY_MODAL);
  };

  useEffect(() => {
    const selectedMeasure = store.measure.selected;
    if (selectedMeasure) setMeasure({ ...selectedMeasure });
  }, [store.measure.selected]);


  return (
    <div className="measure-modal uk-modal-dialog uk-modal-body uk-margin-auto-vertical uk-width-3-4">
      <button
        className="uk-modal-close-default"
        type="button"
        data-uk-close
      ></button>
      <h3 className="uk-modal-title">Measure/KPI</h3>
      <div className="dialog-content uk-position-relative">
        <Tabs tab={tab} setTab={setTab} />
        <form className="uk-form-stacked uk-grid-small" data-uk-grid>
          {tab === "Metrics" && (
            <MeasureForm measure={measure} setMeasure={setMeasure} />
          )}
          {tab === "Comments" && (
            <MeasureCommentsForm measure={measure} setMeasure={setMeasure} />
          )}
          <div className="uk-width-1-1 uk-text-right">
            <button
              className="btn-text uk-margin-right"
              type="button"
              onClick={onCancel}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
});

export default MeasureReadOnlyModal;