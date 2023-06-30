import { useEffect, useState } from "react";
import $ from 'jquery';
import moment from 'moment';
import { Stats } from "../../../models/Stats";
import { chartColors, periods, summaryColors } from "../../../Utils";
import AreaDataChart from "../../../components/AreaDataChart";
import { useAppDispatch, useAppSelector } from "../../../store/store";
import '../styles/CountrySection.css';
import { Summary } from "../../../models/Summary";
import GenderSection from "./GenderSection";
import HBarDataChart from "../../../components/HBarDataChart";
import ComboTextbox from "../components/ComboTextbox";
import SegmentedButton from "../components/SegmentedButton";
import { setCountry } from "../../../store/mainSlice";

export default function CountrySection({ id }: IProps) {
    const types = useAppSelector(state => state.main.types);
    const district = useAppSelector(state => state.main.districts.find(t => t.id == id));
    const dispatcher = useAppDispatch();

    const [countMan, setCountMan] = useState(0);
    const [countWoman, setCountWoman] = useState(0);

    const [text, setText] = useState('');
    const [cityId, setCityId] = useState<number | undefined>(undefined);

    const [data, setData] = useState<Stats[]>([]);
    const [cityData, setCityData] = useState<Stats[]>([]);

    const [checked, setChecked] = useState(types.map(() => true));
    useEffect(() => {
        setChecked(types.map(() => true));
    }, types);

    const [summary, setSummary] = useState<Summary[]>([]);
    const [summaryPeriod, setSummaryPeriod] = useState<Summary[]>([]);

    const [citySummary, setCitySummary] = useState<Summary[]>([]);
    const [citySummaryPeriod, setCitySummaryPeriod] = useState<Summary[]>([]);

    const [period, setPeriod] = useState(0);
    const [cityPeriod, setCityPeriod] = useState(0);

    const city = district?.cities.find(t => t.id == cityId);
    const summaryValues = [
        summary.filter(t => t.title == types[0]).map(t => t.value).reduce((p, c) => p + c, 0),
        summary.filter(t => t.title == types[1]).map(t => t.value).reduce((p, c) => p + c, 0),
        summary.filter(t => t.title == types[2]).map(t => t.value).reduce((p, c) => p + c, 0),
        summary.filter(t => t.title == types[3]).map(t => t.value).reduce((p, c) => p + c, 0)
    ];
    const citySummaryValues = [
        citySummary.filter(t => t.title == types[0]).map(t => t.value).reduce((p, c) => p + c, 0),
        citySummary.filter(t => t.title == types[1]).map(t => t.value).reduce((p, c) => p + c, 0),
        citySummary.filter(t => t.title == types[2]).map(t => t.value).reduce((p, c) => p + c, 0),
        citySummary.filter(t => t.title == types[3]).map(t => t.value).reduce((p, c) => p + c, 0)
    ];

    const vaccineValues = summaryPeriod.filter(t => t.title == types[3]).map(t => ({
        key: t.details,
        value: t.value
    }));
    const cityVaccineValues = citySummaryPeriod.filter(t => t.title == types[3]).map(t => ({
        key: t.details,
        value: t.value
    }));

    useEffect(() => {
        const r = district?.cities.find(t => t.title.toLowerCase() === text.toLowerCase());
        if (r) {
            const b = moment().subtract(periods[cityPeriod].days + 1, 'days').format();
            const e = moment().format();

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
            $.ajax('api/data/summary/1', {
                method: 'POST',
                data: JSON.stringify({
                    cityId: id,
                    beginDate: b,
                    endDate: e
                }),
                contentType: 'application/json',
                processData: false,
                success: result => {
                    setCitySummaryPeriod(result.causes);
                }
            });
            $.ajax('api/data/query/1', {
                method: 'POST',
                data: JSON.stringify({
                    xAxis: 0,
                    cityId: id,
                    beginDate: b,
                    endDate: e
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
    }, [text, cityPeriod]);

    useEffect(() => {
        if (id === undefined) return;

        const b = moment().subtract(periods[period].days + 1, 'days').format();
        const e = moment().format();

        $.ajax('api/data/summary/1', {
            method: 'POST',
            data: JSON.stringify({
                districtId: id,
                beginDate: b,
                endDate: e
            }),
            contentType: 'application/json',
            processData: false,
            success: result => {
                setSummaryPeriod(result.causes);
            }
        });
        $.ajax('api/data/query/1', {
            method: 'POST',
            data: JSON.stringify({
                xAxis: 0,
                districtId: id,
                beginDate: b,
                endDate: e
            }),
            contentType: 'application/json',
            processData: false,
            success: result => {
                setData(result.causes);
                if (result.causes.length == 0) return;
            }
        });
    }, [id, period]);

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
                if (result.causes.length > 0)
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
                if (result.causes.length > 0)
                    setCountWoman((result.causes as Summary[])[0].value);
            }
        });
    }, [cityId, id]);

    useEffect(() => {
        setCityPeriod(0);
    }, [cityId]);

    const setType = (i: number) => {
        const temp = [...checked];
        temp[i] = !temp[i];
        setChecked(temp);
    }

    return (
        <div>
            <i className='close-icon-button bx bx-x bx-lg' onClick={() => dispatcher(setCountry(undefined))} />
            {id !== undefined && data.length > 0 && <div className='country-section-container'>
                <h3>{district?.title ?? ''}</h3>
                {(district?.cities?.length ?? 0) > 1 &&
                    <ComboTextbox options={district?.cities?.map(t => t.title) ?? []} setOption={setText} />}
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
                <div className='country-section-perion'>
                    <h4>Оперативные данные за период: </h4>
                    <select
                        value={city === undefined ? period : cityPeriod}
                        onChange={e => city === undefined ? setPeriod(+e.target.value) : setCityPeriod(+e.target.value)}
                    >
                        {periods.map((t, i) => <option key={`opt-${i}`} value={i}>{t.title}</option>)}
                    </select>
                </div>
                <div className='country-section-charts'>
                    <div>
                        <SegmentedButton values={types} checked={checked} setValue={setType} />
                        <AreaDataChart
                            data={city === undefined ? data : cityData}
                            types={types.filter((t, i) => checked[i])}
                            colors={chartColors}
                        />
                    </div>
                    <div>
                        <HBarDataChart
                            data={city === undefined ? vaccineValues : cityVaccineValues}
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