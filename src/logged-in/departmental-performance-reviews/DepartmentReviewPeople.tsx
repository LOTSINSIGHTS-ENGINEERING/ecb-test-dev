import { useAppContext } from "../../shared/functions/Context";
import EmptyError from "../admin-settings/EmptyError";
import showModalFromId from "../../shared/functions/ModalShow";
import MODAL_NAMES from "../dialogs/ModalName";
import { IScorecardMetadata } from "../../shared/models/ScorecardMetadata";
import { observer } from "mobx-react-lite";
import ErrorBoundary from "../../shared/components/error-boundary/ErrorBoundary";
import { exportPerformanceOverview } from "../shared/functions/Excel";
import Toolbar from "../shared/components/toolbar/Toolbar";

interface IDivisionPerformanceReviewsProps {
  scorecards: IScorecardMetadata[];
}
const DivisionPerformanceReviews = observer((props: IDivisionPerformanceReviewsProps) => {
  const { scorecards } = props;

  const { store } = useAppContext();
  const role = store.auth.role;

  const statusClassName = (status: string) => `status status__${status}`;
  const myDepartment = store.auth.division;

  const myDepartmentScoreCards = scorecards.filter((s) => s.department === myDepartment);

  const onExportExcel = async () => {
    await exportPerformanceOverview(myDepartmentScoreCards);
  };

  const onView = (view: any) => {
    showModalFromId(MODAL_NAMES.PERFORMANCE_REVIEW.REVIEW_MODAL);
    store.individualScorecard.select(view);
  };

  return (
    <ErrorBoundary>
      <div className="review-staff">
        <Toolbar rightControls={<button
          className="btn btn-primary uk-margin-left"
          onClick={onExportExcel}
        >
          Export Report
        </button>}

          leftControls={
            <h6 className="title">Department Reviews</h6>
          }

        />
        <table className="people-table uk-table uk-table-small uk-table-middle uk-table-hover uk-table-divider">
          <thead className="header">
            <tr>
              <th>#</th>
              <th className="uk-width-expand@s">Name</th>
              <th>Department</th>
              <th>Scorecard</th>
              <th>Midterm</th>
              <th>Assessment</th>
            </tr>
          </thead>
          <tbody>
            {myDepartmentScoreCards.map((scorecard, index) => (
              <tr
                className="row"
                key={scorecard.uid}
                onClick={() => onView(scorecard)}
              >
                <td>{index + 1}</td>
                <td>{scorecard.displayName}</td>
                <td>{scorecard.departmentName}</td>
                <td>
                  <div
                    className={statusClassName(scorecard.agreementDraft.status)}
                  >
                    {scorecard.agreementDraft.status}
                  </div>
                </td>
                <td>
                  <div
                    className={statusClassName(scorecard.quarter2Review.status)}
                  >
                    {scorecard.quarter2Review.status}
                  </div>
                </td>
                <td>
                  <div
                    className={statusClassName(scorecard.quarter4Review.status)}
                  >
                    {scorecard.quarter4Review.status}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {!store.user.all.length && <EmptyError errorMessage="No users found" />}
      </div>
    </ErrorBoundary>
  );
});

export default DivisionPerformanceReviews;
