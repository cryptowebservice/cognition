import { createEvent, createStore, forward } from 'effector';

export const $selectedModuleStore = createStore(-1);

export const setSelectedModule = createEvent<number>();

forward({
    from: setSelectedModule,
    to: $selectedModuleStore,
});
