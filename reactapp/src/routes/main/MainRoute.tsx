import { useEffect, useState } from "react";
import $ from 'jquery';
import AreaDataChart from "../../components/AreaDataChart";
import { Stats } from "../../models/Stats";
import { chartColors } from "../../Utils";
import SummaryHeader from "./components/SummaryHeader";

export default function MainRoute() {
    const [dataAge, setDataAge] = useState<Stats[]>([]);
    const [types, setTypes] = useState<string[]>([]);

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
            }
        });
    }, []);

    return (
        <div>
            <SummaryHeader />
            <AreaDataChart data={dataAge} types={types} colors={chartColors} />
        </div>
    )
}