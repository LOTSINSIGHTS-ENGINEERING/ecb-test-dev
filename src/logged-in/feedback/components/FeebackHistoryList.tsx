import { observer } from "mobx-react-lite";
import moment from "moment";
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Slider } from 'primereact/slider';
import React, { FC, useState } from "react";
import { useAppContext } from "../../../shared/functions/Context";
import Feedback, { IFeedback } from "../../../shared/models/Feedback.model";

interface IFeedbackHistory {
  feedbackHistoryList: IFeedback[],
  catergory: string,
}
const FeedbackHistoryList: FC<IFeedbackHistory> = observer(({ feedbackHistoryList, catergory }) => {
  const { store } = useAppContext();

  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [filters, setFilters] = useState({
    'global': { value: null, matchMode: FilterMatchMode.CONTAINS },
    'sender': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
    'context': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
    'message': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
    'date': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
    'feeling': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
    'effect': { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
    'recipient': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
    'impact': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] }
  });
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [loading, setLoading] = useState(true);

  const context = [
    'unprompted', 'ideas', 'praise', 'peers-feedback', 'request'
  ];


  const getCustomers = (data: any) => {
    return [...data || []].map(d => {
      d.date = new Date(d.date);
      return d;
    });
  }

  const formatDate = (value: any) => {
    return moment(value).calendar();
  }


  const onGlobalFilterChange = (e: any) => {
    const value = e.target.value;
    let _filters = { ...filters };
    _filters['global'].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  }

  const renderHeader = () => {
    return (
      <div className="flex justify-content-between align-items-center">
        <h5 className="m-0">Feedback</h5>
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Keyword Search" />
        </span>
      </div>
    )
  }

  const dateBodyTemplate = (rowData: IFeedback) => {
    return formatDate(rowData.date);
  }

  const dateFilterTemplate = (options: any) => {
    return <Calendar value={options.value} onChange={(e) => options.filterCallback(e.value, options.index)} dateFormat="mm/dd/yy" placeholder="mm/dd/yyyy" mask="99/99/9999" />
  }


  const effectBodyTemplate = (rowData: IFeedback) => {
    return <span className={`customer-badge status-${rowData.effect}`}>{rowData.effect}</span>;
  }

  const contextBodyTemplate = (rowData: IFeedback) => {
    return <span className={`customer-badge status-${rowData.context}`}>{rowData.context}</span>;
  }

  const senderBodyTemplate = (rowData: IFeedback) => {
    const user = store.user.getItemById(rowData.sender)?.asJson;
    return <span>{!!rowData.anonymously ? "Anonymously" : user?.displayName}</span>;
  }

  const receiverBodyTemplate = (rowData: IFeedback) => {
    const user = store.user.getItemById(rowData.recipient)?.asJson;
    return <span>{user?.displayName}</span>;
  }

  const feelingBodyTemplate = (rowData: IFeedback) => {
    return <span>{rowData.feeling}</span>;
  }
  const messageBodyTemplate = (rowData: IFeedback) => {
    return <span>{rowData.message}</span>;
  }

  const statusItemTemplate = (option: any) => {
    return <span className={`customer-badge status-${option}`}>{option}</span>;
  }

  const activityFilterTemplate = (options: any) => {
    return (
      <React.Fragment>
        <Slider value={options.value} onChange={(e) => options.filterCallback(e.value)} range className="m-3"></Slider>
        <div className="flex align-items-center justify-content-between px-2">
          <span>{options.value ? options.value[0] : 0}</span>
          <span>{options.value ? options.value[1] : 100}</span>
        </div>
      </React.Fragment>
    )
  }

  const feelingFilterTemplate = (options: any) => {
    return null;
  }

  const statusRowFilterTemplate = (options: any) => {
    return <Dropdown value={options.value} options={context} onChange={(e) => options.filterApplyCallback(e.value)} itemTemplate={statusItemTemplate} placeholder="Select a Status" className="p-column-filter" showClear />;
  }

  const actionBodyTemplate = () => {
    return <Button type="button" icon="pi pi-cog"></Button>;
  }

  const header = renderHeader();

  return (
    <div className="datatable-doc-demo">
      <div className="card">
        <DataTable value={feedbackHistoryList} paginator className="p-datatable-customers" header={header} rows={10}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" rowsPerPageOptions={[10, 25, 50]}
          dataKey="id" rowHover selection={selectedFeedback} onSelectionChange={e => setSelectedFeedback(e.value)}
          filters={filters} filterDisplay="menu" responsiveLayout="scroll"
          globalFilterFields={['name', 'country.name', 'representative.name', 'balance', 'status']} emptyMessage="No Feedback found."
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries">

          <Column selectionMode="multiple" headerStyle={{ width: '3em' }}></Column>

          {(catergory === "unprompted" || catergory === "ideas") &&
            <Column field="sender" header="Name" sortable filter filterPlaceholder="Search by name" style={{ minWidth: '14rem' }} body={senderBodyTemplate} />}

          {catergory === "praise" && <Column field="sender" header="Praised By" sortable filter filterPlaceholder="Search by name" style={{ minWidth: '14rem' }} body={senderBodyTemplate} />}

          {(catergory === "praise" || catergory === "peers-feedback") && <Column field="recipient" header="Receiver" sortable filter filterPlaceholder="Search by name" style={{ minWidth: '14rem' }} body={receiverBodyTemplate} />}

          {catergory === "ideas" && <Column field="effect" header="Effect" sortable filterField="effect" style={{ minWidth: '14rem' }} body={effectBodyTemplate} filter filterPlaceholder="Search by effect" />}

          {catergory === "unprompted" && <Column field="feeling" header="Feeling" sortable sortField="feeling" filterField="representative" showFilterMatchModes={false} filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '14rem' }} body={feelingBodyTemplate}
            filter filterElement={feelingFilterTemplate} />}

          {catergory === "unprompted" && <Column field="context" header="Context" sortable filterField="context" style={{ minWidth: '14rem' }} body={contextBodyTemplate} filter filterPlaceholder="Search by context" />}

          {catergory === "unprompted" && <Column field="proceed" header="Proceed" sortable filterField="proceed" style={{ minWidth: '14rem' }} />}

          {catergory === "unprompted" && <Column field="impact" header="Impact" sortable filterField="impact" style={{ minWidth: '14rem' }} filter filterPlaceholder="Search by Impact" />}

          {catergory !== "peers-feedback" && <Column field="message" header="Message" sortable sortField="message" style={{ minWidth: '14rem' }} body={messageBodyTemplate}
          />}

          {catergory === "peers-feedback" && <Column field="observation" header="Observation" sortable sortField="observation" style={{ minWidth: '14rem' }} />}

          {catergory === "peers-feedback" && <Column field="reason" header="Reason" sortable sortField="reason" style={{ minWidth: '14rem' }} />}

          {catergory === "peers-feedback" && <Column field="suggestion" header="Suggestion" sortable sortField="suggestion" style={{ minWidth: '14rem' }} />}

          {catergory === "peers-feedback" && <Column field="feel" header="Feel" sortable sortField="feel" style={{ minWidth: '14rem' }} />}
          <Column field="date" header="Date" sortable filterField="date" dataType="date" style={{ minWidth: '8rem' }} body={dateBodyTemplate}
            filter filterElement={dateFilterTemplate} />
        </DataTable>
      </div>
    </div>
  );
});

export default FeedbackHistoryList;