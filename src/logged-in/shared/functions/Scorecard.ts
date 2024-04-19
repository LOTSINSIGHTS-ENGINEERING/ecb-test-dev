import AppApi from "../../../shared/apis/AppApi";
import { IMeasure } from "../../../shared/models/Measure";
import { IMeasureAudit } from "../../../shared/models/MeasureAudit";
import { IMeasureAuditCompany } from "../../../shared/models/MeasureAuditCompany";
import { IMeasureCompany } from "../../../shared/models/MeasureCompany";
import { IObjective } from "../../../shared/models/Objective";
import { IScorecardMetadata } from "../../../shared/models/ScorecardMetadata";
import AppStore from "../../../shared/stores/AppStore";

export const deriveCompanyNumberRating = (measure: IMeasureCompany) => {
  const { annualActual, annualTarget } = measure;
  if (annualActual === null || annualTarget === null) return 1;

  if (annualActual < annualTarget) return 1;
  if (annualActual === annualTarget) return 3;
  if (annualActual > annualTarget) return 5;

  return 1;
};

export const companyQ2Rating = (measure: IMeasureCompany) => {
  const { quarter2Actual, annualTarget } = measure;
  if (quarter2Actual === null || annualTarget === null) return 1;

  if (quarter2Actual < annualTarget) return 1;
  if (quarter2Actual === annualTarget) return 3;
  if (quarter2Actual > annualTarget) return 5;
  return 1;
};

export const companyQ4Rating = (measure: IMeasureCompany) => {
  const { annualActual, annualTarget } = measure;
  if (annualActual === null || annualTarget === null) return 1;

  if (annualActual < annualTarget) return 1;
  if (annualActual === annualTarget) return 3;
  if (annualActual > annualTarget) return 5;

  return 1;
};

export const rateColor = (rating: number, isUpdated?: boolean): string => {
  if (!isUpdated) return "grey"; // if not updated, return grey

  if (rating === 5) return "purple";
  else if (rating >= 4 && rating < 5) return "blue";
  else if (rating >= 3 && rating < 4) return "green";
  else if (rating >= 2 && rating < 3) return "warning";
  else return "red";
};


export const statusClass = (status: string): string => {
  switch (status) {
    case "Upward":
      return "green";
    case "Steady":
      return "warning";
    case "Downward":
      return "red";
    default:
      return "green";
  }
};

interface ISymobl {
  symbol: string;
  prefix?: string;
  suffix?: string;
}
export const dataTypeSymbol = (dataType: string): ISymobl => {
  if (dataType === "Percentage")
    return {
      prefix: "",
      suffix: "%",
      symbol: "%",
    };

  if (dataType === "Currency")
    return {
      prefix: "N$",
      suffix: "",
      symbol: "N$",
    };

  if (dataType === "Rating")
    return {
      prefix: "",
      suffix: "Rating",
      symbol: "Rate",
    };

  if (dataType === "Number")
    return {
      prefix: "",
      suffix: "",
      symbol: "#",
    };

  if (dataType === "Date")
    return {
      prefix: "",
      suffix: "",
      symbol: "Date",
    };

  return {
    prefix: "",
    suffix: "",
    symbol: "",
  };
};

export const measureQ2Rating = (measure: IMeasure | IMeasureCompany): number => {
  const actual = measure.quarter2Actual;
  const rating1 = Number(measure.rating1) || 0;
  const rating2 = Number(measure.rating2) || 0;
  const rating3 = Number(measure.rating3) || 0;
  const rating4 = measure.rating4;
  const rating5 = measure.rating5;

  const type = ratingType(rating1, rating2, rating3);

  if (actual === null || actual === undefined) return 1;

  if (type === "INCREASING") {
    const rating = calculateIncreasingRating(
      actual,
      rating1,
      rating2,
      rating3,
      rating4,
      rating5
    );

    return Math.round(rating * 10) / 10;
  }
  if (type === "DECREASING") {
    const rating = calculateIncreasingRating(
      actual,
      rating5 || 0,
      rating4 || 0,
      rating3,
      rating2,
      rating1
    );

    const reversedRating = 6 - rating;
    return Math.round(reversedRating * 10) / 10;
  }
  return 1;
};

export const measureQ4Rating = (measure: IMeasure | IMeasureCompany): number => {
  const actual = measure.annualActual;
  const rating1 = Number(measure.rating1) || 0;
  const rating2 = Number(measure.rating2) || 0;
  const rating3 = Number(measure.rating3) || 0;
  const rating4 = measure.rating4;
  const rating5 = measure.rating5;

  const type = ratingType(rating1, rating2, rating3);

  if (actual === null || actual === undefined) return 1;

  if (type === "INCREASING") {
    const rating = calculateIncreasingRating(
      actual,
      rating1,
      rating2,
      rating3,
      rating4,
      rating5
    );

    return Math.round(rating * 10) / 10;
  }
  if (type === "DECREASING") {
    const rating = calculateIncreasingRating(
      actual,
      rating5 || 0,
      rating4 || 0,
      rating3,
      rating2,
      rating1
    );

    const reversedRating = 6 - rating;
    return Math.round(reversedRating * 10) / 10;
  }
  return 1;
};

