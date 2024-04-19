import { observer } from "mobx-react-lite"
import { useAppContext } from "../../shared/functions/Context"
import { useEffect, useState } from "react";

export const DuplicationModal = observer(() => {
    const { store, api } = useAppContext();
    const [selectedScorecardId, setSelectedScore] = useState<string>("");
    const [loading, setLoading] = useState(false);

    const handleScoreChange = (scoreId: string) => {
        setSelectedScore(scoreId);
    };

    const scorecards = store.scorecard.all.filter((s) => !s.asJson.current).map((s) => { return s.asJson });
    const currentScorecardId = store.scorecard.all.find((s) => s.asJson.current)?.asJson.id;


    const duplicateCompanyScorecard = async () => {
        try {
            setLoading(true);
            await api.scorecard.duplicateScorecard(currentScorecardId || "", selectedScorecardId);
        } catch (error) {
            console.log("Modal error: ", error)
        } finally {
            setLoading(false)
        }
    }



    useEffect(() => {
        const loadData = async () => {
            try {
                await api.scorecard.getAll()
            } catch (error) {
            }
        }
        loadData();
    }, [])


    return (
        <div className="objective-modal uk-modal-dialog uk-modal-body uk-margin-auto-vertical">
            <button
                title="Close or Cancel"
                className="uk-modal-close-default"
                type="button"
                data-uk-close
            // onClick={onCancel}
            ></button>
            <h5>Choose the scorecard that you would like to duplicate from</h5>
            <div>
                <ul className="uk-list">
                    {scorecards.map((s) => (
                        <li key={s.id}>
                            <label>
                                <input
                                    type="radio"
                                    name="score"
                                    value={s.id}
                                    checked={selectedScorecardId === s.id}
                                    onChange={() => handleScoreChange(s.id)}
                                />
                                {s.description}
                            </label>
                        </li>
                    ))}
                </ul>
            </div>
            <div>
                <button onClick={duplicateCompanyScorecard} className="btn btn-primary">Duplicate Scorecard {loading && <span data-uk-spinner={".5"}></span>}</button>
            </div>
        </div>
    )
})