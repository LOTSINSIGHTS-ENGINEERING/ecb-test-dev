import { faBullseye, faChartSimple, faChessBoard, faDatabase, faHomeAlt, faShield, faTrophy } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { observer } from "mobx-react-lite";
import { NavLink } from "react-router-dom";
import ErrorBoundary from "../../shared/components/error-boundary/ErrorBoundary";
import { USER_ROLES } from "../../shared/functions/CONSTANTS";
import { useAppContext } from "../../shared/functions/Context";

const Account = () => {
  return (
    <div className="account-settings">
      <img src={`${process.env.PUBLIC_URL}/logo.png`} alt="" />
    </div>
  );
};

const HR_USER_DRAWER = () => {
  return (
    <div className="drawer-list">
      <ul className="main-list uk-nav-default" data-uk-nav>
        <li className="list-item uk-parent">
          <NavLink to={"home"} className="navlink">
            <FontAwesomeIcon size={"2x"} icon={faHomeAlt} className="icon" />
            Overview
            <div className="triangle"></div>
          </NavLink>
          <ul className="uk-nav-sub">
            <li>
              <NavLink to={"home/dashboard"} className="navlink">
                Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink to={"home/strategy-map"} className="navlink">
                Strategy Map
              </NavLink>
            </li>
          </ul>
        </li>
        <li className="list-item uk-parent">
          <NavLink to={"strategy"} className="navlink">
            <FontAwesomeIcon size={"2x"} icon={faChessBoard} className="icon" />
            Strategy<div className="triangle"></div>
          </NavLink>
          <ul className="uk-nav-sub">
            <li>
              <NavLink to={"strategy/themes"} className="navlink">
                Themes
              </NavLink>
            </li>
            <li>
              <NavLink to={"strategy/company"} className="navlink">
                Company
              </NavLink>
            </li>
          </ul>
        </li>
        <li className="list-item uk-parent">
          <NavLink to={"scorecards"} className="navlink">
            <FontAwesomeIcon size={"2x"} icon={faBullseye} className="icon" />
            Scorecards <div className="triangle"></div>
          </NavLink>
          <ul className="uk-nav-sub">
            <li>
              <NavLink to={"scorecards/my"} className="navlink">
                My Scorecard
              </NavLink>
            </li>
            <li>
              <NavLink to={"scorecards/supervision"} className="navlink">
                Team Scorecards
              </NavLink>
            </li>
            <li>
              <NavLink to={"scorecards/people"} className="navlink">
                Performance Overview
              </NavLink>
            </li>
            <li>
              <NavLink to={"scorecards/reviews"} className="navlink">
                Performance Reviews
              </NavLink>
            </li>
          </ul>
        </li>
        <li className="list-item uk-parent">
          <NavLink to={"statistics"} className="navlink">
            <FontAwesomeIcon
              icon={faTrophy}
              size="2x"
              className="icon"
            />
            Recognition
            <div className="triangle"></div>
          </NavLink>
          <ul className="uk-nav-sub">
            <li>
              <NavLink to={"feedback/home"} className="navlink">
                Recognition Home
              </NavLink>
            </li>
            <li>
              <NavLink to={"feedback/give"} className="navlink">
                Give Recognition
              </NavLink>
            </li>
            <li>
              <NavLink to={"feedback/request"} className="navlink">
                Request Recognition
              </NavLink>
            </li>
            <li>
              <NavLink to={"feedback/history"} className="navlink">
                Recognition History
              </NavLink>
            </li>
          </ul>
        </li>
        <li className="list-item uk-parent">
          <NavLink to={"statistics"} className="navlink">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="30"
              height="30"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-layers"
            >
              <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
              <polyline points="2 17 12 22 22 17"></polyline>
              <polyline points="2 12 12 17 22 12"></polyline>
            </svg>
            Execution<div className="triangle"></div>
          </NavLink>
          <ul className="uk-nav-sub">
            <li>
              <NavLink to={"statistics"} className="navlink">
                Project Overview
              </NavLink>
            </li>
            <li>
              <NavLink to={"portfolio"} className="navlink">
                Portfolios
              </NavLink>
            </li>
            <li>
              <NavLink to={"projects"} className="navlink">
                Projects
              </NavLink>
            </li>
            <li>
              <NavLink to={"tasks"} className="navlink">
                Other Tasks
              </NavLink>
            </li>
          </ul>
        </li>
        <li className="list-item uk-parent">
          <NavLink to={"drive"} className="navlink">
            <FontAwesomeIcon size={"2x"} icon={faDatabase} className="icon" />
            Portfolio of evidence <div className="triangle"></div>
          </NavLink>
          <ul className="uk-nav-sub">
            <li>
              <NavLink to={"drive"} className="navlink">
                Drive
              </NavLink>
            </li>
          </ul>
        </li>

        <li className="list-item uk-parent">
          <NavLink to={"reports"} className="navlink">
            <FontAwesomeIcon
              size={"2x"}
              icon={faChartSimple}
              className="icon"
            />
            Charts and Reports <div className="triangle"></div>
          </NavLink>
          <ul className="uk-nav-sub">
            <li>
              <NavLink to={"reports/kpis"} className="navlink">
                Performance Reports
              </NavLink>
            </li>
            <li>
              <NavLink to={"reports/bonus-report"} className="navlink">
                Bonus Reports
              </NavLink>
            </li>
            <li>
              <NavLink to={"reports/development-plan"} className="navlink">
                Development Plan
              </NavLink>
            </li>
          </ul>
        </li>

        <li className="list-item uk-parent">
          <NavLink to={"admin"} className="navlink">
            <FontAwesomeIcon size={"2x"} icon={faShield} className="icon" />
            Admin <div className="triangle"></div>
          </NavLink>
          <ul className="uk-nav-sub">
            <li>
              <NavLink to={"admin/settings"} className="navlink">
                Settings
              </NavLink>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  );
};

