import $ from 'jquery';
import '../styles/MapSection.css';
import { setCountry, useAppDispatch, useAppSelector } from '../../../store';
import { summaryColors } from '../../../Utils';
import CountrySection from './CountrySection';

export default function MapSection() {
    const country = useAppSelector(state => state.main.selectedCountry);
    const summary = useAppSelector(state => state.main.summary);
    const dispatcher = useAppDispatch();

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

    return (
        <div>
            <div className='map-section-summary'>
                {country === undefined && summary.length > 0 && <h3>
                    {'С начала пандемии на территории Приднестровья было '}
                    <span style={{ color: summaryColors[0] }}>выявлено {summary[0].value}</span> {'случаев заболевания, '}
                    <span style={{ color: summaryColors[1] }}>выздоровело {summary[1].value}</span> {'человек, '}
                    <span style={{ color: summaryColors[2] }}>умерло {summary[2].value}</span> {'человек, '}
                    <span style={{ color: summaryColors[3] }}>вакцинировалось {summary[3].value}</span> человек.
                </h3>}
            </div>
            <div className='map-section'>
                <div className='map-section-map'>
                    <object id='map-object' type='image/svg+xml' data='map.svg' onLoad={onLoad} />
                </div>
                <div className='map-section-charts'>
                    {country === undefined && <div className='map-section-main'>

                    </div>}
                    {country !== undefined && <div className='map-section-modal'>
                        <CountrySection id={country} />
                    </div>}
                </div>
            </div>
        </div>
    );
}