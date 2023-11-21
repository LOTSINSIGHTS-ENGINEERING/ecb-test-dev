import { observer } from "mobx-react-lite";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { useAppContext } from "../../../shared/functions/Context";
import { MAIL_EMAIL, MAIL_SCORECARD_APPROVED_ME } from "../../../shared/functions/mailMessages";
import { hideModalFromId } from "../../../shared/functions/ModalShow";
import { defaultScorecardMetadata, IScorecardMetadata } from "../../../shared/models/ScorecardMetadata";
import MODAL_NAMES from "../ModalName";

const PerformanceAgreementApprovalModal = observer(() => {
  const { api, store, ui } = useAppContext();
  const [appraisal, setAppraisal] = useState<string>("");
  const [agreement, setAgreement] = useState<IScorecardMetadata>(defaultScorecardMetadata);
  const [loading, setLoading] = useState(false);
  const me = store.auth.meJson;
  const user = store.user.selected;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user || !me) {
      ui.snackbar.load({
        id: Date.now(),
        type: "danger",
        message: "User not found, email not sent.",
        timeoutInMs: 10000,
      });
      return;
    }
    const { MY_SUBJECT, MY_BODY } = MAIL_SCORECARD_APPROVED_ME(user.displayName, me.displayName);
    setLoading(true);
    const $agreement: IScorecardMetadata = { ...agreement };
    $agreement.agreementDraft.comments = appraisal;
    $agreement.agreementDraft.status = "approved";
    $agreement.quarter2Review.status = "in-progress";
    await update($agreement);
    await api.mail.sendMailCC(
      [user.email!],
      ['engdesign@lotsinsights.com'!],
      MAIL_EMAIL,
      MY_SUBJECT,
      MY_BODY
    );
    setLoading(false);

    onCancel();
  };

  const update = async (agreement: IScorecardMetadata) => {
    try {
      await api.individualScorecard.update(agreement);
      ui.snackbar.load({
        id: Date.now(),
        message: "Approved Scorecard.",
        type: "success",
      });
    } catch (error) {
      ui.snackbar.load({
        id: Date.now(),
        message: "Error! Failed to approved Scorecard.",
        type: "danger",
      });
    }
  };

  const onCancel = () => {
    store.individualScorecard.clearSelected();
    hideModalFromId(MODAL_NAMES.EXECUTION.PERFORMANCE_AGREEMENT_DRAFT_APPROVAL_MODAL);
  };

  const updateFormOnMount = useCallback(() => {
    if (store.individualScorecard.selected)
      setAgreement({ ...store.individualScorecard.selected });
    if (!store.individualScorecard.selected)
      setAgreement({ ...defaultScorecardMetadata });
  }, [store.individualScorecard.selected]);

  useEffect(() => {
    updateFormOnMount();
    return () => { };
  }, [updateFormOnMount]);

  return (
    <div className="scorecard-approval-modal uk-modal-dialog uk-modal-body uk-margin-auto-vertical">
      <button
        className="uk-modal-close-default"
        type="button"
        data-uk-close
      ></button>
      <h3 className="uk-modal-title">Approve Performance Scorecard Draft</h3>
      <div className="dialog-content uk-position-relative">
        <div
          className="uk-alert-primary uk-padding-small uk-margin"
          data-uk-alert
        >
          <p>The performance scorecard will be locked after approval.</p>
        </div>
        <form
          className="uk-form-stacked uk-grid-small"
          data-uk-grid
          onSubmit={handleSubmit}
        >
          <div className="uk-width-1-1">
            <label className="uk-form-label" htmlFor="kpi-appraisal">
              Feedback (optional)
            </label>
            <div className="uk-form-controls">
              <textarea
                className="uk-textarea uk-form-small"
                id="kpi-appraisal"
                rows={3}
                placeholder="Appraisals"
                value={appraisal}
                onChange={(e) => setAppraisal(e.target.value)}
              />
            </div>
          </div>
          <div className="uk-width-1-1 uk-text-right">
            <button
              className="btn-text uk-margin-right"
              type="button"
              onClick={onCancel}>
              Cancel
            </button>
            <button
              className="btn btn-primary"
              type="submit"
              disabled={loading}
            >
              Approve {loading && <div data-uk-spinner="ratio: .5"></div>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
});

export default PerformanceAgreementApprovalModal;
