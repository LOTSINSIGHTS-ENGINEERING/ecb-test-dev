import { observer } from "mobx-react-lite";
import { useAppContext } from "../../../shared/functions/Context";
import NodeRow from "./NodeRow";
import Node from "./Node";
import { CUSTOMER_TAB, FINANCIAL_TAB, GROWTH_TAB, PROCESS_TAB } from "../../../shared/interfaces/IPerspectiveTabs";
import VisionMission from "../../../shared/components/vision-mission/VisionMission";
import { IObjective } from "../../../shared/models/Objective";
import ErrorBoundary from "../../../shared/components/error-boundary/ErrorBoundary";

const StrategicMap = observer(() => {
  const { store } = useAppContext();

  const THEMES = {
    OPERATIONAL: "7KXuTnrLjZaTTY64h1Ja", //TO ACHIVE ACTIVE ND STRUCTURED
    SUPPLY: "cvjZ7HwphVJUkoJaT0JQ", //IMPROVE ELECTRICITY AFFORDABILITY
    HARNESS: "pVifGIhhBG8K7Fpu8PlT", //TO ACHIEVE SECURITY AND QAULITY
    DIGITAL: "uYw6YoNC5LJbMZVDpuGH", //TO BUILD THE ECB CAPACITY
  };

  const getObjectivesPerPerspective = (perspective: string) => {
    return store.companyObjective.all.filter((objective) => objective.asJson.perspective === perspective).map((objective) => objective.asJson);
  };

  const getByTheme = (objectives: IObjective[], theme: string) => {
    return objectives.filter((objective) => objective.theme === theme);
  };

  return (
    <div className="uk-margin">
      <div className="strategic-map uk-card uk-card-default uk-card-body uk-card-small">
        <div className="map">
          <VisionMission />
          <table className="objectives">
            <thead>
              <tr>
                <th></th>
                <th>
                  Improve electricity affordability through innovative tariff
                  mechanisms.
                </th>
                <th>
                  To achieve active and structured stakeholder engagement and
                  brand management.
                </th>
                <th>
                  To achieve security and quality of electricity supply for
                  Namibia.
                </th>
                <th>
                  To build the ECB Capacity and ensure Financial Sustainability
                </th>
              </tr>
            </thead>
            <tbody>
              <NodeRow
                perspective={FINANCIAL_TAB.perspective}
                operational={getByTheme(getObjectivesPerPerspective(FINANCIAL_TAB.id),
                  THEMES.OPERATIONAL).map((objective) => (
                    <ErrorBoundary key={objective.id}>
                      <Node objective={objective} />
                    </ErrorBoundary>
                  ))}
                supply={getByTheme(getObjectivesPerPerspective(FINANCIAL_TAB.id),
                  THEMES.SUPPLY).map((objective) => (
                    <ErrorBoundary key={objective.id}>
                      <Node objective={objective} />
                    </ErrorBoundary>
                  ))}
                harness={getByTheme(getObjectivesPerPerspective(FINANCIAL_TAB.id),
                  THEMES.HARNESS).map((objective) => (
                    <ErrorBoundary key={objective.id}>
                      <Node objective={objective} />
                    </ErrorBoundary>
                  ))}
                digital={getByTheme(getObjectivesPerPerspective(FINANCIAL_TAB.id),
                  THEMES.DIGITAL).map((objective) => (
                    <ErrorBoundary key={objective.id}>
                      <Node objective={objective} />
                    </ErrorBoundary>
                  ))}
              />

              <NodeRow
                perspective={CUSTOMER_TAB.perspective}
                operational={getByTheme(getObjectivesPerPerspective(CUSTOMER_TAB.id),
                  THEMES.OPERATIONAL).map((objective) => (
                    <ErrorBoundary key={objective.id}>
                      <Node objective={objective} />
                    </ErrorBoundary>
                  ))}
                supply={getByTheme(getObjectivesPerPerspective(CUSTOMER_TAB.id),
                  THEMES.SUPPLY).map((objective) => (
                    <ErrorBoundary key={objective.id}>
                      <Node objective={objective} />
                    </ErrorBoundary>
                  ))}
                harness={getByTheme(getObjectivesPerPerspective(CUSTOMER_TAB.id),
                  THEMES.HARNESS).map((objective) => (
                    <ErrorBoundary key={objective.id}>
                      <Node objective={objective} />
                    </ErrorBoundary>
                  ))}
                digital={getByTheme(getObjectivesPerPerspective(CUSTOMER_TAB.id),
                  THEMES.DIGITAL).map((objective) => (
                    <ErrorBoundary key={objective.id}>
                      <Node objective={objective} />
                    </ErrorBoundary>
                  ))}
              />

              <NodeRow
                perspective={PROCESS_TAB.perspective}
                operational={getByTheme(getObjectivesPerPerspective(PROCESS_TAB.id),
                  THEMES.OPERATIONAL).map((objective) => (
                    <ErrorBoundary key={objective.id}>
                      <Node objective={objective} />
                    </ErrorBoundary>
                  ))}
                supply={getByTheme(getObjectivesPerPerspective(PROCESS_TAB.id),
                  THEMES.SUPPLY).map((objective) => (
                    <ErrorBoundary key={objective.id}>
                      <Node objective={objective} />
                    </ErrorBoundary>
                  ))}
                harness={getByTheme(getObjectivesPerPerspective(PROCESS_TAB.id),
                  THEMES.HARNESS).map((objective) => (
                    <ErrorBoundary key={objective.id}>
                      <Node objective={objective} />
                    </ErrorBoundary>
                  ))}
                digital={getByTheme(getObjectivesPerPerspective(PROCESS_TAB.id),
                  THEMES.DIGITAL).map((objective) => (
                    <ErrorBoundary key={objective.id}>
                      <Node objective={objective} />
                    </ErrorBoundary>
                  ))}
              />

              <NodeRow
                perspective={GROWTH_TAB.perspective}
                operational={getByTheme(getObjectivesPerPerspective(GROWTH_TAB.id),
                  THEMES.OPERATIONAL).map((objective) => (
                    <ErrorBoundary key={objective.id}>
                      <Node objective={objective} />
                    </ErrorBoundary>
                  ))}
                supply={getByTheme(getObjectivesPerPerspective(GROWTH_TAB.id),
                  THEMES.SUPPLY).map((objective) => (
                    <ErrorBoundary key={objective.id}>
                      <Node objective={objective} />
                    </ErrorBoundary>
                  ))}
                harness={getByTheme(getObjectivesPerPerspective(GROWTH_TAB.id),
                  THEMES.HARNESS).map((objective) => (
                    <ErrorBoundary key={objective.id}>
                      <Node objective={objective} />
                    </ErrorBoundary>
                  ))}
                digital={getByTheme(getObjectivesPerPerspective(GROWTH_TAB.id),
                  THEMES.DIGITAL).map((objective) => (
                    <ErrorBoundary key={objective.id}>
                      <Node objective={objective} />
                    </ErrorBoundary>
                  ))}
              />
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
});

export default StrategicMap;
