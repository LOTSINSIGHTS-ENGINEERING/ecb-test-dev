import { ChangeEvent, useState } from "react";
import useTitle from "../../shared/hooks/useTitle";
import Calendar from "./Calendar";
import Toolbar from "../shared/components/toolbar/Toolbar";
import List from "./List";
import { faCalendarAlt, faTableList } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ReportPersonalDevelopmentPlan = () => {
  const [tab, setTab] = useState("Calendar");
  useTitle("Personal Development Plans");
  const [date, setDate] = useState(() => {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;

    return `${year}-${month < 10 ? "0" + month : month}`;
  });

  const onDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    let date = e.target.valueAsDate;
    if (!date) date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const dateString = `${year}-${month < 10 ? "0" + month : month}`;
    setDate(dateString);
  };

  const onCalendar = () => {
    setTab("Calendar");
  };
  const onList = () => {
    setTab("List");
  };

  return (
    <div className="uk-section personal-development-page">
      <div className="uk-container uk-container-xlarge">
        <Toolbar
          leftControls={
            <>
              {tab === "Calendar" && (
                <div className="uk-inline">
                  <label
                    className="date-picker btn btn-primary uk-margin-small-right"
                    htmlFor="date-picker"
                  >
                    <input
                      title="Month Picker"
                      type="month"
                      id="date-picker"
                      value={date}
                      onChange={onDateChange}
                    />
                  </label>
                </div>
              )}
            </>
          }
          rightControls={
            <>
              <button
                className="btn btn-primary uk-margin-small-right"
                onClick={onCalendar}
              >
                <FontAwesomeIcon
                  icon={faCalendarAlt}
                  className="icon uk-margin-small-right"
                />
                Calendar
              </button>
              <button className="btn btn-primary" onClick={onList}>
                <FontAwesomeIcon
                  icon={faTableList}
                  className="icon uk-margin-small-right"
                />
                List
              </button>
            </>
          }
        ></Toolbar>

        {tab === "Calendar" && <Calendar date={date} />}
        {tab === "List" && <List />}
      </div>
    </div>
  );
};

export default ReportPersonalDevelopmentPlan;
