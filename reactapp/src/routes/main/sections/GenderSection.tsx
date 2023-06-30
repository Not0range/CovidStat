import { useEffect, useState } from "react";
import { chartColors } from "../../../Utils";
import $ from 'jquery';
import AreaDataChart from "../../../components/AreaDataChart";
import { Stats } from "../../../models/Stats";
import '../styles/GenderSection.css';

export default function GenderSection({cityId, districtId}: IProps) {

    const [dataMan, setDataMan] = useState<Stats[]>([]);
    const [dataWoman, setDataWoman] = useState<Stats[]>([]);
    const [types, setTypes] = useState<string[]>([]);

    useEffect(() => {
        $.ajax('api/data/query/1', {
            method: 'POST',
            data: JSON.stringify({
                xAxis: 1,
                gender: false,
                cityId,
                districtId
            }),
            contentType: 'application/json',
            processData: false,
            success: result => {
                setDataMan(result.causes);
                const t = (result.causes[0].values as any[]).map(t => t.key);
                setTypes(t);
            }
        });
    }, [cityId, districtId]);

    useEffect(() => {
        $.ajax('api/data/query/1', {
            method: 'POST',
            data: JSON.stringify({
                xAxis: 1,
                gender: true,
                cityId,
                districtId
            }),
            contentType: 'application/json',
            processData: false,
            success: result => {
                setDataWoman(result.causes);
            }
        });
    }, [cityId, districtId]);
    
    return (
        <div className='gender-section'>
            <div>
                <AreaDataChart
                    data={dataMan}
                    types={types.slice(0, 2)}
                    colors={chartColors}
                    unit=" лет"
                    legendVisible={false}
                />
                <h4>Мужчины</h4>
            </div>
            <div>
                <AreaDataChart
                    data={dataWoman}
                    types={types.slice(0, 2)}
                    colors={chartColors}
                    unit=" лет"
                    legendVisible={false}
                />
                <h4>Женщины</h4>
            </div>
        </div>
    )
}

interface IProps {
    cityId?: number;
    districtId?: number;
}
