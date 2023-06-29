import $ from 'jquery';
import moment from 'moment';
import '../styles/MapSection.css';
import { setCountry, useAppDispatch, useAppSelector } from '../../../store';
import { chartColors, periods, summaryColors } from '../../../Utils';
import CountrySection from './CountrySection';
import { useEffect, useState } from 'react';
import { Stats } from '../../../models/Stats';
import AreaDataChart from '../../../components/AreaDataChart';
import BarDataChart from '../../../components/BarDataChart';

export default function MapSection() {
    const country = useAppSelector(state => state.main.selectedCountry);
    const summary = useAppSelector(state => state.main.summary);
    const dispatcher = useAppDispatch();

    const [period, setPeriod] = useState(0);

    const [dataTime, setDataTime] = useState<Stats[]>([]);
    const [dataDistrict, setDataDistrict] = useState<Stats[]>([]);

    const [types, setTypes] = useState<string[]>([]);
    const [checked, setChecked] = useState<boolean[]>([]);

    useEffect(() => {
        const b = moment().subtract(periods[period].days + 1, 'days').format();
        const e = moment().format();

        $.ajax('api/data/query/1', {
            method: 'POST',
            data: JSON.stringify({
                xAxis: 0,
                beginDate: b,
                endDate: e
            }),
            contentType: 'application/json',
            processData: false,
            success: result => {
                setDataTime(result.causes);
                const t = (result.causes[0].values as any[]).map(t => t.key);
                setTypes(t);
                setChecked(t.map(() => true));
            }
        });

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
                setDataDistrict(result.causes);
            }
        });
    }, [period]);

    const countryClick = (id: number | undefined, event: JQuery.ClickEvent) => {
        dispatcher(setCountry(id));
        event.stopPropagation();
    }

    const onLoad = () => {
        const embed = $('#map-object').contents();
        embed.find('svg').on('click', (event) => countryClick(undefined, event));

        embed.find('#Kamenka').on('click', (event) => countryClick(0, event));
        embed.find('#Bendery').on('click', (event) => countryClick(2, event));
        embed.find('#Rybnica').on('click', (event) => countryClick(0, event));
        embed.find('#Dubossary').on('click', (event) => countryClick(0, event));
        embed.find('#Grioriopol').on('click', (event) => countryClick(0, event));
        embed.find('#Slobodzia').on('click', (event) => countryClick(3, event));
        embed.find('#Tiraspol').on('click', (event) => countryClick(1, event));
    }

    const setType = (i: number) => {
        const temp = [...checked];
        temp[i] = !temp[i];
        setChecked(temp);
    }

    return (
        <div>
            <div className='map-section'>
                <div className='map-section-map'>
                    <object id='map-object' type='image/svg+xml' data='map.svg' onLoad={onLoad} />
                </div>
                <div className='map-section-charts'>

                    {country === undefined && <div className='map-section-main'>
                        <h3>
                            {'С начала пандемии на территории Приднестровья было '}
                            <span style={{ color: summaryColors[0] }}>выявлено {summary[0].value}</span> {'случаев заболевания, '}
                            <span style={{ color: summaryColors[1] }}>выздоровело {summary[1].value}</span> {'человек, '}
                            <span style={{ color: summaryColors[2] }}>умерло {summary[2].value}</span> {'человек, '}
                            <span style={{ color: summaryColors[3] }}>вакцинировалось {summary[3].value}</span> человек.
                        </h3>
                        <div className='map-section-perion'>
                            <h4>Оперативные данные за период: </h4>
                            <select
                                value={period}
                                onChange={e => setPeriod(+e.target.value)}
                            >
                                {periods.map((t, i) => <option key={`opt-${i}`} value={i}>{t.title}</option>)}
                            </select>
                        </div>
                        <div className='map-segmented-button'>
                            {types.map((t, i) =>
                                <div
                                    className={checked.length > 0 && checked[i] ? 'map-segmented-button-selected' : ''}
                                    key={`type${i}`}
                                    onClick={() => setType(i)}
                                >
                                    {t}
                                </div>)}
                        </div>
                        <AreaDataChart
                            data={dataTime}
                            types={types.filter((t, i) => checked[i])}
                            colors={chartColors}
                        />
                        <BarDataChart
                            data={dataDistrict}
                            types={types.filter((t, i) => checked[i])}
                            colors={chartColors}
                        />
                    </div>}
                    {country !== undefined && <div className='map-section-modal'>
                        <CountrySection id={country} />
                    </div>}
                </div>
            </div>
        </div>
    );
}