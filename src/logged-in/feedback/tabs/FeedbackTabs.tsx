import React, { FC } from "react";

interface ITabItem {
  label: string;
  name: string;
  tooltip: string;
  activeTab: (tab: string) => string;
  onClickTab: (tab: string) => void;
}
const TabItem = (props: ITabItem) => {
  const { label, name, activeTab, onClickTab, tooltip } = props;

  return (
    <div className={`feedback-tab-item ${activeTab(label)}`} uk-tooltip={tooltip} onClick={() => onClickTab(label)}>
      <div className="icon">
        {label === "unprompted-tab" &&
          <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="feather feather-message-circle">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
          </svg>
        }
        {label === "ideas-tab" &&
          <svg width="26" height="26" strokeWidth="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="currentColor">
            <path d="M9 18h6M10 21h4M9 15c.001-2-.499-2.5-1.5-3.5-1-1-1.476-2.013-1.5-3.5-.047-3.05 2-5 6-5 4.001 0 6.049 1.95 6 5-.023 1.487-.5 2.5-1.5 3.5-.999 1-1.499 1.5-1.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
          </svg>
        }
        {label === "praise-tab" &&
          <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="feather feather-thumbs-up">
            <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
          </svg>
        }
        {label === "peers-feedback-tab" &&
          <svg width="26" height="26" strokeWidth="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="currentColor">
            <path d="M1 20v-1a7 7 0 017-7v0a7 7 0 017 7v1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
            <path d="M13 14v0a5 5 0 015-5v0a5 5 0 015 5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
            <path d="M8 12a4 4 0 100-8 4 4 0 000 8zM18 9a3 3 0 100-6 3 3 0 000 6z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
          </svg>
        }
        {label === "request-tab" &&
          <svg width="26" height="26" viewBox="0 0 24 24" strokeWidth="1.5" fill="none" xmlns="http://www.w3.org/2000/svg" color="currentColor">
            <path d="M7 8l5 3 5-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
            <path d="M10 20H4a2 2 0 01-2-2V6a2 2 0 012-2h16a2 2 0 012 2v6.857" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
            <path d="M13 17.111h6.3c3.6 0 3.6 4.889 0 4.889M13 17.111L16.15 14M13 17.111l3.15 3.111" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
          </svg>
        }
      </div>
      <span>{name}</span>
    </div>
  );
};

interface IProps {
  selectedTab: string;
  setselectedTab: React.Dispatch<React.SetStateAction<string>>;
}
const FeedbackTabs: FC<IProps> = ({ selectedTab, setselectedTab }) => {

  const activeTab = (tab: string) => {
    return tab === selectedTab ? "selected-feedback" : "";
  };

  const onClickTab = (tab: string) => {
    setselectedTab(tab);
    localStorage.setItem("feedback-selected-tab", tab);
  };

  return (
    <div className="feedback-tab">
      <TabItem
        label="unprompted-tab"
        name="Unprompted"
        activeTab={activeTab}
        onClickTab={onClickTab}
        tooltip="Unprompted Tab"
      />
      <TabItem
        label="peers-feedback-tab"
        name="Peers Feedback"
        activeTab={activeTab}
        onClickTab={onClickTab}
        tooltip="Peers Feedback"
      />
      <TabItem
        label="ideas-tab"
        name="Ideas"
        activeTab={activeTab}
        onClickTab={onClickTab}
        tooltip="Ideas"
      />
      <TabItem
        label="praise-tab"
        name="Praise"
        activeTab={activeTab}
        onClickTab={onClickTab}
        tooltip="Praise"
      />
      <TabItem
        label="request-tab"
        name="Request Feedback"
        activeTab={activeTab}
        onClickTab={onClickTab}
        tooltip="Request Feedback"
      />
    </div>
  );
};

export default FeedbackTabs;
