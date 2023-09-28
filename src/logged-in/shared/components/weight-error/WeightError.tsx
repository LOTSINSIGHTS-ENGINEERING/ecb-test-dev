import React, { ReactNode } from "react";
import "./WeightError.scss";

interface IProps {
  weightError: number;
  children?: ReactNode;
  pos?: "relative";
}
const WeightError = (props: IProps) => {
  const {
    weightError,
    pos,
    children = "The weights of the objectives don't add up to ",
  } = props;

  if (pos === "relative")
    return (
      <>
        {weightError !== 100 && (
          <div className="weight-error-relative">
            <div className="uk-alert-danger" data-uk-alert>
              <p>
                {children}
                <strong> 100%. </strong>
                Currently at
                <strong> {Number(weightError) || 0}%.</strong>
              </p>
            </div>
          </div>
        )}
      </>
    );

  return (
    <>
      {weightError !== 100 && (
        <div className="weight-error">
          <div className="uk-alert-danger" data-uk-alert>
            <p>
              {children}
              <strong> 100%. </strong>
              Currently at
              <strong> {weightError || 0}%.</strong>
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default WeightError;

export const MeasureError = () => {
  const children = "Empty objective found, delete it or add measure";
  return (
    <div className="weight-error">
      <div className="uk-alert-danger" data-uk-alert>
        <p>{children}</p>
      </div>
    </div>
  );
};
