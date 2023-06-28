import { Bar, BarChart, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { KeyValuePair } from "../models/Stats";

export default function BarDataChart(props: IProps) {
    return (
        <ResponsiveContainer aspect={2.5} width={'100%'}>
            <BarChart data={props.data} width={400} height={400}>
                <XAxis dataKey={t => t.key} unit={props.unit} />
                <YAxis />
                <Tooltip />
                <Legend />
                {props.types.map((t, i) =>
                    <Bar
                        key={`${t}-${i}`}
                        type="monotone"
                        name={t}
                        dataKey={t2 => (t2.values as any[]).find(t3 => t3.key === t).value}
                        stroke={props.colors[i]}
                        fill={props.colors[i]}
                    />)}
            </BarChart>
        </ResponsiveContainer>
    )
}

interface IProps {
    data: IData[];
    types: string[];
    colors: string[];
    unit?: string;
}

interface IData {
    key: string;
    values: KeyValuePair[];
}