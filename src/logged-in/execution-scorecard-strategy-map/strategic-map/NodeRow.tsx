import React from "react";
import ErrorBoundary from "../../../shared/components/error-boundary/ErrorBoundary";

interface INodeRow {
  perspective: string;
  operational: JSX.Element[];
  supply: JSX.Element[];
  harness: JSX.Element[];
  digital: JSX.Element[];
}
const NodeRow = (props: INodeRow) => {
  return (
    <ErrorBoundary>
      <tr className="map-row">
        <td className="perspective">
          <h6>{props.perspective}</h6>
        </td>
        <td>
          <ul className="objective-nodes">{props.operational}</ul>
        </td>
        <td>
          <ul className="objective-nodes">{props.supply}</ul>
        </td>
        <td>
          <ul className="objective-nodes">{props.harness}</ul>
        </td>
        <td>
          <ul className="objective-nodes">{props.digital}</ul>
        </td>
      </tr>
    </ErrorBoundary>
  );
};

export default NodeRow;
