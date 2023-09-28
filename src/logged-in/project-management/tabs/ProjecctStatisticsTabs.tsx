import { observer } from "mobx-react-lite";
import React, { FC } from "react";
import { USER_ROLES } from "../../../shared/functions/CONSTANTS";
import { useAppContext } from "../../../shared/functions/Context";

interface ITabItem {
  label: string;
  name: string;
  activeTab: (tab: string) => "" | "uk-active";
  onClickTab: (tab: string) => void;
  tooltip: string
}
const TabItem = (props: ITabItem) => {
  const { label, name, activeTab, onClickTab, tooltip } = props;

  return (
    <li className={activeTab(label)} onClick={() => onClickTab(label)}>
      <a href="#" data-uk-tooltip={tooltip} >{name}</a>
    </li>
  );
};

interface IProps {
  selectedTab: string;
  setselectedTab: React.Dispatch<React.SetStateAction<string>>;
}
const ProjectStatisticsTabs: FC<IProps> = observer(({ selectedTab, setselectedTab }) => {

  const { store } = useAppContext();
  const role = store.auth.role;
  const hasAccess = (role === USER_ROLES.EXECUTIVE_USER || role === USER_ROLES.HR_USER || role === USER_ROLES.ADMIN_USER);

  const activeTab = (tab: string) => {
    return tab === selectedTab ? "uk-active" : "";
  };

  const onClickTab = (tab: string) => {
    localStorage.setItem("project-s-selected-tab", tab);
    setselectedTab(tab);
  };

  return (
    <div className="settings-filters">
      <ul className="kit-tabs" data-uk-tab>
        {hasAccess &&
          <>
            <TabItem
              label="company-tab"
              name="Company"
              activeTab={activeTab}
              onClickTab={onClickTab}
              tooltip="This is an overall company projects"
            />
            {/* <TabItem
              label="department-tab"
              name="Department"
              activeTab={activeTab}
              onClickTab={onClickTab}
              tooltip="My department projects."
            /> */}
            <TabItem
              label="individual-tab"
              name="Individual"
              activeTab={activeTab}
              onClickTab={onClickTab}
              tooltip="All the projects that I am involved."
            />
            <TabItem
              label="project-tab"
              name="Projects"
              activeTab={activeTab}
              onClickTab={onClickTab}
              tooltip="All the projects that I am involved."
            />
          </>
        }
        {!hasAccess &&
          <>
            <TabItem
              label="department-tab"
              name="Department"
              activeTab={activeTab}
              onClickTab={onClickTab}
              tooltip="My department projects."
            />
            <TabItem
              label="individual-tab"
              name="Individual"
              activeTab={activeTab}
              onClickTab={onClickTab}
              tooltip="All the projects that I am involved."
            />
            <TabItem
              label="project-tab"
              name="Projects"
              activeTab={activeTab}
              onClickTab={onClickTab}
              tooltip="All the projects that I am involved."
            />
          </>
        }

      </ul>
    </div>
  );
});

export default ProjectStatisticsTabs;