const ratingType = (rating1: number, rating2: number, rating3: number) => {
  if (rating1 <= rating2 && rating2 <= rating3 && rating3) return "INCREASING";
  else if (rating1 >= rating2 && rating2 >= rating3 && rating3)
    return "DECREASING";
  return "INCREASING";
};

const calculateIncreasingRating = (
  actual: number,
  rating1: number,
  rating2: number,
  rating3: number,
  rating4: number | null,
  rating5: number | null
) => {
  if (actual <= rating1)
    return 1; // actual greater than rate 1 and less than rate 2
  else if (actual > rating1 && actual <= rating2)
    return (actual / rating2) * 2 || 1;
  // actual greater than rate 1 and less than rate 2
  else if (actual > rating2 && actual <= rating3)
    return (actual / rating3) * 3 || 3;
  else if (actual > rating3) {
    if (rating5 !== null && actual >= rating5) return 5;
    else if (rating4 !== null && rating5 !== null && actual >= rating4)
      return (actual / rating5) * 5 || 5;
    else if (rating4 !== null && actual >= rating4) return 4;
    else if (rating4 !== null && actual <= rating4)
      return (actual / rating4) * 4 || 4;
    else return 3;
  } else return 1;
};

// COMPANY RATINGS REDONE TO REMOVE THE WEIGHT
export const totalQ2CompanyObjectiveRating = (measures: IMeasureCompany[] | IMeasureAuditCompany[]) => {
  const data = measures.map((measure) => ({
    rating: Number(measure.q2FinalRating),
  }));
  let rating = data.reduce((acc, curr) => {
    return acc + curr.rating;
  }, 0) / data.length;

  // rating = Math.round(rating * 10) / 10;
  return rating;
};


export const totalQ4CompanyObjectiveRating = (measures: IMeasureCompany[] | IMeasureAuditCompany[]) => {
  const data = measures.map((measure) => ({
    rating: Number(measure.q4FinalRating),
  }));

  let rating = data.reduce((acc, curr) => {
    return acc + curr.rating;
  }, 0) / data.length;

  // rating = Math.round(rating * 10) / 10;
  return rating;
};

// INDIVIDUAL RATINGS REDONE TO REMOVE THE WEIGHTS
export const totalQ2IndividualObjectiveRating = (measures: IMeasure[] | IMeasureAudit[]) => {
  const data = measures.map((measure) => ({
    rating: Number(measure.finalRating || 0),
  }));

  let rating = data.reduce((acc, curr) => {
    return acc + curr.rating;
  }, 0) / data.length;

  // rating = Math.round(rating * 10) / 10;
  return rating;
};



//old function not having weight
// export const totalQ4IndividualObjectiveRating = (measures: IMeasure[] | IMeasureAudit[]) => {
//   const data = measures.map((measure) => ({
//     rating: Number(measure.finalRating2 || 0),
//   }));


//   let rating = data.reduce((acc, curr) => {
//     return acc + curr.rating;
//   }, 0) / data.length;

//   rating = Math.round(rating * 10) / 10;
//   return 3;
// };


//weight added to new function
export const totalQ4IndividualObjectiveRating = (measures: IMeasure[] | IMeasureAudit[], objective?: string): number => {
  let totalScore = 0;
  // Iterate over each measure
  measures.filter((measure) => measure.objective === objective).forEach((measure) => {
    // Calculate the score for the current measure
    const score = (measure.finalRating2 || 0) * ((measure.weight || 0) / 100);
    // Add the score to the total score
    totalScore += score;
  });
  return totalScore;
};

//weighted objective total score
export const totalQ4IndividualObjectiveRatingObjWeighted = (measures: IMeasure[] | IMeasureAudit[], objective: IObjective): number => {

  let totalScore = 0;
  // Iterate over each measure
  measures.filter((measure) => measure.objective === objective.id).forEach((measure) => {
    // Calculate the score for the current measure
    const score = (measure.finalRating2 || 0) * ((measure.weight || 0) / 100);
    // Add the score to the total score
    totalScore += score;
  });

  return 0;
};



// weighted perspective total score





export const totalQ2MeasureCompanyRating = (measures: IMeasureCompany[]) => {
  const rating = measures.reduce((acc, measure) => {
    return acc + (measure.q2FinalRating || 0);
  }, 0) / measures.length;
  // return Math.round((rating) * 10) / 10;
  return rating || 0
};

export const totalQ4MeasureCompanyRating = (measures: IMeasureCompany[]) => {
  const rating = measures.reduce((acc, measure) => {
    return acc + (measure.q4FinalRating || 0);
  }, 0) / measures.length;
  // return Math.round((rating) * 10) / 10;
  return rating || 0
};

// molale and john mukoya

export const totalQ2MeasureRating = (measures: IMeasure[]) => {
  const rating = measures.reduce((acc, measure) => {
    return acc + (measure.finalRating || 0);
  }, 0) / measures.length;
  // return Math.round((rating) * 10) / 10;
  return rating
};

