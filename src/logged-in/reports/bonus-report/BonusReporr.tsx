import { observer } from "mobx-react-lite"
import { useAppContext } from "../../../shared/functions/Context"
import ErrorBoundary from "../../../shared/components/error-boundary/ErrorBoundary";

export const BonusReport = observer(() => {
    const { store, api } = useAppContext();








    return (
        <ErrorBoundary>
            <div className="reports uk-section">
                <div className="uk-container uk-container-xlarge">
                    <div>
                        <h3>Bonus Report</h3>
                    </div>
                    <div className="uk-table uk-table-small uk-table-divider">
                        <table>
                            <thead>
                                <tr>
                                    <th>Employee Name</th>
                                    <th>Department</th>
                                    <th>Final Assessment Score</th>
                                    <th>Computed Bonus Percentage</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </ErrorBoundary>
    )
})


// name, dep, final score, percentage,
//