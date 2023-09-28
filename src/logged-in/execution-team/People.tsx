import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { LoadingEllipsis } from "../../shared/components/loading/Loading";
import SingleSelect from "../../shared/components/single-select/SingleSelect";
import { useAppContext } from "../../shared/functions/Context";
import useTitle from "../../shared/hooks/useTitle";
import EmptyError from "../admin-settings/EmptyError";
import Toolbar from "../shared/components/toolbar/Toolbar";
import UserItem from "./UserItem";
import useBackButton from "../../shared/hooks/useBack";
import User from "../../shared/models/User";
import ErrorBoundary from "../../shared/components/error-boundary/ErrorBoundary";

const People = observer(() => {
  const { api, store, ui } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  useTitle("People");
  useBackButton();

  const onSearch = (employeeUid: string): void => setSearchValue(employeeUid);

  // sort by name
  const sortByName = (a: User, b: User) => {
    return (a.asJson.displayName || "").localeCompare(b.asJson.displayName || "");
  };

  const search_access = () => {
    if (searchValue !== "")
      return store.user.all.filter((u) => u.asJson.uid === searchValue);
    else return store.user.all;
  };

  const groupedByDivision = () => {
    const users = search_access();
    const divisions = store.division.all;
    const grouped = divisions.map((div) => {
      return {
        id: div.asJson.id,
        division: div.asJson.name,
        users: users.sort(sortByName).filter((u) => {
          return (
            u.asJson.division === div.asJson.id ||
            u.asJson.divisionTwo === div.asJson.id
          );
        }),
      };
    });
    return grouped;
  };

  const options = store.user.all.sort(sortByName).map((user) => {
    return { label: user.asJson.displayName || "", value: user.asJson.uid };
  });

  useEffect(() => {
    // load users from db
    const loadAll = async () => {
      setLoading(true); // start loading
      try {
        await api.user.getAll();
        await api.department.getAll();
        await api.division.getAll();
      } catch (error) {
        ui.snackbar.load({
          id: Date.now(),
          message: "Failed to load.",
          type: "danger",
        });
      }
      setLoading(false); // stop loading
    };
    loadAll();
  }, [api.department, api.division, api.user, ui.snackbar]);

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
                    placeholder="Search by name"
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
              {groupedByDivision().map((dev) => (
                <ErrorBoundary key={dev.id}>
                  {dev.users.length !== 0 && (
                    <ErrorBoundary>
                      <div className="uk-width-1-1 uk-margin-top">
                        {dev.division}
                      </div>
                      <ErrorBoundary>
                        {dev.users.map((user) => (
                          <div key={user.asJson.uid}>
                            <UserItem user={user.asJson} />
                          </div>
                        ))}
                      </ErrorBoundary>
                    </ErrorBoundary>
                  )}
                </ErrorBoundary>
              ))}
            </div>
          </ErrorBoundary>

          <ErrorBoundary>
            {!store.user.all.length && !loading && (
              <EmptyError errorMessage="No users found" />
            )}
          </ErrorBoundary>

          <ErrorBoundary>{loading && <LoadingEllipsis />}</ErrorBoundary>
        </div>
      </div>
    </ErrorBoundary>
  );
});

export default People;
