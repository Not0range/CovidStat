import { useEffect, useState } from "react";
import $ from 'jquery';
import SummaryHeader from "./components/SummaryHeader";
import './styles/MainRoute.css';
import { Summary } from "../../models/Summary";
import GenderSection from "./sections/GenderSection";
import MapSection from "./sections/MapSection";
import TableSection from "./sections/TableSection";

export default function MainRoute() {
    const [countMan, setCountMan] = useState(0);
    const [countWoman, setCountWoman] = useState(0);
    
    useEffect(() => {
        $.ajax('api/data/summary/1', {
            method: 'POST',
            data: JSON.stringify({
                "gender": false
            }),
            contentType: 'application/json',
            processData: false,
            success: result => {
                setCountMan((result.causes as Summary[])[0].value);
            }
        });
    }, []);

    useEffect(() => {
        $.ajax('api/data/summary/1', {
            method: 'POST',
            data: JSON.stringify({
                "gender": true
            }),
            contentType: 'application/json',
            processData: false,
            success: result => {
                setCountWoman((result.causes as Summary[])[0].value);
            }
        });
    }, []);

    return (
        <div className='main-route-body'>
            <SummaryHeader />
            <h2>Ситуация COVID-19 по региону</h2>
            <MapSection />
            <h2>С начала пандемии было выявлено {countWoman} случаев заболевания женщин и {countMan} мужчин.</h2>
            <GenderSection />
            <TableSection />
        </div>
    )
}