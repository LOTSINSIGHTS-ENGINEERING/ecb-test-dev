interface INodeRow {
  perspective: string;
  children: JSX.Element[];
}
const NodeRow = (props: INodeRow) => {
  return (
    <tr className="map-row">
      <td className="perspective">
        <h6>{props.perspective}</h6>
      </td>
      <td>
        <ul className="objective-nodes">{props.children}</ul>
      </td>
    </tr>
  );
};

export default NodeRow;
