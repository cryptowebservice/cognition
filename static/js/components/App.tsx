import { useStore } from 'effector-react';
import React, { useEffect } from 'react';
import { handleThemeChange } from '../graphics/helpers/LandingTheme';
import { useIsMobile } from '../hooks/useIsMobile';
import { androidScreenActiveStore, currentAndroidStore } from '../store/android';
import { androidLoadingStore } from '../store/loading';
import { Content } from './main/Content/Content';
import { Cursor } from './main/Cursor/Cursor';
import { GraphicsBackground } from './main/GraphicsBackground/GraphicsBackground';
import { Preloader } from './main/Preloader/Preloader';
import { VectorLookup } from './main/VectorLookup/VectorLookup';
import { AndroidLoading } from './shared/AndroidLoading/AndroidLoading';
import { DocumentTitle } from './shared/DocumentTitle/DocumentTitle';

export function App() {
    const mobile = useIsMobile();
    const activeAndroid = useStore(currentAndroidStore);
    const activeAndroidScreen = useStore(androidScreenActiveStore);
    const androidLoading = useStore(androidLoadingStore);

    useEffect(() => {
        // Ресайз и пересчет 100vh
        const handler = () => {
            document.documentElement.style.setProperty('--full-h', `${window.innerHeight}px`);
            document.documentElement.style.setProperty('--content-h', `${window.innerHeight - (mobile ? 41 : 0)}px`);
        };
        window.addEventListener('resize', handler);
        handler();

        return () => {
            window.removeEventListener('resize', handler);
        };
    }, [mobile]);

    useEffect(() => {
        handleThemeChange(activeAndroid);
    }, [activeAndroid]);

    useEffect(() => {
        if (!activeAndroidScreen) {
            handleThemeChange(-1);
        }
    }, [activeAndroidScreen]);

    return (
        <>
            <DocumentTitle />
            <VectorLookup />
            <GraphicsBackground />
            <Content />
            <AndroidLoading active={androidLoading} />
            <Preloader />
            <Cursor />
        </>
    );
}
