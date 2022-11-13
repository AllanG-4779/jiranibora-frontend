import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJs,
  CategoryScale,
  LineElement,
  LinearScale,
  PointElement,
  BarElement,
} from "chart.js";

ChartJs.register(
  CategoryScale,
  LineElement,
  BarElement,

  PointElement,
  LinearScale
);
const LineChart = (props:any) => {
  
  const options = {
    maintainAspectRatio: true,
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          title: function () {
            return "my tittle";
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: false,
      },
    },
  };
  return <Bar data={props.data} options={options}></Bar>;
};
export default LineChart;
