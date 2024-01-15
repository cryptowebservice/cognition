import { createEvent, createStore, forward } from 'effector';

const currentAndroidStore = createStore(-1);
const setCurrentAndroid = createEvent<number>();
forward({
    from: setCurrentAndroid,
    to: currentAndroidStore,
});
export { currentAndroidStore, setCurrentAndroid };

const androidScreenActiveStore = createStore(false);
const setAndroidScreenActive = createEvent<boolean>();
forward({
    from: setAndroidScreenActive,
    to: androidScreenActiveStore,
});
export { androidScreenActiveStore, setAndroidScreenActive };