const EXECUTIVE_USER_DRAWER = () => {
  return (
    <div className="drawer-list">
      <ul className="main-list uk-nav-default" data-uk-nav>
        <li className="list-item uk-parent">
          <NavLink to={"home"} className="navlink">
            <FontAwesomeIcon size={"2x"} icon={faHomeAlt} className="icon" />
            Overview
            <div className="triangle"></div>
          </NavLink>
          <ul className="uk-nav-sub">
            <li>
              <NavLink to={"home/dashboard"} className="navlink">
                Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink to={"home/strategy-map"} className="navlink">
                Strategy Map
              </NavLink>
            </li>
          </ul>
        </li>
        <li className="list-item uk-parent">
          <NavLink to={"strategy"} className="navlink">
            <FontAwesomeIcon size={"2x"} icon={faChessBoard} className="icon" />
            Strategy<div className="triangle"></div>
          </NavLink>
          <ul className="uk-nav-sub">
            <li>
              <NavLink to={"strategy/themes"} className="navlink">
                Themes
              </NavLink>
            </li>
            <li>
              <NavLink to={"strategy/company"} className="navlink">
                Company
              </NavLink>
            </li>
          </ul>
        </li>
        <li className="list-item uk-parent">
          <NavLink to={"scorecards"} className="navlink">
            <FontAwesomeIcon size={"2x"} icon={faBullseye} className="icon" />
            Scorecards <div className="triangle"></div>
          </NavLink>
          <ul className="uk-nav-sub">
            <li>
              <NavLink to={"scorecards/supervision"} className="navlink">
                Team Scorecards
              </NavLink>
            </li>
            <li>
              <NavLink to={"scorecards/people"} className="navlink">
                Performance Overview
              </NavLink>
            </li>
            <li>
              <NavLink to={"scorecards/reviews"} className="navlink">
                Performance Reviews
              </NavLink>
            </li>
          </ul>
        </li>
        <li className="list-item uk-parent">
          <NavLink to={"statistics"} className="navlink">
            <FontAwesomeIcon
              icon={faTrophy}
              size="2x"
              className="icon"
            />
            Recognition
            <div className="triangle"></div>
          </NavLink>
          <ul className="uk-nav-sub">
            <li>
              <NavLink to={"feedback/home"} className="navlink">
                Recognition Home
              </NavLink>
            </li>
            <li>
              <NavLink to={"feedback/give"} className="navlink">
                Give Recognition
              </NavLink>
            </li>
            <li>
              <NavLink to={"feedback/request"} className="navlink">
                Request Recognition
              </NavLink>
            </li>
            <li>
              <NavLink to={"feedback/history"} className="navlink">
                Recognition History
              </NavLink>
            </li>
          </ul>
        </li>
        <li className="list-item uk-parent">
          <NavLink to={"statistics"} className="navlink">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="30"
              height="30"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-layers"
            >
              <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
              <polyline points="2 17 12 22 22 17"></polyline>
              <polyline points="2 12 12 17 22 12"></polyline>
            </svg>
            Execution <div className="triangle"></div>
          </NavLink>
          <ul className="uk-nav-sub">
            <li>
              <NavLink to={"statistics"} className="navlink">
                Project Overview
              </NavLink>
            </li>
            <li>
              <NavLink to={"portfolio"} className="navlink">
                Portfolios
              </NavLink>
            </li>
            <li>
              <NavLink to={"projects"} className="navlink">
                Projects
              </NavLink>
            </li>
            <li>
              <NavLink to={"tasks"} className="navlink">
                Other Tasks
              </NavLink>
            </li>
          </ul>
        </li>

        <li className="list-item uk-parent">
          <NavLink to={"drive"} className="navlink">
            <FontAwesomeIcon size={"2x"} icon={faDatabase} className="icon" />
            Portfolio of evidence <div className="triangle"></div>
          </NavLink>
          <ul className="uk-nav-sub">
            <li>
              <NavLink to={"drive"} className="navlink">
                Drive
              </NavLink>
            </li>
          </ul>
        </li>

        <li className="list-item uk-parent">
          <NavLink to={"reports"} className="navlink">
            <FontAwesomeIcon
              size={"2x"}
              icon={faChartSimple}
              className="icon"
            />
            Charts and Reports <div className="triangle"></div>
          </NavLink>
          <ul className="uk-nav-sub">
            <li>
              <NavLink to={"reports/kpis"} className="navlink">
                Performance Reports
              </NavLink>
            </li>
            <li>
              <NavLink to={"reports/development-plan"} className="navlink">
                Development Plan
              </NavLink>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  );
};

