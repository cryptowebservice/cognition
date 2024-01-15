import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';

import lockedVideo from '../../../assets/images/android_list/locked.mp4';
import configs from '../../../configs/AndroidConfigs';
import { ACCENT_COLORS, handleThemeChange } from '../../../graphics/helpers/LandingTheme';
import { SoundManager, SoundType } from '../../../sounds/SoundManager';
import { setAndroidScreenActive, setCurrentAndroid } from '../../../store/android';
import { setAndroidLoading } from '../../../store/loading';
import { OutlineDots } from '../../shared/OutlineDots/OutlineDots';

interface ButtonProps {
    android: number,
    condense: boolean,
    extend: boolean,
    transform: string,
    onHoverEnter: () => void,
    disabled?: boolean
}

export function AndroidButton(props: ButtonProps) {
    const {
        android,
        condense,
        extend,
        transform,
        disabled,
        onHoverEnter,
    } = props;
    const [outlineActive, setOutlineActive] = useState(false);
    const lockedVideoEl = useRef<HTMLVideoElement>(null);
    const config = configs[android];

    const video = lockedVideoEl.current;

    const onLockedMouseEnter = () => {
        setOutlineActive(true);
        video?.play();
    };
    const onLockedMouseLeave = () => {
        video?.pause();
        setOutlineActive(false);
    };

    const onMouseEnter = () => {
        setOutlineActive(true);
    };
    const onMouseLeave = () => {
        setOutlineActive(false);
    };
    const handleClick = () => {
        SoundManager.play(SoundType.Button);
        setCurrentAndroid(android);
        handleThemeChange(android);
        setAndroidLoading(true);
        setTimeout(() => {
            setAndroidScreenActive(true);
        }, 4000);
    };

    useEffect(() => {
        if (outlineActive) {
            onHoverEnter();
        }
    }, [outlineActive]);

    return (
        <button
            type="button"
            className={clsx('item', condense && 'condensed', extend && 'wide')}
            onMouseEnter={!disabled ? onMouseEnter : undefined}
            onMouseLeave={!disabled ? onMouseLeave : undefined}
            onClick={!disabled ? handleClick : undefined}
            style={{ transform }}
        >
            {disabled
                ? (
                    // eslint-disable-next-line jsx-a11y/media-has-caption
                    <video
                        src={lockedVideo}
                        ref={lockedVideoEl}
                        onMouseEnter={onLockedMouseEnter}
                        onMouseLeave={onLockedMouseLeave}
                        muted
                        playsInline
                        loop
                    />
                )
                : <img src={config.previewImage} alt="" />}
            <OutlineDots
                active={outlineActive}
                activeColor={ACCENT_COLORS[android]}
                inactiveColor="#555565"
                noBackground
                flip
            />
            <span><em>{disabled ? 'Locked' : config.name}</em></span>
        </button>
    );
}
