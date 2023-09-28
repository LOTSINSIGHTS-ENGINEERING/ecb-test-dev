import { observer } from "mobx-react-lite";
import { useState } from "react";
import ErrorBoundary from "../../../shared/components/error-boundary/ErrorBoundary";
import { useAppContext } from "../../../shared/functions/Context";
import { IMeasureCompany } from "../../../shared/models/MeasureCompany";
import { IObjectiveCompany } from "../../../shared/models/ObjectiveCompany";
import Rating, { BarRating } from "../../shared/components/rating/Rating";
import { totalQ2MeasureCompanyRating, totalQ4CompanyObjectiveRating, totalQ4MeasureCompanyRating } from "../../shared/functions/Scorecard";
import { NoData } from "./NoData";

interface IcProps {
    measure: IMeasureCompany;
}
export const MeasureItem = (props: IcProps) => {
    const { measure } = props;

    return (
        <li className="red-measure">
            <div className="uk-flex uk-flex-middle">
                <Rating rate={(measure.q4FinalRating || 0)} isUpdated={measure.isUpdated} />
                <div className="uk-margin-left">{measure.description}</div>
            </div>
        </li>
    );
};

interface ImProps {
    objective: IObjectiveCompany;
}
const ObjectiveItem = observer((props: ImProps) => {
    const { store } = useAppContext();
    const { objective } = props;

    // calculate rating
    const calculateRating = () => {
        const measures = getMeasures(objective);
        const measuresUpdated = measures.filter((measure) => measure.isUpdated).length > 0;
        const rating = totalQ4CompanyObjectiveRating(measures);
        return {
            rate: rating,
            isUpdated: measuresUpdated,
        };
    };

    const getMeasures = (objective: IObjectiveCompany): IMeasureCompany[] => {
        return store.companyMeasure.all.filter((measure) => measure.asJson.objective === objective.id).map((measure) => measure.asJson);
    };

    return (
        <li className="objective">
            <div className="uk-flex uk-flex-middle">
                <Rating rate={calculateRating().rate} isUpdated={calculateRating().isUpdated}
                />
                <div className="uk-margin-left">{objective.description}</div>
            </div>
        </li>
    );
});

const ObjectivesCard = observer((props: ImProps) => {
    const { store } = useAppContext();
    const { objective } = props;

    const calculateRating = () => {
        const measures = getMeasures(objective);
        const measuresUpdated = measures.filter((measure) => measure.isUpdated).length > 0;
        const rating = totalQ4CompanyObjectiveRating(measures);
        return {
            rate: rating,
            isUpdated: measuresUpdated,
        };
    };

    const getMeasures = (objective: IObjectiveCompany): IMeasureCompany[] => {
        return store.companyMeasure.all.filter((measure) => measure.asJson.objective === objective.id).map((measure) => measure.asJson);
    };

    return (
        <div className="objective-sub-card score uk-card uk-card-default uk-card-body uk-card-small">
            <p className="sub-heading uk-text-smaller">
                {objective.description}
            </p>
            <ErrorBoundary>
                <div
                    className="uk-grid-small uk-child-width-1-2 uk-grid-match uk-margin"
                    data-uk-grid
                    style={{ marginBottom: "30px", bottom: 0, }}>
                    <div>
                        <div className="rating-container">
                            <BarRating rating={calculateRating().rate} />
                        </div>
                    </div>
                    <div>
                        <div className="rating-container">
                            <Rating rate={calculateRating().rate} isUpdated={calculateRating().isUpdated} />
                        </div>
                    </div>
                </div>
            </ErrorBoundary>
        </div>
    );
});



const ObjectivesTable = observer(() => {
    const { store } = useAppContext();
    const objectives = store.companyObjective.all;

    return (
        <ul className="uk-list uk-list-striped uk-margin">
            {objectives.map((objective) => (
                <ErrorBoundary key={objective.asJson.id}>
                    <li key={objective.asJson.id}>
                        <ObjectiveItem objective={objective.asJson} />
                    </li>
                </ErrorBoundary>
            ))}
            {objectives.length === 0 && (
                <NoData message="No data to display."></NoData>
            )}
        </ul>
    );
});

const ObjectivesGrid = observer(() => {
    const { store } = useAppContext();
    const objectives = store.companyObjective.all;

    return (
        <div
            className="uk-grid-small uk-child-width-1-3@m uk-child-width-1-4@l uk-grid-match uk-margin"
            data-uk-grid style={{ marginBottom: "30px" }}>
            {objectives.map((objective) => (
                <div key={objective.asJson.id}>
                    <ErrorBoundary key={objective.asJson.id}>
                        <ObjectivesCard objective={objective.asJson} />
                    </ErrorBoundary>
                </div>
            ))}
        </div>
    );
});