const GENERAL_MANAGER_USER_DRAWER = () => {
  return (
    <div className="drawer-list">
      <ul className="main-list uk-nav-default" data-uk-nav>
        <li className="list-item uk-parent">
          <NavLink to={"home"} className="navlink">
            <FontAwesomeIcon size={"2x"} icon={faHomeAlt} className="icon" />
            Overview
            <div className="triangle"></div>
          </NavLink>
          <ul className="uk-nav-sub">
            <li>
              <NavLink to={"home/dashboard"} className="navlink">
                Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink to={"home/strategy-map"} className="navlink">
                Strategy Map
              </NavLink>
            </li>
          </ul>
        </li>
        <li className="list-item uk-parent">
          <NavLink to={"strategy"} className="navlink">
            <FontAwesomeIcon size={"2x"} icon={faChessBoard} className="icon" />
            Strategy<div className="triangle"></div>
          </NavLink>
          <ul className="uk-nav-sub">
            <li>
              <NavLink to={"strategy/themes"} className="navlink">
                Themes
              </NavLink>
            </li>
            <li>
              <NavLink to={"strategy/company"} className="navlink">
                Company
              </NavLink>
            </li>
          </ul>
        </li>

        <li className="list-item uk-parent">
          <NavLink to={"scorecards"} className="navlink">
            <FontAwesomeIcon size={"2x"} icon={faBullseye} className="icon" />
            Scorecards <div className="triangle"></div>
          </NavLink>
          <ul className="uk-nav-sub">
            <li>
              <NavLink to={"scorecards/my"} className="navlink">
                My Scorecard
              </NavLink>
            </li>
            <li>
              <NavLink to={"scorecards/supervision"} className="navlink">
                Team Scorecards
              </NavLink>
            </li>
            <li>
              <NavLink to={"scorecards/reviews"} className="navlink">
                Department Reviews
              </NavLink>
            </li>
          </ul>
        </li>
        <li className="list-item uk-parent">
          <NavLink to={"statistics"} className="navlink">
            <FontAwesomeIcon
              icon={faTrophy}
              size="2x"
              className="icon"
            />
            Recognition
            <div className="triangle"></div>
          </NavLink>
          <ul className="uk-nav-sub">
            <li>
              <NavLink to={"feedback/home"} className="navlink">
                Recognition Home
              </NavLink>
            </li>
            <li>
              <NavLink to={"feedback/give"} className="navlink">
                Give Recognition
              </NavLink>
            </li>
            <li>
              <NavLink to={"feedback/request"} className="navlink">
                Request Recognition
              </NavLink>
            </li>
            <li>
              <NavLink to={"feedback/history"} className="navlink">
                Recognition History
              </NavLink>
            </li>
          </ul>
        </li>
        <li className="list-item uk-parent">
          <NavLink to={"statistics"} className="navlink">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="30"
              height="30"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-layers"
            >
              <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
              <polyline points="2 17 12 22 22 17"></polyline>
              <polyline points="2 12 12 17 22 12"></polyline>
            </svg>
            Execution <div className="triangle"></div>
          </NavLink>
          <ul className="uk-nav-sub">
            <li>
              <NavLink to={"statistics"} className="navlink">
                Project Overview
              </NavLink>
            </li>
            <li>
              <NavLink to={"portfolio"} className="navlink">
                Portfolios
              </NavLink>
            </li>
            <li>
              <NavLink to={"projects"} className="navlink">
                Projects
              </NavLink>
            </li>
            <li>
              <NavLink to={"tasks"} className="navlink">
                Other Tasks
              </NavLink>
            </li>
          </ul>
        </li>

        <li className="list-item uk-parent">
          <NavLink to={"drive"} className="navlink">
            <FontAwesomeIcon size={"2x"} icon={faDatabase} className="icon" />
            Portfolio of evidence <div className="triangle"></div>
          </NavLink>
          <ul className="uk-nav-sub">
            <li>
              <NavLink to={"drive"} className="navlink">
                Drive
              </NavLink>
            </li>
          </ul>
        </li>

        <li className="list-item uk-parent">
          <NavLink to={"reports"} className="navlink">
            <FontAwesomeIcon
              size={"2x"}
              icon={faChartSimple}
              className="icon"
            />
            Charts and Reports <div className="triangle"></div>
          </NavLink>
          <ul className="uk-nav-sub">
            <li>
              <NavLink to={"reports/kpis"} className="navlink">
                Performance Reports
              </NavLink>
            </li>
            <li>
              <NavLink to={"reports/development-plan"} className="navlink">
                Development Plan
              </NavLink>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  );
};

