import React, { FC } from 'react';
import { BreadCrumb } from 'primereact/breadcrumb';
import { useNavigate } from 'react-router-dom';

interface IBProps {
    values: { label: string, link: string }[];
}
const FeedbackBreadCrumb: FC<IBProps> = ({ values }) => {
    const navigate = useNavigate();

    const items = values.map(value => ({
        label: value.label,
        command: () => navigate(value.link)
    }))

    const home = { icon: 'pi pi-home', url: '/c/dashboard' }

    return (
        <div>
            <div className="card">
                <BreadCrumb model={items} home={home} />
            </div>
        </div>
    );
}

export default FeedbackBreadCrumb;