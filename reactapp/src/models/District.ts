export interface District {
    id: number;
    title: string;
}

export interface City {
    id: number;
    districtId: number;
    title: string;
}

export interface FullDistrict extends District {
    cities: City[];
}