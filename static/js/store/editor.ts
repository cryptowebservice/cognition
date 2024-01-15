import { createEvent, createStore, forward } from 'effector';
import { Vector2 } from 'three';

export interface VideoCameraState {
    position: Vector2,
    zoom: number,
    shift: number,
}

const androidModuleSetup = createStore('000000');
const setAndroidModuleSetup = createEvent<string>();
forward({
    from: setAndroidModuleSetup,
    to: androidModuleSetup,
});
export { androidModuleSetup, setAndroidModuleSetup };

const androidVideoCamera = createStore<VideoCameraState>({
    position: new Vector2(0, 0),
    zoom: 1,
    shift: 0,
});
const setAndroidVideoCamera = createEvent<VideoCameraState>();
forward({
    from: setAndroidVideoCamera,
    to: androidVideoCamera,
});
export { androidVideoCamera, setAndroidVideoCamera };
