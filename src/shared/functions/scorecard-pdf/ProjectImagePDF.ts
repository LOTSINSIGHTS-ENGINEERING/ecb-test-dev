import { marginTopBottom } from "./DocDefition";
import { charts } from "./ImageDefinition";

export const ProjectImagePDF = async (
    chartsimage: HTMLAnchorElement,

) => {
    // const logo = await brandLogo();
    const _charts = await charts(chartsimage)

    return {
        pageSize: "A1",
        pageOrientation: "portrait",
        content: [
            marginTopBottom(),
            _charts,
            marginTopBottom(),
        ],
    };
};
