import { useEffect, useState } from "react";
import { AreaChart, BarChart, XAxis, YAxis, Area, Bar, Tooltip, Legend } from "recharts";
import $ from 'jquery';
import { Stats } from "./models/Stats";
import { chartColors } from "./Utils";

export default function App() {
    const [dataAge, setDataAge] = useState<Stats[]>([]);
    const [dataGender, setDataGender] = useState<Stats[]>([]);
    const [types, setTypes] = useState<string[]>([]);
    const [checked, setChecked] = useState<boolean[]>([]);

    useEffect(() => {
        $.ajax('api/data/query/1', {
            method: 'POST',
            data: JSON.stringify({
                "xAxis": 1,
                "beginDate": "2022-01-01",
                "endDate": "2022-12-31"
            }),
            contentType: 'application/json',
            processData: false,
            success: result => {
                setDataAge(result.causes);
                const t = (result.causes[0].values as any[]).map(t => t.key);
                setTypes(t);
                setChecked(t.map(() => true));
            }
        })
    }, []);

    useEffect(() => {
        $.ajax('api/data/query/1', {
            method: 'POST',
            data: JSON.stringify({
                "xAxis": 4,
                "beginDate": "2022-01-01",
                "endDate": "2022-12-31"
            }),
            contentType: 'application/json',
            processData: false,
            success: result => {
                setDataGender(result.causes);
            }
        })
    }, []);

    const setCheck = (i: number) => {
        const t = [...checked];
        t[i] = !t[i];
        setChecked(t);
    }

    return (<div>
        <AreaChart width={1000} height={400} data={dataAge}>
            <XAxis dataKey={t => t.key / 12} unit={'лет'} />
            <YAxis />
            <Tooltip />
            <Legend />
            {types.filter((t, i) => checked[i]).map((t, i) => <Area
                type="monotone"
                name={t}
                dataKey={t2 => (t2.values as any[]).find(t3 => t3.key === t).value}
                stroke={chartColors[i]}
                fill={chartColors[i]}
            />)}
        </AreaChart>
        <BarChart width={1000} height={400} data={dataGender}>
            <XAxis dataKey={t => t.key} />
            <YAxis />
            <Tooltip />
            <Legend />
            {types.filter((t, i) => checked[i]).map((t, i) => <Bar
                name={t}
                dataKey={t2 => (t2.values as any[]).find(t3 => t3.key === t).value}
                fill={chartColors[i]}
            />)}
        </BarChart>
        <div>
            {checked.map((t, i) => 
            <div>
                <input type="checkbox" id={`check${i}`} checked={t} onChange={() => setCheck(i)} />
                <label htmlFor={`check${i}`}>{types[i]}</label>
            </div>)}
        </div>
    </div>);
}