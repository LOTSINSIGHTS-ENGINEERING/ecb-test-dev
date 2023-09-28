import { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import useTitle from '../../shared/hooks/useTitle';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, faPlus } from '@fortawesome/free-solid-svg-icons';
import showModalFromId from '../../shared/functions/ModalShow';
import MODAL_NAMES from '../dialogs/ModalName';
import ErrorBoundary from '../../shared/components/error-boundary/ErrorBoundary';
import Modal from '../../shared/components/Modal';
import NewPortfolioModal from '../dialogs/project/NewPortfolioModal';
import { useAppContext } from '../../shared/functions/Context';
import Portfolio, { IPortfolio } from '../../shared/models/Portfolio.model';
import PortfolioItem from './components/portfolioItem';
import Filter from './utils/filter';
import { USER_ROLES } from '../../shared/functions/CONSTANTS';
import { HorizontalLoading } from '../../shared/components/loading/Loading';


const PortfolioPage = observer(() => {
    useTitle("Portfolios");
    const { api, store } = useAppContext();
    const me = store.auth.meJson;
    const role = store.auth.role;

    const projects = store.projectManagement.all.map(p => p.asJson);
    const department = store.department.all.map((d) => ({ id: d.asJson.id, name: d.asJson.name }));

    const [loadingData, setLoadingData] = useState(false);
    const [selectedValue, setSelectedValue] = useState("all");

    const sortByName = (a: Portfolio, b: Portfolio) => {
        return (a.asJson.portfolioName || "").localeCompare(
            b.asJson.portfolioName || ""
        );
    };

    const portfolios = () => {
        let portfolios: Portfolio[] = [];
        if (role === USER_ROLES.HR_USER || role === USER_ROLES.EXECUTIVE_USER || role === USER_ROLES.MD_USER)
            return portfolios = store.portfolio.all.sort(sortByName);

        else if (role === USER_ROLES.GENERAL_MANAGER || role === USER_ROLES.MANAGER_USER)
            portfolios = store.portfolio.all.sort(sortByName).filter((p) => {
                return p.asJson.department === me?.department;
            });
        else if (role === USER_ROLES.EMPLOYEE_USER)
            portfolios = store.portfolio.all.sort(sortByName).filter((p) => {
                return p.asJson.section === me?.division;
            });
        return portfolios;
    };

    const filteredPortfolios = portfolios().filter((p) => {
        if (selectedValue === "all") {
            return true;
        }
        return p.asJson.department === selectedValue;
    });


    const handleNewPortfolio = () => {
        showModalFromId(MODAL_NAMES.PROJECTS.CREATE_PORTFOLIO);
    }

    useEffect(() => {
        const fetchData = async () => {
            setLoadingData(true);
            try {
                await api.department.getAll();
                await api.projectManagement.getAllPortfolios();

                if (!projects.length) {
                    await api.projectManagement.getAllProjects();
                }
                setLoadingData(false);
            } catch (error) {
                setLoadingData(false);
            }
        }
        fetchData()
    }, [api.department, api.projectManagement]);



    if (loadingData)
        return (
            <HorizontalLoading />
        )

    return (
        <ErrorBoundary>
            <div style={{ padding: "1rem" }}>
                <div className="p-navbar">
                    <button className="btn btn-primary" type="button">
                        <span>Filter&nbsp;&nbsp;</span>
                        <FontAwesomeIcon
                            icon={faFilter}
                            className="icon uk-margin-small-right"
                        />
                    </button>
                    <div uk-drop="mode: click">
                        <Filter list={[...department, { name: "All Departments", id: "all" }]}
                            selectedValue={selectedValue} setSelectedValue={setSelectedValue} />
                    </div>

                    &nbsp;&nbsp;&nbsp;&nbsp;
                    <button className="btn btn-primary" onClick={handleNewPortfolio}>
                        <span>New Portfolio&nbsp;&nbsp;</span>
                        <FontAwesomeIcon
                            icon={faPlus}
                            className="icon uk-margin-small-right"
                        />
                    </button>
                </div>
                <div className='portfolios'>
                    {filteredPortfolios.map((p) => {
                        return <PortfolioItem
                            key={p.asJson.id}
                            portfolioName={p.asJson.portfolioName}
                            icon={p.asJson.icon} colors={p.asJson.colors}
                            textColor={p.asJson.textColor} id={p.asJson.id}
                            department={p.asJson.department}
                            section={p.asJson.section} />
                    })
                    }
                </div>
            </div>
            {/* Modals */}
            <ErrorBoundary>
                <Modal modalId={MODAL_NAMES.PROJECTS.CREATE_PORTFOLIO}>
                    <NewPortfolioModal />
                </Modal>
            </ErrorBoundary>
        </ErrorBoundary>
    )
});

export default PortfolioPage;


// {portfolios().filter((p) => {
//     if (selectedValue === "all") return p;
//     else if (p.asJson.department === selectedValue) return p
// }).map((p) 

    // useEffect(() => {
    //     const fetchData = async () => {
    //         if (!projects.length)
    //             await api.projectManagement.getAllProjects();
    //     }
    //     fetchData().catch();
    // }, [api.projectManagement, projects.length]);

    // useEffect(() => {
    //     if (!me) return;
    //     const fetchData = async () => {
    //         if (role === USER_ROLES.EXECUTIVE_USER || role === USER_ROLES.GUEST_USER || role === USER_ROLES.HR_USER)
    //             await api.projectManagement.getAllPortfolios();
    //         else if (role === USER_ROLES.GENERAL_MANAGER || USER_ROLES.MANAGER_USER)
    //             await api.projectManagement.getDepartmentPortfolios(me.department);
    //         else
    //             await api.projectManagement.getSectionPortfolios(me.division);
    //     }
    //     fetchData().catch();
    // }, [api.projectManagement, role, me]);