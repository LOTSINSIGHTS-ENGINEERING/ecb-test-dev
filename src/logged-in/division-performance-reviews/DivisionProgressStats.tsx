import { observer } from "mobx-react-lite";
import ErrorBoundary from "../../shared/components/error-boundary/ErrorBoundary";
import { useAppContext } from "../../shared/functions/Context";
import { IDivision } from "../../shared/models/Division";
import { IScorecardMetadata, defaultScorecardMetadata } from "../../shared/models/ScorecardMetadata";

interface IDivisionProps {
  division: IDivision;
}
const Division = (props: IDivisionProps) => {
  const { store } = useAppContext();
  const { division } = props;

  const scorecards: IScorecardMetadata[] = store.user.all.map((user) => {
    const agreement = store.individualScorecard.all.find(
      (agreement) => agreement.asJson.uid === user.asJson.uid
    );

    const divisionName = division ? division.name : "Unknown";

    const $agreement = agreement
      ? {
        ...defaultScorecardMetadata,
        ...agreement.asJson,
        division: division.id,
        divisionName: divisionName,
        uid: user.asJson.uid,
        displayName: user.asJson.displayName || "Unknown",
      }
      : {
        ...defaultScorecardMetadata,
        uid: user.asJson.uid,
        division: division.id,
        divisionName: divisionName,
        displayName: user.asJson.displayName || "Unknown",
      };

    return $agreement;
  });

  const approvedSum = scorecards.reduce((prev, curr) => {
    const match = curr.agreementDraft.status === "approved" ? 1 : 0;
    return prev + match;
  }, 0);

  const submittedSum = scorecards.reduce((prev, curr) => {
    const match = curr.agreementDraft.status === "submitted" ? 1 : 0;
    return prev + match;
  }, 0);

  const pendingSum = scorecards.reduce((prev, curr) => {
    const match = curr.agreementDraft.status === "pending" ? 1 : 0;
    return prev + match;
  }, 0);

  const progress = (submittedSum / scorecards.length) * 100;
  const dataAttr = progress < 80 ? "danger" : "success";

  return (
    <div className="division uk-margin">
      <h6 className="division--name">
        {division.name} (
        <span className="division--progress-bar-text">
          {progress.toFixed(1)}%
        </span>
        )
      </h6>
      <div className="division--progress">
        <div
          className="division--progress-bar"
          data-progress-status={dataAttr}
          style={{ width: progress.toFixed(1) + "%" }}
        ></div>
      </div>
    </div>
  );
};

const DivisionProgressStats = observer(() => {
  const { store } = useAppContext();

  const divisions = store.division.all.map((d) => d.asJson);
  const scorecards: IScorecardMetadata[] = store.user.all.map((user) => {
    const agreement = store.individualScorecard.all.find(
      (agreement) => agreement.asJson.uid === user.asJson.uid
    );

    const division = store.division.getItemById(user.asJson.division);
    const divisionName = division ? division.asJson.name : "Unknown";
    const $agreement = agreement
      ? {
        ...defaultScorecardMetadata,
        ...agreement.asJson,
        division: user.asJson.division,
        divisionName: divisionName,
        uid: user.asJson.uid,
        displayName: user.asJson.displayName || "Unknown",
      }
      : {
        ...defaultScorecardMetadata,
        uid: user.asJson.uid,
        division: user.asJson.division,
        divisionName: divisionName,
        displayName: user.asJson.displayName || "Unknown",
      };

    return $agreement;
  });

  return (
    <ErrorBoundary>
      <div className="review-stats">
        <h6 className="title">Progress Statitics (Draft)</h6>

        {divisions.map((division) => (
          <ErrorBoundary key={division.id}>
            <Division division={division} />
          </ErrorBoundary>
        ))}
      </div>
    </ErrorBoundary>
  );
});

export default DivisionProgressStats;
