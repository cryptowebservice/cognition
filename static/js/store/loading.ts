import {
    createEvent, createStore, forward, sample,
} from 'effector';

const loadingStore = createStore(0);
const loadingTotalStore = createStore(0);
const loadingCompleteStore = createStore(false);
const addLoadingStep = createEvent<number>();
const advanceLoading = createEvent<number>();
const setLoadingComplete = createEvent<boolean>();
sample({
    clock: addLoadingStep,
    source: loadingTotalStore,
    target: loadingTotalStore,
    fn: (prevState: number, increment: number) => prevState + increment,
});
sample({
    clock: advanceLoading,
    source: loadingStore,
    target: loadingStore,
    fn: (prevState: number, increment: number) => prevState + increment,
});
forward({
    from: setLoadingComplete,
    to: loadingCompleteStore,
});

export {
    loadingStore, loadingTotalStore, addLoadingStep, advanceLoading, loadingCompleteStore, setLoadingComplete,
};

const androidLoadingStore = createStore(false);
const setAndroidLoading = createEvent<boolean>();
androidLoadingStore.on(setAndroidLoading, (_, payload) => payload);

export { androidLoadingStore, setAndroidLoading };
