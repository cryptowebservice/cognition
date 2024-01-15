import { useEffect, useState } from 'react';
import './SoundBars.scss';

interface BarsProps {
    enabled: boolean,
}

const BARS_COUNT = 12;

export function SoundBars({ enabled }: BarsProps) {
    const [barStatus, setBarStatus] = useState<number[]>(Array(BARS_COUNT).fill(0));

    // Эффект для высчитывания блоков
    useEffect(() => {
        if (!enabled) {
            setBarStatus(Array(BARS_COUNT).fill(0));
        } else {
            let timeout: ReturnType<typeof setTimeout> | null = null;
            const handler = () => {
                setBarStatus([...barStatus].map(() => (Math.random() < 0.3 ? 0 : Math.random())));
                timeout = setTimeout(handler, 50 + 120 * Math.random());
            };
            handler();
            return () => {
                if (timeout) {
                    clearTimeout(timeout);
                }
            };
        }
    }, [enabled]);

    // Рендер
    const fakeArray = Array(BARS_COUNT).fill(0);
    return (
        <div className="sound-bars">
            <div className="sound-bars__wrap">
                {
                    fakeArray.map((_, idx) => (
                        <i
                            style={{
                                height: `${barStatus[idx] * 100}%`,
                            }}
                            key={idx}
                        />
                    ))
                }
            </div>
        </div>
    );
}
