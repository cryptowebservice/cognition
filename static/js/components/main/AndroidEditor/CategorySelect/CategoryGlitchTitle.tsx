import { useEffect, useState } from 'react';
import { MathUtils } from 'three';

interface TitleProps {
    length: number;
}

const SYMBOLS = '&#*+%?£@§$1234567890'.split('');

const randomString = (length: number) => Array(length).fill('').map(() => SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]).join('');

export function CategoryGlitchTitle({ length }: TitleProps) {
    const [title, setTitle] = useState(randomString(length));
    const [animating, setAnimating] = useState(false);

    useEffect(() => {
        if (animating) {
            const t = setTimeout(() => {
                setAnimating(false);
            }, Math.floor(MathUtils.lerp(200, 800, Math.random())));
            const int = setInterval(() => {
                setTitle(randomString(length));
            }, 100);
            return () => {
                clearTimeout(t);
                clearInterval(int);
            };
        }
        const t = setTimeout(() => {
            setAnimating(true);
        }, Math.floor(MathUtils.lerp(1000, 3000, Math.random())));

        return () => {
            clearTimeout(t);
        };
    }, [animating]);

    return <u>{title}</u>;
}
