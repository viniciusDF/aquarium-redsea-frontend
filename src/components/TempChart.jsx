import { Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Legend,
  Tooltip
} from "chart.js"

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Legend,
  Tooltip
)

export default function TempChart({ agua, led }) {
  const data = {
    labels: ["Água", "LED"],
    datasets: [
      {
        label: "Temperatura °C",
        data: [agua, led],
        borderColor: "#38bdf8",
        backgroundColor: "#38bdf8",
      },
    ],
  }

  return (
    <div className="card">
      <h3>Temperatura</h3>
      <Line data={data} />
    </div>
  )
}