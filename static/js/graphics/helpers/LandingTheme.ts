const ACCENT_COLORS = [
    '#DE414A',
    '#01A4FF',
    '#16943A',
    '#F6CF00',
    '#A849F3',

];
const ROBOT_INDICES = [
    0, //
    3,
    1,
    4,
    2,
];

let storageIndex = +(localStorage.getItem('last_preset') ?? 0);
let theme = 0;
for (let j = 0; j < ROBOT_INDICES.length; j++) {
    storageIndex = (storageIndex + 1) % ROBOT_INDICES.length;
    if (![4].includes(storageIndex)) {
        theme = ROBOT_INDICES[storageIndex];
        break;
    }
}
localStorage.setItem('last_preset', storageIndex.toString());

let accent = ACCENT_COLORS[theme];
const newIndex = storageIndex;

function handleThemeChange(activeIndex: number) {
    if (activeIndex !== -1) {
        theme = activeIndex;
    } else {
        theme = newIndex;
    }

    const { body } = document;
    accent = ACCENT_COLORS[theme];
    if (body) {
        body.classList.remove('robot-1', 'robot-2', 'robot-3', 'robot-4', 'robot-5');
        body.classList.add(`robot-${theme + 1}`);
    }
}

const CURRENT_ACCENT = () => accent;
const CURRENT_THEME = () => theme;

export {
    ACCENT_COLORS,
    CURRENT_ACCENT,
    CURRENT_THEME,
    handleThemeChange,
};
