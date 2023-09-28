// import * as am5 from "@amcharts/amcharts5";
import { Component, FC } from "react";
// import * as am5xy from "@amcharts/amcharts5/xy";
// import * as am5percent from "@amcharts/amcharts5/percent";
// import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import { Chart as ChartJS, registerables } from "chart.js";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import { IProject } from "../../../shared/models/Project.model";

ChartJS.register(
    ...registerables
);

// export interface IChart {
//     values: [
//         {
//             category: string;
//             value: number;
//         }
//     ] | any[]
// }

// export class PieChart extends Component<IChart> {
//     root: any;
//     // constructor(private chartValues: IChart[]) {
//     //     super(chartValues);
//     // }
//     componentDidMount() {
//         let root = am5.Root.new("pieChart");
//         root.setThemes([
//             am5themes_Animated.new(root)
//         ]);

//         // Set themes
//         // https://www.amcharts.com/docs/v5/concepts/themes/



//         // Create chart
//         // https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/
//         let chart = root.container.children.push(am5percent.PieChart.new(root, {
//             layout: root.verticalLayout
//         }));


//         // Create series
//         // https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/#Series
//         let series = chart.series.push(am5percent.PieSeries.new(root, {
//             alignLabels: true,
//             calculateAggregates: true,
//             valueField: "value",
//             categoryField: "category"
//         }));

//         series.slices.template.setAll({
//             strokeWidth: 2,
//             stroke: am5.color(0xffffff)
//         });

//         series?.get("colors")?.set("colors", [
//             am5.color(0xFF0000),
//             am5.color(0xFFA500),
//             am5.color(0xA020F0),
//             am5.color(0x00FF00)
//         ]);

//         series.labelsContainer.set("paddingTop", 30);

//         // Set up adapters for variable slice radius
//         // https://www.amcharts.com/docs/v5/concepts/settings/adapters/
//         series.slices.template.adapters.add("radius", function (radius: number | any, target: any) {
//             let dataItem = target.dataItem;
//             let high: any = series.getPrivate("valueHigh");

//             if (dataItem) {
//                 let value = target.dataItem.get("valueWorking", 0);
//                 return radius * value / high;
//             }
//             return radius;
//         });


//         // Set data
//         // https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/#Setting_data
//         series.data.setAll(this.props.values);

//         // Create legend
//         // https://www.amcharts.com/docs/v5/charts/percent-charts/legend-percent-series/
//         let legend = chart.children.push(am5.Legend.new(root, {
//             centerX: am5.p50,
//             x: am5.p50,
//             marginTop: 15,
//             marginBottom: 15
//         }));

//         legend.data.setAll(series.dataItems);


//         // Play initial series animation
//         // https://www.amcharts.com/docs/v5/concepts/animations/#Animation_of_series
//         series.appear(1000, 100);

//         this.root = root;
//     }

//     componentWillUnmount() {
//         if (this.root) {
//             this.root.dispose();
//         }
//     }
//     render() {
//         return (
//             <div style={{ width: "35rem", height: "30rem", padding: "4rem" }} className="pieChart" id="pieChart" ></div>
//         )
//     }
// }

export interface IBarChartProps {
    data: {
        milestones: any;
        tasks: any;
    }
}


export const ProgressBarChart: FC<IBarChartProps> = ({ data }) => {

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            // title: {
            //     display: true,
            //     text: 'Project Milestones and Tasks',
            // },
        },
        scales: {
            y: {
                type: 'linear' as const, // magic
                ticks: {
                    stepSize: 1,
                },
            },
        },
    };

    const labels = ['Todo', 'In Progress', "In Review", "Done"];

    const data1 = {
        labels,
        datasets: [
            {
                label: 'Milestones',
                data: data.milestones,
                backgroundColor: '#6ca97e',
            },
            {
                label: 'Tasks',
                data: data.tasks,
                backgroundColor: '#84cbe9',
            },
        ],
    };

    return (
        <div className="bar-graph" style={{ height: "calc(100% - 20px)" }}>
            <Bar options={options} data={data1} />
        </div>
    );
}


interface IBarChartHorizontalProps {
    data: {
        labels: string[];
        values: number[];
    }
}
export const ProgressHorizontalBarChart: FC<IBarChartHorizontalProps> = ({ data }) => {
    const options = {
        indexAxis: 'y' as const,
        elements: {
            bar: {
                borderWidth: 1,
            },
        },
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            // title: {
            //     display: true,
            //     text: 'Project progress',
            // },
        },
    };

    const labels = data.labels;

    const data1 = {
        labels,
        datasets: [
            {
                label: 'Milestones',
                data: data.values,
                backgroundColor: '#9b59b6',
            }
        ],
    };

    return (
        <div className="bar-graph" style={{ height: "calc(100% - 20px)" }}>
            <Bar options={options} data={data1} />
        </div>
    );
}

