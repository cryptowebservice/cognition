import clsx from 'clsx';
import { useStore } from 'effector-react';
import { useEffect, useState } from 'react';
import configs from '../../../configs/AndroidConfigs';
import { SoundManager, SoundType } from '../../../sounds/SoundManager';
import { currentAndroidStore } from '../../../store/android';
import { GlitchText } from '../GlitchText/GlitchText';
import './AndroidLoading.scss';

interface LoadingProps {
    active: boolean;
}

export function AndroidLoading({ active }: LoadingProps) {
    const androidIndex = useStore(currentAndroidStore);
    const [time, setTime] = useState(0);
    const [visible, setVisible] = useState(false);
    const [timerActive, setTimerActive] = useState(false);
    const [loadingMode, setLoadingMode] = useState(false);
    const [firstShow, setFirstShow] = useState(true);

    useEffect(() => {
        const tm = setTimeout(() => {
            setVisible(active);
        }, 10);

        return () => {
            clearTimeout(tm);
        };
    }, [active]);

    useEffect(() => {
        if (visible) {
            setTimerActive(true);
        } else if (time === 1) {
            setTimerActive(false);
        }
    }, [visible, time]);

    useEffect(() => {
        if (timerActive) {
            setFirstShow(true);
            setLoadingMode(false);
            setTime(0.33);
            SoundManager.play(SoundType.Text);
            let needSound = true;

            // Странный баг - таймаут дергает функцию дважды
            let prevTime = performance.now();
            const toggleMode = () => {
                const t = performance.now();
                if (t - prevTime < 500) return;
                prevTime = t;

                setLoadingMode((prevLoad) => !prevLoad);
                setFirstShow(false);
                setTime(0);
                if (needSound) {
                    SoundManager.play(SoundType.TextLarge);
                }
            };

            let currentTimeout: ReturnType<typeof setTimeout> | null = null;
            const textInterval = setInterval(() => {
                setTime((prev) => {
                    let val = prev;
                    if (val < 1) {
                        val = Math.min(val + 0.005, 1.0);
                        if (val === 1) {
                            setTimerActive((prevTimer) => {
                                if (prevTimer) {
                                    currentTimeout = setTimeout(() => {
                                        toggleMode();
                                    }, 1500);
                                } else {
                                    currentTimeout = null;
                                }
                                return prevTimer;
                            });
                        }
                    }
                    return val;
                });
            }, 10);

            return () => {
                if (currentTimeout) {
                    clearTimeout(currentTimeout);
                    currentTimeout = null;
                    needSound = false;
                }
                clearInterval(textInterval);
            };
        }
    }, [timerActive]);

    const textDelta = time < 0.5 ? 4 * time ** 3 : 1 - (-2 * time + 2) ** 3 / 2;
    const robotName = androidIndex > -1 ? configs[androidIndex].name : '';

    // eslint-disable-next-line no-nested-ternary
    const firstText = firstShow ? 'n' : (loadingMode ? robotName : 'Loading');
    const secondText = loadingMode ? 'Loading' : robotName;

    return (
        <div id="android-loading" className={clsx((timerActive) && 'active')}>
            <div className="wrap">
                {androidIndex > -1 && configs[androidIndex].icon}
            </div>
            <div className="wrap">
                <div className="title">
                    <GlitchText from={firstText} to={secondText} delta={textDelta} />
                </div>
            </div>
        </div>
    );
}
