import { toPng } from "html-to-image";
import { observer } from "mobx-react-lite";
import { useRef, useState } from "react";
import ErrorBoundary from "../../../shared/components/error-boundary/ErrorBoundary";
import { mission, vision } from "../../../shared/components/vision-mission/VisionMission";
import { useAppContext } from "../../../shared/functions/Context";
import { generateCompanyDashboardPDF } from "../../../shared/functions/scorecard-pdf/GeneratePerformaneAgreementPDF";
import { CompanyDashboardQ2 } from "./CompanyDashboardQ2";
import { CompanyDashboardQ4 } from "./CompanyDashboardQ4";

interface ITabsProps {
  tab: "Q2" | "Q4";
  setTab: React.Dispatch<React.SetStateAction<"Q2" | "Q4">>;
  handleExportPDF: () => Promise<void>;
  loading: boolean;
}
const Tabs = observer((props: ITabsProps) => {
  const activeClass = (tab: "Q2" | "Q4") => {
    if (props.tab === tab) return "uk-active";
    return "";
  };

  return (
    <div className="dashboard--company--tab">
      <div>
        <button className="tab-button uk-button uk-button-default" type="button"
          onClick={props.handleExportPDF}
          disabled={props.loading}>
          Export PDF
          {props.loading && <div data-uk-spinner="ratio: .5"></div>}
        </button>
      </div>
      <div>
        <button className="tab-button uk-button uk-button-default" type="button">Select Semester</button>
        <div data-uk-dropdown>
          <ul className="kit-tabs uk-nav uk-dropdown-nav">
            <li className={activeClass("Q2")}
              onClick={() => props.setTab("Q2")}><a href="#">Semester 1</a></li>
            <li className={activeClass("Q4")}
              onClick={() => props.setTab("Q4")}><a href="#">Semester 2</a></li>
          </ul>
        </div>
      </div>
    </div>
  );
});


export const CompanyDashboard = observer(() => {
  const { ui } = useAppContext();
  const [loading, setLoading] = useState(false)
  const [tab, setTab] = useState<"Q2" | "Q4">("Q2");
  const { store } = useAppContext();

  const chartref = useRef<HTMLDivElement>(null)
  const handleExportPDF = async () => {
    if (chartref.current === null) {
      return
    }
    try {
      setLoading(true)
      await toPng(chartref.current, { cacheBust: true, })
        .then(async (dataUrl) => {
          const link = document.createElement('a')
          link.href = dataUrl
          await generateCompanyDashboardPDF(
            vision,
            mission,
            link
          );
        })
    } catch (error) {
      ui.snackbar.load({
        id: Date.now(),
        message: "Error! Failed to export.",
        type: "danger",
      });
    }
    setLoading(false)
  };
  // ProjectImagePDF



  // useEffect(() => {
  //   const loadAll = async () => {
  //     if (!scorecardId) return;
  //     setLoading(true);
  //     try {
  //       await api.companyObjective.getAll(scorecardId);
  //       await api.companyMeasure.getAll(scorecardId);
  //       await api.strategicTheme.getAll(scorecardId);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //     setLoading(false);
  //   };

  //   loadAll();
  // }, [api.strategicTheme, api.companyMeasure, api.companyObjective, scorecardId]);

  return (
    <ErrorBoundary>
      <Tabs tab={tab} setTab={setTab} handleExportPDF={handleExportPDF} loading={loading} />
      <div className="individual-dashboard">
        {tab === "Q2" &&
          <div ref={chartref}>
            <CompanyDashboardQ2 />
          </div>
        }
        {tab === "Q4" &&
          <div ref={chartref}>
            <CompanyDashboardQ4 />
          </div>
        }
      </div>
    </ErrorBoundary>

  );
});