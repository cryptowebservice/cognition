import clsx from 'clsx';
import { useStore } from 'effector-react';
import { useEffect, useRef, useState } from 'react';
import { CURRENT_ACCENT } from '../../../graphics/helpers/LandingTheme';
import { loadingStore, loadingTotalStore, setLoadingComplete } from '../../../store/loading';
import { setSoundEnabled } from '../../../store/page';
import { Button } from '../../shared/Button/Button';
import { SoundBars } from '../../shared/SoundBars/SoundBars';
import { GlitchText } from './GlitchText';
import './Preloader.scss';

const LINES = [
    'Art is not created only by human.',
    'Art is created only for human.',
    'Art is limited.',
    'Art cannot be controlled, it is unpredictable.',
    'Art should be accessible.',
    'Art should be decentralized.',
    'Art should be distributed freely.',
];

export function Preloader() {
    const [currentLine, setCurrentLine] = useState(Math.floor(Math.random() * LINES.length));
    const [soundSelected, setSoundSelected] = useState(false);
    const [soundBarsActive, setSoundBarsActive] = useState(true);
    const timerRef = useRef<ReturnType<typeof setInterval>>();
    const total = useStore(loadingTotalStore);
    const current = useStore(loadingStore);

    // Обновление линий
    useEffect(() => () => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }
    }, []);

    const onReady = () => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }
        timerRef.current = setTimeout(() => {
            setCurrentLine((prev) => (prev + 1) % LINES.length);
        }, 2000);
    };

    const onSoundSelect = (enable: boolean) => {
        setSoundSelected(true);
        setSoundEnabled(enable);
        setLoadingComplete(true);
    };

    useEffect(() => {
        if (process.env.REACT_APP_DISABLE_LOADING && (total === 0 || total > current)) {
            onSoundSelect(false);
        }
    }, [total, current]);

    const strokeValue = total > 0 ? current / total : 0;
    const strokeLength = 18 * 2 * Math.PI;
    const loaderActive = total === 0 || total > current;

    return (
        <div id='preloader' className={clsx(soundSelected && 'hidden')}>
            <div className={clsx('text', !loaderActive && 'sound')}>
                <GlitchText text={LINES[currentLine]} active={total !== current} onReady={onReady} />
                <div className="sound-message">
                    <div className="sound-message__wrap">
                        <div className="equalizer-wrap">
                            <SoundBars enabled={soundBarsActive} />
                        </div>

                        For a better experience we recommend
                        <br />
                        using headphones

                        <div className="button-wrap">
                            <Button onClick={() => onSoundSelect(true)}>JOIN THE FUTURE</Button>
                        </div>
                    </div>
                </div>
            </div>
            <div className={clsx('ring', !loaderActive && 'hidden')}>
                <div className="wrapper">
                    <svg className="inner" width="38" height="38" viewBox="0 0 38 38" fill="none">
                        <g>
                            <circle cx="19" cy="19" r="18" stroke="#555565" strokeDasharray="4 4" />
                        </g>
                        <g>
                            <circle cx="19" cy="19" r="18" stroke={CURRENT_ACCENT()} strokeWidth="2" strokeDasharray={`${strokeLength * strokeValue} ${strokeLength}`} />
                        </g>
                    </svg>
                    <svg className="outer" width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M30.3366 7.50094C28.8302 7.60036 27.2387 7.8322 25.3394 8.19646L25.3318 8.19791L23.6513 10.3047C14.9063 13.672 8.69889 22.1739 8.69889 32.1298C8.69889 33.3722 8.79555 34.592 8.98175 35.7819L8 38.3021L8.00252 38.3094C8.63767 40.1412 9.2332 41.6394 9.90056 42.9975M33.6655 7.5C35.1741 7.59889 36.7648 7.83104 38.6627 8.19646L38.6702 8.19791L40.3508 10.3047C49.0958 13.672 55.3032 22.1739 55.3032 32.1298C55.3032 33.3735 55.2063 34.5946 55.0198 35.7858L56 38.3021L55.9975 38.3094C55.3623 40.1412 54.7668 41.6394 54.0994 42.9975M11.5642 45.8893C12.4039 47.1502 13.3997 48.4157 14.6642 49.8814L14.6692 49.8872L17.3393 50.2951C21.3435 53.55 26.4452 55.5 32.0011 55.5C37.5571 55.5 42.659 53.5498 46.6633 50.2947L49.3308 49.8872L49.3358 49.8814C50.6003 48.4157 51.5961 47.1502 52.4358 45.8893" stroke="#555565" />
                    </svg>
                </div>
            </div>
            <div className={clsx('no-sound', loaderActive && 'hidden')}>
                <div className="wrapper">
                    <button
                        type='button'
                        onClick={() => onSoundSelect(false)}
                        onMouseEnter={() => setSoundBarsActive(false)}
                        onMouseLeave={() => setSoundBarsActive(true)}
                    >
                        Proceed without sound
                    </button>
                </div>
            </div>
        </div>
    );
}
