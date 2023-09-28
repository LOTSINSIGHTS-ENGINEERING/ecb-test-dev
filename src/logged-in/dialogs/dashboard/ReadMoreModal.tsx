import { observer } from "mobx-react-lite";
import { hideModalFromId } from "../../../shared/functions/ModalShow";
import MODAL_NAMES from "../ModalName";

interface IProps {
  name: string;
}

const ReadMoreModal = observer((props: IProps) => {
  const { name } = props;

  const onCancel = () => {
    hideModalFromId(MODAL_NAMES.DASHBOARD.READ_MORE_MODAL);
  };

  return (
    <div className="measure-modal uk-modal-dialog uk-modal-body uk-margin-auto-vertical">
      <button
        className="uk-modal-close-default"
        type="button"
        data-uk-close
      ></button>
      <div className="dialog-content uk-position-relative">
        <p>{name}</p>
        <div className="uk-width-1-1 uk-text-right">
          <button
            className="btn-text uk-margin-right"
            type="button"
            onClick={onCancel}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
});

export default ReadMoreModal;
