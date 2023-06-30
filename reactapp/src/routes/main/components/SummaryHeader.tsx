import { useEffect } from "react";
import $ from 'jquery';
import { GeneralSummary, Summary } from "../../../models/Summary";
import '../styles/SummaryHeader.css';
import { useAppDispatch, useAppSelector } from "../../../store/store";
import { setSummary } from "../../../store/mainSlice";

export default function SummaryHeader() {
    const summary = useAppSelector(state => state.main.summary);
    const dispatcher = useAppDispatch();

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
                dispatcher(setSummary(list));
            }
        });
    }, []);

    return (
        <div className='summary-header'>
            {summary.length > 0 && summary.map((t, i) =>
                <div key={`summary-${i}`} className={`summary-header-item${i}`}>
                    <h1>{t.value}</h1>
                    <h4>{t.title}</h4>
                </div>)}
        </div>
    )
}