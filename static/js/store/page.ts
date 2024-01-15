import { createEvent, createStore, forward } from 'effector';
import { PopupOverlay } from '../enums/PopupOverlay';
import { SoundManager, SoundType } from '../sounds/SoundManager';

const currentPageStore = createStore<number>(0);
const setCurrentPage = createEvent<number>();
forward({
    from: setCurrentPage,
    to: currentPageStore,
});
export { currentPageStore, setCurrentPage };

const currentScrollStore = createStore<number>(0);
const setCurrentScroll = createEvent<number>();
forward({
    from: setCurrentScroll,
    to: currentScrollStore,
});
export { currentScrollStore, setCurrentScroll };

const currentOverlayStore = createStore<PopupOverlay>(PopupOverlay.None);
const setCurrentOverlay = createEvent<PopupOverlay>();
forward({
    from: setCurrentOverlay,
    to: currentOverlayStore,
});
export { currentOverlayStore, setCurrentOverlay };

const soundEnabledStore = createStore<boolean>(false);
const setSoundEnabled = createEvent<boolean>();
forward({
    from: setSoundEnabled,
    to: soundEnabledStore,
});
soundEnabledStore.watch((state) => {
    SoundManager.setActive(state);
    if (state) {
        setTimeout(() => {
            SoundManager.play(SoundType.Button);
        });
    }
});

export { soundEnabledStore, setSoundEnabled };