export const totalQ2MeasureRatingNew = (
  measures: IMeasure[],
  objectives: IObjective[],
  metaData?: IScorecardMetadata
) => {

  //kpis
  const kpiTotalScores: { [objectiveId: string]: number } = {};

  measures.forEach(measure => {
    const objectiveId = measure.objective;
    const measureWeight = measure.weight;
    const finalRating2 = measure.finalRating;
    const totalScore = ((measureWeight || 0) / 100) * (finalRating2 || 0);

    if (!kpiTotalScores[objectiveId]) {
      kpiTotalScores[objectiveId] = 0;
    }

    kpiTotalScores[objectiveId] += totalScore;
  });


  //objectives
  const objectiveTotalScores: {
    [objectiveId: string]: {
      totalScore: number;
      perspective: string;
    };
  } = {};

  objectives.forEach(objective => {
    const objectiveId = objective.id;
    const objectiveWeight = objective.weight;
    const perspective = objective.perspective;

    const totalMeasureScore = kpiTotalScores[objectiveId] || 0;
    const totalObjectiveScore = totalMeasureScore * ((objectiveWeight || 0) / 100);

    objectiveTotalScores[objectiveId] = {
      totalScore: totalObjectiveScore,
      perspective: perspective || '',
    };
  });

  // Object to store the total scores grouped by perspective
  const totalScoresByPerspective: { [perspective: string]: number } = {};

  for (const objectiveId in objectiveTotalScores) {
    if (objectiveTotalScores.hasOwnProperty(objectiveId)) {
      const { totalScore, perspective } = objectiveTotalScores[objectiveId];

      if (!totalScoresByPerspective.hasOwnProperty(perspective)) {
        totalScoresByPerspective[perspective] = 0;
      }

      totalScoresByPerspective[perspective] += totalScore;
    }
  }

  const financialWeightPercentage = metaData?.perspectiveWeights.financial || 0;  // financial
  const stakeholderPercentage = metaData?.perspectiveWeights.customer || 0;      // customer
  const operationPercentage = metaData?.perspectiveWeights.process || 0;        // process
  const humanCapitalPercentage = metaData?.perspectiveWeights.growth || 0;     // growth


  let totalScoreFinancial = 0;
  let totalScoreStakeholder = 0;
  let totalScoreOperation = 0;
  let totalScoreHumanCapital = 0;

  for (const perspective in totalScoresByPerspective) {
    if (totalScoresByPerspective.hasOwnProperty(perspective)) {
      const totalScore = totalScoresByPerspective[perspective];

      switch (perspective) {
        case "Financial":
          totalScoreFinancial += totalScore * (financialWeightPercentage / 100);
          break;
        case "Customer":
          totalScoreStakeholder += totalScore * (stakeholderPercentage / 100);
          break;
        case "Process":
          totalScoreOperation += totalScore * (operationPercentage / 100);
          break;
        case "Growth":
          totalScoreHumanCapital += totalScore * (humanCapitalPercentage / 100);
          break;
        default:
          console.log("Unknown perspective:", perspective);
      }
    }
  }

  // Calculate the overall score
  const overallScore =
    totalScoreFinancial +
    totalScoreStakeholder +
    totalScoreOperation +
    totalScoreHumanCapital;

  return overallScore;
};

export const totalQ4MeasureRating = (measures: IMeasure[]) => {
  const rating = measures.reduce((acc, measure) => {
    return acc + (measure.finalRating2 || 0);
  }, 0) / measures.length;
  // return Math.round((rating) * 10) / 10;
  return rating
};

