import { observer } from "mobx-react-lite";
import ErrorBoundary from "../../shared/components/error-boundary/ErrorBoundary";
import { useAppContext } from "../../shared/functions/Context";
import showModalFromId from "../../shared/functions/ModalShow";
import Division, { IDivision } from "../../shared/models/Division";
import MODAL_NAMES from "../dialogs/ModalName";
import EmptyError from "./EmptyError";

interface IDivisionItemProps {
  division: IDivision;
}
const DivisionItem = (props: IDivisionItemProps) => {
  const { division } = props;
  const { api, store } = useAppContext();

  const handleEdit = () => {
    store.division.select(division); // set selected division
    showModalFromId(MODAL_NAMES.ADMIN.DIVISION_MODAL); // show modal
  };

  const handleDelete = async () => {
    if (!window.confirm("Remove division?")) return; // TODO: confirmation dialog
    api.division.delete(division); // remove division
  };

  return (
    <div className="division uk-card uk-card-default uk-card-body uk-card-small">
      <div className="uk-grid-small uk-grid-match" data-uk-grid>
        <div className="uk-flex uk-flex-middle uk-width-1-1 uk-width-expand@m">
          <h6 className="name">
            <span className="span-label">Name</span>
            {division.name}
          </h6>
        </div>
        <div className="uk-flex uk-flex-middle uk-width-1-1 uk-width-expand@m">
          <h6>
            <span className="span-label">Department</span>
            {division.departmentName}
          </h6>
        </div>

        <div className="uk-flex uk-flex-middle uk-width-1-1 uk-width-auto@m uk-text-center">
          <div className="controls">
            <button
              className="btn-icon uk-margin-small-right"
              onClick={handleEdit}
            >
              <span uk-icon="pencil"></span>
            </button>
            <button className="btn-icon" onClick={handleDelete}>
              <span uk-icon="trash"></span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const DivisionList = observer(() => {
  const { store } = useAppContext();

  const sortByName = (a: Division, b: Division) => {
    if (a.asJson.name < b.asJson.name) return -1;
    if (a.asJson.name > b.asJson.name) return 1;
    return 0;
  };

  return (
    <ErrorBoundary>
      <div className="division-list">
        <ErrorBoundary>
          {store.division.all.sort(sortByName).map((division) => (
            <div key={division.asJson.id}>
              <DivisionItem division={division.asJson} />
            </div>
          ))}
        </ErrorBoundary>

        {/* Empty & not loading */}
        <ErrorBoundary>
          {store.division.isEmpty && (
            <EmptyError errorMessage="No divisions found" />
          )}
        </ErrorBoundary>
      </div>
    </ErrorBoundary>
  );
});

export default DivisionList;
