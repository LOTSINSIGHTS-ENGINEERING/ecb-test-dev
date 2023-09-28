import { useAppContext } from "../../../shared/functions/Context";
import { IMeasureCompany } from "../../../shared/models/MeasureCompany";
import { IObjective } from "../../../shared/models/Objective";
import { IObjectiveCompany } from "../../../shared/models/ObjectiveCompany";
import Rating from "../../shared/components/rating/Rating";
import { totalQ4CompanyObjectiveRating } from "../../shared/functions/Scorecard";

interface IProps {
  objective: IObjective;
}
const ObjectiveItem = (props: IProps) => {
  const { store } = useAppContext();

  const { objective } = props;

  // calculate rating
  const calculateRating = () => {
    const measures = getMeasures(objective);
    const measuresUpdated = measures.filter((measure) => measure.isUpdated).length > 0;
    const rating = totalQ4CompanyObjectiveRating(measures);
    return {
      rate: rating,
      isUpdated: measuresUpdated,
    };
  };

  const getMeasures = (objective: IObjectiveCompany): IMeasureCompany[] => {
    return store.companyMeasure.all.filter((measure) => measure.asJson.objective === objective.id).map((measure) => measure.asJson);
  };

  return (
    <li className="objective">
      <div className="uk-flex uk-flex-middle">
        <Rating
          rate={calculateRating().rate}
          isUpdated={calculateRating().isUpdated}
        />
        <div className="uk-margin-left">{objective.description}</div>
      </div>
    </li>
  );
};

export default ObjectiveItem;
