import { observer } from "mobx-react-lite";
import React from "react";
import SingleSelect from "../../../shared/components/single-select/SingleSelect";
import { USER_ROLES } from "../../../shared/functions/CONSTANTS";
import { useAppContext } from "../../../shared/functions/Context";
import { IUser } from "../../../shared/models/User";

interface IProps {
  user: IUser;
  setUser: React.Dispatch<React.SetStateAction<IUser>>;
}
const UserForm = observer((props: IProps) => {
  const { store } = useAppContext();
  const role = store.auth.role;

  const { user, setUser } = props;

  const divisionOptions = store.division.all.map((division) => ({
    label: division.asJson.name,
    value: division.asJson.id,
  }));

  const departmentOptions = store.department.all.map((deprt) => ({
    label: deprt.asJson.name,
    value: deprt.asJson.id,
  }));

  const userOptions = store.user.all.map((user) => ({
    label:
      user.asJson.displayName ||
      `${user.asJson.firstName} ${user.asJson.lastName}`,
    value: user.asJson.uid,
  }));

  userOptions.push({
    label: "None",
    value: "none",
  });

  return (
    <>
      <div className="uk-width-1-1">
        <label className="uk-form-label" htmlFor="user-fname">
          Full name
        </label>
        <div className="uk-form-controls">
          <input
            className="uk-input uk-form-small"
            id="user-fname"
            type="text"
            placeholder="First name"
            value={user.displayName || `${user.firstName} ${user.lastName}`}
            onChange={() => {}}
            disabled
          />
        </div>
      </div>

      <div className="uk-width-1-1">
        <label className="uk-form-label" htmlFor="user-email">
          Email
        </label>
        <div className="uk-form-controls">
          <input
            className="uk-input uk-form-small"
            id="user-email"
            type="email"
            placeholder="Email"
            value={user.email || "no email"}
            onChange={() => {}}
            disabled
          />
        </div>
      </div>

      <div className="uk-width-1-1">
        <label className="uk-form-label" htmlFor="user-job-title">
          Job Title
        </label>
        <div className="uk-form-controls">
          <input
            className="uk-input uk-form-small"
            id="user-job-title"
            type="text"
            placeholder="Job title"
            value={user.jobTitle || ""}
            onChange={(e) => setUser({ ...user, jobTitle: e.target.value })}
          />
        </div>
      </div>

      <div className="uk-width-1-1">
        <label className="uk-form-label" htmlFor="user-reporting-to">
          Reporting to
        </label>
        <div className="uk-form-controls">
          <SingleSelect
            options={userOptions}
            name="user-reporting-to"
            value={user.supervisor}
            onChange={(value) => setUser({ ...user, supervisor: value })}
            placeholder="Select a supervisor"
            required
          />
        </div>
      </div>
      <div className="uk-width-1-1">
        <label className="uk-form-label" htmlFor="user-department">
          Department
        </label>
        <div className="uk-form-controls">
          <SingleSelect
            options={departmentOptions}
            name="user-department"
            value={user.department}
            onChange={(value) => setUser({ ...user, department: value })}
            placeholder="Select a department"
            required
          />
        </div>
      </div>
      <div className="uk-width-1-1">
        <label className="uk-form-label" htmlFor="user-division">
          First section
        </label>
        <div className="uk-form-controls">
          <SingleSelect
            options={divisionOptions}
            name="user-division"
            value={user.division}
            onChange={(value) => setUser({ ...user, division: value })}
            placeholder="Select a section"
          />
        </div>
      </div>
      <div className="uk-width-1-1">
        <label className="uk-form-label" htmlFor="user-division">
          Second section
        </label>
        <div className="uk-form-controls">
          <SingleSelect
            options={divisionOptions}
            name="user-division"
            value={user.divisionTwo}
            onChange={(value) => setUser({ ...user, divisionTwo: value })}
            placeholder="Select a section"
          />
        </div>
      </div>
      <div className="uk-width-1-1">
        <label className="uk-form-label" htmlFor="user-division">
          Third section
        </label>
        <div className="uk-form-controls">
          <SingleSelect
            options={divisionOptions}
            name="user-division"
            value={user.divisionTwo}
            onChange={(value) => setUser({ ...user, divisionTwo: value })}
            placeholder="Select a section"
          />
        </div>
      </div>

      <div className="uk-width-1-1">
        <label className="uk-form-label" htmlFor="user-role">
          Role
        </label>
        <div className="uk-form-controls">
          <select
            className="uk-select uk-form-small"
            id="user-role"
            value={user.role}
            onChange={(e) => setUser({ ...user, role: e.target.value })}
            required
            // disabled={role === USER_ROLES.ADMIN_USER ? true : false}
          >
            <option value={USER_ROLES.ADMIN_USER}>Administrator</option>
            <option value={USER_ROLES.HR_USER}>Human Resource</option>
            <option value={USER_ROLES.EXECUTIVE_USER}>CEO</option>
            <option value={USER_ROLES.GENERAL_MANAGER}>General Manager</option>
            <option value={USER_ROLES.MANAGER_USER}>Manager</option>
            <option value={USER_ROLES.EMPLOYEE_USER}>Employee</option>
            <option value={USER_ROLES.BOARD_MEMBER_USER}>Board Member</option>
            <option value={USER_ROLES.GUEST_USER}>Guest</option>
          </select>
        </div>
      </div>
    </>
  );
});

export default UserForm;
