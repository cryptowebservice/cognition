import {
    CSSProperties, ReactNode, useEffect, useRef, useState,
} from 'react';
import WheelIndicator from 'wheel-indicator';
import './ScreenRoller.scss';

interface RollerProps {
    children: ReactNode,
    page?: number,
    disableScroll?: boolean,
    onScrollChange?: (value: number) => void,
    onPageChange?: (value: number) => void,
    onSoundEmit?: () => void
}

/**
 * Обработчик роллера
 */
class RollerManager {
    /**
     * Время на скролл в миллисекундах
     * @private
     */
    private static readonly SCROLL_TIME = 1000;

    /**
     * Разрешить скролл вообще
     * @private
     */
    private allowScroll: boolean = true;

    /**
     * Общее количество детей
     * @private
     */
    private slideCount: number = 1;

    /**
     * Текущая страница
     * @private
     */
    private page: number = 0;

    /**
     * Целевая страница
     * @private
     */
    private targetPage: number = 0;

    /**
     * Начальный оффсет при автоскролле
     * @private
     */
    private autoScrollStartOffset: number = 0;

    /**
     * Таймер для автоскролла
     * @private
     */
    private autoScrollCounter: number = 0;

    /**
     * Хендл для RequestAnimationFrame
     * @private
     */
    private rafHandle: number = 0;

    /**
     * Прошлый таймштамп скролла
     * @private
     */
    private rafPreviousTime: number = 0;

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
     * Метод для изменения оффсета
     * @private
     */
    private readonly changeScrollHandler: (value: number) => void;

    /**
     * Метод для изменения страницы
     * @private
     */
    private readonly changePageHandler: (value: number) => void;

    /**
     * Функция для вычисления кривой
     * @private
     */
    private readonly curveFunc: (value: number) => number;

    /**
     * Функция для звуков
     * @private
     */
    private readonly soundEmitFunc: (() => void) | undefined = undefined;

    /**
     * Привязка скролла
     * @private
     */
    private indicator: WheelIndicator | null = null;

    /**
     * Флаг на событие звука
     * @private
     */
    private soundEmitted: boolean = false;

    /**
     * Конструктор компонента
     */
    constructor(
        currentPage: number,
        changeHandler: (value: number) => void,
        pageHandler: (value: number) => void,
        curveFunc: (value: number) => number,
        soundEmitFunc: (() => void) | undefined = undefined,
    ) {
        this.page = currentPage;
        this.changeScrollHandler = changeHandler;
        this.changePageHandler = pageHandler;
        this.curveFunc = curveFunc;
        this.soundEmitFunc = soundEmitFunc;
        setTimeout(() => {
            this.changePageHandler(this.page);
            this.changeScrollHandler(this.page);
        }, 10);

        // Бинд ивентов на класс
        this.handleCalculation = this.handleCalculation.bind(this);
        this.handleScroll = this.handleScroll.bind(this);
        this.handleTouchStart = this.handleTouchStart.bind(this);
        this.handleTouchMove = this.handleTouchMove.bind(this);
        this.handleTouchEnd = this.handleTouchEnd.bind(this);
    }

    /**
     * Общая настройка параметров
     * @param childrenCount
     * @param allowScroll
     */
    public configure(childrenCount: number, allowScroll: boolean) {
        this.slideCount = childrenCount;
        this.allowScroll = allowScroll;
    }

    /**
     * Привязка ивентов смены слайдов
     */
    public attach() {
        this.indicator = new WheelIndicator({
            elem: document.body,
            callback: this.handleScroll,
            preventMouse: false,
        });

        this.rafPreviousTime = performance.now();
        this.handleCalculation(this.rafPreviousTime);

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
        cancelAnimationFrame(this.rafHandle);

        document.body.removeEventListener('touchstart', this.handleTouchStart);
        document.body.removeEventListener('touchmove', this.handleTouchMove);
        document.body.removeEventListener('touchend', this.handleTouchEnd);
        document.body.removeEventListener('touchcancel', this.handleTouchEnd);
    }

    /**
     * Перелистывание
     * @param page
     */
    public setPage(page: number) {
        if ((this.autoScrollCounter > 0 ? this.targetPage : this.page) !== page) {
            this.targetPage = page;
            this.autoScrollCounter = 1;
            this.autoScrollStartOffset = this.page;
        }
    }

