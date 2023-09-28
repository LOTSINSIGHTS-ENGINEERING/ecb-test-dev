import { observer } from "mobx-react-lite";
import { useState, useEffect } from "react";
import { useAppContext } from "../../../shared/functions/Context";
import { hideModalFromId } from "../../../shared/functions/ModalShow";
import { IObjectiveCompany, defaultObjectiveCompany } from "../../../shared/models/ObjectiveCompany";
import MODAL_NAMES from "../ModalName";


const ViewObjectiveCompanyDraftCommentModal = observer(() => {
  const { store } = useAppContext();
  const [objective, setObjective] = useState<IObjectiveCompany>({ ...defaultObjectiveCompany })

  const onCancel = () => {
    store.companyObjective.clearSelected()
    hideModalFromId(MODAL_NAMES.EXECUTION.VIEW_OBJECTIVE_COMPANY_DRAFT_COMMENT_MODAL);
  };

  useEffect(() => {
    if (store.companyObjective.selected) {
      setObjective(store.companyObjective.selected);
    } else {
      setObjective({ ...defaultObjectiveCompany })
    }
  }, [store.companyObjective.selected]);

  return (
    <div className="objective-modal uk-modal-dialog uk-modal-body uk-margin-auto-vertical">
      <button
        title="Close or Cancel"
        className="uk-modal-close-default"
        type="button"
        data-uk-close
        onClick={onCancel}
      ></button>
      <h4 className="uk-modal-title">Supervisor Comment</h4>
      <div className="dialog-content uk-position-relative">
        <div className="comment">
          <p className="supervisor-comment">{objective.draftComment}</p>
        </div>
        <div className="uk-width-1-1 uk-text-right"></div>
      </div>
    </div>
  );
});

export default ViewObjectiveCompanyDraftCommentModal;
