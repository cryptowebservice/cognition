import clsx from 'clsx';
import { useStore } from 'effector-react';
import { useEffect, useState } from 'react';
import AndroidConfigs from '../../../configs/AndroidConfigs';
import { PopupOverlay } from '../../../enums/PopupOverlay';
import { NeuraGraphicsManager } from '../../../graphics/managers/NeuraGraphicsManager';
import { useIsMobile } from '../../../hooks/useIsMobile';
import { SwipeDirection, useSwipeGesture } from '../../../hooks/useSwipeGesture';
import { SoundManager, SoundType } from '../../../sounds/SoundManager';
import { currentAndroidStore, setAndroidScreenActive } from '../../../store/android';
import { setAndroidLoading } from '../../../store/loading';
import { setCurrentOverlay } from '../../../store/page';
import { setSelectedModule } from '../../../store/selectedModule';
import { Button } from '../../shared/Button/Button';
import { GlitchText } from '../../shared/GlitchText/GlitchText';
import './AndroidEditor.scss';
import { CategoryEditor } from './CategoryEditor/CategoryEditor';
import { CategorySelect } from './CategorySelect/CategorySelect';
import { FullSetEditor } from './FullSetEditor/FullSetEditor';
import { MobileCategoryEditor } from './MobileCategoryEditor/MobileCategoryEditor';
import { MobileCategorySelect } from './MobileCategorySelect/MobileCategorySelect';

