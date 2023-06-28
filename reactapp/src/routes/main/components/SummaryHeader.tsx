import { useEffect, useState } from "react";
import $ from 'jquery';
import { Summary } from "../../../models/Summary";
import '../../../styles/SummaryHeader.css';

export default function SummaryHeader() {
    const [data, setData] = useState<GeneralSummary[]>([]);

    useEffect(() => {
        $.ajax('api/data/summary/1', {
            method: 'POST',
            data: JSON.stringify({}),
            contentType: 'application/json',
            processData: false,
            success: result => {
                const list: GeneralSummary[] = [];
                for (let item of result.causes as Summary[]) {
                    const ind = list.findIndex(t => t.title == item.title);
                    if (ind == -1)
                        list.push({
                            title: item.title,
                            value: item.value
                        });
                    else
                        list[ind].value += item.value;
                }
                setData(list);
            }
        });
    }, []);

    return (
        <div className='summary-header'>
            {data.map((t, i) =>
                <div className={`summary-header-item${i}`}>
                    <h1>{t.value}</h1>
                    <h4>{t.title}</h4>
                </div>)}
        </div>
    )
}

interface GeneralSummary {
    title: string;
    value: number;
}