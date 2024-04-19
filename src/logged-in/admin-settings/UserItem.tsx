import { useAppContext } from "../../shared/functions/Context";
import showModalFromId from "../../shared/functions/ModalShow";
import { IUser } from "../../shared/models/User";
import MODAL_NAMES from "../dialogs/ModalName";

interface IProps {
  user: IUser;
}
const UserItem = (props: IProps) => {
  const { api, store, ui } = useAppContext();

  const { user } = props;
  const cssClass = user.userVerified ? "user" : "user user__not-verified";

  const department = store.department.getItemById(user.department);
  const departmentName = department ? department.asJson.name : "-";

  const division = store.division.getItemById(user.division);
  const divisionName = division ? division.asJson.name : "-";

  const handleEdit = () => {
    store.user.select(user); // set selected user
    showModalFromId(MODAL_NAMES.ADMIN.USER_MODAL); // show modal
  };



  const handleVerify = async () => {
    if (!window.confirm("Verify user?")) return; // TODO: confirmation dialog
    try {
      await api.user.update({ ...user, userVerified: true }); // update user
      // TODO: notify user (success snackbar)
    } catch (error) {
      // TODO: error handling
      console.log(error);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Remove user?")) return;
    api.user.delete(user);
  };

  return (
    <div
      className={`${cssClass} uk-card uk-card-default uk-card-body uk-card-small`}
    >
      <div className="uk-grid-small uk-grid-match" data-uk-grid>
        <div className="uk-flex uk-flex-middle uk-width-1-1 uk-width-expand@m">
          <h6 className="name">
            <span className="span-label uk-margin-bottom">name</span>
            {user.userStatus === "Active" || !user.userStatus && <span data-uk-tooltip="Active User" style={{ padding: "2px", background: "green", marginRight: "9px" }}></span>}
            {user.userStatus === "In-Active" && <span data-uk-tooltip="In-Active User" style={{ padding: "2px", background: "grey", marginRight: "9px" }}></span>}
            {user.userStatus === "Resigned" && <span data-uk-tooltip="Resigned User" style={{ padding: "2px", background: "yellow", marginRight: "9px" }}></span>}
            {user.userStatus === "Terminated" && <span data-uk-tooltip="Termiated User" style={{ padding: "2px", background: "red", marginRight: "9px" }}></span>}
            {user.displayName}
          </h6>
        </div>

        <div className="uk-flex uk-flex-middle uk-width-1-2 uk-width-1-6@m">
          <p className="role">
            <span className="span-label uk-margin-bottom">User rights</span>
            {user.role || "-"}
          </p>
        </div>

        <div className="uk-flex uk-flex-middle uk-width-1-2 uk-width-1-6@m">
          <p className="role">
            <span className="span-label uk-margin-bottom">Position</span>
            {user.jobTitle || "-"}
          </p>
        </div>
        <div className="uk-flex uk-flex-middle uk-width-1-2 uk-width-1-6@m">
          <p className="department-name ">
            <span className="span-label uk-margin-bottom">Department</span>
            {departmentName}
          </p>
        </div>

        <div className="uk-flex uk-flex-middle uk-width-1-2 uk-width-1-6@m">
          <p className="department-name">
            <span className="span-label uk-margin-bottom">Division</span>
            {divisionName}
          </p>
        </div>


        <div className="uk-flex uk-flex-middle uk-width-1-1 uk-width-1-6@m uk-text-right">
          <div className="controls">
            {!user.userVerified && (
              <button
                className="btn-icon uk-margin-small-right"
                onClick={handleVerify}
              >
                <span uk-icon="check "></span>Verify
              </button>
            )}
            <button className="btn-icon" onClick={handleEdit}>
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

export default UserItem;