export const totalQ4MeasureRatingNew = (
  measures: IMeasure[],
  objectives: IObjective[],
  metaData?: IScorecardMetadata
) => {

  //kpis
  const kpiTotalScores: { [objectiveId: string]: number } = {};

  measures.forEach(measure => {
    const objectiveId = measure.objective;
    const measureWeight = measure.weight;
    const finalRating2 = measure.finalRating2;
    const totalScore = ((measureWeight || 0) / 100) * (finalRating2 || 0);

    if (!kpiTotalScores[objectiveId]) {
      kpiTotalScores[objectiveId] = 0;
    }

    kpiTotalScores[objectiveId] += totalScore;
  });


  //objectives
  const objectiveTotalScores: {
    [objectiveId: string]: {
      totalScore: number;
      perspective: string;
    };
  } = {};

  objectives.forEach(objective => {
    const objectiveId = objective.id;
    const objectiveWeight = objective.weight;
    const perspective = objective.perspective;

    const totalMeasureScore = kpiTotalScores[objectiveId] || 0;
    const totalObjectiveScore = totalMeasureScore * ((objectiveWeight || 0) / 100);

    objectiveTotalScores[objectiveId] = {
      totalScore: totalObjectiveScore,
      perspective: perspective || '',
    };
  });

  // Object to store the total scores grouped by perspective
  const totalScoresByPerspective: { [perspective: string]: number } = {};

  for (const objectiveId in objectiveTotalScores) {
    if (objectiveTotalScores.hasOwnProperty(objectiveId)) {
      const { totalScore, perspective } = objectiveTotalScores[objectiveId];

      if (!totalScoresByPerspective.hasOwnProperty(perspective)) {
        totalScoresByPerspective[perspective] = 0;
      }

      totalScoresByPerspective[perspective] += totalScore;
    }
  }

  const financialWeightPercentage = metaData?.perspectiveWeights.financial || 0;  // financial
  const stakeholderPercentage = metaData?.perspectiveWeights.customer || 0;      // customer
  const operationPercentage = metaData?.perspectiveWeights.process || 0;        // process
  const humanCapitalPercentage = metaData?.perspectiveWeights.growth || 0;     // growth


  let totalScoreFinancial = 0;
  let totalScoreStakeholder = 0;
  let totalScoreOperation = 0;
  let totalScoreHumanCapital = 0;

  for (const perspective in totalScoresByPerspective) {
    if (totalScoresByPerspective.hasOwnProperty(perspective)) {
      const totalScore = totalScoresByPerspective[perspective];

      switch (perspective) {
        case "Financial":
          totalScoreFinancial += totalScore * (financialWeightPercentage / 100);
          break;
        case "Customer":
          totalScoreStakeholder += totalScore * (stakeholderPercentage / 100);
          break;
        case "Process":
          totalScoreOperation += totalScore * (operationPercentage / 100);
          break;
        case "Growth":
          totalScoreHumanCapital += totalScore * (humanCapitalPercentage / 100);
          break;
        default:
          console.log("Unknown perspective:", perspective);
      }
    }
  }

  // Calculate the overall score
  const overallScore =
    totalScoreFinancial +
    totalScoreStakeholder +
    totalScoreOperation +
    totalScoreHumanCapital;

  return overallScore;
};

// SEMESTER ONE RATINGS
// export const semester1EmpRating = (measures: IMeasure[]) => {
//   const rating = measures.reduce((acc, measure) => {
//     return acc + measure.autoRating;
//   }, 0) / measures.length;
//   // return Math.round((rating) * 10) / 10;
//   return rating
// };
export const semester1EmpRating = (
  measures: IMeasure[],
  objectives: IObjective[],
  metaData?: IScorecardMetadata
) => {

  //kpis
  const kpiTotalScores: { [objectiveId: string]: number } = {};

  measures.forEach(measure => {
    const objectiveId = measure.objective;
    const measureWeight = measure.weight;
    const finalRating2 = measure.autoRating;
    const totalScore = ((measureWeight || 0) / 100) * (finalRating2 || 0);

    if (!kpiTotalScores[objectiveId]) {
      kpiTotalScores[objectiveId] = 0;
    }

    kpiTotalScores[objectiveId] += totalScore;
  });


  //objectives
  const objectiveTotalScores: {
    [objectiveId: string]: {
      totalScore: number;
      perspective: string;
    };
  } = {};

  objectives.forEach(objective => {
    const objectiveId = objective.id;
    const objectiveWeight = objective.weight;
    const perspective = objective.perspective;

    const totalMeasureScore = kpiTotalScores[objectiveId] || 0;
    const totalObjectiveScore = totalMeasureScore * ((objectiveWeight || 0) / 100);

    objectiveTotalScores[objectiveId] = {
      totalScore: totalObjectiveScore,
      perspective: perspective || '',
    };
  });

  // Object to store the total scores grouped by perspective
  const totalScoresByPerspective: { [perspective: string]: number } = {};

  for (const objectiveId in objectiveTotalScores) {
    if (objectiveTotalScores.hasOwnProperty(objectiveId)) {
      const { totalScore, perspective } = objectiveTotalScores[objectiveId];

      if (!totalScoresByPerspective.hasOwnProperty(perspective)) {
        totalScoresByPerspective[perspective] = 0;
      }

      totalScoresByPerspective[perspective] += totalScore;
    }
  }

  const financialWeightPercentage = metaData?.perspectiveWeights.financial || 0;  // financial
  const stakeholderPercentage = metaData?.perspectiveWeights.customer || 0;      // customer
  const operationPercentage = metaData?.perspectiveWeights.process || 0;        // process
  const humanCapitalPercentage = metaData?.perspectiveWeights.growth || 0;     // growth


  let totalScoreFinancial = 0;
  let totalScoreStakeholder = 0;
  let totalScoreOperation = 0;
  let totalScoreHumanCapital = 0;

  for (const perspective in totalScoresByPerspective) {
    if (totalScoresByPerspective.hasOwnProperty(perspective)) {
      const totalScore = totalScoresByPerspective[perspective];

      switch (perspective) {
        case "Financial":
          totalScoreFinancial += totalScore * (financialWeightPercentage / 100);
          break;
        case "Customer":
          totalScoreStakeholder += totalScore * (stakeholderPercentage / 100);
          break;
        case "Process":
          totalScoreOperation += totalScore * (operationPercentage / 100);
          break;
        case "Growth":
          totalScoreHumanCapital += totalScore * (humanCapitalPercentage / 100);
          break;
        default:
          console.log("Unknown perspective:", perspective);
      }
    }
  }

  // Calculate the overall score
  const overallScore =
    totalScoreFinancial +
    totalScoreStakeholder +
    totalScoreOperation +
    totalScoreHumanCapital;

  return overallScore;
};


