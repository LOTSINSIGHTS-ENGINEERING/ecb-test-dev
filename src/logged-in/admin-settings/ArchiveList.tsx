import { observer } from "mobx-react-lite";
import ErrorBoundary from "../../shared/components/error-boundary/ErrorBoundary";
import { useAppContext } from "../../shared/functions/Context";
import EmptyError from "./EmptyError";
import ArchiveItem from "./ArchiveItem";

const ArchiveList = observer(() => {
  const { store } = useAppContext();

  return (
    <ErrorBoundary>
      <div className="department-list">
        <ErrorBoundary>
          {store.scorecardArchiveStore.all.map((a) => (
            <div key={a.asJson.uid}>
              <ArchiveItem archive={a.asJson} />
            </div>
          ))}
        </ErrorBoundary>
        <ErrorBoundary>
          {store.scorecardArchiveStore.isEmpty && (
            <EmptyError errorMessage="No data found" />
          )}
        </ErrorBoundary>
      </div>
    </ErrorBoundary>
  );
});

export default ArchiveList;