const MANAGER_USER_DRAWER = () => {
  return (
    <div className="drawer-list">
      <ul className="main-list uk-nav-default" data-uk-nav>
        <li className="list-item uk-parent">
          <NavLink to={"home"} className="navlink">
            <FontAwesomeIcon size={"2x"} icon={faHomeAlt} className="icon" />
            Overview
            <div className="triangle"></div>
          </NavLink>
          <ul className="uk-nav-sub">
            <li>
              <NavLink to={"home/dashboard"} className="navlink">
                Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink to={"home/strategy-map"} className="navlink">
                Strategy Map
              </NavLink>
            </li>
          </ul>
        </li>
        <li className="list-item uk-parent">
          <NavLink to={"strategy"} className="navlink">
            <FontAwesomeIcon size={"2x"} icon={faChessBoard} className="icon" />
            Strategy<div className="triangle"></div>
          </NavLink>
          <ul className="uk-nav-sub">
            <li>
              <NavLink to={"strategy/themes"} className="navlink">
                Themes
              </NavLink>
            </li>
            <li>
              <NavLink to={"strategy/company"} className="navlink">
                Company
              </NavLink>
            </li>
          </ul>
        </li>

        <li className="list-item uk-parent">
          <NavLink to={"scorecards"} className="navlink">
            <FontAwesomeIcon size={"2x"} icon={faBullseye} className="icon" />
            Scorecards <div className="triangle"></div>
          </NavLink>
          <ul className="uk-nav-sub">
            <li>
              <NavLink to={"scorecards/my"} className="navlink">
                My Scorecard
              </NavLink>
            </li>
            <li>
              <NavLink to={"scorecards/supervision"} className="navlink">
                Team Scorecards
              </NavLink>
            </li>
            <li>
              <NavLink to={"scorecards/reviews"} className="navlink">
                Division Reviews
              </NavLink>
            </li>
          </ul>
        </li>
        <li className="list-item uk-parent">
          <NavLink to={"statistics"} className="navlink">
            <FontAwesomeIcon
              icon={faTrophy}
              size="2x"
              className="icon"
            />
            Recognition
            <div className="triangle"></div>
          </NavLink>
          <ul className="uk-nav-sub">
            <li>
              <NavLink to={"feedback/home"} className="navlink">
                Recognition Home
              </NavLink>
            </li>
            <li>
              <NavLink to={"feedback/give"} className="navlink">
                Give Recognition
              </NavLink>
            </li>
            <li>
              <NavLink to={"feedback/request"} className="navlink">
                Request Recognition
              </NavLink>
            </li>
            <li>
              <NavLink to={"feedback/history"} className="navlink">
                Recognition History
              </NavLink>
            </li>
          </ul>
        </li>
        <li className="list-item uk-parent">
          <NavLink to={"statistics"} className="navlink">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="30"
              height="30"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-layers"
            >
              <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
              <polyline points="2 17 12 22 22 17"></polyline>
              <polyline points="2 12 12 17 22 12"></polyline>
            </svg>
            Execution <div className="triangle"></div>
          </NavLink>
          <ul className="uk-nav-sub">
            <li>
              <NavLink to={"statistics"} className="navlink">
                Project Overview
              </NavLink>
            </li>
            <li>
              <NavLink to={"portfolio"} className="navlink">
                Portfolios
              </NavLink>
            </li>
            <li>
              <NavLink to={"projects"} className="navlink">
                Projects
              </NavLink>
            </li>
            <li>
              <NavLink to={"tasks"} className="navlink">
                Other Tasks
              </NavLink>
            </li>
          </ul>
        </li>

        <li className="list-item uk-parent">
          <NavLink to={"drive"} className="navlink">
            <FontAwesomeIcon size={"2x"} icon={faDatabase} className="icon" />
            Portfolio of evidence <div className="triangle"></div>
          </NavLink>
          <ul className="uk-nav-sub">
            <li>
              <NavLink to={"drive"} className="navlink">
                Drive
              </NavLink>
            </li>
          </ul>
        </li>

        <li className="list-item uk-parent">
          <NavLink to={"reports"} className="navlink">
            <FontAwesomeIcon
              size={"2x"}
              icon={faChartSimple}
              className="icon"
            />
            Charts and Reports <div className="triangle"></div>
          </NavLink>
          <ul className="uk-nav-sub">
            <li>
              <NavLink to={"reports/kpis"} className="navlink">
                Performance Reports
              </NavLink>
            </li>
            <li>
              <NavLink to={"reports/development-plan"} className="navlink">
                Development Plan
              </NavLink>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  );
};

