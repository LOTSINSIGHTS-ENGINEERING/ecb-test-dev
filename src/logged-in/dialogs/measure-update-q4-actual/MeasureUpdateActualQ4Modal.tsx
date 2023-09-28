import { observer } from "mobx-react-lite";
import { FormEvent, useEffect, useState } from "react";
import { useAppContext } from "../../../shared/functions/Context";
import { hideModalFromId } from "../../../shared/functions/ModalShow";
import MODAL_NAMES from "../ModalName";
import MeasureUpdateActualQ4Form from "./MeasureUpdateActualQ4Form";
import { IMeasure, defaultMeasure } from "../../../shared/models/Measure";
import { measureQ4Rating } from "../../shared/functions/Scorecard";

const MeasureUpdateActualQ4Modal = observer(() => {
  const { api, store, ui } = useAppContext();

  const [measure, setMeasure] = useState<IMeasure>({ ...defaultMeasure });
  const [loading, setLoading] = useState(false);
  const [isLocked, setisLocked] = useState(true);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const me = store.auth.meJson;
    if (!me) return; //TODO: alert invalid uid.

    setLoading(true);

    const $measure: IMeasure = {
      ...measure,
      uid: me.uid,
      userName: me.displayName || "",
      autoRating2: measureQ4Rating(measure),
      supervisorRating2: null,
      finalRating2: null,
      isUpdated: measure.quarter4Actual == null ? false : true,
    };

    const selected = store.measure.selected;
    if (selected) await update($measure);
    setLoading(false);
    onCancel();
  };

  const update = async (measure: IMeasure) => {
    try {
      if (isLocked)
        await api.measure.update(measure, ["quarter4Actual", "annualActual", "autoRating2", "supervisorRating2", "finalRating2", "isUpdated"]);
      else await api.measure.update(measure);
    } catch (error) {
      ui.snackbar.load({
        id: Date.now(),
        message: "Error! Failed to update.",
        type: "danger",
      });
    }
  };

  const onCancel = () => {
    // clear selected measure & selected objective
    store.measure.clearSelected();
    // reset form
    setMeasure({ ...defaultMeasure });
    // hide modal
    hideModalFromId(MODAL_NAMES.EXECUTION.MEASURE_UPDATE_Q4_ACTUAL_MODAL);
  };

  useEffect(() => {
    // no selected measure, and no selected objective
    if (!store.measure.selected) {
      hideModalFromId(MODAL_NAMES.EXECUTION.MEASURE_UPDATE_Q4_ACTUAL_MODAL);
    }

    // if selected measure, set form values
    if (store.measure.selected) setMeasure({ ...store.measure.selected });
  }, [store.measure.selected]);

  useEffect(() => {
    const scorecard = store.scorecard.active; // active/current scorecard
    if (scorecard) setisLocked(scorecard.locked);
  }, [store.scorecard.active]);

  return (
    <div className="measure-modal uk-modal-dialog uk-modal-body uk-margin-auto-vertical">
      <button
        className="uk-modal-close-default"
        type="button"
        data-uk-close
      ></button>
      <h3 className="uk-modal-title">Measure/KPI Assesssment Progress</h3>
      <div className="dialog-content uk-position-relative">
        <form
          className="uk-form-stacked uk-grid-small"
          data-uk-grid
          onSubmit={handleSubmit}
        >
          <MeasureUpdateActualQ4Form
            measure={measure}
            setMeasure={setMeasure}
          />

          <div className="uk-width-1-1 uk-text-right">
            <button
              className="btn-text uk-margin-right"
              type="button"
              onClick={onCancel}
            >
              Cancel
            </button>
            <button
              className="btn btn-primary"
              type="submit"
              disabled={loading}
            >
              Save {loading && <div data-uk-spinner="ratio: .5"></div>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
});

export default MeasureUpdateActualQ4Modal;
