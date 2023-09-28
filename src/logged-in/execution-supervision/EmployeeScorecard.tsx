import { observer } from "mobx-react-lite";
import { useCallback, useEffect, useState } from "react";
import ErrorBoundary from "../../shared/components/error-boundary/ErrorBoundary";
import { LoadingEllipsis } from "../../shared/components/loading/Loading";
import SingleSelect from "../../shared/components/single-select/SingleSelect";
import { useAppContext } from "../../shared/functions/Context";
import useBackButton from "../../shared/hooks/useBack";
import useTitle from "../../shared/hooks/useTitle";
import User from "../../shared/models/User";
import EmptyError from "../admin-settings/EmptyError";
import Toolbar from "../shared/components/toolbar/Toolbar";
import UserItem from "./UserItem";

interface IOption {
  label: string;
  value: string;
}

const EmployeeScorecard = observer(() => {
  const { api, store, ui } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState<IOption[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  useTitle("Employee");
  useBackButton();

  const me = store.auth.meJson;

  const onSearch = (employeeUid: string) => {
    if (employeeUid === "") {
      initAll();
    } else {
      const $users = store.user.all.filter((u) => u.asJson.uid === employeeUid);
      setUsers([...$users]); // users
    }
  };

  // set the states of the users & search options.
  const initAll = useCallback(() => {
    if (!me) return; // TODO: handle error
    const $users = store.user.all.filter((u) => {
      if (!process.env.NODE_ENV || process.env.NODE_ENV === "development")
        return u.asJson.uid !== me.uid;
      else return u.asJson.uid !== me.uid && !u.asJson.devUser; // production code
    });

    setUsers($users); // users
    const options = $users.map((user) => {
      return { label: user.asJson.displayName || "", value: user.asJson.uid };
    });

    setOptions(options);
  }, [me, store.user.all]);

  useEffect(() => {
    initAll();
  }, [initAll]);

  useEffect(() => {
    const loadAll = async () => {
      if (!me) return;
      setLoading(true);
      try {
        await api.user.getAllSubordinates(me.uid);
      } catch (error) {
      }
      setLoading(false);
    };

    loadAll();
  }, [api.user, me]);

  return (
    <ErrorBoundary>
      <div className="performance-team uk-section uk-section-small">
        <div className="uk-container uk-container-xlarge">
          <ErrorBoundary>
            <Toolbar
              rightControls={
                <ErrorBoundary>
                  <SingleSelect
                    name="search-team"
                    options={options}
                    width="250px"
                    onChange={onSearch}
                  />
                </ErrorBoundary>
              }
            />
          </ErrorBoundary>

          <ErrorBoundary>
            <div
              className="uk-grid-small uk-grid-match uk-child-width-1-2 uk-child-width-1-3@m uk-child-width-1-4@l"
              data-uk-grid
            >
              {users.map((user) => (
                <div key={user.asJson.uid}>
                  <UserItem user={user.asJson} />
                </div>
              ))}
            </div>
          </ErrorBoundary>

          {/* Empty & not loading */}
          <ErrorBoundary>
            {users.length === 0 && !loading && (
              <EmptyError errorMessage="No users found" />
            )}
          </ErrorBoundary>

          {/* Loading */}
          <ErrorBoundary>{loading && <LoadingEllipsis />}</ErrorBoundary>
        </div>
      </div>
    </ErrorBoundary>
  );
});

export default EmployeeScorecard;