// export const semester1SuperRating = (measures: IMeasure[]) => {
//   const rating = measures.reduce((acc, measure) => {
//     return acc + (measure.supervisorRating || 0);
//   }, 0) / measures.length;
//   // return Math.round((rating) * 10) / 10;
//   return rating
// };

export const semester1SuperRating = (
  measures: IMeasure[],
  objectives: IObjective[],
  metaData?: IScorecardMetadata
) => {

  //kpis
  const kpiTotalScores: { [objectiveId: string]: number } = {};

  measures.forEach(measure => {
    const objectiveId = measure.objective;
    const measureWeight = measure.weight;
    const finalRating2 = measure.supervisorRating;
    const totalScore = ((measureWeight || 0) / 100) * (finalRating2 || 0);

    if (!kpiTotalScores[objectiveId]) {
      kpiTotalScores[objectiveId] = 0;
    }

    kpiTotalScores[objectiveId] += totalScore;
  });


  //objectives
  const objectiveTotalScores: {
    [objectiveId: string]: {
      totalScore: number;
      perspective: string;
    };
  } = {};

  objectives.forEach(objective => {
    const objectiveId = objective.id;
    const objectiveWeight = objective.weight;
    const perspective = objective.perspective;

    const totalMeasureScore = kpiTotalScores[objectiveId] || 0;
    const totalObjectiveScore = totalMeasureScore * ((objectiveWeight || 0) / 100);

    objectiveTotalScores[objectiveId] = {
      totalScore: totalObjectiveScore,
      perspective: perspective || '',
    };
  });

  // Object to store the total scores grouped by perspective
  const totalScoresByPerspective: { [perspective: string]: number } = {};

  for (const objectiveId in objectiveTotalScores) {
    if (objectiveTotalScores.hasOwnProperty(objectiveId)) {
      const { totalScore, perspective } = objectiveTotalScores[objectiveId];

      if (!totalScoresByPerspective.hasOwnProperty(perspective)) {
        totalScoresByPerspective[perspective] = 0;
      }

      totalScoresByPerspective[perspective] += totalScore;
    }
  }

  const financialWeightPercentage = metaData?.perspectiveWeights.financial || 0;  // financial
  const stakeholderPercentage = metaData?.perspectiveWeights.customer || 0;      // customer
  const operationPercentage = metaData?.perspectiveWeights.process || 0;        // process
  const humanCapitalPercentage = metaData?.perspectiveWeights.growth || 0;     // growth


  let totalScoreFinancial = 0;
  let totalScoreStakeholder = 0;
  let totalScoreOperation = 0;
  let totalScoreHumanCapital = 0;

  for (const perspective in totalScoresByPerspective) {
    if (totalScoresByPerspective.hasOwnProperty(perspective)) {
      const totalScore = totalScoresByPerspective[perspective];

      switch (perspective) {
        case "Financial":
          totalScoreFinancial += totalScore * (financialWeightPercentage / 100);
          break;
        case "Customer":
          totalScoreStakeholder += totalScore * (stakeholderPercentage / 100);
          break;
        case "Process":
          totalScoreOperation += totalScore * (operationPercentage / 100);
          break;
        case "Growth":
          totalScoreHumanCapital += totalScore * (humanCapitalPercentage / 100);
          break;
        default:
          console.log("Unknown perspective:", perspective);
      }
    }
  }

  // Calculate the overall score
  const overallScore =
    totalScoreFinancial +
    totalScoreStakeholder +
    totalScoreOperation +
    totalScoreHumanCapital;

  return overallScore;
};


// export const semester1FinalRating = (measures: IMeasure[]) => {
//   const rating = measures.reduce((acc, measure) => {
//     return acc + (measure.finalRating || 0);
//   }, 0) / measures.length;
//   // return Math.round((rating) * 10) / 10;
//   return rating
// };

