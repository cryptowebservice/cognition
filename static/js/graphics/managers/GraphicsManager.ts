import { WebGLRenderer } from 'three';
import { isLowPower } from '../../hooks/useIsMobile';
import { GraphicsScene } from '../scenes/GraphicsScene';

const QUALITY_TIERS = [
    0.25,
    0.5,
    0.75,
    1.0,
    1.5,
];

export abstract class GraphicsManager {
    /**
     * Количество семплов для FPS
     * @private
     */
    private static readonly FPS_SAMPLES = 64;

    /**
     * Счетчик до проверки качества
     * @private
     */
    private static qualityCheckCounter = GraphicsManager.FPS_SAMPLES;

    /**
     * Счетчик для определения герцовки монитора
     * @private
     */
    private static monitorFreqCounter = 16;

    /**
     * Значения дельты для рассчета герцовки монитора
     * @private
     */
    private static monitorDeltaArray: number[] = [];

    /**
     * Полученная герцовка монитора
     * @private
     */
    private static monitorFrequency = 60;

    /**
     * Текущий активный менеджер
     * @private
     */
    private static activeManager: GraphicsManager;

    /**
     * Список всех менеджеров
     * @private
     */
    private static managers: GraphicsManager[] = [];

    /**
     * Индекс запроса для RequestAnimationFrame
     * @private
     */
    private static rafQuery: number = 0;

    /**
     * Прошлое время кадра
     * @private
     */
    private static rafTime: number = 0;

    /**
     * Текущее значение качества
     * @private
     */
    private static qualityTier = QUALITY_TIERS.indexOf(isLowPower() ? 0.5 : 1.0);

    /**
     * Флаг высвобождения контекста
     * @private
     */
    private disposed: boolean = false;

    /**
     * Связанный канвас
     * @private
     */
    private canvas: HTMLCanvasElement;

    /**
     * THREE-рендерер
     * @private
     */
    private readonly renderer: WebGLRenderer;

    /**
     * Флаг нахождения канваса в области видимости
     * @private
     */
    private inView: boolean = true;

    /**
     * Флаг на инициализацию
     * @private
     */
    private initialized: boolean = false;

    /**
     * Обновление сцен
     * @private
     */
    private scenes: GraphicsScene[] = [];

    /**
     * Значения FPS для взвешенного вычисления
     * @private
     */
    private static fpsSamples: number[] = [];

    /**
     * Текущее значение FPS
     * @private
     */
    private static fps: number = 0;

    /**
     * Конструктор менеджера
     * @param canvas
     */
    protected constructor(canvas: HTMLCanvasElement) {
        this.disposed = false;
        this.initialized = false;
        this.canvas = canvas;
        this.renderer = new WebGLRenderer({
            canvas,
            antialias: false,
            depth: false,
            powerPreference: 'high-performance',
        });

        GraphicsManager.managers.push(this);
        console.log('[GraphicsManager] Subscribed new instance');

        if (GraphicsManager.managers.length === 1) {
            console.log('[GraphicsManager] Starting renderer');

            // Запуск рендера и подписка на ивенты
            setTimeout(() => {
                GraphicsManager.resizeEvent = GraphicsManager.resizeEvent.bind(GraphicsManager);
                GraphicsManager.scrollEvent = GraphicsManager.scrollEvent.bind(GraphicsManager);
                GraphicsManager.renderLoop = GraphicsManager.renderLoop.bind(GraphicsManager);
                GraphicsManager.resizeEvent();
                GraphicsManager.renderLoop(performance.now());

                window.addEventListener('resize', GraphicsManager.resizeEvent);
                window.addEventListener('scroll', GraphicsManager.scrollEvent);
            }, 0);
        }
    }

    /**
     * Высвобождение рендера
     * @param releaseScenes
     */
    public dispose(releaseScenes: boolean = true) {
        // Удаление из общей подписки
        const idx = GraphicsManager.managers.indexOf(this);
        if (idx !== -1) {
            GraphicsManager.managers.splice(idx, 1);
        }

        // Если нужно снести сцены - сносим
        if (releaseScenes) {
            for (const scene of this.scenes) {
                scene.sceneRemoved();
                scene.disposeScene();
            }
        }

        // Остановка RAF, если это последний менеджер
        console.log('[GraphicsManager] Unsubscribed');
        if (GraphicsManager.managers.length === 0) {
            cancelAnimationFrame(GraphicsManager.rafQuery);
            GraphicsManager.rafQuery = 0;
            console.log('[GraphicsManager] Stopping whole render');
        }
    }

    /**
     * Обновление логики сцен
     * @param tween
     * @private
     */
    private updateSceneLogic(tween: number) {
        this.update(tween);
        for (const scene of this.scenes) {
            if (scene.active) {
                scene.updateLogic(tween);
            }
        }
    }

