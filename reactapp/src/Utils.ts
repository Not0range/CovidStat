export const chartColors = [
    '#8884d8',
    '#82ca9d',
    '#ff7300',
    '#a4de6c',
    '#f23805',
    '#f205ea'
]

export const summaryColors = [
    'rgb(15, 44, 139)',
    'rgb(32, 75, 69)',
    'rgb(133, 43, 28)',
    'rgb(180, 158, 34)'
]

export const periods: Period[] = [
    {
        title: 'Неделя',
        days: 7
    },
    {
        title: 'Месяц',
        days: 30
    },
    {
        title: '3 месяца',
        days: 90
    },
    {
        title: '6 месяцев',
        days: 180
    },
    {
        title: 'Год',
        days: 365
    }
]

interface Period {
    title: string;
    days: number;
}