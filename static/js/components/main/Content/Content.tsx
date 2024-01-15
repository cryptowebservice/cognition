import { useStore } from 'effector-react';
import { useEffect, useState } from 'react';
import { PopupOverlay } from '../../../enums/PopupOverlay';
import { SoundManager, SoundType } from '../../../sounds/SoundManager';
import { androidScreenActiveStore, setAndroidScreenActive, setCurrentAndroid } from '../../../store/android';
import { loadingCompleteStore, setAndroidLoading } from '../../../store/loading';
import {
    currentOverlayStore, currentScrollStore, setCurrentPage, setCurrentScroll,
} from '../../../store/page';
import { AboutScreen } from '../../screens/AboutScreen/AboutScreen';
import { AndroidSelectScreen } from '../../screens/AndroidSelectScreen/AndroidSelectScreen';
import { FabulaScreen } from '../../screens/FabulaScreen/FabulaScreen';
import { FaqScreen } from '../../screens/FaqScreen/FaqScreen';
import { FollowScreen } from '../../screens/FollowScreen/FollowScreen';
import { IntroScreen } from '../../screens/IntroScreen/IntroScreen';
import { RoadmapScreen } from '../../screens/RoadmapScreen/RoadmapScreen';
import { TeamScreen } from '../../screens/TeamScreen/TeamScreen';
import { AndroidEditor } from '../AndroidEditor/AndroidEditor';
import { Header } from '../Header/Header';
import { Overlays } from '../Overlays/Overlays';
import { ScreenRoller } from '../ScreenRoller/ScreenRoller';

import './Content.scss';
import { NavigationDots } from './NavigationDots';

export function Content() {
    const [internalPage, setInternalPage] = useState(document.location.hash === '#androids' ? 3 : 0);
    const [scrollDirection, setScrollDirection] = useState(0);
    const [authActive, setAuthActive] = useState(false);
    const currentPopup = useStore(currentOverlayStore);
    const currentScroll = useStore(currentScrollStore);
    const androidScreenActive = useStore(androidScreenActiveStore);
    const loadingComplete = useStore(loadingCompleteStore);

    // console.debug(document.location.hash);

    // Обработка мьюта высоких
    useEffect(() => {
        SoundManager.setBackgroundMuted(currentPopup !== PopupOverlay.None || androidScreenActive);
    }, [currentPopup, androidScreenActive]);

    // Ивенты на обработку скролла
    const onPageChange = (page: number) => {
        setCurrentPage(page);
        setInternalPage(page);
    };
    const onScrollChange = (scroll: number) => {
        setScrollDirection(Math.sign(scroll - currentScroll));
        setCurrentScroll(scroll);
    };
    const onIndexButton = () => {
        setCurrentPage(1);
        setInternalPage(1);
    };
    const onRoadmapLeave = (direction: number) => {
        const index = 4 + direction;
        setCurrentPage(index);
        setInternalPage(index);
    };
    const onLogoClick = () => {
        setCurrentPage(0);
        setInternalPage(0);
        if (androidScreenActive) {
            setAndroidLoading(true);
            setTimeout(() => {
                setAndroidScreenActive(false);
                setAndroidLoading(false);
            }, 1000);
        }
    };
    const onAuthChange = (state: boolean) => {
        setAuthActive(state);
    };
    const onScrollSound = () => {
        SoundManager.play(SoundType.PageScroll);
    };

    useEffect(() => {
        if (process.env.REACT_APP_SHOW_ANDROID) {
            setCurrentAndroid(+process.env.REACT_APP_SHOW_ANDROID - 1);
            setAndroidScreenActive(true);
            setAndroidLoading(true);
        }
    }, []);

    // Рендер
    const blockScroll = authActive
        || internalPage === 4
        || currentPopup !== PopupOverlay.None
        || !loadingComplete;
    const roadmapScaleOff = currentScroll < (scrollDirection > 0 ? 3.5 : 4)
        || currentScroll > (scrollDirection < 0 ? 4.5 : 4);

    return (
        <div className="content-block">
            {/* <div className="fog" style={{ boxShadow: `inset -250px 0px ${window.innerHeight * 2}px ${window.innerHeight / 8}px rgba(0, 0, 0, ${currentScroll})` }} /> */}
            {
                androidScreenActive
                    ? (
                        <AndroidEditor />
                    )
                    : (
                        <>
                            <Header onLogoClick={onLogoClick} onAuthChange={onAuthChange} />
                            <div className="scroller-block">
                                <ScreenRoller
                                    page={internalPage}
                                    disableScroll={blockScroll}
                                    onScrollChange={onScrollChange}
                                    onPageChange={onPageChange}
                                    onSoundEmit={onScrollSound}
                                >
                                    <IntroScreen onIndexButton={onIndexButton} />
                                    <AboutScreen />
                                    <FabulaScreen />
                                    <AndroidSelectScreen />
                                    <RoadmapScreen
                                        active={internalPage === 4}
                                        slideTime={1000}
                                        leavePage={onRoadmapLeave}
                                        scaleOff={roadmapScaleOff}
                                    />
                                    <TeamScreen />
                                    <FaqScreen />
                                    <FollowScreen />
                                </ScreenRoller>
                                <NavigationDots onNavigate={onPageChange} page={Math.round(currentScroll)} totalPages={8} />
                            </div>
                        </>
                    )

            }
            <Overlays />
        </div>
    );
}
