import { observer } from "mobx-react-lite";
import { FormEvent, useEffect, useState } from "react";
import { useAppContext } from "../../../shared/functions/Context";
import { hideModalFromId } from "../../../shared/functions/ModalShow";
import { defaultMeasureCompany, IMeasureCompany } from "../../../shared/models/MeasureCompany";
import MODAL_NAMES from "../ModalName";

const MeasureCompanyMidermCommentsModal = observer(() => {
  const { api, store, ui } = useAppContext();

  const [measure, setMeasure] = useState<IMeasureCompany>({ ...defaultMeasureCompany });
  const [loading, setLoading] = useState(false);
  const [remainingChar, setRemainingChars] = useState(0);
  const maxCharCount = 2000;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const selected = store.companyMeasure.selected;
    if (!selected) return; //TODO: alert invalid uid.
    setLoading(true); // start loading
    await update(measure);
    setLoading(false); // stop loading
    onCancel();
  };

  const update = async (companyMeasure: IMeasureCompany) => {
    try {
      await api.companyMeasure.update(companyMeasure, ["midtermComments"]);
    } catch (error) {
      ui.snackbar.load({
        id: Date.now(),
        message: "Error! Failed to update.",
        type: "danger",
      });
    }
  };

  const onCancel = () => {
    store.companyMeasure.clearSelected();
    store.companyObjective.clearSelected();
    setMeasure({ ...defaultMeasureCompany }); // reset form
    hideModalFromId(MODAL_NAMES.EXECUTION.MEASURE_COMMENTS_COMPANY_MIDTERM_MODAL);
  };

  useEffect(() => {
    if (store.companyMeasure.selected)
      setMeasure({ ...defaultMeasureCompany, ...store.companyMeasure.selected });
    else {
      setMeasure({ ...defaultMeasureCompany })
    }
  }, [store.companyMeasure.selected, store.companyObjective, store.companyObjective.selected]);

  useEffect(() => {
    setRemainingChars(maxCharCount - measure.midtermComments.length);
    if (maxCharCount < measure.midtermComments.length) {
      setMeasure({
        ...measure,
        midtermComments: measure.midtermComments.substring(0, maxCharCount),
      });
    }
  }, [measure]);

  return (
    <div className="measure-comments-modal uk-modal-dialog uk-modal-body uk-margin-auto-vertical">
      <button
        className="uk-modal-close-default"
        type="button"
        data-uk-close
      ></button>

      <h3 className="uk-modal-title">
        {measure.description}{" "}
        <span className="comment-title">(KPI Midterm Comments)</span>
      </h3>
      <div className="dialog-content uk-position-relative">
        <form
          className="uk-form-stacked uk-grid-small"
          data-uk-grid
          onSubmit={handleSubmit}
        >
          <div className="uk-width-1-1">
            <textarea
              className={
                "uk-textarea uk-form-small " +
                (remainingChar < 50 && "characters-limit-hit")
              }
              id="kpi-midtermComments"
              rows={10}
              placeholder="KPI midtermComments"
              value={measure.midtermComments}
              onChange={(e) =>
                setMeasure({ ...measure, midtermComments: e.target.value })
              }
            />
            {remainingChar < 100 && (
              <p className="characters-left">
                {remainingChar} characters left. You're approaching the maximum
                of {maxCharCount} characters.
              </p>
            )}
          </div>

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

export default MeasureCompanyMidermCommentsModal;
