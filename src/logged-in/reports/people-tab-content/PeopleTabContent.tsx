import { observer } from "mobx-react-lite";
import BarGraph from "../../../shared/components/graph-components/BarGraph";
import PieChart from "../../../shared/components/graph-components/PieChart";
import { useAppContext } from "../../../shared/functions/Context";
import TopPerformers from "./TopPerformers";
import WorstPerformers from "./WorstPerformers";
import WorstQ4Performers from "./WorstQ4Performers";
import TopQ4Performers from "./TopQ4Performers";
import Toolbar from "../../shared/components/toolbar/Toolbar";
import { generateReportPDF } from "../../../shared/functions/scorecard-pdf/GeneratePerformaneAgreementPDF";
import { useState } from "react";
import { exportReportExcel } from "../../shared/functions/ReportExcel";

const PeopleTabContent = observer(() => {
  const { store, ui } = useAppContext();

  // analytics on people per rating.
  const labels = ["Rating 1", "Rating 2", "Rating 3", "Rating 4", "Rating 5"];
  // user data
  const userData = store.report.allUserPerformanceData;
  // group rating
  const groupRating = userData.reduce((acc, user) => {
    const rate = user.asJson.rating >= 1 ? user.asJson.rating : 1;
    const rating = Math.floor(rate);
    const pos = rating - 1;
    acc[pos] = acc[pos] + 1; // increment
    return acc;
  },
    [0, 0, 0, 0, 0]
  );

  // top Q2 performers
  const topQ2Performers = userData.filter((user) => user.asJson.rating >= 3);
  // worst Q2 performers
  const worstQ2Performers = userData.filter((user) => user.asJson.rating < 3);
  // top Q4 performers
  const topQ4Performers = userData.filter((user) => user.asJson.rating2 >= 3);
  // worst Q4 performers
  const worstQ4Performers = userData.filter((user) => user.asJson.rating2 < 3);

  const [loading, setLoading] = useState(false)

  const handleExportPDF = async () => {
    try {
      await generateReportPDF(
        topQ2Performers,
        worstQ2Performers,
        topQ4Performers,
        worstQ4Performers
      );
    } catch (error) { }
  };

  const handleExportExcel = async () => {
    setLoading(true)
    try {
      await exportReportExcel(userData);
    } catch (error) {
      setLoading(false)
      console.log(error);
      
    }
    setLoading(false)
  };


  return (
    <div className="people-tab-content">
      <Toolbar
        rightControls={
          <div>
            <button
              className="btn btn-primary uk-margin-left"
              onClick={handleExportExcel}
              disabled={loading}
            >
              Export Excel
              {loading && <div data-uk-spinner="ratio: .5"></div>}
            </button>
            <button
              className="btn btn-primary uk-margin-left"
              onClick={handleExportPDF}
            >
              Export PDF
            </button>
          </div>
        }
      />
      <div>
        <div className="uk-grid-small uk-child-width-1-2@l" data-uk-grid>
          <div>
            <TopPerformers
              data={topQ2Performers}
              departments={store.department.all}
            />
          </div>
          <div>
            <WorstPerformers
              data={worstQ2Performers}
              departments={store.department.all}
            />
          </div>
        </div>
        <div className="uk-grid-small uk-child-width-1-2@l" data-uk-grid>
          <div>
            <TopQ4Performers
              data={topQ4Performers}
              departments={store.department.all}
            />
          </div>
          <div>
            <WorstQ4Performers
              data={worstQ4Performers}
              departments={store.department.all}
            />
          </div>
        </div>
        <div className="uk-grid-small uk-child-width-1-2@l" data-uk-grid>
          <div>
            <div
              className="uk-card uk-card-default uk-card-small uk-card-body"
              style={{ height: 500 }}
            >
              <BarGraph
                title="Rating"
                ylabel="People"
                labels={labels}
                data={groupRating}
                scales={{ y: { min: 0, max: 100 } }}
              />
            </div>
          </div>
          <div>
            <div className="uk-card uk-card-default uk-card-small uk-card-body"
              style={{ height: 500 }}>
              <PieChart
                title="Rating"
                ylabel="People"
                labels={labels}
                data={groupRating}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default PeopleTabContent;


  // const q2Sorted = userData.sort((a, b) => b.asJson.rating - a.asJson.rating);
  // const q4Sorted = userData.sort((a, b) => b.asJson.rating2 - a.asJson.rating2);

  // const chartref = useRef<HTMLDivElement>(null)

  // const handleExportPNG = async () => {
  //   if (chartref.current === null) {
  //     return
  //   }
  //   try {
  //     setLoading(true)
  //     await toPng(chartref.current, { cacheBust: true, })
  //       .then(async (dataUrl) => {
  //         const link = document.createElement('a')
  //         link.href = dataUrl
  //         await generateCompanyDashboardPDF(
  //           vision,
  //           mission,
  //           link
  //         );
  //       })
  //   } catch (error) {
  //     ui.snackbar.load({
  //       id: Date.now(),
  //       message: `Error! Failed to export.`,
  //       type: "danger",
  //     });
  //   }
  //   setLoading(false)
  // };