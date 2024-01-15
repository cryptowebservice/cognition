import { useEffect, useRef, useState } from 'react';

import './GlitchText.scss';

interface GlitchProps {
    from: string,
    to: string,
    delta: number
}

interface SizeDimension {
    width: number,
    height: number,
}

const GLITCH_SYMBOLS = 'abcdefghijklmnopqrstuvwxyz1234567890'.split('');
const randomGlitch = (length: number) => {
    let out = '';
    for (let i = 0; i < length; i++) {
        out += GLITCH_SYMBOLS[Math.floor(Math.random() * GLITCH_SYMBOLS.length)];
    }
    return out;
};

export function GlitchText({ from, to, delta }: GlitchProps) {
    const leftRef = useRef<HTMLDivElement>(null);
    const rightRef = useRef<HTMLDivElement>(null);
    const [leftDim, setLeftDim] = useState<SizeDimension>({
        width: 0,
        height: 0,
    });
    const [rightDim, setRightDim] = useState<SizeDimension>({
        width: 0,
        height: 0,
    });
    useEffect(() => {
        if (leftRef.current) {
            setLeftDim({
                width: leftRef.current.clientWidth,
                height: leftRef.current.clientHeight,
            });
        }
        if (rightRef.current) {
            setRightDim({
                width: rightRef.current.clientWidth,
                height: rightRef.current.clientHeight,
            });
        }
    }, [leftRef, rightRef, from, to]);

    let left = '';
    let inner = '';
    let dimDelta = 1;
    if (delta > 0.66) {
        const len = Math.ceil((delta - 0.66) / 0.33 * to.length);
        left = to.substring(0, len);
        inner = randomGlitch(to.length - len);
    } else if (delta > 0.33) {
        dimDelta = (delta - 0.33) / 0.33;
        const len = Math.ceil(dimDelta * (to.length - from.length)) + from.length;
        left = '';
        inner = randomGlitch(len);
        dimDelta = dimDelta < 0.5 ? 4 * (dimDelta ** 3) : 1 - (-2 * dimDelta + 2) ** 3 / 2;
    } else {
        const len = Math.ceil(delta / 0.33 * from.length);
        inner = randomGlitch(len);
        left = from.substring(0, from.length - len);
        dimDelta = 0;
    }

    // Считаем ширину контейнера
    const wrapStyle = {
        width: `${Math.floor(leftDim.width + (rightDim.width - leftDim.width) * dimDelta)}px`,
        height: `${Math.floor(leftDim.height + (rightDim.height - leftDim.height) * dimDelta)}px`,
    };

    return (
        <div className="glitch-text" style={wrapStyle}>
            <div className="glitch-text__proto" ref={leftRef}>{from}</div>
            <div className="glitch-text__proto" ref={rightRef}>{to}</div>
            <div className="glitch-text__container">
                {left}
                {inner.length > 0 && <span>{inner}</span>}
            </div>
        </div>
    );
}
