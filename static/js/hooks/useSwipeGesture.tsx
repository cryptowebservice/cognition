import React, { useEffect } from 'react';

export enum SwipeDirection {
    Vertical,
    Horizontal,
}

/**
 * Детектор для свайпа
 * @param callback
 * @param deps
 * @param direction
 * @param wrapper
 * @param threshold
 */
export function useSwipeGesture(
    callback: (direction: number) => void,
    deps: React.DependencyList | undefined = undefined,
    direction: SwipeDirection = SwipeDirection.Vertical,
    wrapper: HTMLElement | undefined = undefined,
    threshold: number = 10,
) {
    useEffect(() => {
        const axis = direction === SwipeDirection.Vertical ? 'clientY' : 'clientX';
        const otherAxis = direction === SwipeDirection.Vertical ? 'clientX' : 'clientY';
        let idx = -1;
        let pos = -1;
        let otherPos = -1;

        // Поиск записанного тача
        const findTouch = (tl: TouchList) => {
            for (let i = 0; i < tl.length; i++) {
                if (tl[i].identifier === idx) return tl[i];
            }
            return null;
        };

        // Старт касания
        const touchstart = (e: Event) => {
            const te = e as TouchEvent;
            if (idx === -1) {
                const t = te.touches[0];
                idx = t.identifier;
                pos = t[axis];
                otherPos = t[otherAxis];
            }
        };

        // Касание движется - ловим скролл
        const touchmove = (e: Event) => {
            const t = findTouch((e as TouchEvent).changedTouches);
            if (t) {
                const diff = t[axis] - pos;
                const otherDiff = t[otherAxis] - otherPos;
                if (Math.abs(diff) > Math.abs(otherDiff) && Math.abs(diff) > threshold) {
                    idx = -1;
                    callback(-Math.sign(diff));
                }
            }
        };

        // Касание окончено - ищем наше
        const touchend = (e: Event) => {
            const t = findTouch((e as TouchEvent).changedTouches);
            if (t) {
                idx = -1;
            }
        };

        // Бинд на ивенты
        const container = wrapper || window;
        container.addEventListener('touchstart', touchstart);
        container.addEventListener('touchmove', touchmove);
        container.addEventListener('touchend', touchend);
        container.addEventListener('touchcancel', touchend);
        return () => {
            container.removeEventListener('touchstart', touchstart);
            container.removeEventListener('touchmove', touchmove);
            container.removeEventListener('touchend', touchend);
            container.removeEventListener('touchcancel', touchend);
        };
    }, deps);
}
