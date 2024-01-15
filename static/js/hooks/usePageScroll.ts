import { useEffect, useRef, useState } from 'react';
import WheelIndicator from 'wheel-indicator';

/**
 * Отдельный класс для обработки скролла
 */
class ScrollHandler {
    /**
     * Текущий фрейм
     * @private
     */
    private page: number = 0;

    /**
     * Целевой фрейм
     * @private
     */
    private targetPage: number = 0;

    /**
     * Остаточный таймер скролла
     * @private
     */
    private scrollTimer: number = 0;

    /**
     * Начальная точка скролла
     * @private
     */
    private scrollOrigin: number = 0;

    /**
     * Время перехода
     * @private
     */
    private readonly transitionTime: number;

    /**
     * Количество страниц
     * @private
     */
    private readonly totalPages: number;

    /**
     * Разрешить ли скролл
     * @private
     */
    private allowScroll: boolean = true;

    /**
     * Индекс RAF
     * @private
     */
    private rafQuery: number = 0;

    /**
     * Время последнего RAF
     * @private
     */
    private rafTime: number = 0;

    /**
     * Хендлер для колеса
     * @private
     */
    private indicator: WheelIndicator | null = null;

    /**
     * Индекс пальца
     * @private
     */
    private touchFinger: number = -1;

    /**
     * Изначальная позиция
     * @private
     */
    private touchOrigin: number = -1;

    /**
     * Колбек для передачи офсета наружу
     * @private
     */
    private readonly updatePageHandler: (page: number, rawPage: number) => void;

    /**
     * Колбек при оверскролле за границы
     * @private
     */
    private readonly overscrollHandler: (direction: number) => void;

    /**
     * Обработчик звука
     * @private
     */
    private readonly soundHandler: (() => void) | null;

    /**
     * Флаг проигрыша звука
     * @private
     */
    private soundPlayed: boolean = false;

    /**
     * Конструктор
     * @param current
     * @param slideTime
     * @param totalPages
     * @param updatePageHandler
     * @param overscrollHandler
     * @param soundHandler
     */
    public constructor(
        current: number,
        slideTime: number,
        totalPages: number,
        updatePageHandler: (page: number, rawPage: number) => void,
        overscrollHandler: (direction: number) => void,
        soundHandler: (() => void) | null = null,
    ) {
        this.page = current;
        this.transitionTime = slideTime;
        this.totalPages = totalPages;
        this.updatePageHandler = updatePageHandler;
        this.overscrollHandler = overscrollHandler;
        this.soundHandler = soundHandler;
        this.update = this.update.bind(this);
        this.handleScroll = this.handleScroll.bind(this);
        this.handleTouchStart = this.handleTouchStart.bind(this);
        this.handleTouchMove = this.handleTouchMove.bind(this);
        this.handleTouchEnd = this.handleTouchEnd.bind(this);
    }

    /**
     * Привязка ивентов
     */
    public attach() {
        this.indicator = new WheelIndicator({
            elem: document.body,
            callback: this.handleScroll,
            preventMouse: false,
        });
        this.rafTime = performance.now();
        this.update(this.rafTime);

        document.body.addEventListener('touchstart', this.handleTouchStart);
        document.body.addEventListener('touchmove', this.handleTouchMove);
        document.body.addEventListener('touchend', this.handleTouchEnd);
        document.body.addEventListener('touchcancel', this.handleTouchEnd);
    }

    /**
     * Отвязка ивентов
     */
    public detach() {
        if (this.indicator) {
            this.indicator.destroy();
            this.indicator = null;
        }

        document.body.removeEventListener('touchstart', this.handleTouchStart);
        document.body.removeEventListener('touchmove', this.handleTouchMove);
        document.body.removeEventListener('touchend', this.handleTouchEnd);
        document.body.removeEventListener('touchcancel', this.handleTouchEnd);
    }

    /**
     * Установка доступности скролла
     * @param active
     */
    public setEnabled(active: boolean) {
        this.allowScroll = active;
    }