export const semester1FinalRating = (
  measures: IMeasure[],
  objectives: IObjective[],
  metaData?: IScorecardMetadata
) => {

  //kpis
  const kpiTotalScores: { [objectiveId: string]: number } = {};

  measures.forEach(measure => {
    const objectiveId = measure.objective;
    const measureWeight = measure.weight;
    const finalRating2 = measure.finalRating;
    const totalScore = ((measureWeight || 0) / 100) * (finalRating2 || 0);

    if (!kpiTotalScores[objectiveId]) {
      kpiTotalScores[objectiveId] = 0;
    }

    kpiTotalScores[objectiveId] += totalScore;
  });


  //objectives
  const objectiveTotalScores: {
    [objectiveId: string]: {
      totalScore: number;
      perspective: string;
    };
  } = {};

  objectives.forEach(objective => {
    const objectiveId = objective.id;
    const objectiveWeight = objective.weight;
    const perspective = objective.perspective;

    const totalMeasureScore = kpiTotalScores[objectiveId] || 0;
    const totalObjectiveScore = totalMeasureScore * ((objectiveWeight || 0) / 100);

    objectiveTotalScores[objectiveId] = {
      totalScore: totalObjectiveScore,
      perspective: perspective || '',
    };
  });

  // Object to store the total scores grouped by perspective
  const totalScoresByPerspective: { [perspective: string]: number } = {};

  for (const objectiveId in objectiveTotalScores) {
    if (objectiveTotalScores.hasOwnProperty(objectiveId)) {
      const { totalScore, perspective } = objectiveTotalScores[objectiveId];

      if (!totalScoresByPerspective.hasOwnProperty(perspective)) {
        totalScoresByPerspective[perspective] = 0;
      }

      totalScoresByPerspective[perspective] += totalScore;
    }
  }

  const financialWeightPercentage = metaData?.perspectiveWeights.financial || 0;  // financial
  const stakeholderPercentage = metaData?.perspectiveWeights.customer || 0;      // customer
  const operationPercentage = metaData?.perspectiveWeights.process || 0;        // process
  const humanCapitalPercentage = metaData?.perspectiveWeights.growth || 0;     // growth


  let totalScoreFinancial = 0;
  let totalScoreStakeholder = 0;
  let totalScoreOperation = 0;
  let totalScoreHumanCapital = 0;

  for (const perspective in totalScoresByPerspective) {
    if (totalScoresByPerspective.hasOwnProperty(perspective)) {
      const totalScore = totalScoresByPerspective[perspective];

      switch (perspective) {
        case "Financial":
          totalScoreFinancial += totalScore * (financialWeightPercentage / 100);
          break;
        case "Customer":
          totalScoreStakeholder += totalScore * (stakeholderPercentage / 100);
          break;
        case "Process":
          totalScoreOperation += totalScore * (operationPercentage / 100);
          break;
        case "Growth":
          totalScoreHumanCapital += totalScore * (humanCapitalPercentage / 100);
          break;
        default:
          console.log("Unknown perspective:", perspective);
      }
    }
  }

  // Calculate the overall score
  const overallScore =
    totalScoreFinancial +
    totalScoreStakeholder +
    totalScoreOperation +
    totalScoreHumanCapital;

  return overallScore;
};


// SEMESTER TWO RATINGS
//wrong
// export const q4EmpRating = (measures: IMeasure[]) => {
//   const rating = measures.reduce((acc, measure) => {
//     return acc + measure.autoRating2;
//   }, 0) / measures.length;
//   // return Math.round((rating) * 10) / 10;
//   return rating
// };


//wrong
// export const q4SuperRating = (measures: IMeasure[]) => {
//   const rating = measures.reduce((acc, measure) => {
//     return acc + (measure.supervisorRating2 || 0);
//   }, 0) / measures.length;
//   // return Math.round((rating) * 10) / 10;
//   return rating
// };


//wrong
// export const q4FinalRating = (measures: IMeasure[]) => {
//   const rating = measures.reduce((acc, measure) => {
//     return acc + (measure.finalRating2 || 0);
//   }, 0) / measures.length;

//   return rating
// };

//new functionS
export const q4EmpRating = (
  measures: IMeasure[],
  objectives: IObjective[],
  metaData?: IScorecardMetadata
) => {

  //kpis
  const kpiTotalScores: { [objectiveId: string]: number } = {};

  measures.forEach(measure => {
    const objectiveId = measure.objective;
    const measureWeight = measure.weight;
    const finalRating2 = measure.autoRating2;
    const totalScore = ((measureWeight || 0) / 100) * (finalRating2 || 0);

    if (!kpiTotalScores[objectiveId]) {
      kpiTotalScores[objectiveId] = 0;
    }

    kpiTotalScores[objectiveId] += totalScore;
  });


  //objectives
  const objectiveTotalScores: {
    [objectiveId: string]: {
      totalScore: number;
      perspective: string;
    };
  } = {};

  objectives.forEach(objective => {
    const objectiveId = objective.id;
    const objectiveWeight = objective.weight;
    const perspective = objective.perspective;

    const totalMeasureScore = kpiTotalScores[objectiveId] || 0;
    const totalObjectiveScore = totalMeasureScore * ((objectiveWeight || 0) / 100);

    objectiveTotalScores[objectiveId] = {
      totalScore: totalObjectiveScore,
      perspective: perspective || '',
    };
  });

  // Object to store the total scores grouped by perspective
  const totalScoresByPerspective: { [perspective: string]: number } = {};

  for (const objectiveId in objectiveTotalScores) {
    if (objectiveTotalScores.hasOwnProperty(objectiveId)) {
      const { totalScore, perspective } = objectiveTotalScores[objectiveId];

      if (!totalScoresByPerspective.hasOwnProperty(perspective)) {
        totalScoresByPerspective[perspective] = 0;
      }

      totalScoresByPerspective[perspective] += totalScore;
    }
  }

  const financialWeightPercentage = metaData?.perspectiveWeights.financial || 0;  // financial
  const stakeholderPercentage = metaData?.perspectiveWeights.customer || 0;      // customer
  const operationPercentage = metaData?.perspectiveWeights.process || 0;        // process
  const humanCapitalPercentage = metaData?.perspectiveWeights.growth || 0;     // growth


  let totalScoreFinancial = 0;
  let totalScoreStakeholder = 0;
  let totalScoreOperation = 0;
  let totalScoreHumanCapital = 0;

  for (const perspective in totalScoresByPerspective) {
    if (totalScoresByPerspective.hasOwnProperty(perspective)) {
      const totalScore = totalScoresByPerspective[perspective];

      switch (perspective) {
        case "Financial":
          totalScoreFinancial += totalScore * (financialWeightPercentage / 100);
          break;
        case "Customer":
          totalScoreStakeholder += totalScore * (stakeholderPercentage / 100);
          break;
        case "Process":
          totalScoreOperation += totalScore * (operationPercentage / 100);
          break;
        case "Growth":
          totalScoreHumanCapital += totalScore * (humanCapitalPercentage / 100);
          break;
        default:
          console.log("Unknown perspective:", perspective);
      }
    }
  }

  // Calculate the overall score
  const overallScore =
    totalScoreFinancial +
    totalScoreStakeholder +
    totalScoreOperation +
    totalScoreHumanCapital;

  return overallScore;
};


