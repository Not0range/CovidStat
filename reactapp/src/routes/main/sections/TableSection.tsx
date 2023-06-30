import $ from 'jquery';
import moment from 'moment';
import { useEffect, useState } from "react";
import { chartColors, periods } from "../../../Utils";
import '../styles/TableSection.css';
import { Stats } from '../../../models/Stats';

export default function TableSection() {
    const [period, setPeriod] = useState(0);

    const [data, setData] = useState<Stats[]>([]);
    const [types, setTypes] = useState<string[]>([]);

    useEffect(() => {
        const b = moment().subtract(periods[period].days + 1, 'days').format();
        const e = moment().format();

        $.ajax('api/data/query/1', {
            method: 'POST',
            data: JSON.stringify({
                xAxis: 3,
                beginDate: b,
                endDate: e
            }),
            contentType: 'application/json',
            processData: false,
            success: result => {
                setData(result.causes);
                const t = (result.causes[0].values as any[]).map(t => t.key);
                setTypes(t);
            }
        });
    }, [period]);

    return (
        <div className='table-section-main'>
            <div className='table-section-period'>
                <h4>Оперативные данные за период: </h4>
                <select
                    value={period}
                    onChange={e => setPeriod(+e.target.value)}
                >
                    {periods.map((t, i) => <option key={`opt-${i}`} value={i}>{t.title}</option>)}
                </select>
            </div>
            <table>
                <thead>
                    <th>Район</th>
                    {types.map((t, i) => <th key={`th-${i}`}>{t}</th>)}
                </thead>
                <tbody>
                    {data.map((t, i) =>
                        <tr key={`tr-${i}`}>
                            <td>{t.key}</td>
                            {t.values.map((t2, i2) =>
                                <td key={`td-${i}-${i2}`}>
                                    <div className='table-section-cell'>
                                        <div className='table-section-indicator' style={{backgroundColor: chartColors[i2]}} />
                                        {t2.value}
                                    </div>
                                </td>)}
                        </tr>)}
                </tbody>
            </table>
        </div>
    )
}