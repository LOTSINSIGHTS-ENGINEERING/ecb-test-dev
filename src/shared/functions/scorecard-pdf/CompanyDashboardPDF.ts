import { marginTopBottom, header, sectionHeader } from "./DocDefition";
import { brandLogo, charts } from "./ImageDefinition";


export const CompanyDashboardPDF = async (
    vision: string,
    mission: string,
    chartsimage: HTMLAnchorElement,

) => {
    const logo = await brandLogo();
    const _charts = await charts(chartsimage)

    return {
        pageSize: "A1",
        pageOrientation: "portrait",
        content: [
            // logo,
            marginTopBottom(),
            header("Dashboard Performance Report"),
            marginTopBottom(),
            sectionHeader(mission),
            marginTopBottom(),
            sectionHeader(vision),
            marginTopBottom(),
            _charts,
            marginTopBottom(),
            marginTopBottom(),
            marginTopBottom(),
            // logo,
        ],
    };
};
