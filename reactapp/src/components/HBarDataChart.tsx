import { Bar, BarChart, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export default function HBarDataChart(props: IProps) {
    return (
        <ResponsiveContainer width={'100%'} height={'100%'}>
            <BarChart data={props.data} layout="vertical">
                <XAxis type="number" />
                <YAxis dataKey='key' type="category" style={{wordWrap: 'break-word'}} />
                <Tooltip />
                <Bar
                    dataKey={t => t.value}
                    fill={props.colors[3]}
                />
            </BarChart>
        </ResponsiveContainer>
    )
}

interface IProps {
    data: IData[];
    colors: string[];
}

interface IData {
    key: string;
    value: number;
}