interface IBarChartHorizontalStakedProps {
    data: {
        labels: string[];
        values: {
            completed: number[],
            remaining: number[],
            overdue: number[],
        };
    }
}
export const ProgressHorizontalStackedBarChart: FC<IBarChartHorizontalStakedProps> = ({ data }) => {
    const options = {
        indexAxis: 'y' as const,
        elements: {
            bar: {
                borderWidth: 1,
            },
        },
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
                labels: {
                    // This more specific font property overrides the global property
                    font: {
                        size: 12
                    }
                }
            },
            // title: {
            //     display: true,
            //     text: 'Project Workload',
            // }
        },
        scales: {
            x: {
                stacked: true,
                type: 'linear' as const,
                // stackWeight:1,
                max: 15,
                min: 0,
                stepSize: 1,
                precision: 0
            },
            y: {
                stacked: true,
                // ticks: {
                // precision: 0,
                stepSize: 1
                // }
            }
        }
    };

    const labels = data.labels;

    const data1 = {
        labels,
        datasets: [
            {
                label: 'Completed',
                data: data.values.completed,
                backgroundColor: "#4bb543",
                barPercentage: 0.4,
            },
            {
                label: 'Remaining',
                data: data.values.remaining,
                backgroundColor: "#e7a637",
                barPercentage: 0.4
            },
            {
                label: 'Overdue',
                data: data.values.overdue,
                backgroundColor: "#dc3545",
                barPercentage: 0.4
            },
        ],
    };

    return (
        <div className="bar-graph" style={{ height: "calc(100% - 20px)" }}>
            <Bar options={options} data={data1} />
        </div>
    );
}

type ProjectProps = {
    projects: IProject[];
}
export const ProjectBudgetChart: FC<ProjectProps> = ({ projects }) => {

    const options = {
        elements: {
            bar: {
                borderWidth: 1,
            },
        },
        plugins: {
            legend: {
                position: 'top' as const,
            },
        },
    };

    const labels = projects.map(p => p.projectName);

    const data1 = {
        labels,
        datasets: [
            {
                label: 'Projects Budget',
                data: projects.map(p => p.awardedAmount),
                backgroundColor: '#84cbe9',
                barPercentage: 0.2

            }
        ],
    };
    return (
        <Bar options={options} data={data1} />
    );
}

type StatusProps = {
    status: { active: number, onHold: number, atRisk: number, completed: number };
}
export const ProjectStatusChart: FC<StatusProps> = ({ status }) => {

    const options = {
        cutout: "70%"
    };

    const labels = ["Active", "On Hold", "At Risk", "Completed"];

    const data = {
        labels,
        datasets: [
            {
                label: 'Project Status',
                data: [status.active, status.onHold, status.atRisk, status.completed],
                backgroundColor: [
                    '#2f80ed',
                    '#e7a637',
                    '#dc3545',
                    '#4bb543'
                ],
            }
        ],
    };
    return (
        <Doughnut options={options} data={data} />
    );
}

export const projectCChart: FC<ProjectProps> = ({ projects }) => {

    const options = {
        indexAxis: 'y' as const,
        elements: {
            bar: {
                borderWidth: 2.5,
            },
        },
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: 'Project progress',
            },
        },
    };

    const labels = projects.map(p => p.projectName);

    const data1 = {
        labels,
        datasets: [
            {
                label: 'Milestones',
                data: projects.map(p => p.awardedAmount),
                backgroundColor: '#03045e',
            }
        ],
    };
    return (
        <div className="bar-graph" style={{ height: "calc(100% - 20px)" }}>
            <Bar options={options} data={data1} />
        </div>
    );
}

export const DepartmentTimeChart: FC<any> = ({ data }) => {



    const options: any = {
        scales: {
            x: {
                type: 'time',
                time: {
                    displayFormats: {
                        quarter: 'MMM YYYY'
                    }
                }
            }
        }
    }

    const data1 = {
        datasets: [{
            data: [{
                x: '2021-11-06 23:39:30',
                y: 50
            }, {
                x: '2021-11-07 01:00:28',
                y: 60
            }, {
                x: '2021-11-07 09:00:28',
                y: 20
            }]
        }],
    }

    return (
        <div className="bar-graph" style={{ height: "calc(100% - 20px)" }}>
            <Line options={options} data={data1} />
        </div>
    );
}



