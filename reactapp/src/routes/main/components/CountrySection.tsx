import { useEffect, useState } from "react";
import $ from 'jquery';
import { Stats } from "../../../models/Stats";
import { chartColors, summaryColors } from "../../../Utils";
import AreaDataChart from "../../../components/AreaDataChart";
import { setCountry, useAppDispatch, useAppSelector } from "../../../store";
import '../styles/CountrySection.css';
import { Summary } from "../../../models/Summary";
import GenderSection from "./GenderSection";

export default function CountrySection({ id }: IProps) {
    const district = useAppSelector(state => state.main.districts.find(t => t.id == id));
    const dispatcher = useAppDispatch();

    const [countMan, setCountMan] = useState(0);
    const [countWoman, setCountWoman] = useState(0);

    const [text, setText] = useState('');
    const [cityId, setCityId] = useState<number | undefined>(undefined);

    const [data, setData] = useState<Stats[]>([]);
    const [cityData, setCityData] = useState<Stats[]>([]);
    const [types, setTypes] = useState<string[]>([]);

    const [summary, setSummary] = useState<Summary[]>([]);
    const [citySummary, setCitySummary] = useState<Summary[]>([]);

    const city = district?.cities.find(t => t.id == cityId);
    const summaryValues = [
        summary.filter(t => t.title == types[0]).map(t => t.value).reduce((p, c) => p + c, 0),
        summary.filter(t => t.title == types[1]).map(t => t.value).reduce((p, c) => p + c, 0),
        summary.filter(t => t.title == types[2]).map(t => t.value).reduce((p, c) => p + c, 0),
        summary.filter(t => t.title == types[3]).map(t => t.value).reduce((p, c) => p + c, 0)
    ]
    const citySummaryValues = [
        citySummary.filter(t => t.title == types[0]).map(t => t.value).reduce((p, c) => p + c, 0),
        citySummary.filter(t => t.title == types[1]).map(t => t.value).reduce((p, c) => p + c, 0),
        citySummary.filter(t => t.title == types[2]).map(t => t.value).reduce((p, c) => p + c, 0),
        citySummary.filter(t => t.title == types[3]).map(t => t.value).reduce((p, c) => p + c, 0)
    ]

    useEffect(() => {
        const r = district?.cities.find(t => t.title.toLowerCase() === text.toLowerCase());
        if (r) {
            $.ajax('api/data/summary/1', {
                method: 'POST',
                data: JSON.stringify({
                    cityId: id
                }),
                contentType: 'application/json',
                processData: false,
                success: result => {
                    setCityId(r.id);
                    setCitySummary(result.causes);
                }
            });
            $.ajax('api/data/query/1', {
                method: 'POST',
                data: JSON.stringify({
                    xAxis: 0,
                    cityId: id
                }),
                contentType: 'application/json',
                processData: false,
                success: result => {
                    setCityData(result.causes);
                }
            });
            return;
        }
        setCityId(undefined);
    }, [text]);

    useEffect(() => {
        if (id === undefined) return;

        $.ajax('api/data/query/1', {
            method: 'POST',
            data: JSON.stringify({
                xAxis: 0,
                districtId: id
            }),
            contentType: 'application/json',
            processData: false,
            success: result => {
                setData(result.causes);
                const t = (result.causes[0].values as any[]).map(t => t.key);
                setTypes(t);
            }
        });
    }, [id]);

    useEffect(() => {
        if (id === undefined) return;
        $.ajax('api/data/summary/1', {
            method: 'POST',
            data: JSON.stringify({
                districtId: id
            }),
            contentType: 'application/json',
            processData: false,
            success: result => {
                setSummary(result.causes);
            }
        });
    }, []);

    useEffect(() => {
        if (id === undefined) return;
        $.ajax('api/data/summary/1', {
            method: 'POST',
            data: JSON.stringify({
                gender: false,
                cityId,
                districtId: id
            }),
            contentType: 'application/json',
            processData: false,
            success: result => {
                setCountMan((result.causes as Summary[])[0].value);
            }
        });
    }, [cityId, id]);

    useEffect(() => {
        if (id === undefined) return;
        $.ajax('api/data/summary/1', {
            method: 'POST',
            data: JSON.stringify({
                gender: true,
                cityId,
                districtId: id
            }),
            contentType: 'application/json',
            processData: false,
            success: result => {
                setCountWoman((result.causes as Summary[])[0].value);
            }
        });
    }, [cityId, id]);

    return (
        <div>
            <i className='close-icon-button bx bx-x bx-lg' onClick={() => dispatcher(setCountry(undefined))} />
            {id !== undefined && data.length > 0 && <div className='country-section-container'>
                <h3>{district?.title ?? ''}</h3>
                {(district?.cities?.length ?? 0) > 1 && <input type='text' value={text} onChange={(e) => setText(e.target.value)} />}
                <h3>{city?.title ?? ''}</h3>
                {city === undefined ?
                    <h4>{'С начала пандемии было '}
                        <span style={{ color: summaryColors[0] }}>выявлено {summaryValues[0]}</span>{' случаев заболевания, '}
                        <span style={{ color: summaryColors[1] }}>выздоровело {summaryValues[1]}</span>{' человек, '}
                        <span style={{ color: summaryColors[2] }}>умерло {summaryValues[2]}</span>{' человек, '}
                        <span style={{ color: summaryColors[3] }}>вакцинировалось {summaryValues[3]}</span> человек.
                    </h4> :
                    <h4>С начала пандемии в городе {city.title} {'было '}
                        <span style={{ color: summaryColors[0] }}>выявлено {citySummaryValues[0]}</span>{' случаев заболевания, '}
                        <span style={{ color: summaryColors[1] }}>выздоровело {citySummaryValues[1]}</span>{' человек, '}
                        <span style={{ color: summaryColors[2] }}>умерло {citySummaryValues[2]}</span>{' человек, '}
                        <span style={{ color: summaryColors[3] }}>вакцинировалось {citySummaryValues[3]}</span> человек.
                    </h4>}
                <div className='country-section-charts'>
                    <div>
                        <div className='segmented-button'>
                            {types.map((t, i) => <div key={`type${i}`}>{t}</div>)}
                        </div>
                        <AreaDataChart
                            data={city === undefined ? data : cityData}
                            types={types}
                            colors={chartColors}
                        />
                    </div>
                    <div>
                        <AreaDataChart
                            data={city === undefined ? data : cityData}
                            types={types}
                            colors={chartColors}
                        />
                    </div>
                </div>
                <h2>С начала пандемии было выявлено {countWoman} случаев заболевания женщин и {countMan} мужчин.</h2>
                <GenderSection cityId={cityId} districtId={id} />
            </div>}
        </div>
    )
}

interface IProps {
    id?: number;
}