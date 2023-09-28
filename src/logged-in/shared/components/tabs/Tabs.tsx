/* eslint-disable jsx-a11y/anchor-is-valid */
import {
  ALL_TAB,
  CUSTOMER_TAB,
  FINANCIAL_TAB,
  GROWTH_TAB,
  ITAB_ID,
  MAP_TAB,
  PROCESS_TAB,
} from "../../../../shared/interfaces/IPerspectiveTabs";

interface ITabItem {
  label: ITAB_ID;
  name: string;
  tooltip?: string;
  activeTab: (tab: string) => "" | "uk-active";
  onClick: (tab: ITAB_ID) => void;
}
const TabItem = (props: ITabItem) => {
  const { label, name, tooltip, activeTab, onClick: onClickTab } = props;

  return (
    <li
      className={activeTab(label)}
      onClick={() => onClickTab(label)}
      title={tooltip || label}
    >
      <a href="#">{name}</a>
    </li>
  );
};

interface IProps {
  noMap?: boolean;
  tab: ITAB_ID;
  setTab: React.Dispatch<React.SetStateAction<ITAB_ID>>;
}
const Tabs = (props: IProps) => {
  const { tab, setTab, noMap = false } = props;

  const activeTab = (_tab: string) => {
    return tab === _tab ? "uk-active" : "";
  };

  const onClick = (label: ITAB_ID) => {
    setTab(label);
  };

  return (
    <div className="perspective-filters">
      <ul className="kit-tabs uk-margin-remove" data-uk-tab>
        {!noMap && (
          <TabItem
            label={MAP_TAB.id}
            name="Map"
            activeTab={activeTab}
            onClick={onClick}
            tooltip="Display the objectives in a strategic map"
          />
        )}
        <TabItem
          label={ALL_TAB.id}
          name="All"
          activeTab={activeTab}
          onClick={onClick}
          tooltip="Show all the objectives"
        />
        <TabItem
          label={FINANCIAL_TAB.id}
          name="Financial"
          activeTab={activeTab}
          onClick={onClick}
          tooltip="Only show the financial sustainability objectives"
        />
        <TabItem
          label={CUSTOMER_TAB.id}
          name="Stakeholder"
          activeTab={activeTab}
          onClick={onClick}
          tooltip="Only show the stakeholder value addition objectives"
        />
        <TabItem
          label={PROCESS_TAB.id}
          name="Operational"
          activeTab={activeTab}
          onClick={onClick}
          tooltip="Only show the operational excellence &amp; governance objectives"
        />
        <TabItem
          label={GROWTH_TAB.id}
          name="Human Capital"
          activeTab={activeTab}
          onClick={onClick}
          tooltip="Only show the human capital &amp; transformation objectives"
        />
      </ul>
    </div>
  );
};

export default Tabs;
