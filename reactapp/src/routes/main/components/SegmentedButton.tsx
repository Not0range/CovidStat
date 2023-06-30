import '../styles/SegmentedButton.css';

export default function SegmentedButton({ values, checked, setValue }: IProps) {
    return (
        <div className='segmented-button'>
            {values.map((t, i) =>
                <div
                    className={checked.length > 0 && checked[i] ? 'segmented-button-selected' : ''}
                    key={`type${i}`}
                    onClick={() => setValue(i)}
                >
                    {t}
                </div>)}
        </div>
    )
}

interface IProps {
    values: string[];
    checked: boolean[];
    setValue: (value: number) => void;
}