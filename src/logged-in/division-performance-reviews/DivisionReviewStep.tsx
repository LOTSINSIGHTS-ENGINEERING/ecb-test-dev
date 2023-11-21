import React from "react";
import { IReviewCycleType, IScorecardBatch } from "../../shared/models/ScorecardBatch";
import StepStage from "./DivisionStepStage";

interface IDivisionReviewStepProps {
  openStage: IReviewCycleType;
  setOpenStage: React.Dispatch<React.SetStateAction<IReviewCycleType>>;
  batch: IScorecardBatch;
}
const DivisionReviewStep = (props: IDivisionReviewStepProps) => {
  const { openStage, setOpenStage, batch } = props;
  const { draftReview, midtermReview, finalAssessment } = batch;

  const isOpen = (stage: string) => openStage === stage;

  return (
    <div className="step uk-card uk-card-default uk-card-body uk-card-small uk-margin">
      <StepStage
        index={1}
        title={"Scorecard"}
        open={isOpen("Scorecard")}
        status={draftReview.status}
        onClick={() => setOpenStage("Scorecard")}
      />
      <StepStage
        index={2}
        title={"Midterm Reviews (Q2)"}
        open={isOpen("Midterm Reviews")}
        status={midtermReview.status}
        onClick={() => setOpenStage("Midterm Reviews")}
      />
      <StepStage
        index={3}
        title={"Assessment (Q4)"}
        open={isOpen("Assessment")}
        status={finalAssessment.status}
        onClick={() => setOpenStage("Assessment")}
      />
    </div>
  );
};

export default DivisionReviewStep;
