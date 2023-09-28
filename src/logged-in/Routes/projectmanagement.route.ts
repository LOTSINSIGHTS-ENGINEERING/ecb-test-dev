import Portfolio from "../project-management/portfolio.page";
import Project from "../project-management/project.page";
import UserProjects from "../project-management/usersProjects.page";
import PortfolioProjects from "../project-management/portfolioProjects.page";
import Tasks from "../project-management/tasks.page";
import Statistics from "../project-management/statistics.page";

type Routes = {
    path: string;
    component: any;
    title?: string;
}

const routes: Routes[] = [
    { path: "projects", component: UserProjects, title: "Users Projects" },
    { path: "projects/:id", component: PortfolioProjects, title: "Porfolio Projects" },
    { path: "project/:projectId", component: Project, title: "Project" },
    { path: "portfolio", component: Portfolio, title: "Portfolio" },
    { path: "tasks", component: Tasks, title: "Tasks" },
    { path: "statistics", component: Statistics, title: "Statistics" }
];

export default routes