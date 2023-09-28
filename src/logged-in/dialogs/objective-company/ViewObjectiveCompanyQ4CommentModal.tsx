import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { useAppContext } from "../../../shared/functions/Context";
import { hideModalFromId } from "../../../shared/functions/ModalShow";
import { defaultObjectiveCompany, IObjectiveCompany } from "../../../shared/models/ObjectiveCompany";
import MODAL_NAMES from "../ModalName";

const ViewObjectiveCompanyQ4CommentModal = observer(() => {
  const { store } = useAppContext();
  const [objective, setObjective] = useState<IObjectiveCompany>({ ...defaultObjectiveCompany })

  const onCancel = () => {
    store.companyObjective.clearSelected()
    hideModalFromId(MODAL_NAMES.EXECUTION.VIEW_OBJECTIVE_COMPANY_Q4_COMMENT_MODAL);
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
      <h3 className="uk-modal-title">Supervisor Comment</h3>
      <div className="dialog-content uk-position-relative">
        <div className="comment">
          <p className="supervisor-comment">{objective.assessComment}</p>
        </div>
        <div className="uk-width-1-1 uk-text-right"></div>
      </div>
    </div>
  );
});

export default ViewObjectiveCompanyQ4CommentModal;
