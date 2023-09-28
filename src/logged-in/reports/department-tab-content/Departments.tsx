import { observer } from "mobx-react-lite";
import { IDepartmentPeformanceData } from "../../../shared/models/Report";

interface IProps {
  data: IDepartmentPeformanceData[];
}

export const S1Departments = observer((props: IProps) => {
  const { data } = props;
  //order
  const sortByRate = (data: IDepartmentPeformanceData[], orderType: "asc" | "dsc") => {
    if (orderType === "asc")
      return data.sort((a, b) => a.avg - b.avg);
    return data.sort((a, b) => b.avg - a.avg);
  };

  const sortedData = sortByRate(data, "dsc");

  return (
    <>
      <div className="department-tab-content uk-card uk-card-default uk-card-body uk-card-small">
        <div className="header uk-margin">
          <h4 className="title kit-title">Departmental Performance Midterm Rating</h4>
        </div>

        <table className="kit-table uk-table uk-table-small uk-table-striped">
          <thead>
            <tr>
              <th>#</th>
              <th>Department</th>
              <th>Average Rating</th>
              <th>Minimum Rating</th>
              <th>Median Rating</th>
              <th>Maximum Rating</th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map((department, index) => (
              <tr key={department.id}>
                <td>{index + 1}</td>
                <td>{department.departmentName}</td>
                <td>{department.avg.toFixed(2)}</td>
                <td>{department.min.toFixed(2)}</td>
                <td>{department.median.toFixed(2)}</td>
                <td>{department.max.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
});

export const S2Departments = observer((props: IProps) => {
  const { data } = props;
  //order
  const sortByRate = (data: IDepartmentPeformanceData[], orderType: "asc" | "dsc") => {
    if (orderType === "asc")
      return data.sort((a, b) => a.avg - b.avg);
    return data.sort((a, b) => b.avg - a.avg);
  };

  const sortedData = sortByRate(data, "dsc");

  return (
    <>
      <div className="department-tab-content uk-card uk-card-default uk-card-body uk-card-small">
        <div className="header uk-margin">
          <h4 className="title kit-title">Departmental Performance Final Assessment Rating</h4>
        </div>

        <table className="kit-table uk-table uk-table-small uk-table-striped">
          <thead>
            <tr>
              <th>#</th>
              <th>Department</th>
              <th>Average Rating</th>
              <th>Minimum Rating</th>
              <th>Median Rating</th>
              <th>Maximum Rating</th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map((department, index) => (
              <tr key={department.id}>
                <td>{index + 1}</td>
                <td>{department.departmentName}</td>
                <td>{department.avg.toFixed(2)}</td>
                <td>{department.min.toFixed(2)}</td>
                <td>{department.median.toFixed(2)}</td>
                <td>{department.max.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
});