    /**
     * Внутреннее обновление логики
     * @param rawDeltaTime
     * @private
     */
    private update(rawDeltaTime: number) {
        this.rafQuery = requestAnimationFrame(this.update);
        const delta = (rawDeltaTime - this.rafTime) / 16.666;
        this.rafTime = rawDeltaTime;
        const oldPage = this.page;

        if (this.scrollTimer > 0) {
            const change = 16.666 / this.transitionTime * delta;
            this.scrollTimer = Math.max(this.scrollTimer - change, 0);
            this.page = this.targetPage + (this.scrollOrigin - this.targetPage) * this.scrollTimer;
            if (!this.soundPlayed) {
                this.soundPlayed = true;
                if (this.soundHandler) this.soundHandler();
            }
        } else {
            this.soundPlayed = false;
        }

        if (oldPage !== this.page) {
            this.updatePageWithEasing(this.page);
        }
    }

    /**
     * Ивент скролла
     * @param event
     * @private
     */
    private handleScroll(event: WheelEvent) {
        if (this.allowScroll && Math.abs(event.deltaY) > Math.abs(event.deltaX) && event.deltaY !== 0) {
            if (this.scrollTimer === 0) {
                const dir = Math.sign(event.deltaY);
                if ((dir < 0 && this.page === 0) || (dir > 0 && this.page === this.totalPages - 1)) {
                    this.overscrollHandler(dir);
                } else {
                    this.scrollOrigin = this.page;
                    this.targetPage = this.page + dir;
                    this.scrollTimer = 1;
                }
            }
        }
    }

    /**
     * Начало скролла пальцем
     * @param event
     * @private
     */
    private handleTouchStart(event: TouchEvent) {
        if (event.changedTouches.length > 0 && this.touchFinger === -1) {
            const t = event.changedTouches[0];
            this.touchFinger = t.identifier;
            this.touchOrigin = t.clientY;
        }
    }

    /**
     * Обработка скролла пальцем
     * @param event
     * @private
     */
    private handleTouchMove(event: TouchEvent) {
        for (let i = 0; i < event.changedTouches.length; i++) {
            const t = event.changedTouches[i];
            if (t.identifier === this.touchFinger) {
                const diff = t.clientY - this.touchOrigin;
                if (Math.abs(diff) > 20) {
                    if (this.scrollTimer === 0 && this.allowScroll) {
                        const dir = -Math.sign(diff);
                        if ((dir < 0 && this.page === 0) || (dir > 0 && this.page === this.totalPages - 1)) {
                            this.overscrollHandler(dir);
                        } else {
                            this.scrollOrigin = this.page;
                            this.targetPage = Math.max(Math.min(this.page + dir, this.totalPages - 1), 0);
                            if (this.page !== this.targetPage) {
                                this.scrollTimer = 1;
                            }
                        }
                    }
                    this.touchFinger = -1;
                }
                break;
            }
        }
    }

    /**
     * Окончание касания
     * @param event
     * @private
     */
    private handleTouchEnd(event: TouchEvent) {
        for (let i = 0; i < event.changedTouches.length; i++) {
            const t = event.changedTouches[i];
            if (t.identifier === this.touchFinger) {
                this.touchFinger = -1;
                break;
            }
        }
    }

    /**
     * Обновление внешнего значения с изингом
     * @param value
     * @private
     */
    private updatePageWithEasing(value: number) {
        const full = Math.floor(value);
        const x = value % 1.0;
        const sub = x < 0.5 ? 4 * x * x * x : 1 - (-2 * x + 2) ** 3 / 2;
        this.updatePageHandler(full + sub, value);
    }
}

export function usePageScroll(enabled: boolean, slideTime: number, totalPages: number, overscrollFunc: (direction: number) => void, soundFunc: (() => void) | null = null) {
    const [offset, setOffset] = useState(0);
    const [rawOffset, setRawOffset] = useState(0);
    const handlerRef = useRef<ScrollHandler | null>(null);

    useEffect(() => {
        handlerRef.current = new ScrollHandler(
            offset,
            slideTime,
            totalPages,
            (page, rawPage) => {
                setOffset(page);
                setRawOffset(rawPage);
            },
            overscrollFunc,
            soundFunc,
        );
        handlerRef.current!.attach();

        return () => {
            handlerRef.current!.detach();
            handlerRef.current = null;
        };
    }, [slideTime, totalPages]);

    useEffect(() => {
        if (handlerRef.current) {
            handlerRef.current!.setEnabled(enabled);
        }
    }, [enabled]);

    return [offset, rawOffset];
}
