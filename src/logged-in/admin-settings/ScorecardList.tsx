import { observer } from "mobx-react-lite";
import { useCallback, useMemo } from "react";
import { ErrorAlert } from "../../shared/components/alert/Alert";
import ErrorBoundary from "../../shared/components/error-boundary/ErrorBoundary";
import { useAppContext } from "../../shared/functions/Context";
import EmptyError from "./EmptyError";
import ScorecardItem from "./ScorecardItem";

const ScorecardList = observer(() => {
  const { store } = useAppContext();

  // multiple scorecards active
  const multipleActive = useMemo(() => {
    return (store.scorecard.all.filter((scorecard) => scorecard.asJson.active).length > 1);
  }, [store.scorecard.all]);

  const multipleCurrent = useMemo(() => {
    return (store.scorecard.all.filter((scorecard) => scorecard.asJson.current).length > 1);
  }, [store.scorecard.all]);

  return (
    <ErrorBoundary>
      <div className="scorecard-batch-list">
        {/* Error Multiple scorecards active */}
        <ErrorBoundary>
          {multipleActive && (
            <ErrorAlert msg="Error! You cannot have multiple scorecards/batches active." />
          )}
          {multipleCurrent && (
            <ErrorAlert msg="Error! You cannot have current multiple scorecards/batches." />
          )}
        </ErrorBoundary>

        <ErrorBoundary>
          {store.scorecard.all.map((batch) => (
            <div key={batch.asJson.id}>
              <ScorecardItem scorecardBatch={batch.asJson} />
            </div>
          ))}
        </ErrorBoundary>

        {/* Empty & not loading */}
        <ErrorBoundary>
          {!store.scorecard.all.length && (
            <EmptyError errorMessage="No scorecards found" />
          )}
        </ErrorBoundary>
      </div>
    </ErrorBoundary>
  );
});

export default ScorecardList;
