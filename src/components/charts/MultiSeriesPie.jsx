// import {
//   Chart as ChartJS,
//   ArcElement,
//   Tooltip,
//   Legend,
// } from "chart.js";
// import { Doughnut } from "react-chartjs-2";

// ChartJS.register(ArcElement, Tooltip, Legend);

// function MultiSeriesPie({ attendanceStats }) {
//   const {
//     totals = 0,
//     totals_checkedin = 0,
//     buyers = { totals: 0, checked_in: 0 },
//     exhibitors = { totals: 0, checked_in: 0 },
//     vip = { totals: 0, checked_in: 0 },
//     media = { totals: 0, checked_in: 0 },
//   } = attendanceStats || {};

//   const data = {
//     labels: ["Checked In", "Remaining"],
//     datasets: [
//       {
//         label: "Overall",
//         data: [totals_checkedin, Math.max(totals - totals_checkedin, 0)],
//         backgroundColor: ["#111111", "#E5E5E5"],
//         borderWidth: 0,
//         weight: 1,
//       },
//       {
//         label: "Buyers",
//         data: [buyers.checked_in, Math.max(buyers.totals - buyers.checked_in, 0)],
//         backgroundColor: ["#2563EB", "#DBEAFE"],
//         borderWidth: 0,
//         weight: 1,
//       },
//       {
//         label: "Exhibitors",
//         data: [exhibitors.checked_in, Math.max(exhibitors.totals - exhibitors.checked_in, 0)],
//         backgroundColor: ["#059669", "#D1FAE5"],
//         borderWidth: 0,
//         weight: 1,
//       },
//       {
//         label: "VIP",
//         data: [vip.checked_in, Math.max(vip.totals - vip.checked_in, 0)],
//         backgroundColor: ["#D97706", "#FEF3C7"],
//         borderWidth: 0,
//         weight: 1,
//       },
//       {
//         label: "Media",
//         data: [media.checked_in, Math.max(media.totals - media.checked_in, 0)],
//         backgroundColor: ["#7C3AED", "#EDE9FE"],
//         borderWidth: 0,
//         weight: 1,
//       },
//     ],
//   };

//   const options = {
//     responsive: true,
//     maintainAspectRatio: false,
//     cutout: "25%",
//     plugins: {
//       legend: {
//         position: "bottom",
//         labels: {
//           generateLabels(chart) {
//             const datasets = chart.data.datasets;

//             return datasets.map((dataset, index) => ({
//               text: dataset.label,
//               fillStyle: dataset.backgroundColor[0],
//               strokeStyle: dataset.backgroundColor[0],
//               lineWidth: 0,
//               hidden: false,
//               index,
//             }));
//           },
//         },
//       },
//       tooltip: {
//         callbacks: {
//           label(context) {
//             const datasetLabel = context.dataset.label;
//             const value = context.raw;
//             const total = context.dataset.data.reduce((sum, current) => sum + current, 0);
//             const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;

//             return `${datasetLabel}: ${value} (${percentage}%)`;
//           },
//         },
//       },
//     },
//   };

//   return (
//     <div style={{ width: "100%", maxWidth: "420px", height: "340px" }}>
//       <Doughnut data={data} options={options} />
//     </div>
//   );
// }

// export default MultiSeriesPie;

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

function MultiSeriesPie({ attendanceStats }) {
  const data = {
    labels: ["Checked In", "Remaining"],
    datasets: [],
  };

  // Extract categories dynamically from the provided attendanceStats object
  Object.keys(attendanceStats).forEach((category) => {
    const { checked_in = 0, totals = 0 } = attendanceStats[category];

    data.datasets.push({
      label: category,
      data: [checked_in, Math.max(totals - checked_in, 0)],
      backgroundColor: getCategoryColors(category),
      borderWidth: 0,
      weight: 1,
    });
  });

  // Helper function to generate category-specific colors
  function getCategoryColors(category) {
    const colorMap = {
      "Buyer 1st day only": ["#2563EB", "#DBEAFE"],
      "Buyers 2 day": ["#059669", "#D1FAE5"],
      "Exhibitors": ["#D97706", "#FEF3C7"],
      "Media": ["#7C3AED", "#EDE9FE"],
      "Sponsors": ["#F59E0B", "#FEE2B3"],
      "TDC": ["#4B5563", "#D1D5DB"],
      "Speakers": ["#9CA3AF", "#F3F4F6"],
      "Institutions": ["#9333EA", "#E9D5FF"],
    };

    return colorMap[category] || ["#111111", "#E5E5E5"];
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "25%",
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          generateLabels(chart) {
            const datasets = chart.data.datasets;
            return datasets.map((dataset, index) => ({
              text: dataset.label,
              fillStyle: dataset.backgroundColor[0],
              strokeStyle: dataset.backgroundColor[0],
              lineWidth: 0,
              hidden: false,
              index,
            }));
          },
        },
      },
      tooltip: {
        callbacks: {
          label(context) {
            const datasetLabel = context.dataset.label;
            const value = context.raw;
            const total = context.dataset.data.reduce((sum, current) => sum + current, 0);
            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;

            return `${datasetLabel}: ${value} (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <div style={{ width: "100%", maxWidth: "420px", height: "340px" }}>
      <Doughnut data={data} options={options} />
    </div>
  );
}

export default MultiSeriesPie;