const ADMIN_USER_DRAWER = () => {
  return (
    <div className="drawer-list">
      <ul className="main-list uk-nav-default" data-uk-nav>
        <li className="list-item uk-parent">
          <NavLink to={"home"} className="navlink">
            <FontAwesomeIcon size={"2x"} icon={faHomeAlt} className="icon" />
            Overview
            <div className="triangle"></div>
          </NavLink>
          <ul className="uk-nav-sub">
            <li>
              <NavLink to={"home/dashboard"} className="navlink">
                Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink to={"home/strategy-map"} className="navlink">
                Strategy Map
              </NavLink>
            </li>
          </ul>
        </li>
        <li className="list-item uk-parent">
          <NavLink to={"strategy"} className="navlink">
            <FontAwesomeIcon size={"2x"} icon={faChessBoard} className="icon" />
            Strategy<div className="triangle"></div>
          </NavLink>
          <ul className="uk-nav-sub">
            <li>
              <NavLink to={"strategy/themes"} className="navlink">
                Themes
              </NavLink>
            </li>
            <li>
              <NavLink to={"strategy/company"} className="navlink">
                Company
              </NavLink>
            </li>
          </ul>
        </li>
        <li className="list-item uk-parent">
          <NavLink to={"scorecards"} className="navlink">
            <FontAwesomeIcon size={"2x"} icon={faBullseye} className="icon" />
            Scorecards <div className="triangle"></div>
          </NavLink>
          <ul className="uk-nav-sub">
            <li>
              <NavLink to={"scorecards/my"} className="navlink">
                My Scorecard
              </NavLink>
            </li>
            <li>
              <NavLink to={"scorecards/supervision"} className="navlink">
                Team Scorecards
              </NavLink>
            </li>
            <li>
              <NavLink to={"scorecards/people"} className="navlink">
                Performance Overview
              </NavLink>
            </li>
            <li>
              <NavLink to={"scorecards/reviews"} className="navlink">
                Performance Reviews
              </NavLink>
            </li>
          </ul>
        </li>
        <li className="list-item uk-parent">
          <NavLink to={"statistics"} className="navlink">
            <FontAwesomeIcon
              icon={faTrophy}
              size="2x"
              className="icon"
            />
            Recognition
            <div className="triangle"></div>
          </NavLink>
          <ul className="uk-nav-sub">
            <li>
              <NavLink to={"feedback/home"} className="navlink">
                Recognition Home
              </NavLink>
            </li>
            <li>
              <NavLink to={"feedback/give"} className="navlink">
                Give Recognition
              </NavLink>
            </li>
            <li>
              <NavLink to={"feedback/request"} className="navlink">
                Request Recognition
              </NavLink>
            </li>
            <li>
              <NavLink to={"feedback/history"} className="navlink">
                Recognition History
              </NavLink>
            </li>
          </ul>
        </li>
        <li className="list-item uk-parent">
          <NavLink to={"statistics"} className="navlink">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="30"
              height="30"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-layers"
            >
              <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
              <polyline points="2 17 12 22 22 17"></polyline>
              <polyline points="2 12 12 17 22 12"></polyline>
            </svg>
            Execution <div className="triangle"></div>
          </NavLink>
          <ul className="uk-nav-sub">
            <li>
              <NavLink to={"statistics"} className="navlink">
                Project Overview
              </NavLink>
            </li>
            <li>
              <NavLink to={"portfolio"} className="navlink">
                Portfolios
              </NavLink>
            </li>
            <li>
              <NavLink to={"projects"} className="navlink">
                Projects
              </NavLink>
            </li>
            <li>
              <NavLink to={"tasks"} className="navlink">
                Other Tasks
              </NavLink>
            </li>
          </ul>
        </li>
        <li className="list-item uk-parent">
          <NavLink to={"drive"} className="navlink">
            <FontAwesomeIcon size={"2x"} icon={faDatabase} className="icon" />
            Portfolio of evidence <div className="triangle"></div>
          </NavLink>
          <ul className="uk-nav-sub">
            <li>
              <NavLink to={"drive"} className="navlink">
                Drive
              </NavLink>
            </li>
          </ul>
        </li>

        <li className="list-item uk-parent">
          <NavLink to={"reports"} className="navlink">
            <FontAwesomeIcon
              size={"2x"}
              icon={faChartSimple}
              className="icon"
            />
            Charts and Reports <div className="triangle"></div>
          </NavLink>
          <ul className="uk-nav-sub">
            <li>
              <NavLink to={"reports/kpis"} className="navlink">
                Performance Reports
              </NavLink>
            </li>
            <li>
              <NavLink to={"reports/development-plan"} className="navlink">
                Development Plan
              </NavLink>
            </li>
          </ul>
        </li>
        <li className="list-item uk-parent">
          <NavLink to={"admin"} className="navlink">
            <FontAwesomeIcon size={"2x"} icon={faShield} className="icon" />
            Admin <div className="triangle"></div>
          </NavLink>
          <ul className="uk-nav-sub">
            <li>
              <NavLink to={"admin/settings"} className="navlink">
                Settings
              </NavLink>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  );
};

