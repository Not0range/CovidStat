import { useEffect, useState } from 'react';
import $ from 'jquery';
import '../styles/ComboTextbox.css'

export default function ComboTextbox({ options, setOption }: IProps) {
    const [text, setText] = useState('');
    const [visible, setVisible] = useState(false);
    const [index, setIndex] = useState<number | undefined>(undefined);

    const filter = options.filter(t => t.toLowerCase().startsWith(text.toLowerCase())).slice(0, 4);

    const keyEvent = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter') {
            e.preventDefault();
            if (e.key == 'ArrowDown') {
                if (index === undefined && filter.length > 0) setIndex(0);
                else if (index !== undefined && index < filter.length) setIndex(index + 1);
            } else if (e.key == 'ArrowUp') {
                if (index === undefined && filter.length > 0) setIndex(filter.length - 1);
                else if (index !== undefined && index > 0) setIndex(index - 1);
            } else {
                if (index === undefined) return;
                setText(filter[index]);
            }
        }
    }

    const onBlur = () => {
        setTimeout(() => {
            setVisible(false);
            setIndex(undefined);
        }, 200);
    }

    useEffect(() => {
        setOption(text);
    }, [text]);

    return (
        <div className='combotextbox-container'>
            <div className='combotextbox-input-container'>
                <i className='bx bx-search' onClick={e => $(e.currentTarget).next().trigger('focus')} />
                <input
                    className='combotextbox-input'
                    type="text"
                    value={text}
                    onChange={e => setText(e.target.value)}
                    onFocus={() => setVisible(true)}
                    onBlur={onBlur}
                    onKeyDown={keyEvent}
                />
                <i className='bx bx-x' onClick={() => setText('')} />
            </div>
            {visible && filter.length > 0 && <div className='combotextbox-dropdown'>
                {filter.map((t, i) =>
                    <h5
                        className={i == index ? 'combotextbox-dropdown-selected' : ''}
                        key={`option-${i}`}
                        onClick={() => setText(t)}
                    >
                        {t}
                    </h5>)}
            </div>}
        </div>
    )
}

interface IProps {
    options: string[];
    setOption: (title: string) => void;
}