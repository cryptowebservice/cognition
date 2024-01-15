/**
 * Класс для обработки RAF
 */
export class FrameLoop {
    /**
     * Хендлер для покадрового вызова
     * @type {(delta: number) => void}
     * @private
     */
    private readonly handler: (delta: number) => void;

    /**
     * Индекс запроса RAF
     * @type {number}
     * @private
     */
    private rafHandle: number = 0;

    /**
     * Время последнего вызова апдейта
     * @type {number}
     * @private
     */
    private rafTime: number = 0;

    /**
     * Конструктор и запуск
     * @param {(delta: number) => void} handler
     */
    public constructor(handler: (delta: number) => void) {
        this.handler = handler;
        this.update = this.update.bind(this);
        this.update(performance.now());
    }

    /**
     * Остановка хендлера
     */
    public destroy() {
        cancelAnimationFrame(this.rafHandle);
        this.rafHandle = -1;
    }

    /**
     * Обновление логики
     * @param {number} time
     * @private
     */
    private update(time: number) {
        this.rafHandle = requestAnimationFrame(this.update);
        const delta = (time - this.rafTime) / 16.666;
        this.rafTime = time;
        this.handler(delta);
    }
}
