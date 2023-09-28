import { observer } from "mobx-react-lite";
import { FormEvent, useState } from "react";
import { defaultMeasureCompany, IMeasureCompany } from "../../../shared/models/MeasureCompany";
import PerspectiveObjectiveForm from "./PerspectiveObjectiveForm";


const ObjectivePerPerspectiveModal = observer(() => {

  const [measure, setMeasure] = useState<IMeasureCompany>({
    ...defaultMeasureCompany,
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onCancel();
  };

  const onCancel = () => {
    setMeasure({ ...defaultMeasureCompany });
  };

  return (
    <div className="perspective-objective-modal uk-modal-dialog uk-modal-body uk-margin-auto-vertical">
      <button
        className="uk-modal-close-default"
        type="button"
        data-uk-close
      ></button>

      <h3 className="uk-modal-title">Financial Perspective</h3>

      <div className="dialog-content uk-position-relative">
        <form
          className="uk-form-stacked uk-grid-small"
          data-uk-grid
          onSubmit={handleSubmit}
        >
          <PerspectiveObjectiveForm measure={measure} setMeasure={setMeasure} />

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
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
});

export default ObjectivePerPerspectiveModal;
