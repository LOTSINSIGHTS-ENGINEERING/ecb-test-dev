import React from "react";
import { rateColor } from "../../functions/Scorecard";
import "./Rating.scss";

interface IBarRatingProps {
  rating: number;
}
export const BarRating = (props: IBarRatingProps) => {
  const { rating } = props;

  const activeClass = (index: number) => {
    if (rating >= index) return `bar-rating__bar rating-${index} active`;
    else return `bar-rating__bar rating-${index}`;
  };

  return (
    <div className="bar-rating">
      <div className={activeClass(1)}></div>
      <div className={activeClass(2)}></div>
      <div className={activeClass(3)}></div>
      <div className={activeClass(4)}></div>
      <div className={activeClass(5)}></div>
    </div>
  );
};

interface IProps {
  rate: number;
  simple?: boolean;
  isUpdated?: boolean;
}

const Rating = (props: IProps) => {
  const { rate, simple = true, isUpdated } = props;

  // Status color coding
  const rateCss = rateColor(rate, isUpdated);

  // Score bar update progress
  const style = () => {
    const deg = (rate / 5) * 180;
    const css: React.CSSProperties = {
      transform: `rotate(${deg}deg)`,
    };
    return css;
  };

  if (simple)
    return (
      <div className={`simple-score ${rateCss}`}>{rate.toFixed(2)}</div>
    );

  return (
    <div className={`complex-score ${rateCss}`}>
      <div className="circle">
        <div className="mask full" style={style()}>
          <div className="fill" style={style()}></div>
        </div>
        <div className="mask half">
          <div className="fill" style={style()}></div>
        </div>
        <div className="inside-circle">{rate.toFixed(2)}</div>
      </div>
    </div>
  );
};

export default Rating;
