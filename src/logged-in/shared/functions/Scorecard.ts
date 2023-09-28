import { IMeasure } from "../../../shared/models/Measure";
import { IMeasureAudit } from "../../../shared/models/MeasureAudit";
import { IMeasureAuditCompany } from "../../../shared/models/MeasureAuditCompany";
import { IMeasureCompany } from "../../../shared/models/MeasureCompany";

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

export const totalQ4IndividualObjectiveRating = (measures: IMeasure[] | IMeasureAudit[]) => {
  const data = measures.map((measure) => ({
    rating: Number(measure.finalRating2 || 0),
  }));

  let rating = data.reduce((acc, curr) => {
    return acc + curr.rating;
  }, 0) / data.length;

  // rating = Math.round(rating * 10) / 10;
  return rating;
};

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

export const totalQ4MeasureRating = (measures: IMeasure[]) => {
  const rating = measures.reduce((acc, measure) => {
    return acc + (measure.finalRating2 || 0);
  }, 0) / measures.length;
  // return Math.round((rating) * 10) / 10;
  return rating
};

// SEMESTER ONE RATINGS
export const semester1EmpRating = (measures: IMeasure[]) => {
  const rating = measures.reduce((acc, measure) => {
    return acc + measure.autoRating;
  }, 0) / measures.length;
  // return Math.round((rating) * 10) / 10;
  return rating
};

export const semester1SuperRating = (measures: IMeasure[]) => {
  const rating = measures.reduce((acc, measure) => {
    return acc + (measure.supervisorRating || 0);
  }, 0) / measures.length;
  // return Math.round((rating) * 10) / 10;
  return rating
};
export const semester1FinalRating = (measures: IMeasure[]) => {
  const rating = measures.reduce((acc, measure) => {
    return acc + (measure.finalRating || 0);
  }, 0) / measures.length;
  // return Math.round((rating) * 10) / 10;
  return rating
};

// SEMESTER TWO RATINGS
export const q4EmpRating = (measures: IMeasure[]) => {
  const rating = measures.reduce((acc, measure) => {
    return acc + measure.autoRating2;
  }, 0) / measures.length;
  // return Math.round((rating) * 10) / 10;
  return rating
};

export const q4SuperRating = (measures: IMeasure[]) => {
  const rating = measures.reduce((acc, measure) => {
    return acc + (measure.supervisorRating2 || 0);
  }, 0) / measures.length;
  // return Math.round((rating) * 10) / 10;
  return rating
};
export const q4FinalRating = (measures: IMeasure[]) => {
  const rating = measures.reduce((acc, measure) => {
    return acc + (measure.finalRating2 || 0);
  }, 0) / measures.length;
  // return Math.round((rating) * 10) / 10;
  return rating
};