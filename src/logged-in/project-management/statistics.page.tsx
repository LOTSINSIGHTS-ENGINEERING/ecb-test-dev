import { useEffect, useRef, useState } from "react";
import { observer } from "mobx-react-lite";
import ErrorBoundary from "../../shared/components/error-boundary/ErrorBoundary";
import ProjectStatisticsTabs from "./tabs/ProjecctStatisticsTabs";
import CompanyProjectStatistics from "./components/companyProjectsStatistics";
import DepartmentProjectStatistics from "./components/departmentProjectsStatistics";
import ProjectStatistics from "./components/projectStatistics";
import { useAppContext } from "../../shared/functions/Context";
import useTitle from "../../shared/hooks/useTitle";
import IndividualProjectStatistics from "./components/individualProjectsStatistics";
import Loading from "../../shared/components/loading/Loading";

const Statistics = observer(() => {
    useTitle("Projects Statistics and Reports");
    const { api } = useAppContext();
    const selectedValue = localStorage.getItem("project-s-selected-tab");
    const [selectedTab, setselectedTab] = useState(selectedValue || "company-tab");
    const [loading, setLoading] = useState(false);
    const firstRenderRef = useRef(true);

    useEffect(() => {
        if (!firstRenderRef.current) return;
        setLoading(true)
        const loaData = async () => {
            await api.user.getAll();
        };
        loaData()
        setLoading(false)
        firstRenderRef.current = false;
    }, [api.user]);


    if (loading)
        return (
            <Loading />
        )

    return (
        <ErrorBoundary>
            <div className="statistics">
                <ProjectStatisticsTabs selectedTab={selectedTab} setselectedTab={setselectedTab} />
                <div className="content">
                    {selectedTab === "company-tab" && <CompanyProjectStatistics />}
                    {selectedTab === "department-tab" && <DepartmentProjectStatistics />}
                    {selectedTab === "individual-tab" && <IndividualProjectStatistics />}
                    {selectedTab === "project-tab" && <ProjectStatistics />}
                </div>
            </div>
        </ErrorBoundary>

    )
});


export default Statistics;
