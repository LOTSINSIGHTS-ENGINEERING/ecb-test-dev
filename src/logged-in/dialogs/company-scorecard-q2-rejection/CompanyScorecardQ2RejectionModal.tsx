import { observer } from "mobx-react-lite";
import { FormEvent, useState } from "react";
import { useAppContext } from "../../../shared/functions/Context";
import { hideModalFromId } from "../../../shared/functions/ModalShow";
import { IScorecardMetadata } from "../../../shared/models/ScorecardMetadata";
import MODAL_NAMES from "../ModalName";

interface IProps {
  agreement: IScorecardMetadata;
}
const CompanyScorecardQ2RejectionModal = observer((props: IProps) => {
  const { agreement } = props;
  const { api, store, ui } = useAppContext();
  const [comments, setComments] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const onUpdate = async (agreement: IScorecardMetadata) => {
    try {
      await api.companyScorecardMetadata.update(agreement);
      ui.snackbar.load({
        id: Date.now(),
        message: "Reverted Scorecard to Employee.",
        type: "success",
      });
    } catch (error) {
      ui.snackbar.load({
        id: Date.now(),
        message: "Error! Failed to revert the Scorecard.",
        type: "danger",
      });
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const me = store.auth.meJson;
    if (!me) return;
    setLoading(true);
    const $agreement: IScorecardMetadata = { ...agreement };
    $agreement.quarter2Review.comments = comments;
    $agreement.quarter2Review.status = "in-progress";
    await onUpdate($agreement);
    setLoading(false);
    onCancel();
  };

  const onCancel = () => {
    hideModalFromId(MODAL_NAMES.EXECUTION.COMPANY_Q2_REJECTION_MODAL);
    setComments("");
  };

  return (
    <div className="measure-modal uk-modal-dialog uk-modal-body uk-margin-auto-vertical">
      <button
        className="uk-modal-close-default"
        type="button"
        data-uk-close
      ></button>
      <h3 className="uk-modal-title">Revert Midterm Review</h3>
      <div className="dialog-content uk-position-relative">
        <form
          className="uk-form-stacked uk-grid-small"
          data-uk-grid
          onSubmit={handleSubmit}
        >
          <div className="uk-width-1-1">
            <label className="uk-form-label" htmlFor="kpi-comments">
              Reasons / comments for reverting the Quarter 2 review.
            </label>
            <div className="uk-form-controls">
              <textarea
                className="uk-textarea uk-form-small"
                id="kpi-comments"
                rows={3}
                placeholder="Comments"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                required
              />
            </div>
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
              Revert {loading && <div data-uk-spinner="ratio: .5"></div>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
});

export default CompanyScorecardQ2RejectionModal;
