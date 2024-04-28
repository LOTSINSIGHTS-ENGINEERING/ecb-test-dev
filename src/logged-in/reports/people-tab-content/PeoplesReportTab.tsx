import React from "react";

interface ITabItem {
  label: string;
  name: string;
  activeTab: (tab: string) => "" | "uk-active";
  onClickTab: (tab: string) => void;
}
const TabItem = (props: ITabItem) => {
  const { label, name, activeTab, onClickTab } = props;

  return (
    <li className={activeTab(label)} onClick={() => onClickTab(label)}>
      <a href="void(0)">{name}</a>
    </li>
  );
};

interface IProps {
  selectedTab: string;
  setselectedTab: React.Dispatch<React.SetStateAction<string>>;
}
export const PeopleReportTabs = (props: IProps) => {
  const { selectedTab, setselectedTab } = props;

  const activeTab = (tab: string) => {
    return tab === selectedTab ? "uk-active" : "";
  };

  const onClickTab = (tab: string) => {
    setselectedTab(tab);
  };

  return (
    <div className="settings-filters uk-margin">
      <ul className="kit-tabs" data-uk-tab>
        <TabItem
          label="overview"
          name="Overview"
          activeTab={activeTab}
          onClickTab={onClickTab}
        />
        <TabItem
          label="mid-term-best-performers"
          name="Mid-Term (Top Performers)"
          activeTab={activeTab}
          onClickTab={onClickTab}
        />
        <TabItem
          label="mid-term-worst-performers"
          name="Mid-Term"
          activeTab={activeTab}
          onClickTab={onClickTab}
        />
        <TabItem
          label="final-assessment-best-performers"
          name="Final (Top Performers)"
          activeTab={activeTab}
          onClickTab={onClickTab}
        />
        <TabItem
          label="final-assessment-worst-performers"
          name="Final Performers"
          activeTab={activeTab}
          onClickTab={onClickTab}
        />
      </ul>
    </div>
  );
};

