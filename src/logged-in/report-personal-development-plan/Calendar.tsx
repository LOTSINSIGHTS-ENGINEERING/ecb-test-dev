import { getFirstAndLastDateOfMonth, getLastDateOfMonth } from "./CalendarDateUtils";
import { observer } from "mobx-react-lite";
import { useEffect, useMemo, useState } from "react";
import { useAppContext } from "../../shared/functions/Context";
import { dateFormat_YY_MM_DY } from "../shared/utils/utils";
import { USER_ROLES } from "../../shared/functions/CONSTANTS";
import User from "../../shared/models/User";
import Measure from "../../shared/models/Measure";

interface ICalendarDay {
  day: number;
  month: number;
  year: number;
  disabled?: boolean;
}

interface ICalendarDayProps {
  date: ICalendarDay;
}
const CalendarDay = observer((props: ICalendarDayProps) => {
  const { day, month, year, disabled } = props.date;
  const { store, api } = useAppContext();
  const [loading, setLoading] = useState(false);
  const department = store.auth.department;
  const me = store.auth.meJson;
  const role = store.auth.role;

  const _date = new Date();
  _date.setFullYear(year);
  _date.setMonth(month);
  _date.setDate(day);
  const date = dateFormat_YY_MM_DY(_date.getTime());

  const measures = store.measure.getByDate(date, "self-development");

  const className = disabled ? "day day--disabled" : "day";

  const users = useMemo(() => {
    let _users: User[] = [];
    switch (role) {
      case USER_ROLES.MD_USER:
        _users = [...store.user.all];
        break;
      case USER_ROLES.HR_USER:
        _users = [...store.user.all];
        break;
      case USER_ROLES.SUPER_USER:
        _users = [...store.user.all];
        break;
      case USER_ROLES.EXECUTIVE_USER:
        _users = [...store.user.all.filter((u) => {
          return u.asJson.department === department;
        }),];
        break;
      case USER_ROLES.GENERAL_MANAGER:
        _users = [...store.user.all.filter((u) => {
          return u.asJson.supervisor === me?.uid;
        }),];
        break;
      case USER_ROLES.MANAGER_USER:
        _users = [...store.user.all.filter((u) => {
          return u.asJson.supervisor === me?.uid;
        }),];
        break;

      default:
        _users = [...store.user.all.filter((u) => {
          return u.asJson.supervisor === me?.uid;
        }),];
        break;
    }
    return _users;
  }, [department, me?.uid, role, store.user.all]);

  const get_user_id = () => {
    const usersId = users.map((u) => u.asJson.uid);
    return usersId;
  };

  const sub_measures = () => {
    let _measures: Measure[] = [];
    get_user_id().map((uid) => {
      for (const measure of measures) {
        if (measure.asJson.uid === uid) {
          _measures.push(measure);
        }
      }
    });
    return _measures;
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await api.measure.getAllByTargetDate(date, "self-development");
      await api.user.getAll();
      setLoading(false);
    };
    load();
  }, [api.measure, api.user, date]);

  return (
    <button className={className}>
      <span>{day}</span>
      {sub_measures().map((m) => (
        <section className="task task--primary" key={m.asJson.id}>
          {m.asJson.userName} - {m.asJson.description}
        </section>
      ))}
    </button>
  );
});

interface ICalendarProps {
  date: string;
}
const Calendar = (props: ICalendarProps) => {
  const { date } = props;
  const _date = new Date(`${date}-01`);
  const month = _date.getMonth();
  const year = _date.getFullYear();

  let calendar: ICalendarDay[] = [];

  // Prev month days
  const getPrevMonthCalendar = (date: Date) => {
    const month = date.getMonth() === 0 ? 11 : date.getMonth() - 1;

    const monthLastDate = getLastDateOfMonth(month).getDate();
    const _calendar: ICalendarDay[] = [];
    for (let day = date.getDay() - 1; day >= 0; day--) {
      _calendar.push({
        day: monthLastDate - day,
        month,
        year,
        disabled: true,
      });
    }

    return _calendar;
  };

  // Next month days
  const getNextMonthCalendar = (date: Date) => {
    const noOfDays = 6 - date.getDay();

    const _calendar: ICalendarDay[] = [];
    for (let day = 1; day <= noOfDays; day++) {
      _calendar.push({
        day,
        month,
        year,
        disabled: true,
      });
    }

    return _calendar;
  };

  const getCurrentMonthCalendar = (firstDate: Date, lastDate: Date) => {
    const _calendar: ICalendarDay[] = [];
    for (let day = firstDate.getDate(); day <= lastDate.getDate(); day++) {
      _calendar.push({
        day,
        month,
        year,
      });
    }

    return _calendar;
  };

  // Populate calendar.
  const populateCalendar = () => {
    const { firstDate, lastDate } = getFirstAndLastDateOfMonth(month, year);

    const _prevCalendar = getPrevMonthCalendar(firstDate);
    const _calendar = getCurrentMonthCalendar(firstDate, lastDate);
    const _nextCalendar = getNextMonthCalendar(lastDate);

    calendar = [..._prevCalendar, ..._calendar, ..._nextCalendar];
  };

  populateCalendar();

  return (
    <div className="uk-margin">
      <div className="calendar-container">
        <div className="calendar">
          <span className="day-name">Sun</span>
          <span className="day-name">Mon</span>
          <span className="day-name">Tue</span>
          <span className="day-name">Wed</span>
          <span className="day-name">Thu</span>
          <span className="day-name">Fri</span>
          <span className="day-name">Sat</span>

          {calendar.map((date, index) => (
            <CalendarDay key={index} date={date} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Calendar;

// const users = useMemo(() => {
//   let _users: User[] = [];
//   switch (role) {
//     case USER_ROLES.MD_USER:
//       _users = [...store.user.all];
//       break;
//     case USER_ROLES.HR_USER:
//       _users = [...store.user.all];
//       break;
//     case USER_ROLES.SUPER_USER:
//       _users = [...store.user.all];
//       break;
//     case USER_ROLES.EXECUTIVE_USER:
//       _users = [
//         ...store.user.all.filter((u) => {
//           return u.asJson.department === department;
//         }),
//       ];
//       break;
//     case USER_ROLES.MANAGER_USER:
//       _users = [
//         ...store.user.all.filter((u) => {
//           return u.asJson.supervisor === me?.uid;
//         }),
//       ];
//       break;
//     default:
//       _users = [
//         ...store.user.all.filter((u) => {
//           return u.asJson.supervisor === me?.uid;
//         }),
//       ];
//       break;
//   }
//   return _users;
// }, [department, me?.uid, role, store.user.all]);

// const getuserid = () => {
//   const usersId = users.map((u) => u.asJson.uid);
//   return usersId;
// };

// const getobjectives = () => {
//   let _objectives: Objective[] = [];
//   getuserid().map((uid) => {
//     for (const objective of store.objective.all) {
//       if (objective.asJson.uid === uid) {
//         _objectives.push(objective);
//       }
//     }
//   });
//   return _objectives;
// };

// const getobjectiveid = () => {
//   const _objectiveid = getobjectives().map((u) => u.asJson.id);
//   return _objectiveid;
// };

// const subordinatemeasures = () => {
//   let _measures: Measure[] = [];
//   getuserid().map((uid) => {
//     for (const measure of measures) {
//       if (measure.asJson.uid === uid) {
//         _measures.push(measure);
//       }
//     }
//   });
//   return _measures;
// };