    /**
     * Обработка колеса мыши или скролла по трекбару
     * @param event
     * @private
     */
    private handleScroll(event: WheelEvent) {
        if (this.allowScroll) {
            // Постраничный скролл
            if (event.deltaY !== 0) {
                if (this.autoScrollCounter === 0) {
                    this.targetPage = this.page + Math.sign(event.deltaY);
                    this.targetPage = Math.max(Math.min(this.targetPage, this.slideCount - 1), 0);
                    if (this.targetPage !== this.page) {
                        this.autoScrollCounter = 1.0;
                        this.autoScrollStartOffset = this.page;
                    }
                } else if (event.cancelable) event.preventDefault();
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
                    if (this.autoScrollCounter === 0 && this.allowScroll) {
                        this.targetPage = this.page - Math.sign(diff);
                        this.targetPage = Math.max(Math.min(this.targetPage, this.slideCount - 1), 0);
                        if (this.targetPage !== this.page) {
                            this.autoScrollCounter = 1.0;
                            this.autoScrollStartOffset = this.page;
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
     * Обработка всех переменных
     * @private
     */
    private handleCalculation(deltaTimeRaw: number) {
        requestAnimationFrame(this.handleCalculation);

        // Общие переменные
        const prevPage = this.page;
        const delta = (deltaTimeRaw - this.rafPreviousTime) / 16.666;
        this.rafPreviousTime = deltaTimeRaw;

        // Обработка автоскролла
        if (this.autoScrollCounter > 0) {
            // Звук
            if (!this.soundEmitted) {
                if (this.soundEmitFunc) this.soundEmitFunc();
                this.soundEmitted = true;
            }

            // Уменьшаем счетчик и двигаем экраны
            const change = 16.666 / RollerManager.SCROLL_TIME * delta;
            this.autoScrollCounter = Math.max(
                this.autoScrollCounter - change,
                0.0,
            );
            this.page = this.autoScrollStartOffset + (this.targetPage - this.autoScrollStartOffset) * (1.0 - this.curveFunc(this.autoScrollCounter));
            if (this.autoScrollCounter === 0) {
                this.soundEmitted = false;
                this.changePageHandler(this.page);
            }
        }

        // Передача изменений в компонент
        if (this.page !== prevPage) {
            this.changeScrollHandler(this.page);
        }
    }
}

/**
 * Компонент для полноэкранного роллера
 * @param props
 * @constructor
 */
export function ScreenRoller(props: RollerProps) {
    const [offset, setOffset] = useState(0);
    const [renderMask, setRenderMask] = useState<boolean[]>([]);
    const managerRef = useRef<RollerManager | null>(null);
    const {
        children,
        page,
        disableScroll,
        onScrollChange,
        onPageChange,
        onSoundEmit,
    } = props;
    const notifyNewPage = (page: number) => {
        if (onPageChange) onPageChange(page);
    };

    useEffect(() => {
        managerRef.current = new RollerManager(
            page ?? 0,
            (value) => setOffset(value),
            (value) => notifyNewPage(value),
            (x) => (x < 0.5 ? 4 * x * x * x : 1 - (-2 * x + 2) ** 3 / 2),
            onSoundEmit,
        );
        managerRef.current!.attach();
        return () => {
            managerRef.current!.detach();
            managerRef.current = null;
        };
    }, []);

    // Изменение параметров
    useEffect(() => {
        if (managerRef.current) {
            managerRef.current!.configure(
                Array.isArray(children) ? children.length : 1,
                !disableScroll,
            );
        }
    }, [children, page, disableScroll]);

    // Изменение скролла
    useEffect(() => {
        // Обработка рендер-маски
        const mask: boolean[] = Array(Array.isArray(children) ? children.length : 1).fill(false).map((val, idx) => {
            if (renderMask[idx]) return true;
            if (Math.floor(offset) === idx) return true;
            return (offset % 1.0) !== 0 && Math.ceil(offset) === idx;
        });
        setRenderMask(mask);

        // Отправка ивента
        if (onScrollChange) {
            onScrollChange(offset);
        }
    }, [offset]);

    // Смена страницы извне
    useEffect(() => {
        if (managerRef.current) {
            managerRef.current!.setPage(page as number);
        }
    }, [page]);

    // Создание массива блоков
    const items: ReactNode[] = (!Array.isArray(children) ? [children] : children).map((item, key) => {
        const style: CSSProperties = {};
        if (offset < key + 1 && offset > key - 1) {
            style.transform = `translateY(calc(var(--content-h) * (${(offset - key) * -1}))`;
            style.opacity = 1.5 - Math.abs(key - offset) * 4;
        } else {
            style.transform = 'translateY(-200vh)';
            style.visibility = 'hidden';
        }
        return (
            <div className="screen-roller__slide" key={key} style={style}>
                {renderMask[key] ? item : null}
            </div>
        );
    });

    // Рендер
    return (
        <div className="screen-roller">
            {items}
        </div>
    );
}
