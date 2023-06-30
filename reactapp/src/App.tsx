import $ from 'jquery';
import { Outlet } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { setDistricts, setTypes, useAppDispatch } from "./store";
import { useEffect } from "react";
import { City, District } from './models/District';

export default function App() {
    const dispatcher = useAppDispatch();

    useEffect(() => {
        $.ajax('api/data/causeTypes', {
            success: (types: any[]) => {
                dispatcher(setTypes(types.map(t => t.title)));
            }
        });
    })

    useEffect(() => {
        $.ajax('api/data/districts', {
            success: (districts: District[]) => {
                $.ajax('api/data/cities', {
                    success: (cities: City[]) => {
                        const d = districts.map(t => ({
                            id: t.id,
                            title: t.title,
                            cities: cities.filter(t2 => t2.districtId == t.id)
                        }));
                        dispatcher(setDistricts(d));
                    }
                });
            }
        });
    }, []);

    return (
        <div>
            <Header />
            <Outlet />
            <Footer />
        </div>);
}