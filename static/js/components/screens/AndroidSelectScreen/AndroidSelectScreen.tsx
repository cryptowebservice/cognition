import clsx from 'clsx';
import { useState } from 'react';
import configs from '../../../configs/AndroidConfigs';
import { ACCENT_COLORS, handleThemeChange } from '../../../graphics/helpers/LandingTheme';
import { useIsMobile } from '../../../hooks/useIsMobile';
import { SoundManager, SoundType } from '../../../sounds/SoundManager';
import { setAndroidScreenActive, setCurrentAndroid } from '../../../store/android';
import { setAndroidLoading } from '../../../store/loading';
import { OutlineDots } from '../../shared/OutlineDots/OutlineDots';
import { AndroidButton } from './AndroidButton';
import './AndroidSelectScreen.scss';
import { AndroidSlider } from './AndroidSlider/AndroidSlider';
import LockedImage from '../../../assets/images/android_list/locked.jpg';

export function AndroidSelectScreen() {
    const [hoverButton, setHoverButton] = useState(-1);
    const isMobile = useIsMobile();
    const [activeSlide, setActiveSlide] = useState(0);

    const handleActiveSlide = (index: number) => {
        setActiveSlide(index);
    };

    const handleSelect = (index: number) => {
        if ([4].includes(configs[index].id)) return;
        SoundManager.play(SoundType.Button);
        setCurrentAndroid(configs[index].id);
        handleThemeChange(configs[index].id);
        setAndroidLoading(true);

        setTimeout(() => {
            setAndroidScreenActive(true);
        }, 4000);
    };

    return (
        <div id="android-select-screen">
            <div className="wrapper" onMouseLeave={() => setHoverButton(-1)}>
                {
                    isMobile
                        ? (
                            <AndroidSlider handleActiveSlide={handleActiveSlide} handleSelect={handleSelect}>
                                {
                                    configs.map((config, key) => {
                                        const cfg = configs[config.id];
                                        const locked = config.id === 4;
                                        return (
                                            <div className={clsx('slide', key === activeSlide && 'active')} key={config.id}>
                                                <div
                                                    className="img"
                                                    style={{
                                                        backgroundImage: `url(${locked ? LockedImage : cfg.previewImage})`,
                                                    }}
                                                />
                                                <span>{locked ? 'Locked' : cfg.name}</span>
                                                <OutlineDots
                                                    active={key === activeSlide}
                                                    activeColor={ACCENT_COLORS[config.id]}
                                                    inactiveColor="#555565"
                                                    noBackground
                                                    flip
                                                />
                                            </div>
                                        );
                                    })
                                }
                            </AndroidSlider>
                        )
                        : configs.map((config, key) => {
                            let shift = `var(--block-pad) * ${key}`;
                            for (let i = 0; i < key; i++) {
                                if (hoverButton === -1) {
                                    shift += ' + var(--normal-width)';
                                } else {
                                    shift += ` + var(${i === hoverButton ? '--extended-width' : '--condense-width'})`;
                                }
                            }

                            return (
                                <AndroidButton
                                    transform={`translateX(calc(${shift}))`}
                                    key={config.id}
                                    android={config.id}
                                    condense={hoverButton !== -1 && hoverButton !== key}
                                    extend={hoverButton === key}
                                    disabled={config.id === 4}
                                    onHoverEnter={() => {
                                        SoundManager.playHover();
                                        setHoverButton(key);
                                    }}
                                />
                            );
                        })
                }
                <div className="title">
                    {isMobile ? 'Androids' : 'Android types'}
                </div>
            </div>

        </div>
    );
}
