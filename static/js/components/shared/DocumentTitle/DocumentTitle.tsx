import { useStore } from 'effector-react';
import { useEffect } from 'react';
import androidConfigs from '../../../configs/AndroidConfigs';
import { PopupOverlay } from '../../../enums/PopupOverlay';
import { androidScreenActiveStore, currentAndroidStore } from '../../../store/android';
import { androidLoadingStore, loadingStore, loadingTotalStore } from '../../../store/loading';
import { currentOverlayStore } from '../../../store/page';

export function DocumentTitle() {
    const activeAndroid = useStore(currentAndroidStore);
    const activeAndroidScreen = useStore(androidScreenActiveStore);
    const loading = useStore(loadingStore);
    const loadingTotal = useStore(loadingTotalStore);
    const androidLoading = useStore(androidLoadingStore);
    const currentOverlay = useStore(currentOverlayStore);

    useEffect(() => {
        const tm = setInterval(() => {
            let title = 'Neura';
            if (loading < loadingTotal || loadingTotal === 0 || androidLoading) {
                title = 'Loading...';
            } else if (activeAndroid !== -1 && activeAndroidScreen) {
                title = `${androidConfigs[activeAndroid].name} - ${title}`;
            } else if (currentOverlay !== PopupOverlay.None) {
                const names = [
                    'Manifesto',
                    'Story',
                    'Android Bio',
                    'Module',
                    'FAQ',
                ];
                title = `${names[currentOverlay - 1]} - ${title}`;
            }
            if (Math.random() <= 0.04) {
                const symbols = '#%$*&15789-_[]';
                let glitch = '';
                for (let i = 0; i < title.length; i++) {
                    glitch += symbols[Math.floor(Math.random() * symbols.length)];
                }
                title = glitch;
            }
            if (document.title !== title) document.title = title;
        }, 300);
        return () => {
            clearInterval(tm);
        };
    }, [activeAndroid, activeAndroidScreen, loading, loadingTotal, androidLoading, currentOverlay]);

    return null;
}