const MetricsAnalytics = observer(() => {
    const { store } = useAppContext();

    const objectives = store.companyObjective.all;
    const measures = store.companyMeasure.all;
    const redMeasures = measures.filter((measure) => (measure.asJson.q4FinalRating || 0) <= 2);
    const $measures = measures.map((measure) => measure.asJson);

    const rating = totalQ2MeasureCompanyRating($measures);
    const rating2 = totalQ4MeasureCompanyRating($measures);

    return (
        <div
            className="uk-grid-small uk-grid-match  uk-child-width-1-1@s uk-child-width-1-5@m uk-margin"
            data-uk-grid
            style={{ marginBottom: "30px" }}>
            <div>
                <div className="info-card info-card--primary  uk-card uk-card-default uk-card-small">
                    <div
                        className="icon"
                        data-tooltip="View all measures in my scorecard"
                    >
                        <span>✓</span>
                    </div>
                    <div className="info-body uk-card-body">
                        <p className="value">{measures.length}</p>
                        <p className="label">All KPIs</p>
                    </div>
                </div>
            </div>
            <div>
                <div className="info-card info-card--danger  uk-card uk-card-default uk-card-small">
                    <div
                        className="icon"
                        data-tooltip="A red measures dashboard focuses on poorly performing metrics" >
                        <span>❗</span>
                    </div>
                    <div className="info-body uk-card-body">
                        <p className="value">{redMeasures.length}</p>
                        <p className="label">Red KPIs</p>
                    </div>
                </div>
            </div>
            <div>
                <div className="info-card info-card--success  uk-card uk-card-default uk-card-small">
                    <div
                        className="icon"
                        data-tooltip="View all objectives in my scorecard"
                    >
                        <span>✓</span>
                    </div>
                    <div className="info-body uk-card-body">
                        <p className="value">{objectives.length}</p>
                        <p className="label">Objectives</p>
                    </div>
                </div>
            </div>
            <div>
                <div className="info-card info-card--primary  uk-card uk-card-default uk-card-small">
                    <div className="icon" data-tooltip="Midterm company score">
                        <span>✓</span>
                    </div>
                    <div className="info-body uk-card-body">
                        <p className="value">{rating.toFixed(2)}</p>
                        <p className="label">Midterm Score</p>
                    </div>
                </div>
            </div>
            <div>
                <div className="info-card info-card--primary  uk-card uk-card-default uk-card-small">
                    <div className="icon" data-tooltip="Final company score">
                        <span>✓</span>
                    </div>
                    <div className="info-body uk-card-body">
                        <p className="value">{rating2.toFixed(2)}</p>
                        <p className="label">Final Score</p>
                    </div>
                </div>
            </div>
        </div>
    );
});


const ObjectivesAnalytics = () => {
    const [viewType, setViewType] = useState<"table" | "grid">("grid");

    return (
        <div
            className="uk-grid-small uk-child-width-1-3@m uk-margin uk-grid-match"
            data-uk-grid
            style={{ marginBottom: "30px" }}>
            <div className="uk-width-1-1">
                <div className="objectives-card uk-card uk-card-default uk-card-body uk-card-small">
                    <div className="objective-analytics-toolbar">
                        <h5 className="title uk-margin">Objectives ✓</h5>

                        <div
                            className="controls"
                            style={{
                                display: "flex",
                            }}
                        >
                            <button
                                className={"list-btn btn-icon uk-margin-small-right " + (viewType === "grid" ? "active" : "")}
                                onClick={() => setViewType("grid")} >
                                <span data-uk-icon="icon: grid"></span>
                            </button>

                            <button
                                className={"list-btn btn-icon " + (viewType === "table" ? "active" : "")}
                                onClick={() => setViewType("table")}>
                                <span data-uk-icon="icon: table"></span>
                            </button>
                        </div>
                    </div>

                    {viewType === "table" && <ObjectivesTable />}
                    {viewType === "grid" && <ObjectivesGrid />}
                </div>
            </div>
        </div>
    );
};



const MeasuresAnalytics = observer(() => {
    const { store } = useAppContext();
    const measures = store.companyMeasure.all;

    const redMeasures = measures.filter((measure) => (measure.asJson.q4FinalRating || 0) < 2);
    const greenMeasures = measures.filter((measure) => (measure.asJson.q4FinalRating || 0) >= 3);
    const amberMeasures = measures.filter((measure) => (measure.asJson.q4FinalRating || 0) < 3 && (measure.asJson.q4FinalRating || 0) >= 2);

    return (
        <div
            className="uk-grid-small uk-child-width-1-3@m uk-margin uk-grid-match"
            data-uk-grid
            style={{ marginBottom: "30px" }}>
            <div>
                <div className="red-measures-card uk-card uk-card-default uk-card-body uk-card-small">
                    <h5 className="title uk-margin">Green KPIs/Measures 🙂</h5>
                    <ul className="uk-list uk-list-striped uk-margin">
                        {greenMeasures.map((measure) => (
                            <ErrorBoundary key={measure.asJson.id}>
                                <MeasureItem measure={measure.asJson} />
                            </ErrorBoundary>
                        ))}
                        {greenMeasures.length === 0 && (
                            <NoData message="No data to display. " />
                        )}
                    </ul>
                </div>
            </div>
            <div>
                <div className="red-measures-card uk-card uk-card-default uk-card-body uk-card-small">
                    <h5 className="title uk-margin">Amber KPIs/Measures 😐</h5>
                    <ul className="uk-list uk-list-striped uk-margin">
                        {amberMeasures.map((measure) => (
                            <ErrorBoundary key={measure.asJson.id}>
                                <MeasureItem measure={measure.asJson} />
                            </ErrorBoundary>
                        ))}
                        {amberMeasures.length === 0 && (
                            <NoData message="No data to display. " />
                        )}
                    </ul>
                </div>
            </div>
            <div>
                <div className="red-measures-card uk-card uk-card-default uk-card-body uk-card-small">
                    <h5 className="title uk-margin">All Red KPIs/Measures 😔</h5>
                    <ul className="uk-list uk-list-striped uk-margin">
                        {redMeasures.map((measure) => (
                            <ErrorBoundary key={measure.asJson.id}>
                                <MeasureItem measure={measure.asJson} />
                            </ErrorBoundary>
                        ))}
                        {redMeasures.length === 0 && (
                            <NoData message="No red measures 🙂." />
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );
});

export const CompanyDashboardQ4 = observer(() => {
    return (
        <ErrorBoundary>
            <MetricsAnalytics />
            <ObjectivesAnalytics />
            <MeasuresAnalytics />
        </ErrorBoundary>
    );
});