const EMPLOYEE_USER_DRAWER = () => {
  return (
    <div className="drawer-list">
      <ul className="main-list uk-nav-default" data-uk-nav>
        <li className="list-item uk-parent">
          <NavLink to={"home"} className="navlink">
            <FontAwesomeIcon size={"2x"} icon={faHomeAlt} className="icon" />
            Overview
            <div className="triangle"></div>
          </NavLink>
          <ul className="uk-nav-sub">
            <li>
              <NavLink to={"home/dashboard"} className="navlink">
                Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink to={"home/strategy-map"} className="navlink">
                Strategy Map
              </NavLink>
            </li>
          </ul>
        </li>
        <li className="list-item uk-parent">
          <NavLink to={"strategy"} className="navlink">
            <FontAwesomeIcon size={"2x"} icon={faChessBoard} className="icon" />
            Strategy<div className="triangle"></div>
          </NavLink>
          <ul className="uk-nav-sub">
            <li>
              <NavLink to={"strategy/themes"} className="navlink">
                Themes
              </NavLink>
            </li>
          </ul>
        </li>
        <li className="list-item uk-parent">
          <NavLink to={"scorecards"} className="navlink">
            <FontAwesomeIcon size={"2x"} icon={faBullseye} className="icon" />
            Scorecards <div className="triangle"></div>
          </NavLink>
          <ul className="uk-nav-sub">
            <li>
              <NavLink to={"scorecards/my"} className="navlink">
                My Scorecard
              </NavLink>
            </li>
            <li>
              <NavLink to={"scorecards/supervision"} className="navlink">
                Team Scorecards
              </NavLink>
            </li>
          </ul>
        </li>
        <li className="list-item uk-parent">
          <NavLink to={"statistics"} className="navlink">
            <FontAwesomeIcon
              icon={faTrophy}
              size="2x"
              className="icon"
            />
            Recognition
            <div className="triangle"></div>
          </NavLink>
          <ul className="uk-nav-sub">
            <li>
              <NavLink to={"feedback/home"} className="navlink">
                Recognition Home
              </NavLink>
            </li>
            <li>
              <NavLink to={"feedback/give"} className="navlink">
                Give Recognition
              </NavLink>
            </li>
            <li>
              <NavLink to={"feedback/request"} className="navlink">
                Request Recognition
              </NavLink>
            </li>
            <li>
              <NavLink to={"feedback/history"} className="navlink">
                Recognition History
              </NavLink>
            </li>
          </ul>
        </li>
        <li className="list-item uk-parent">
          <NavLink to={"statistics"} className="navlink">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="30"
              height="30"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-layers"
            >
              <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
              <polyline points="2 17 12 22 22 17"></polyline>
              <polyline points="2 12 12 17 22 12"></polyline>
            </svg>
            Execution <div className="triangle"></div>
          </NavLink>
          <ul className="uk-nav-sub">
            <li>
              <NavLink to={"statistics"} className="navlink">
                Project Overview
              </NavLink>
            </li>
            <li>
              <NavLink to={"portfolio"} className="navlink">
                Portfolios
              </NavLink>
            </li>
            <li>
              <NavLink to={"projects"} className="navlink">
                Projects
              </NavLink>
            </li>
            <li>
              <NavLink to={"tasks"} className="navlink">
                Other Tasks
              </NavLink>
            </li>
          </ul>
        </li>
        <li className="list-item uk-parent">
          <NavLink to={"drive"} className="navlink">
            <FontAwesomeIcon size={"2x"} icon={faDatabase} className="icon" />
            Portfolio of evidence <div className="triangle"></div>
          </NavLink>
          <ul className="uk-nav-sub">
            <li>
              <NavLink to={"drive"} className="navlink">
                Drive
              </NavLink>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  );
};

