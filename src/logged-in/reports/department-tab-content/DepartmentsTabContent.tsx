import DepartmentS1Performance from "./DepartmentS1Performance"
import DepartmentS2Performance from "./DepartmentS2Performance"

export const DepartmentsTabContent = () => {
    return (
        <div>
            <div className="uk-margin">
                <DepartmentS1Performance />
            </div>
            <div className="uk-margin">
                <DepartmentS2Performance />
            </div>
        </div>
    )
}