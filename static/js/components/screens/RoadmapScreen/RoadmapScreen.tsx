import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { useIsMobile } from '../../../hooks/useIsMobile';
import { usePageScroll } from '../../../hooks/usePageScroll';
import { SoundManager, SoundType } from '../../../sounds/SoundManager';
import { GlitchText } from '../../shared/GlitchText/GlitchText';
import { OutlineGraphics } from './OutlineGraphics';
import './RoadmapScreen.scss';
import { CURRENT_ACCENT } from '../../../graphics/helpers/LandingTheme';

interface RoadmapProps {
    leavePage: (directon: number) => void,
    slideTime: number,
    active: boolean,
    scaleOff: boolean,
}

export function RoadmapScreen(props: RoadmapProps) {
    const {
        leavePage,
        slideTime,
        active,
        scaleOff,
    } = props;
    const [slide, rawSlide] = usePageScroll(
        active,
        slideTime,
        4,
        (direction) => {
            setTimeout(() => {
                leavePage(direction);
            }, 0);
        },
        () => {
            SoundManager.play(SoundType.Text);
        },
    );
    const isMobile = useIsMobile();
    const trimScroll = (from: number, to: number) => Math.max(Math.min((slide - from) / (to - from), 1.0), 0.0);
    const scrollInFrame = (from:number, to: number) => slide >= from && slide <= to;

    // Вычисление сдвига экрана
    const [ringShiftCSS, setRingShiftCSS] = useState('calc(50% - 70vh)');

    useEffect(() => {
        if (!isMobile && window.innerWidth > 2500) {
            setRingShiftCSS(`calc(50% - ${70 + 76 * trimScroll(0, 1.0)}vh)`);
        } else if (!isMobile) {
            setRingShiftCSS(`calc(50% - ${70 + 70 * trimScroll(0, 1.0)}vh)`);
        }
    }, [slide]);

    // Рендер
    const ringStyle = {
        left: !isMobile ? ringShiftCSS : undefined,
    };
    const metaverseStyle = {
        transform: isMobile ? 'translateX(-50%)' : `translateX(-${(1.0 - trimScroll(0, 1)) * 50.0}%)`,
    };
    const titleStyle = isMobile ? {
        transform: 'translateX(-50%)',
        left: '0.2em',
    } : {
        transform: `translateX(-${(1.0 - trimScroll(0, 1)) * 50.0}%)`,
        left: `${(1.0 - trimScroll(0, 1)) * 0.1}em`,
        // fontSize: slide < 0.5 && slide >= 0 ? '100px' : 'clamp(50px, 5vw, 80px)',

    };
    const textStyle = (center: boolean = false) => {
        const deltaRaw = slide % 1.0;
        const delta = deltaRaw < 0.5 ? 1.0 - deltaRaw / 0.5 : (deltaRaw - 0.5) / 0.5;
        return {
            transform: `translate(${center || isMobile ? -50 : 0}%, ${(1.0 - delta) * (isMobile ? 30 : 100)}px)`,
            opacity: delta,
        };
    };

    // Выборка текста для тайтла
    const titles = [
        'Roadmap',
        'Paintings',
        'Spread',
        'Rewards',
        '',
    ];

    return (
        <div id="roadmap-screen">
            <div className={clsx('ring', scaleOff && 'scale-off')} style={ringStyle}>
                <div className="ring__outline">
                    <svg xmlns="http://www.w3.org/2000/svg" width="1300" height="1300" viewBox="0 0 1300 1300" fill="none">
                        <path d="M650.533 38.1895C642.249 38.1895 635.533 44.9052 635.533 53.1895C635.533 61.4737 642.249 68.1895 650.533 68.1895C658.817 68.1895 665.533 61.4737 665.533 53.1895C665.533 44.9052 658.817 38.1895 650.533 38.1895Z" stroke={CURRENT_ACCENT()} />
                        <path d="M130.875 934.178C122.591 934.178 115.875 940.893 115.875 949.178C115.875 957.462 122.591 964.178 130.875 964.178C139.159 964.178 145.875 957.462 145.875 949.178C145.875 940.893 139.159 934.178 130.875 934.178Z" stroke={CURRENT_ACCENT()} />
                        <path d="M1169.1 933.697C1160.82 933.697 1154.1 940.413 1154.1 948.697C1154.1 956.982 1160.82 963.697 1169.1 963.697C1177.38 963.697 1184.1 956.982 1184.1 948.697C1184.1 940.413 1177.38 933.697 1169.1 933.697Z" stroke={CURRENT_ACCENT()} />
                        <path d="M609.452 53.3969C572.734 55.8065 533.943 61.4257 487.645 70.2547L487.461 70.2898L446.498 121.354C233.339 202.971 82.0334 409.037 82.0334 650.347C82.0334 680.46 84.3896 710.025 88.9282 738.867L64.998 799.951L65.0595 800.127C80.5413 844.527 95.0574 880.84 111.324 913.757M690.594 53.374C727.367 55.7708 766.141 61.3978 812.402 70.2548L812.585 70.2899L853.548 121.353C1066.71 202.969 1218.01 409.037 1218.01 650.347C1218.01 680.493 1215.65 710.089 1211.1 738.96L1235 799.951L1234.94 800.127C1219.45 844.527 1204.94 880.84 1188.67 913.757M151.875 983.847C172.343 1014.41 196.616 1045.08 227.438 1080.61L227.56 1080.75L292.643 1090.63C390.246 1169.53 514.6 1216.79 650.024 1216.79C785.453 1216.79 909.812 1169.52 1007.42 1090.63L1072.44 1080.75L1072.56 1080.61C1103.38 1045.08 1127.65 1014.41 1148.12 983.847" stroke="#555565" />
                    </svg>
                </div>
                <div className="ring__inner">
                    {
                        !isMobile && <OutlineGraphics frame={slide > 1 ? rawSlide : slide} />
                    }
                </div>
            </div>
            <div className="wrap">
                <div className="top">
                    <div className="metaverse" style={metaverseStyle}>
                        BUILDING&nbsp;NEW&nbsp;ERA&nbsp;
                        {25 + Math.floor(slide / 3.0 * 75.0)}
                        %
                    </div>
                    <div className="title" style={titleStyle}>
                        <GlitchText from={titles[Math.floor(slide)]} to={titles[Math.floor(slide) + 1]} delta={slide % 1.0} />
                    </div>
                </div>
                <div className="bottom">
                    {scrollInFrame(0, 0.5) && (
                        <div className="text centered" style={textStyle(true)}>
                            Neura is a firm foundation upon which the whole ecosystem will be built. Quality and mystery combined with technology and experience are at its core.
                            For now, Neura is an artist that can create masterpieces both individually and in collaboration with other artists.
                        </div>
                    )}
                    {scrollInFrame(0.5, 1.5) && (
                        <div className="text" style={textStyle()}>
                            Adanede team will curate Neura as an independent artist spreading its art.
                            Android owners can interact with the Neura to create and manage their own art collections on the collector&apos;s page.
                        </div>
                    )}
                    {scrollInFrame(1.5, 2.5) && (
                        <div className="text" style={textStyle()}>
                            Neura aims to shape and define AI art, creating a dynamic and interactive space for artists and collectors.
                            Neura will focus on collaborations, partnering with established names and galleries, bringing new genres together.
                        </div>
                    )}
                    {scrollInFrame(2.5, 3.5) && (
                        <div className="text" style={textStyle()}>
                            Adanede team aims to create innovative products. Androids will be the main pass, but Paintings and the choices you’ve made will be the key to getting rewards.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
