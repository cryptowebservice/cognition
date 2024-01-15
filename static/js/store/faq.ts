import { createEvent, createStore, forward } from 'effector';

const faqPageStore = createStore(0);
const setFaqPage = createEvent<number>();

forward({
    from: setFaqPage,
    to: faqPageStore,
});

export {
    faqPageStore, setFaqPage,
};