export const q4SuperRating = (
  measures: IMeasure[],
  objectives: IObjective[],
  metaData?: IScorecardMetadata
) => {
  // Step 1: Calculate the total score for each measure (KPI)
  const kpiTotalScores: { [objectiveId: string]: number } = {};

  measures.forEach(measure => {
    const objectiveId = measure.objective;
    const measureWeight = measure.weight;
    const finalRating2 = measure.supervisorRating2;
    const totalScore = ((measureWeight || 0) / 100) * (finalRating2 || 0);

    if (!kpiTotalScores[objectiveId]) {
      kpiTotalScores[objectiveId] = 0;
    }

    kpiTotalScores[objectiveId] += totalScore;
  });


  const objectiveTotalScores: {
    [objectiveId: string]: {
      totalScore: number;
      perspective: string; // Add your extra field here
    };
  } = {};

  objectives.forEach(objective => {
    const objectiveId = objective.id;
    const objectiveWeight = objective.weight;
    const perspective = objective.perspective;

    const totalMeasureScore = kpiTotalScores[objectiveId] || 0;
    const totalObjectiveScore = totalMeasureScore * ((objectiveWeight || 0) / 100);

    // Assign an object with all properties
    objectiveTotalScores[objectiveId] = {
      totalScore: totalObjectiveScore,
      perspective: perspective || '', // Providing a default value for perspective
    };
  });

  // Object to store the total scores grouped by perspective
  const totalScoresByPerspective: { [perspective: string]: number } = {};

  // Iterate through objectiveTotalScores
  for (const objectiveId in objectiveTotalScores) {
    if (objectiveTotalScores.hasOwnProperty(objectiveId)) {
      const { totalScore, perspective } = objectiveTotalScores[objectiveId];

      // If the perspective doesn't exist in totalScoresByPerspective, initialize it with 0
      if (!totalScoresByPerspective.hasOwnProperty(perspective)) {
        totalScoresByPerspective[perspective] = 0;
      }

      // Add the total score to the corresponding perspective
      totalScoresByPerspective[perspective] += totalScore;
    }
  }


  const financialWeightPercentage = metaData?.perspectiveWeights.financial || 0;  // financial
  const stakeholderPercentage = metaData?.perspectiveWeights.customer || 0;      // customer
  const operationPercentage = metaData?.perspectiveWeights.process || 0;        // process
  const humanCapitalPercentage = metaData?.perspectiveWeights.growth || 0;     // growth


  let totalScoreFinancial = 0;
  let totalScoreStakeholder = 0;
  let totalScoreOperation = 0;
  let totalScoreHumanCapital = 0;

  for (const perspective in totalScoresByPerspective) {
    if (totalScoresByPerspective.hasOwnProperty(perspective)) {
      const totalScore = totalScoresByPerspective[perspective];

      switch (perspective) {
        case "Financial":
          totalScoreFinancial += totalScore * (financialWeightPercentage / 100);
          break;
        case "Customer":
          totalScoreStakeholder += totalScore * (stakeholderPercentage / 100);
          break;
        case "Process":
          totalScoreOperation += totalScore * (operationPercentage / 100);
          break;
        case "Growth":
          totalScoreHumanCapital += totalScore * (humanCapitalPercentage / 100);
          break;
        default:
      }
    }
  }


  // Calculate the overall score
  const overallScore =
    totalScoreFinancial +
    totalScoreStakeholder +
    totalScoreOperation +
    totalScoreHumanCapital;

  return overallScore;
};

