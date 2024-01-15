const MONTHS = [
    'Jan', 'Feb', 'Mar', 'Apr',
    'May', 'Jun', 'Jul', 'Aug',
    'Sep', 'Oct', 'Nov', 'Dec',
];

export function useTextDate(original: Date | undefined | null) {
    if (!original) return null;
    return [
        original.getDate(),
        MONTHS[original.getMonth()],
        original.getFullYear(),
    ].join(' ');
}
