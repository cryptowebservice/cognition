import { useEffect, useState } from 'react';
import './Preloader.scss';

interface Props {
    text: string,
    active: boolean,
    onReady: () => void,
}

const GLITCH_SYMBOLS = '&#*+%?£@§$'.split('');
const randomGlitch = (length: number) => {
    let out = '';
    for (let i = 0; i < length; i++) {
        out += GLITCH_SYMBOLS[Math.floor(Math.random() * GLITCH_SYMBOLS.length)];
    }
    return out;
};

export function GlitchText(props: Props) {
    const [frame, setFrame] = useState(0);
    const { text, active, onReady } = props;

    // Анимация
    useEffect(() => {
        if (active) {
            setFrame(0);
            const handler = setInterval(() => {
                setFrame((prev) => {
                    if (prev < text.length * 2) {
                        return prev + 1;
                    }
                    onReady();
                    clearInterval(handler);
                    return prev;
                });
            }, 25);
            return () => {
                clearInterval(handler);
            };
        }
        setFrame(text.length * 2);
    }, [text, active]);

    // Рендеринг текста
    const f = Math.floor((1.0 - (1.0 - frame / text.length / 2) ** 2) * text.length * 2);
    let
        left = null,
        right = null;

    if (f < text.length * 2) {
        if (f <= text.length) {
            left = <i>{randomGlitch(f)}</i>;
        } else {
            const pos = f - text.length;
            left = text.substring(0, pos);
            right = <i>{randomGlitch(text.length - pos)}</i>;
        }
    } else {
        left = text;
    }
    return (
        <div className="glitch">
            <div className="glitch__visual">
                {left}
                {right}
            </div>
            <div className="glitch__hidden">
                {text}
            </div>
        </div>
    );
}
