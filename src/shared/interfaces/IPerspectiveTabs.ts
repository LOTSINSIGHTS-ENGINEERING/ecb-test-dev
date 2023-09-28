export type ITAB_ID =
  | "All"
  | "Map"
  | "Financial"
  | "Customer"
  | "Process"
  | "Growth";

export interface IPerspectiveTab {
  id: ITAB_ID;
  name: string;
  perspective: string | "";
  description: string;
}

export const ALL_TAB: IPerspectiveTab = {
  id: "All",
  name: "All Objectives",
  perspective: "",
  description: "All the objectives in the scorecard.",
};

export const MAP_TAB: IPerspectiveTab = {
  id: "Map",
  name: "Strategic Map",
  perspective: "",
  description: "Strategic map for your organization.",
};

export const FINANCIAL_TAB: IPerspectiveTab = {
  id: "Financial",
  name: "Financial Sustainability Perspective",
  perspective: "Financial Sustainability",
  description: "Financial objectives in the scorecard.",
};

export const CUSTOMER_TAB: IPerspectiveTab = {
  id: "Customer",
  name: "Stakeholder Value Addition Perspective",
  perspective: "Stakeholder Value Addition",
  description: "Stakeholder Value Addition objectives in the scorecard.",
};

export const PROCESS_TAB: IPerspectiveTab = {
  id: "Process",
  name: "Operational Excellence & Governance Perspective",
  perspective: "Operational Excellence & Governance",
  description:
    "Operational Excellence & Governance objectives in the scorecard.",
};

export const GROWTH_TAB: IPerspectiveTab = {
  id: "Growth",
  name: "Human Capital & Transformation Perspective",
  perspective: "Human Capital & Transformation",
  description: "Human Capital & Transformation objectives in the scorecard.",
};

const removeLastWord = (str: string) =>
  str.split(" ").reverse().splice(1).reverse().join(" ");

export const fullPerspectiveName = (tab: string) => {
  if (tab === FINANCIAL_TAB.id) return removeLastWord(FINANCIAL_TAB.name);
  else if (tab === CUSTOMER_TAB.id) return removeLastWord(CUSTOMER_TAB.name);
  else if (tab === PROCESS_TAB.id) return removeLastWord(PROCESS_TAB.name);
  if (tab === GROWTH_TAB.id) return removeLastWord(GROWTH_TAB.name);
  return "uknown";
};
