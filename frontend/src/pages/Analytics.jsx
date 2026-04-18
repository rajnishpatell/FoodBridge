import Layout from "../components/Layout";
import { BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

const data = [
  { name: "Food Created", value: 40 },
  { name: "Collected", value: 28 },
  { name: "Expired", value: 5 },
];

function Analytics(){

  return(
    <Layout>

      <h1 className="text-2xl font-bold mb-6">
        Platform Analytics
      </h1>

      <BarChart width={600} height={300} data={data}>
        <XAxis dataKey="name"/>
        <YAxis/>
        <Tooltip/>
        <Bar dataKey="value" fill="#22c55e"/>
      </BarChart>

    </Layout>
  )
}

export default Analytics