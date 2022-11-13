import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ArcElement,
} from "chart.js";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import { generateRandom } from "./Util";
import { VStack } from "@chakra-ui/react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  ArcElement
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
    title: {
      display: true,
      text: "Admission Comparison with the last year",
    },
    backgroundColor: ["red", "green"],
  },
  scales: {
    y: {
      min: 10,
      max: 20,
      stepSize: 1,
    },
  },
};

export const data = {
  labels: generateRandom(2).map((items) => items.day.toString()),

  datasets: [
    {
      label: "2021",
      data: [54, 23],
      backgroundColor: "rgba(255, 99, 132, 0.5)",
    },
  ],
};

function ChairChart() {
  return <Doughnut data={data} options={options} />;
}
export default ChairChart;
