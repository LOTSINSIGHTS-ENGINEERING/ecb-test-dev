import { observer } from "mobx-react-lite";
import { useCallback, useEffect, useState } from "react";
import Department from "../../../shared/models/Department";
import UserPerformanceData from "../../../shared/models/Report";

interface IProps {
  data: UserPerformanceData[];
  departments: Department[];
}
const WorstQ4Performers = observer((props: IProps) => {
  const { data, departments } = props;
  const [performanceData, setPerformanceData] = useState<UserPerformanceData[]>([]);
  const [count, setCount] = useState(5);
  const [department, setDepartment] = useState("company");

  const sortByRate = (a: UserPerformanceData, b: UserPerformanceData) => {
    return (a.asJson.rating2 - b.asJson.rating2);
  };

  const filterByDepartment = useCallback(() => {
    if (department === "company") {
      setPerformanceData(data.slice(0, count));
    } else {
      const filteredData = data.filter((item) => item.asJson.department === department);
      setPerformanceData(count === -1 ? filteredData : filteredData.slice(0, count));
    }
  }, [count, data, department]);

  const rateColor = (rating: number): string => {
    if (rating === 5) return "purple";
    else if (rating >= 4 && rating < 5) return "blue";
    else if (rating >= 3 && rating < 4) return "green";
    else if (rating >= 2 && rating < 3) return "warning";
    else return "red";
  };

  useEffect(() => {
    filterByDepartment();
    return () => { };
  }, [filterByDepartment]);

  return (
    <>
      <div className="people-tab-content uk-card uk-card-default uk-card-body uk-card-small">
        <div className="header uk-margin">
          <h4 className="title kit-title">
            Assessment Training &#38; Coaching
          </h4>

          <select
            id="category"
            className="uk-select uk-form-small uk-margin-left"
            name="category"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
          >
            <option value="company">Company</option>
            <optgroup label="--Departments --">
              {departments.map((dep) => (
                <option key={dep.asJson.id} value={dep.asJson.id}>
                  {dep.asJson.name}
                </option>
              ))}
            </optgroup>
          </select>
          <select
            id="count"
            className="uk-select uk-form-small uk-margin-left"
            name="count"
            value={count}
            onChange={(e) => setCount(parseInt(e.target.value))}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={-1}>All</option>
          </select>
        </div>

        <table className="kit-table uk-table uk-table-small uk-table-striped">
          <thead>
            <tr>
              <th>#</th>
              <th>Full Name</th>
              <th>Department</th>
              <th>Rating</th>
            </tr>
          </thead>
          <tbody>
            {performanceData.sort(sortByRate).map((user, index) => (
              <tr key={user.asJson.uid}>
                <td>{index + 1}</td>
                <td>{user.asJson.userName}</td>
                <td>{user.asJson.departmentName}</td>
                <td className={`report-value ${rateColor(user.asJson.rating2)}`}>
                  {user.asJson.rating2.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
});

export default WorstQ4Performers;
