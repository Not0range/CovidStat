import { Area, AreaChart, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { KeyValuePair } from "../models/Stats";

export default function AreaDataChart(props: IProps) {
    return (
        <ResponsiveContainer aspect={2.5} width={'100%'} height={'unset'}>
            <AreaChart
                data={props.data}
                margin={{ bottom: 0, top: 0, left: 0, right: 0 }}
            >
                <XAxis dataKey={t => t.key} unit={props.unit} />
                <YAxis />
                <Tooltip />
                {(props.legendVisible === undefined || props.legendVisible) && <Legend />}
                {props.types.map((t, i) =>
                    <Area
                        key={`${t}-${i}`}
                        type="monotone"
                        name={t}
                        dataKey={t2 => (t2.values as any[]).find(t3 => t3.key === t).value}
                        stroke={props.colors[i]}
                        fill={props.colors[i]}
                    />)}
            </AreaChart>
        </ResponsiveContainer>
    )
}

interface IProps {
    data: IData[];
    types: string[];
    colors: string[];
    unit?: string;
    legendVisible?: boolean;
}

interface IData {
    key: string;
    values: KeyValuePair[];
}
