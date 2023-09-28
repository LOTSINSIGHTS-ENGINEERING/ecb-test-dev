import { Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { IScorecardBatch } from "../../shared/models/ScorecardBatch";

interface IProps {
  scorecardBatch: IScorecardBatch;
}
const FYPlan = (props: IProps) => {
  const { scorecardBatch } = props;
  const { id, description, locked } = scorecardBatch;
  const fyPlanCssClass = locked ? "FY-plan FY-plan__locked uk-card uk-card-default uk-card-body uk-card-small" : "FY-plan uk-card uk-card-default uk-card-body uk-card-small";

  const navigate = useNavigate();

  const onUpdate = () => {
    navigate(id);
  };

  return (
    <Fragment>
      <div className={fyPlanCssClass}>
        <h6 className="title">
          Financial Year: {description}
          {locked && (
            <>
              <span className="lock-icon" data-uk-icon="icon: lock"></span>
              <span className="locked-text">Locked</span>
            </>
          )}
        </h6>
      </div>

      <div className="company-scorecard uk-card uk-card-default uk-card-body uk-card-small">
        <h6 className="name">
          <span className="span-label">Name</span>
          Company Scorecard {description}
        </h6>
        <div className="controls">
          <button className="btn btn-primary" onClick={onUpdate}>
            View <span uk-icon="arrow-right"></span>
          </button>
        </div>
      </div>
    </Fragment>
  );
};

export default FYPlan;
// disabled={locked}