export const q4FinalRating = (
  measures: IMeasure[],
  objectives: IObjective[],
  metaData?: IScorecardMetadata
) => {
  // Step 1: Calculate the total score for each measure (KPI)
  const kpiTotalScores: { [objectiveId: string]: number } = {};

  measures.forEach(measure => {
    const objectiveId = measure.objective;
    const measureWeight = measure.weight;
    const finalRating2 = measure.finalRating2;
    const totalScore = ((measureWeight || 0) / 100) * (finalRating2 || 0);

    if (!kpiTotalScores[objectiveId]) {
      kpiTotalScores[objectiveId] = 0;
    }

    kpiTotalScores[objectiveId] += totalScore;
  });


  const objectiveTotalScores: {
    [objectiveId: string]: {
      totalScore: number;
      perspective: string; // Add your extra field here
    };
  } = {};

  objectives.forEach(objective => {
    const objectiveId = objective.id;
    const objectiveWeight = objective.weight;
    const perspective = objective.perspective;

    const totalMeasureScore = kpiTotalScores[objectiveId] || 0;
    const totalObjectiveScore = totalMeasureScore * ((objectiveWeight || 0) / 100);

    // Assign an object with all properties
    objectiveTotalScores[objectiveId] = {
      totalScore: totalObjectiveScore,
      perspective: perspective || '', // Providing a default value for perspective
    };
  });

  // Object to store the total scores grouped by perspective
  const totalScoresByPerspective: { [perspective: string]: number } = {};

  // Iterate through objectiveTotalScores
  for (const objectiveId in objectiveTotalScores) {
    if (objectiveTotalScores.hasOwnProperty(objectiveId)) {
      const { totalScore, perspective } = objectiveTotalScores[objectiveId];

      // If the perspective doesn't exist in totalScoresByPerspective, initialize it with 0
      if (!totalScoresByPerspective.hasOwnProperty(perspective)) {
        totalScoresByPerspective[perspective] = 0;
      }

      // Add the total score to the corresponding perspective
      totalScoresByPerspective[perspective] += totalScore;
    }
  }

  const financialWeightPercentage = metaData?.perspectiveWeights.financial || 0;  // financial
  const stakeholderPercentage = metaData?.perspectiveWeights.customer || 0;      // customer
  const operationPercentage = metaData?.perspectiveWeights.process || 0;        // process
  const humanCapitalPercentage = metaData?.perspectiveWeights.growth || 0;     // growth


  let totalScoreFinancial = 0;
  let totalScoreStakeholder = 0;
  let totalScoreOperation = 0;
  let totalScoreHumanCapital = 0;

  for (const perspective in totalScoresByPerspective) {
    if (totalScoresByPerspective.hasOwnProperty(perspective)) {
      const totalScore = totalScoresByPerspective[perspective];

      switch (perspective) {
        case "Financial":
          totalScoreFinancial += totalScore * (financialWeightPercentage / 100);
          break;
        case "Customer":
          totalScoreStakeholder += totalScore * (stakeholderPercentage / 100);
          break;
        case "Process":
          totalScoreOperation += totalScore * (operationPercentage / 100);
          break;
        case "Growth":
          totalScoreHumanCapital += totalScore * (humanCapitalPercentage / 100);
          break;
        default:
          console.log("Unknown perspective:", perspective);
      }
    }
  }


  // Calculate the overall score
  const overallScore =
    totalScoreFinancial +
    totalScoreStakeholder +
    totalScoreOperation +
    totalScoreHumanCapital;

  return overallScore;
};






export const q4FinalRatingNewTest = (
  measures: IMeasure[],
  objectives: IObjective[],
  metaData: IScorecardMetadata[],
  uid: string
) => {

  const perspectiveWeights = metaData.find((data) => data.uid === uid)?.perspectiveWeights;

  //need to calculate the totalscore. need help

  //logic

  //we have perspective weights 


  //we have objective weights


  // we have kpi (measures) weights


  // the calculation starts from  kpi. so this is what happens


  // kpi total score

  // first find the total scores of kpis (measures). note that kpis are measure yeah.

  // measure has weight and finalRating2 which is the score (weight * finalRating2) = total score
  // practical (40% * 4) = 1.6. note that there are multiple measures.

  // objective total score
  // so here each measure is under a specific objective. very important.
  // now wee need to get the total score 
  // so we neen to first add up all measure of the same objective and get the total scores of the added measures
  // then I multiple the total measures score of the objective with the objective.weight. than you get the total score of the objective
  // then you add up the total score of the objectives
  // total objective scores found


  //total perspective score
  //if (objective.financial ===  "financial") then take the total score of the objetives in that perspective multiply it by the perspective.financial
  //to that to the rest of  the perspective and get add them up afterwards and get the overall rating.


  // expected results

  // if the are 4 objective, then show the total of the four obectives

  // objective name  = score
  // objective++


  // then perspective

  // financial = total score
  // customer = total score
  // grwoth = total score
  // process = total score


  //overall score = financail+customer+growth+process


}


//financial - Financial Sustainability
//Customer  - Stakeholder Value Addition
//Process - Operational Excellence & Governance Perspective
//Growth - Human Capital & Transformation