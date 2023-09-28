import { observer } from "mobx-react-lite";
import { useEffect, useMemo, useState } from "react";
import ErrorBoundary from "../../shared/components/error-boundary/ErrorBoundary";
import Loading, { LoadingEllipsis } from "../../shared/components/loading/Loading";
import { USER_ROLES } from "../../shared/functions/CONSTANTS";
import { useAppContext } from "../../shared/functions/Context";
import { dataFormat } from "../../shared/functions/Directives";
import showModalFromId from "../../shared/functions/ModalShow";
import Measure, { IMeasure } from "../../shared/models/Measure";
import User from "../../shared/models/User";
import MODAL_NAMES from "../dialogs/ModalName";
import NoMeasures from "../execution-scorecard/NoMeasures";

interface IMeasureTableItemProps {
  measure: Measure;
}
const MeasureTableItem = (props: IMeasureTableItemProps) => {
  const { store } = useAppContext();
  const measure = props.measure.asJson;

  const dataType = measure.dataType;
  const dataSymbol = measure.dataSymbol || "";

  const handleUpdateMeasure = () => {
    store.measure.select(measure); // select measure
    showModalFromId(MODAL_NAMES.EXECUTION.MEASURE_UPDATE_MODAL);
  };

  return (
    <ErrorBoundary>
      <tr className="row" onClick={handleUpdateMeasure}>
        <td>
          {measure.description}
          <span className="measure-sub-weight uk-margin-small-left">
            Sub-Weight: {measure.weight}%
          </span>
        </td>
        <td className="no-whitespace">
          {dataFormat(dataType, measure.baseline, dataSymbol)}
        </td>
        <td className="no-whitespace">
          {dataFormat(dataType, measure.annualTarget, dataSymbol)}
        </td>
        <td className="no-whitespace">
          {dataFormat(dataType, measure.rating1, dataSymbol)}
        </td>
        <td className="no-whitespace">
          {dataFormat(dataType, measure.rating2, dataSymbol)}
        </td>
        <td className="no-whitespace">
          {dataFormat(dataType, measure.rating3, dataSymbol)}
        </td>
        <td className="no-whitespace">
          {dataFormat(dataType, measure.rating4, dataSymbol)}
        </td>
        <td className="no-whitespace">
          {dataFormat(dataType, measure.rating5, dataSymbol)}
        </td>
      </tr>
    </ErrorBoundary>
  );
};

interface IMeasureTableProps {
  measures: Measure[];
}
const MeasureTable = observer((props: IMeasureTableProps) => {
  const { measures } = props;
  const [isEmpty, setisEmpty] = useState(false);

  useEffect(() => {
    setisEmpty(measures.length === 0 ? true : false);
  }, [measures]);

  return (
    <ErrorBoundary>
      <div className="measure-table">
        {!isEmpty && (
          <table className="measure-table uk-table uk-table-small uk-table-middle uk-table-hover uk-table-divider">
            <thead className="header">
              <tr>
                <th className="uk-width-expand@s">Measure/KPI</th>
                <th>Baseline</th>
                <th>Annual Target</th>
                <th>Rate 1</th>
                <th>Rate 2</th>
                <th>Rate 3</th>
                <th>Rate 4</th>
                <th>Rate 5</th>
              </tr>
            </thead>
            <tbody>
              {measures.map((measure) => (
                <MeasureTableItem key={measure.asJson.id} measure={measure} />
              ))}
            </tbody>
          </table>
        )}

        {isEmpty && <NoMeasures />}
      </div>
    </ErrorBoundary>
  );
});

interface IUserPDP {
  user: User;
}
const UserPDP = (props: IUserPDP) => {
  const { store, api } = useAppContext();
  const [loading, setloading] = useState(true);

  const user = props.user.asJson;
  const measures = store.measure.getByUidAndObjectiveType(
    user.uid,
    "self-development"
  );

  // Get users PDP measures for each user.
  useEffect(() => {
    const load = async () => {
      setloading(true);
      await api.measure.getAllByObjectiveType(user.uid, "self-development");
      setloading(false);
    };

    load();
  }, [api.measure, user.uid]);

  if (loading) return <LoadingEllipsis />;

  return (
    <div className="user-pdp-measures">
      <div className="measure-list uk-card uk-card-default uk-card-small uk-card-body uk-margin">
        <h3 className="username">
          {user.displayName} <span className="type">PDP</span>
        </h3>
        <MeasureTable measures={measures} />
      </div>
    </div>
  );
};

const List = observer(() => {
  const { store, api } = useAppContext();
  const role = store.auth.role;
  const department = store.auth.department;
  const me = store.auth.meJson;
  // const users = store.user.all;

  const [loading, setloading] = useState(true);

  const sort = (a: User, b: User) => {
    const aName =
      a.asJson.displayName || `${a.asJson.firstName} ${a.asJson.lastName}`;
    const bName =
      b.asJson.displayName || `${b.asJson.firstName} ${b.asJson.lastName}`;
    return aName.localeCompare(bName);
  };

  const users = useMemo(() => {
    let _users: User[] = [];

    switch (role) {
      case USER_ROLES.MD_USER:
        _users = [...store.user.all];
        break;
      case USER_ROLES.HR_USER:
        _users = [...store.user.all];
        break;
      case USER_ROLES.SUPER_USER:
        _users = [...store.user.all];
        break;
      case USER_ROLES.EXECUTIVE_USER:
        _users = [
          ...store.user.all.filter((u) => {
            return u.asJson.department === department;
          }),
        ];
        break;
      case USER_ROLES.MANAGER_USER:
        _users = [
          ...store.user.all.filter((u) => {
            return u.asJson.supervisor === me?.uid;
          }),
        ];
        break;
      default:
        _users = [
          ...store.user.all.filter((u) => {
            return u.asJson.supervisor === me?.uid;
          }),
        ];
        break;
    }

    return _users;
  }, [department, me?.uid, role, store.user.all]);

  // Get users -> Using pagination.
  useEffect(() => {
    const load = async () => {
      setloading(true);
      await api.user.getAll();
      setloading(false);
    };
    load();
  }, [api.user]);

  if (loading) return <Loading />;

  return (
    <ErrorBoundary>
      {users.sort(sort).map((user) => (
        <UserPDP key={user.asJson.uid} user={user} />
      ))}
    </ErrorBoundary>
  );
});

export default List;