export function AndroidEditor() {
    const androidIndex = useStore(currentAndroidStore);
    const [activeGroup, setActiveGroup] = useState(-1);
    const [previousGroup, setPreviousGroup] = useState(0);
    const [blockActive, setBlockActive] = useState(true);
    const [androidState, setAndroidState] = useState([0, 0, 0, 0, 0, 0]);
    const [fullSetIndex, setFullSetIndex] = useState(0);
    const [textTransition, setTextTransition] = useState(0);
    const [categoriesSlide, setCategoriesSlide] = useState(false);
    const [isModules, setIsModules] = useState(true);
    const [isFullSet, setIsFullSet] = useState(false);
    const [animate, setAnimate] = useState(false);
    const [isLeftClicked, setIsLeftClicked] = useState(true);
    const isMobile = useIsMobile();

    // Загрузка робота
    useEffect(() => {
        if (androidIndex === -1) return;

        // Интервал сделан для дебаг-режима, иногда рендер
        // не успевает стартануть, а мы уже грузим сцену -> сразу краш
        const interval = setInterval(() => {
            if (NeuraGraphicsManager.getInstance().isInitialized()) {
                NeuraGraphicsManager
                    .getInstance()
                    .enableEditorScene(androidIndex, () => {
                        setTimeout(() => {
                            setAndroidLoading(false);
                        }, 500);
                    }, (value) => {
                        setTextTransition(value);
                    });
                clearInterval(interval);
            }
        }, 100);

        // Удаление сцены
        return () => {
            clearInterval(interval);
            NeuraGraphicsManager
                .getInstance()
                .disableEditorScene();
        };
    }, [androidIndex]);

    useEffect(() => {
        const config = AndroidConfigs[androidIndex];
        const values: number[] = Array(10).fill(0);
        for (let i = 0; i < androidState.length; i++) {
            if (config.groups && config.groups[i]) {
                values[config.groups[i].group] = androidState[i];
            }
        }

        NeuraGraphicsManager
            .getEditorScene()
            ?.setModules(...values);
    }, [androidState]);

    const config = AndroidConfigs[androidIndex];

    const changeGroup = (index: number) => {
        if (index !== -1) {
            setAndroidState([0, 0, 0, 0, 0, 0, 0]);
        }
        setSelectedModule(index);

        setBlockActive(false);
        setTimeout(() => {
            setActiveGroup(index);
            setTimeout(() => {
                setBlockActive(true);
            }, 10);
        }, 500);
    };

    const onCategorySelect = (index: number) => {
        const changeCat = () => {
            changeGroup(index);
            setPreviousGroup(index);
            NeuraGraphicsManager.getEditorScene()?.setModuleView(index);
            SoundManager.play(SoundType.Text);
        };
        setCategoriesSlide(false);
        if (categoriesSlide && activeGroup === -1) {
            setTimeout(() => {
                changeCat();
            }, 500);
        } else {
            changeCat();
        }
        SoundManager.play(SoundType.Button);
    };

    const onCategoryLeave = () => {
        changeGroup(-1);
        // setAndroidState([0, 0, 0, 0, 0, 0, 0]);
        NeuraGraphicsManager.getEditorScene()?.setOverallView();
        SoundManager.play(SoundType.Text);
    };

    const onModuleSelect = (index: number) => {
        const values = [...androidState];
        values[activeGroup] = index;
        setAndroidState(values);
        SoundManager.play(SoundType.ModuleInstall);
    };

    const onFullSetSelect = (index: number) => {
        if (isMobile) {
            changeGroup(index);
            setPreviousGroup(index);
            setCategoriesSlide(false);
        }
        setFullSetIndex(index);
        setAndroidState([index, index, index, index, index, index]);
        SoundManager.play(SoundType.ModuleInstall);
    };

    const onClickFullSet = (delay : number) => {
        setAndroidState([0, 0, 0, 0, 0, 0, 0]);
        if (isModules) {
            setIsModules(false);
            setTimeout(() => {
                setIsFullSet(true);
            }, delay);
        } else {
            setIsFullSet(false);
            setTimeout(() => {
                setIsModules(true);
            }, delay);
        }
    };

    const onCategoryChangeMobile = () => {
        setAnimate(true);
        setTimeout(() => { setIsModules(!isModules); }, 250);
        NeuraGraphicsManager.getEditorScene()?.setOverallView();
        setAndroidState([0, 0, 0, 0, 0, 0, 0]);
        SoundManager.play(SoundType.Button);
    };

    const onClickBack = () => {
        if (blockActive) {
            if (activeGroup > -1) {
                onCategoryLeave();
            } else {
                setAndroidLoading(true);
                setTimeout(() => {
                    setAndroidState([0, 0, 0, 0, 0, 0, 0]);
                    setAndroidScreenActive(false);
                    setAndroidLoading(false);
                }, 1000);
            }
            SoundManager.play(SoundType.Button);
        }
    };

    useSwipeGesture((dir: number) => {
        setCategoriesSlide(dir > 0);
    }, [categoriesSlide], SwipeDirection.Vertical);

    // Вычисление подписи для уровня
    let moduleName = '';
    if (config.groups[activeGroup] && config.groups[activeGroup].levels[androidState[activeGroup]]) {
        moduleName = config.groups[previousGroup].name;
    }

    const openRobotPopup = () => {
        setCurrentOverlay(PopupOverlay.AndroidInfo);
    };

    const openModulePopup = () => {
        setCurrentOverlay(PopupOverlay.ModuleInfo);
    };

    const desktopEditorPart = activeGroup === -1 ? (
        <>
            <FullSetEditor
                config={config}
                active={isFullSet}
                onSelect={onFullSetSelect}
                index={fullSetIndex}
            />
            <CategorySelect
                config={config}
                active={isModules && blockActive}
                onSelect={onCategorySelect}
                state={androidState}
            />
        </>
    ) : (
        <CategoryEditor
            active={blockActive}
            group={config.groups[activeGroup]}
            index={androidState[activeGroup]}
            onSelect={onModuleSelect}
        />
    );

    const visualPart = (
        <>
            {/* Видео-контейнер, внутри крутится андроид, для 3D - убрать */}
            {/* <VideoContainer /> */}

            {!isMobile && desktopEditorPart}
            <button type="button" className="back" onClick={onClickBack}>
                <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="18" cy="18" r="17.5" stroke="white" />
                    <path d="M19.6464 11.6464C19.8417 11.4512 20.1583 11.4512 20.3536 11.6464C20.5488 11.8417 20.5488 12.1583 20.3536 12.3536L19.6464 11.6464ZM20.3536 23.6464C20.5488 23.8417 20.5488 24.1583 20.3536 24.3536C20.1583 24.5488 19.8417 24.5488 19.6464 24.3536L20.3536 23.6464ZM14.7071 17.2929L14.3536 16.9393L14.7071 17.2929ZM14.7071 18.7071L14.3536 19.0607L14.7071 18.7071ZM20.3536 12.3536L15.0607 17.6464L14.3536 16.9393L19.6464 11.6464L20.3536 12.3536ZM15.0607 18.3536L20.3536 23.6464L19.6464 24.3536L14.3536 19.0607L15.0607 18.3536ZM15.0607 17.6464C14.8654 17.8417 14.8654 18.1583 15.0607 18.3536L14.3536 19.0607C13.7678 18.4749 13.7678 17.5251 14.3536 16.9393L15.0607 17.6464Z" fill="white" />
                </svg>
            </button>
            <div className={clsx('button-wrap', activeGroup !== -1 ? 'disabled' : '')}>
                <Button onClick={() => onClickFullSet(300)}>
                    {isModules ? 'FULL SET' : 'MODULES'}
                </Button>
            </div>
            <div className={clsx('footer', (activeGroup !== -1 && isMobile) && 'shift-up')}>
                <div className="footer__manufacturer">
                    {config.manufacturer}
                    {config.icon}
                </div>
                <div className="footer__wrap">
                    <div className="title">
                        <GlitchText delta={textTransition} from={config.name} to={moduleName} />
                    </div>
                    {
                        // eslint-disable-next-line no-nested-ternary
                        activeGroup === -1
                            ? (
                                <button type="button" className={clsx('show-popup', blockActive && 'active')} onClick={openRobotPopup}>
                                    Read Biography
                                </button>
                            )
                            : isMobile ? null
                                : (
                                    <button type="button" className={clsx('show-popup', blockActive && 'active')} onClick={openModulePopup}>
                                        More About Module
                                    </button>
                                )
                    }
                </div>
            </div>

            {
                isMobile && previousGroup !== -1 && (
                    <MobileCategoryEditor
                        active={activeGroup !== -1}
                        cg={config}
                        prevGroup={previousGroup}
                        index={androidState[previousGroup]}
                        onSelect={isModules ? onModuleSelect : onFullSetSelect}
                        isModule={isModules}
                    />
                )
            }
        </>
    );

    // Рендер под мобильный вид
    if (isMobile) {
        return (
            <div
                id="android-editor"
            >
                <div className={clsx('screen-container', categoriesSlide && 'active')}>
                    {visualPart}
                    <div className={clsx('chevron-down', activeGroup !== -1 && 'hidden')}>
                        <svg width="12" height="6" viewBox="0 0 12 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M11.3123 1.39043C11.528 1.21793 11.5629 0.903284 11.3904 0.687653C11.2179 0.472022 10.9033 0.437061 10.6877 0.609566L11.3123 1.39043ZM1.31235 0.609565C1.09672 0.43706 0.782071 0.472021 0.609566 0.687652C0.437061 0.903283 0.472022 1.21793 0.687653 1.39043L1.31235 0.609565ZM10.6877 0.609566L6.31235 4.10981L6.93704 4.89068L11.3123 1.39043L10.6877 0.609566ZM5.68765 4.10981L1.31235 0.609565L0.687653 1.39043L5.06296 4.89068L5.68765 4.10981ZM6.31235 4.10981C6.12974 4.2559 5.87026 4.2559 5.68765 4.10981L5.06296 4.89068C5.61079 5.32894 6.38921 5.32894 6.93704 4.89068L6.31235 4.10981Z" fill="white" />
                        </svg>
                    </div>
                </div>
                <div className={clsx('screen-container', categoriesSlide && 'active')}>
                    <div className="mobile-modules">
                        <div className="mobile-modules__title">
                            <svg
                                width="36"
                                height="36"
                                viewBox="0 0 36 36"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                onClick={() => { onCategoryChangeMobile(); setIsLeftClicked(true); }}
                            >
                                <path d="M19.6464 11.6464C19.8417 11.4512 20.1583 11.4512 20.3536 11.6464C20.5488 11.8417 20.5488 12.1583 20.3536 12.3536L19.6464 11.6464ZM20.3536 23.6464C20.5488 23.8417 20.5488 24.1583 20.3536 24.3536C20.1583 24.5488 19.8417 24.5488 19.6464 24.3536L20.3536 23.6464ZM14.7071 17.2929L14.3536 16.9393L14.7071 17.2929ZM14.7071 18.7071L14.3536 19.0607L14.7071 18.7071ZM20.3536 12.3536L15.0607 17.6464L14.3536 16.9393L19.6464 11.6464L20.3536 12.3536ZM15.0607 18.3536L20.3536 23.6464L19.6464 24.3536L14.3536 19.0607L15.0607 18.3536ZM15.0607 17.6464C14.8654 17.8417 14.8654 18.1583 15.0607 18.3536L14.3536 19.0607C13.7678 18.4749 13.7678 17.5251 14.3536 16.9393L15.0607 17.6464Z" fill="white" />
                            </svg>
                            {/* eslint-disable-next-line no-nested-ternary */}
                            <div className={clsx('mobile-modules__title-text', animate && isLeftClicked ? 'active-l' : animate && !isLeftClicked ? 'active-r' : '')} onAnimationEnd={() => setAnimate(false)}>
                                {isModules ? 'Modules' : 'Full - set'}
                            </div>
                            <svg
                                style={{ transform: 'rotate(180deg)' }}
                                width="36"
                                height="36"
                                viewBox="0 0 36 36"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                onClick={() => { onCategoryChangeMobile(); setIsLeftClicked(false); }}
                            >
                                <path d="M19.6464 11.6464C19.8417 11.4512 20.1583 11.4512 20.3536 11.6464C20.5488 11.8417 20.5488 12.1583 20.3536 12.3536L19.6464 11.6464ZM20.3536 23.6464C20.5488 23.8417 20.5488 24.1583 20.3536 24.3536C20.1583 24.5488 19.8417 24.5488 19.6464 24.3536L20.3536 23.6464ZM14.7071 17.2929L14.3536 16.9393L14.7071 17.2929ZM14.7071 18.7071L14.3536 19.0607L14.7071 18.7071ZM20.3536 12.3536L15.0607 17.6464L14.3536 16.9393L19.6464 11.6464L20.3536 12.3536ZM15.0607 18.3536L20.3536 23.6464L19.6464 24.3536L14.3536 19.0607L15.0607 18.3536ZM15.0607 17.6464C14.8654 17.8417 14.8654 18.1583 15.0607 18.3536L14.3536 19.0607C13.7678 18.4749 13.7678 17.5251 14.3536 16.9393L15.0607 17.6464Z" fill="white" />
                            </svg>
                        </div>
                        <div className={clsx('mobile-modules__wrap category-grid', animate && 'active')}>
                            <MobileCategorySelect
                                config={config}
                                onSelect={isModules ? onCategorySelect : onFullSetSelect}
                                state={androidState}
                                isModule={isModules}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Рендер под десктоп
    return (
        <div id="android-editor">
            {visualPart}
        </div>
    );
}
