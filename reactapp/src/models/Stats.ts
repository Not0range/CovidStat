export interface Stats {
    key: string;
    values: KeyValuePair[];
}

interface KeyValuePair {
    key: string;
    value: number;
}