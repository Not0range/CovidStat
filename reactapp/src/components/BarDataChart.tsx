import { Bar, BarChart, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { KeyValuePair } from "../models/Stats";

export default function BarDataChart(props: IProps) {
    return (
        <ResponsiveContainer aspect={3} width={'100%'}>
            <BarChart data={props.data}>
                <XAxis dataKey={t => t.key} unit={props.unit} />
                <YAxis />
                <Tooltip />
                <Legend />
                {props.types.map((t, i) =>
                    <Bar
                        key={`${t}-${i}`}
                        name={t}
                        dataKey={t2 => (t2.values as any[]).find(t3 => t3.key === t).value}
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