const GUEST_USER_DRAWER = () => {
  return (
    <div className="drawer-list">
      <ul className="main-list uk-nav-default" data-uk-nav>
        <li className="list-item uk-parent">
          <NavLink to={"home"} className="navlink">
            <FontAwesomeIcon size={"2x"} icon={faHomeAlt} className="icon" />
            Overview
            <div className="triangle"></div>
          </NavLink>
          <ul className="uk-nav-sub">
            <li>
              <NavLink to={"home/dashboard"} className="navlink">
                Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink to={"home/strategy-map"} className="navlink">
                Strategy Map
              </NavLink>
            </li>
          </ul>
        </li>
        <li className="list-item uk-parent">
          <NavLink to={"strategy"} className="navlink">
            <FontAwesomeIcon size={"2x"} icon={faChessBoard} className="icon" />
            Strategy<div className="triangle"></div>
          </NavLink>
          <ul className="uk-nav-sub">
            <li>
              <NavLink to={"strategy/themes"} className="navlink">
                Themes
              </NavLink>
            </li>
            <li>
              <NavLink to={"strategy/company"} className="navlink">
                Company
              </NavLink>
            </li>
          </ul>
        </li>
        <li className="list-item uk-parent">
          <NavLink to={"scorecards"} className="navlink">
            <FontAwesomeIcon size={"2x"} icon={faBullseye} className="icon" />
            Scorecards <div className="triangle"></div>
          </NavLink>
          <ul className="uk-nav-sub">
            <li>
              <NavLink to={"scorecards/my"} className="navlink">
                My Scorecard
              </NavLink>
            </li>
            <li>
              <NavLink to={"scorecards/supervision"} className="navlink">
                Team Scorecards
              </NavLink>
            </li>
          </ul>
        </li>
        <li className="list-item uk-parent">
          <NavLink to={"statistics"} className="navlink">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="30"
              height="30"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-layers"
            >
              <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
              <polyline points="2 17 12 22 22 17"></polyline>
              <polyline points="2 12 12 17 22 12"></polyline>
            </svg>
            Execution <div className="triangle"></div>
          </NavLink>
          <ul className="uk-nav-sub">
            <li>
              <NavLink to={"statistics"} className="navlink">
                Project Overview
              </NavLink>
            </li>
            <li>
              <NavLink to={"portfolio"} className="navlink">
                Portfolios
              </NavLink>
            </li>
            <li>
              <NavLink to={"projects"} className="navlink">
                Projects
              </NavLink>
            </li>
            <li>
              <NavLink to={"tasks"} className="navlink">
                Other Tasks
              </NavLink>
            </li>
          </ul>
        </li>
        <li className="list-item uk-parent">
          <NavLink to={"drive"} className="navlink">
            <FontAwesomeIcon size={"2x"} icon={faDatabase} className="icon" />
            Portfolio of evidence <div className="triangle"></div>
          </NavLink>
          <ul className="uk-nav-sub">
            <li>
              <NavLink to={"drive"} className="navlink">
                Drive
              </NavLink>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  );
};

