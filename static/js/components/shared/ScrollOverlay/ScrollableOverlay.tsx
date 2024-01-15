import clsx from 'clsx';
import {
    ReactNode, useEffect, useRef, useState,
} from 'react';
import AnnaBG from '../../../assets/images/androidPopUp/anna.webp';
import FaraonBG from '../../../assets/images/androidPopUp/faraon.webp';
import KiraBG from '../../../assets/images/androidPopUp/kira.webp';
import NicoleBG from '../../../assets/images/androidPopUp/nicole.webp';
import SarahBG from '../../../assets/images/androidPopUp/sarah.webp';

import { PopupOverlay } from '../../../enums/PopupOverlay';
import { CURRENT_ACCENT, CURRENT_THEME } from '../../../graphics/helpers/LandingTheme';
import { setCurrentOverlay } from '../../../store/page';
import './ScrollOverlay.scss';

const BACKGROUNDS = [
    NicoleBG,
    FaraonBG,
    AnnaBG,
    SarahBG,
    KiraBG,
];

interface ScrollProps {
    children: ReactNode,
    active: boolean,
    isAndroid?: boolean,
}

export function ScrollableOverlay(props: ScrollProps) {
    const {
        children, active,
    } = props;
    const wrapperRef = useRef<HTMLDivElement>(null);
    const [canScrollUp, setCanScrollUp] = useState(false);
    const [canScrollDown, setCanScrollDown] = useState(false);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        if (!active || !wrapperRef.current) {
            return;
        }

        const wrapperHeight = wrapperRef.current.clientHeight;
        const wrapper = wrapperRef.current;
        wrapper.scrollTo(0, 0);

        const handler = () => {
            const total = wrapper.scrollHeight - wrapperHeight;
            if (total > 0) {
                const pr = wrapper.scrollTop / total;
                setCanScrollUp(pr > 0);
                setCanScrollDown(pr < 1);
                setProgress(pr);
            } else {
                setCanScrollUp(false);
                setCanScrollDown(false);
            }
        };
        handler();
        wrapper.addEventListener('scroll', handler);
        return () => {
            wrapper.removeEventListener('scroll', handler);
        };
    }, [active, wrapperRef]);

    const barStyle = {
        width: `${progress * 120.0}%`,
    };

    // console.debug(CURRENT_THEME());
    const backdrop = BACKGROUNDS[CURRENT_THEME()];
    // console.debug(backdrop);

    return (

        <div className={clsx('scroll-overlay', active && 'active')}>
            {
                // eslint-disable-next-line react/destructuring-assignment
                backdrop && props.isAndroid && (
                    <img
                        className="bg"
                        src={backdrop}
                        alt="bg"
                        style={{
                            opacity: `${progress}`,
                            backgroundImage: `url(${backdrop})`,
                        }}
                    />
                )
            }

            <div
                className={clsx('scroll-overlay__upper', canScrollUp && 'scrollable-up', canScrollDown && 'scrollable-down')}
            >
                <div ref={wrapperRef} className="scroll-overlay__wrap">
                    <div className="scroll-overlay__content">
                        {children}
                    </div>
                </div>
            </div>
            {(canScrollDown || canScrollUp) && (
                <div className="scroll-overlay__progress">
                    <em style={barStyle} />
                </div>
            )}
            <div className="scroll-overlay__close" onClick={() => setCurrentOverlay(PopupOverlay.None)}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle
                        cx="10"
                        cy="10"
                        r="2"
                        fill="white"
                    />
                    <path
                        d="M1.5 1.5L5.5 5.5M18.5 18.5L14.5 14.5M18.5 1.5L14.5 5.5M1.5 18.5L5.5 14.5"
                        stroke={CURRENT_ACCENT()}
                        strokeWidth="2"
                        strokeLinecap="round"
                    />
                </svg>
            </div>
        </div>
    );
}
