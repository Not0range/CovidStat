import $ from 'jquery';
import moment from 'moment';
import '../styles/MapSection.css';
import { useAppDispatch, useAppSelector } from '../../../store/store';
import { chartColors, periods, summaryColors } from '../../../Utils';
import CountrySection from './CountrySection';
import { useEffect, useState } from 'react';
import { Stats } from '../../../models/Stats';
import AreaDataChart from '../../../components/AreaDataChart';
import BarDataChart from '../../../components/BarDataChart';
import SegmentedButton from '../components/SegmentedButton';
import { setCountry } from '../../../store/mainSlice';

export default function MapSection() {
    const types = useAppSelector(state => state.main.types);
    const country = useAppSelector(state => state.main.selectedCountry);
    const summary = useAppSelector(state => state.main.summary);

    const [period, setPeriod] = useState(0);

    const [dataTime, setDataTime] = useState<Stats[]>([]);
    const [dataDistrict, setDataDistrict] = useState<Stats[]>([]);

    const [checked, setChecked] = useState(types.map(() => true));
    useEffect(() => {
        setChecked(types.map(() => true));
    }, [types]);

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

    const setType = (i: number) => {
        const temp = [...checked];
        temp[i] = !temp[i];
        setChecked(temp);
    }

    return (
        <div>
            <div className='map-section'>
                <Map />
                <div className='map-section-charts'>
                    {country === undefined && summary.length > 0 && <div className='map-section-main'>
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
                        <SegmentedButton values={types} checked={checked} setValue={setType} />
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

function Map() {
    const country = useAppSelector(state => state.main.selectedCountry);
    const dispatcher = useAppDispatch();

    useEffect(() => {
        const embed = $('#map-object').contents();

        embed.find('.selected').removeClass('selected');
        switch (country) {
            case 1:
                embed.find('#sRTiraspol').addClass('selected');
                break;
            case 2:
                embed.find('#RBendery').addClass('selected');
                break;
            case 3:
                embed.find('#RSlobodzia').addClass('selected');
                break;
            case 4:
                embed.find('#RGrioriopol').addClass('selected');
                break;
            case 5:
                embed.find('#RDubossary').addClass('selected');
                break;
            case 6:
                embed.find('#RRybnica').addClass('selected');
                break;
            case 7:
                embed.find('#RCamenca').addClass('selected');
                break;
        }
    }, [country]);

    const countryClick = (id: number | undefined, event: JQuery.ClickEvent) => {
        dispatcher(setCountry(id));
        event.stopPropagation();
    }

    const onLoad = () => {
        const embed = $('#map-object').contents();
        embed.find('svg').on('click', (event) => countryClick(undefined, event));

        embed.find('#Kamenka').on('click', (event) => countryClick(7, event));
        embed.find('#Bendery').on('click', (event) => countryClick(2, event));
        embed.find('#Rybnica').on('click', (event) => countryClick(6, event));
        embed.find('#Dubossary').on('click', (event) => countryClick(5, event));
        embed.find('#Grioriopol').on('click', (event) => countryClick(4, event));
        embed.find('#Slobodzia').on('click', (event) => countryClick(3, event));
        embed.find('#Tiraspol').on('click', (event) => countryClick(1, event));
    }

    return (
        <div className='map-section-map'>
            <object id='map-object' type='image/svg+xml' data='map.svg' onLoad={onLoad} />
        </div>
    );
}