const BOARD_MEMBER_USER_DRAWER = () => {
  return (
    <div className="drawer-list">
      <ul className="main-list uk-nav-default" data-uk-nav>
        <li className="list-item uk-parent">
          <NavLink to={"home"} className="navlink">
            <FontAwesomeIcon size={"2x"} icon={faHomeAlt} className="icon" />
            Overview
            <div className="triangle"></div>
          </NavLink>
          <ul className="uk-nav-sub">
            <li>
              <NavLink to={"home/dashboard"} className="navlink">
                Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink to={"home/strategy-map"} className="navlink">
                Strategy Map
              </NavLink>
            </li>
          </ul>
        </li>
        <li className="list-item uk-parent">
          <NavLink to={"strategy"} className="navlink">
            <FontAwesomeIcon size={"2x"} icon={faChessBoard} className="icon" />
            Strategy<div className="triangle"></div>
          </NavLink>
          <ul className="uk-nav-sub">
            <li>
              <NavLink to={"strategy/themes"} className="navlink">
                Themes
              </NavLink>
            </li>
            <li>
              <NavLink to={"strategy/company-review"} className="navlink">
                Company Rewiew
              </NavLink>
            </li>
          </ul>
        </li>
        <li className="list-item uk-parent">
          <NavLink to={"scorecards"} className="navlink">
            <FontAwesomeIcon size={"2x"} icon={faBullseye} className="icon" />
            Scorecards <div className="triangle"></div>
          </NavLink>
          <ul className="uk-nav-sub">
            <li>
              <NavLink to={"scorecards/supervision"} className="navlink">
                Team Scorecards
              </NavLink>
            </li>
          </ul>
        </li>
        <li className="list-item uk-parent">
          <NavLink to={"statistics"} className="navlink">
            <FontAwesomeIcon
              icon={faTrophy}
              size="2x"
              className="icon"
            />
            Recognition
            <div className="triangle"></div>
          </NavLink>
          <ul className="uk-nav-sub">
            <li>
              <NavLink to={"feedback/home"} className="navlink">
                Recognition Home
              </NavLink>
            </li>
            <li>
              <NavLink to={"feedback/give"} className="navlink">
                Give Recognition
              </NavLink>
            </li>
            <li>
              <NavLink to={"feedback/request"} className="navlink">
                Request Recognition
              </NavLink>
            </li>
            <li>
              <NavLink to={"feedback/history"} className="navlink">
                Recognition History
              </NavLink>
            </li>
          </ul>
        </li>
        <li className="list-item uk-parent">
          <NavLink to={"statistics"} className="navlink">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="30"
              height="30"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-layers"
            >
              <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
              <polyline points="2 17 12 22 22 17"></polyline>
              <polyline points="2 12 12 17 22 12"></polyline>
            </svg>
            Execution <div className="triangle"></div>
          </NavLink>
          <ul className="uk-nav-sub">
            <li>
              <NavLink to={"statistics"} className="navlink">
                Project Overview
              </NavLink>
            </li>
            <li>
              <NavLink to={"portfolio"} className="navlink">
                Portfolios
              </NavLink>
            </li>
            <li>
              <NavLink to={"projects"} className="navlink">
                Projects
              </NavLink>
            </li>
            <li>
              <NavLink to={"tasks"} className="navlink">
                Other Tasks
              </NavLink>
            </li>
          </ul>
        </li>
        <li className="list-item uk-parent">
          <NavLink to={"drive"} className="navlink">
            <FontAwesomeIcon size={"2x"} icon={faDatabase} className="icon" />
            Portfolio of evidence <div className="triangle"></div>
          </NavLink>
          <ul className="uk-nav-sub">
            <li>
              <NavLink to={"drive"} className="navlink">
                Drive
              </NavLink>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  );
};

const DrawerList = observer(() => {
  const { store } = useAppContext();
  const role = store.auth.role;

  if (role === USER_ROLES.HR_USER) return <HR_USER_DRAWER />;
  else if (role === USER_ROLES.EXECUTIVE_USER) return <EXECUTIVE_USER_DRAWER />;
  else if (role === USER_ROLES.ADMIN_USER) return <ADMIN_USER_DRAWER />;
  else if (role === USER_ROLES.GENERAL_MANAGER)
    return <GENERAL_MANAGER_USER_DRAWER />;
  else if (role === USER_ROLES.MANAGER_USER) return <MANAGER_USER_DRAWER />;
  else if (role === USER_ROLES.BOARD_MEMBER_USER)
    return <BOARD_MEMBER_USER_DRAWER />;
  if (role === USER_ROLES.EMPLOYEE_USER) return <EMPLOYEE_USER_DRAWER />;
  return <GUEST_USER_DRAWER />;
});

const DrawerContent = () => {
  return (
    <div className="drawer-content">
      <Account />
      <DrawerList />
    </div>
  );
};

const OverlayDrawer = () => {
  return (
    <div id="navbar-drawer" data-uk-offcanvas="overlay: true">
      <div className="uk-offcanvas-bar">
        <button
          className="uk-offcanvas-close"
          type="button"
          data-uk-close
        ></button>
        <DrawerContent />
      </div>
    </div>
  );
};

const FixedDrawer = () => {
  return (
    <div className="drawer fixed-drawer uk-visible@s">
      <DrawerContent />
    </div>
  );
};

const Drawer = () => {
  return (
    <ErrorBoundary>
      <OverlayDrawer />
      <FixedDrawer />
    </ErrorBoundary>
  );
};

export default Drawer;