    /**
     * Обновление размеров экранов
     * @private
     */
    private resize() {
        const dpi = window.devicePixelRatio;
        const quality = QUALITY_TIERS[GraphicsManager.qualityTier];
        const rect = this.canvas.getBoundingClientRect();
        rect.x = 0;
        rect.y = 0;
        const pixelWidth = rect.width * quality * dpi;
        const pixelHeight = rect.height * quality * dpi;
        this.canvas.width = pixelWidth;
        this.canvas.height = pixelHeight;
        this.renderer.setSize(pixelWidth, pixelHeight, false);
        for (const scene of this.scenes) {
            scene.resize(rect, quality, dpi);
        }
    }

    /**
     * Рендеринг сцен
     * @private
     */
    private renderScenes() {
        const list = [...this.scenes]
            .filter((scene) => scene.active)
            .map((item) => ({
                scene: item,
                weight: item.getOrder(),
            }))
            .sort((a, b) => b.weight - a.weight);

        this.renderer.setRenderTarget(null);
        this.renderer.setClearColor(0x000000, 0);
        this.renderer.clear();
        for (const item of list) {
            item.scene.renderFrame(this.renderer, 1, 1);
        }
    }

    /**
     * Добавление сцены
     * @param scene
     */
    public addScene(scene: GraphicsScene) {
        if (!this.scenes.includes(scene)) {
            this.scenes.push(scene);
            this.resize();
            scene.sceneAdded();
        }
    }

    /**
     * Удаление сцены
     * @param scene
     */
    public removeScene(scene: GraphicsScene) {
        if (this.scenes.includes(scene)) {
            this.scenes.splice(this.scenes.indexOf(scene), 1);
            scene.sceneRemoved();
        }
    }

    /**
     * Проверка на инит
     */
    public isInitialized() {
        return this.initialized;
    }

    /**
     * Внутренний инит ресурсов
     * @protected
     */
    protected abstract init(): void;

    /**
     * Обновление всего менеджера
     * @param tween
     * @protected
     */
    protected abstract update(tween: number): void;

    /**
     * Циклическая отрисовка
     * @private
     */
    private static renderLoop(elapsed: number) {
        this.rafQuery = requestAnimationFrame(this.renderLoop);
        const delta = (elapsed - this.rafTime) / 16.666;
        this.rafTime = elapsed;

        // Обновление FPS
        if (this.fpsSamples.length >= this.FPS_SAMPLES) {
            this.fpsSamples = this.fpsSamples.slice(this.fpsSamples.length - this.FPS_SAMPLES + 1, this.fpsSamples.length);
        }
        this.fpsSamples.push((1.0 / delta) * 60.0);
        this.fps = this.fpsSamples.reduce(((previousValue, item) => previousValue + item));
        this.fps = Math.ceil(this.fps / this.fpsSamples.length);

        // Высчитывание герцовки монитора
        if (this.monitorFreqCounter > 0) {
            if (this.monitorFreqCounter < 10) {
                this.monitorDeltaArray.push((1.0 / delta) * 60.0);
            }
            this.monitorFreqCounter--;
            if (this.monitorFreqCounter === 0) {
                this.monitorFrequency = Math.ceil(this.monitorDeltaArray.reduce(((previousValue, item) => previousValue + item)) / this.monitorDeltaArray.length);
                console.log(`[GraphicsManager] Screen refresh rate - ${this.monitorFrequency}hz`);
            }
            return;
        }

        // Обработка повышения/понижения качества
        if (this.qualityCheckCounter === 0) {
            const targetQuality = this.qualityTier;
            if (this.fps < 40) {
                // targetQuality = Math.max(this.qualityTier - 1, 0);
            } else if (this.fps > 65) {
                // targetQuality = Math.min(this.qualityTier + 1, QUALITY_TIERS.length - 1);
            }
            if (targetQuality !== this.qualityTier) {
                this.qualityTier = targetQuality;
                for (const man of this.managers) {
                    GraphicsManager.activeManager = man;
                    man.resize();
                }
            }
            this.qualityCheckCounter = this.FPS_SAMPLES;
        } else {
            this.qualityCheckCounter--;
        }

        // Обновление логики экранов
        for (const man of this.managers) {
            GraphicsManager.activeManager = man;
            if (!man.initialized) {
                man.initialized = true;
                man.init();
            }
            man.updateSceneLogic(delta);
        }

        // Рендер
        for (const man of this.managers) {
            GraphicsManager.activeManager = man;
            man.renderScenes();
        }
    }

    /**
     * Определение ресайза
     * @private
     */
    private static resizeEvent() {
        for (const man of this.managers) {
            man.resize();
        }
        this.scrollEvent();
    }

    /**
     * Обновление логики видимости
     * @private
     */
    private static scrollEvent() {
        for (const man of this.managers) {
            if (man.canvas) {
                const rect = man.canvas.getBoundingClientRect();
                if (rect) {
                    man.inView = (
                        rect.top >= 0
                        && rect.left >= 0
                        && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)
                        && rect.right <= (window.innerWidth || document.documentElement.clientWidth)
                    );
                } else {
                    man.inView = false;
                }
            }
        }
    }

    /**
     * Получение активного рендера
     */
    public static getActiveRenderer() {
        if (GraphicsManager.activeManager) {
            return GraphicsManager.activeManager.renderer;
        }
        return null;
    }

    /**
     * Получение FPS
     */
    public static getFPS() {
        return this.fps;
    }
}
