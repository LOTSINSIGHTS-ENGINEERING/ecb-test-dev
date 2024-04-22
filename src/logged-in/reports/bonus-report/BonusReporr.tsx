import { observer } from "mobx-react-lite"
import { useAppContext } from "../../../shared/functions/Context"
import ErrorBoundary from "../../../shared/components/error-boundary/ErrorBoundary";
import { useEffect, useState } from "react";
import { getDepartment, getFinalWeightedScore } from "./BonusReportFunctions";
import { LoadingEllipsis } from "../../../shared/components/loading/Loading";

export const BonusReport = observer(() => {
    const { store, api } = useAppContext();
    const [loading, setLoading] = useState(false);

    const users = store.user.all.map((u) => { return u.asJson });
    const metaData = store.companyScorecardMetadata.all.map((m) => { return m.asJson });
    const objectives = store.objective.all.map((o) => { return o.asJson });
    const measures = store.measure.all.map((m) => { return m.asJson });


    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                await Promise.all([
                    api.user.getAll(),
                    api.companyScorecardMetadata.getAll(),
                    api.objective.getAll(),
                    api.measure.getAll(),
                    api.department.getAll(),
                ]);
            } catch (error) {
            } finally {
                setLoading(false);
            }
        }
        loadData()
    }, [])



    return (
        <ErrorBoundary>
            <div className="reports uk-section">
                <div className="uk-container uk-container-xlarge">
                    <div className="objectives-card uk-card uk-card-default uk-card-body uk-card-small">
                        <h4 className="title kit-title">Bonus Report</h4>
                        {loading ? <LoadingEllipsis /> :
                            <div className="header uk-margin">
                                <div >
                                    <table className="uk-table uk-table-small uk-table-divider">
                                        <thead>
                                            <tr>
                                                <th>Employee Name</th>
                                                <th>Department</th>
                                                <th>Final Assessment Score</th>
                                                <th>Computed Bonus Percentage</th>
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
                                                .map((user) => (
                                                    <tr key={user.uid}>
                                                        <td>{user.displayName}</td>
                                                        <td>{getDepartment(user, store)}</td>
                                                        <td>{getFinalWeightedScore(user, measures, objectives, metaData)?.toFixed(2)}</td>
                                                        <td>50%</td>
                                                    </tr>
                                                ))}
                                        </tbody>
                                    </table>

                                </div>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </ErrorBoundary >
    )
})


// name, dep, final score, percentage,
//