import { observer } from "mobx-react-lite"
import { useAppContext } from "../../../shared/functions/Context"
import ErrorBoundary from "../../../shared/components/error-boundary/ErrorBoundary";
import { useEffect, useState } from "react";
import { getDepartment, getFinalWeightedScore } from "./BonusReportFunctions";
import { LoadingEllipsis } from "../../../shared/components/loading/Loading";
import { getPeriod, getPeriodStart, getScorecardPeriod, percentageCalc } from "../../shared/functions/common";
import showModalFromId, { hideModalFromId } from "../../../shared/functions/ModalShow";
import MODAL_NAMES from "../../dialogs/ModalName";
import Modal from "../../../shared/components/Modal";
import Toolbar from "../../shared/components/toolbar/Toolbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExcel } from "@fortawesome/free-solid-svg-icons";
import { ExportAsExcel } from "react-export-table";

export const BonusReport = observer(() => {
    const { store, api } = useAppContext();
    const [loading, setLoading] = useState(false);
    const [uid, setUid] = useState<string>("");
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const me = store.auth.meJson;

    const users = store.user.all.filter((u) => u.asJson.userStatus === "Active" || !u.asJson.userStatus).map((u) => { return u.asJson });
    const metaData = store.companyScorecardMetadata.all.map((m) => { return m.asJson });
    const objectives = store.objective.all.filter((o) => o.asJson).map((o) => { return o.asJson });
    const measures = store.measure.all.map((m) => { return m.asJson });

    const scorecard = store.scorecard.all.find((s) => s.asJson.current === true)?.asJson.id;

    const savePeriod = async () => {
        try {
            setIsSaving(true);
            await api.user.updateDateRange(uid, startDate, endDate, scorecard || "")
        } catch (error) {
        } finally {
            setIsSaving(false);
            hideModalFromId(MODAL_NAMES.BONUS_REPORT.UPDATE_PERIOD);
            setStartDate("");
            setEndDate("");
            setUid("");
        }
    }




    const onUpdate = (id: string) => {
        setUid(id);
        showModalFromId(MODAL_NAMES.BONUS_REPORT.UPDATE_PERIOD);
    }

    const renderExcel = ({ onClick }: { onClick: () => void }) => {
        return (
            <button className="btn btn-primary" onClick={onClick}>
                <FontAwesomeIcon
                    icon={faFileExcel}
                    size="lg"
                    className="icon uk-margin-small-right"
                />
                Export Excel
            </button>
        )
    }


    const rojasData = [{
        EmployeeName:"Rojas Manyame"
    }]


    const formattedData = users
        .slice() // Make a copy of the array to avoid mutating the original
        .sort((a, b) => {
            const scoreA = getFinalWeightedScore(a, measures, objectives, metaData);
            const scoreB = getFinalWeightedScore(b, measures, objectives, metaData);
            // Handling undefined and 0 cases
            if (!scoreA || scoreA === 0) return 1; // Move scoreA to the end
            if (!scoreB || scoreB === 0) return -1; // Move scoreB to the end
            return scoreB - scoreA; // Sort in descending order
        })
        .map((user) => {
            const finalScore = getFinalWeightedScore(user, measures, objectives, metaData)?.toFixed(2);
            const perecentage = percentageCalc(parseFloat(finalScore || ""));
            const period = getScorecardPeriod(user, scorecard || "")
            const bonus = period > 5 ? true : false;
            const end = getPeriod(user, scorecard || "");
            const start = getPeriodStart(user, scorecard || "");
            const department = getDepartment(user, store);

            return (
                {
                    EmployeeName: user.displayName,
                    Department: department,
                    finalScore: finalScore,
                    percentage: `${perecentage}%`,
                    start: start,
                    end: end,
                    period: period > 1 ? `${period} months` : `${period} month`
                }
            )
        })


    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                await Promise.all([
                    api.user.getAll(),
                    api.companyScorecardMetadata.getAll(),
                    api.objective.getAll(),
                    api.scorecard.getAll(),
                    api.measure.getAll(),
                    api.department.getAll(),
                ]);
            } catch (error) {
            } finally {
                setLoading(false);
            }
        }
        loadData()
    }, []);

    return (
        <ErrorBoundary>
            <div className="reports uk-section">
                <div className="uk-container uk-container-xlarge">
                    <div className="objectives-card uk-card uk-card-default uk-card-body uk-card-small">
                        <Toolbar
                            leftControls={
                                <button className="btn btn-primary" style={{ cursor: "none" }}>Performance Bonus Report</button>
                            }
                            rightControls={
                                <ExportAsExcel
                                    fileName="Performance Bonus Report"
                                    name="Bonus Report"
                                    data={formattedData}
                                    headers={["Employee Name", "Department", "Final Score", "Percentage", "Start", "End", "Period", "Salary", "Bonus"]}
                                >{renderExcel}
                                </ExportAsExcel>
                            }
                        />
                        {loading ? <LoadingEllipsis /> :
                            <div className="uk-margin">
                                <div >
                                    <table className="uk-table uk-table-small uk-table-divider">
                                        <thead>
                                            <tr>
                                                <th>Employee Name</th>
                                                <th>Department</th>
                                                <th>Final Assessment Score</th>
                                                <th>Computed Bonus Percentage</th>
                                                <th>Start Date</th>
                                                <th>End Date</th>
                                                <th>Period</th>
                                                {me?.role === "HR" &&
                                                    <th>Action</th>
                                                }
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {users
                                                .slice() // Make a copy of the array to avoid mutating the original
                                                .sort((a, b) => {
                                                    const scoreA = getFinalWeightedScore(a, measures, objectives, metaData);
                                                    const scoreB = getFinalWeightedScore(b, measures, objectives, metaData);
                                                    // Handling undefined and 0 cases
                                                    if (!scoreA || scoreA === 0) return 1; // Move scoreA to the end
                                                    if (!scoreB || scoreB === 0) return -1; // Move scoreB to the end
                                                    return scoreB - scoreA; // Sort in descending order
                                                }) // Sort the array based on final assessment score
                                                .map((user) => {

                                                    const finalScore = getFinalWeightedScore(user, measures, objectives, metaData)?.toFixed(2);
                                                    const perecentage = percentageCalc(parseFloat(finalScore || ""));
                                                    const period = getScorecardPeriod(user, scorecard || "")
                                                    const bonus = period > 5 ? true : false;


                                                    return (
                                                        <tr style={{
                                                            background: bonus && parseFloat(finalScore || "") > 3.08 ? "#0097af" : "",
                                                            color: bonus && parseFloat(finalScore || "") > 3.08 ? "#fff" : ""

                                                        }} key={user.uid}>
                                                            <td>{user.displayName}</td>
                                                            <td>{getDepartment(user, store)}</td>
                                                            <td>{finalScore}</td>
                                                            <td>{perecentage} %</td>
                                                            <td>{getPeriodStart(user, scorecard || "")}</td>
                                                            <td>{getPeriod(user, scorecard || "")}</td>
                                                            <td>{period} Month(s)</td>
                                                            {me?.role === "HR" &&
                                                                <td>
                                                                    <button
                                                                        style={{
                                                                            background: bonus && parseFloat(finalScore || "") > 3.08 ? "#fff" : "",
                                                                            color: bonus && parseFloat(finalScore || "") > 3.08 ? "#0097af" : ""

                                                                        }}
                                                                        className="btn btn-primary" onClick={() => onUpdate(user.uid)}>Update Period</button>
                                                                </td>
                                                            }
                                                        </tr>
                                                    )
                                                })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        }
                    </div>
                </div>
                <Modal modalId={MODAL_NAMES.BONUS_REPORT.UPDATE_PERIOD}>
                    <div className="user-modal uk-modal-dialog uk-modal-body uk-margin-auto-vertical">
                        <button
                            className="uk-modal-close-default"
                            type="button"
                            data-uk-close
                        ></button>
                        <h3 className="uk-modal-title">Update Period</h3>
                        <div>
                            <label>Start Date</label>
                            <div>
                                <input type="date" onChange={(e: any) => setStartDate(e.target.value)} value={startDate} />
                            </div>
                        </div>

                        <div>
                            <label>End Date</label>
                            <div>
                                <input type="date" onChange={(e: any) => setEndDate(e.target.value)} value={endDate} />
                            </div>
                        </div>
                        <div className="uk-margin">
                            <button className="btn btn-primary " onClick={savePeriod} disabled={isSaving}>
                                Save period {isSaving && <span data-uk-spinner={"ratio: .5"}></span>}
                            </button>
                        </div>
                    </div>
                </Modal>
            </div>
        </ErrorBoundary >
    )
})

