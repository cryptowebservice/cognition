import {
    Material,
    Mesh,
    MeshBasicMaterial,
    OrthographicCamera,
    PlaneBufferGeometry,
    Scene,
    WebGLRenderer,
    WebGLRenderTarget,
} from 'three';

/**
 * Статус сцены
 */
export enum SceneState {
    None,
    Loading,
    Loaded,
    Active,
    Disposed,
}

/**
 * Сцена-экран
 */
export abstract class GraphicsScene {
    /**
     * Ортографическая камера
     * @private
     */
    private static planeCamera: OrthographicCamera;

    /**
     * Буффер для отрисовки сцены
     * @private
     */
    private readonly buffer: WebGLRenderTarget;

    /**
     * Вложенная тришная сцена
     * @private
     */
    protected readonly scene: Scene;

    /**
     * Колбэк на загрузку сцены
     */
    public onReady: ((scene: GraphicsScene) => void) | null = null;

    /**
     * Плейн для рендеринга сцены
     * @private
     */
    private plane: Mesh | null = null;

    /**
     * Материал для плейна
     * @private
     */
    private planeMaterial: MeshBasicMaterial | null = null;

    /**
     * Статус сцены
     * @private
     */
    private state: SceneState = SceneState.None;

    /**
     * Размер сцены
     * @private
     */
    private size: DOMRect;

    /**
     * Флаг на ресайз
     * @private
     */
    private resized: boolean = false;

    /**
     * Флаг активной сцены
     * @private
     */
    public active: boolean = true;

    /**
     * Конструктор сцены
     */
    public constructor() {
        this.buffer = new WebGLRenderTarget(100, 100, {
            depthBuffer: true,
        });
        this.size = new DOMRect(0, 0, 100, 100);
        this.scene = new Scene();
    }

    /**
     * Обновление логики сцены
     * @param delta
     */
    public updateLogic(delta: number) {
        if (this.state === SceneState.Loaded) {
            this.sceneAdded();
        }
        if (this.state === SceneState.Active) {
            this.update(delta);
        }
    }

    /**
     * Отрисовка одного кадра
     */
    public renderFrame(renderer: WebGLRenderer, quality: number = 1.0, fullSize: number = 1.0) {
        if (this.state !== SceneState.Active) return;

        // Отрисовка фрейма
        if (this.needRepaint() || this.resized) {
            renderer.setRenderTarget(this.buffer);
            renderer.setClearColor(0x000000, 0);
            renderer.clear();
            this.render(renderer, this.buffer);
            this.resized = false;
        }

        // Отрисовка плейна с текстурой
        const mat = this.getPlaneMaterial(this.buffer);
        this.checkRenderPlane();
        this.plane!.material = mat || this.planeMaterial!;
        renderer.setRenderTarget(null);
        renderer.render(this.plane as Mesh, GraphicsScene.planeCamera);
    }

    /**
     * Внешняя предзагрузка ресурсов
     * @protected
     */
    public async preloadResources() {
        if (this.state === SceneState.None) {
            this.state = SceneState.Loading;
            try {
                await this.load();
                this.state = SceneState.Loaded;
                if (this.onReady) {
                    this.onReady(this);
                }
            } catch (ex) {
                this.state = SceneState.Disposed;
                console.warn('Сцена не загрузилась', ex);
            }
        }
    }

    /**
     * Сцена добавляется в список
     */
    public sceneAdded() {
        if (this.state === SceneState.Loaded) {
            this.state = SceneState.Active;
            this.enter();
        }
    }

    /**
     * Сцена удаляется из списка
     */
    public sceneRemoved() {
        if (this.state === SceneState.Active) {
            this.state = SceneState.Loaded;
            this.leave();
        }
    }

    /**
     * Удаление ресурсов сцены
     */
    public disposeScene() {
        if (this.state === SceneState.Active || this.state === SceneState.Loaded) {
            this.dispose();
            this.state = SceneState.Disposed;

            if (this.buffer) {
                this.buffer.dispose();
            }
            if (this.plane) {
                this.plane.geometry.dispose();
            }
        }
    }

    /**
     * Предзагрузка ресурсов
     * @protected
     */
    protected abstract load(): Promise<void>;

    /**
     * Активация экрана
     * @protected
     */
    protected abstract enter(): void;

    /**
     * Деактивация экрана
     * @protected
     */
    protected abstract leave(): void;

    /**
     * Освобождение ресурсов
     * @protected
     */
    protected abstract dispose(): void;

    /**
     * Внутреннее обновление логики сцены
     * @param delta
     * @protected
     */
    protected abstract update(delta: number): void;

    /**
     * Отрисовка сцены
     * @param renderer
     * @param targetBuffer
     * @protected
     */
    protected abstract render(renderer: WebGLRenderer, targetBuffer: WebGLRenderTarget): void;

    /**
     * Обновление сцены
     * @param size
     * @param quality
     * @param pixelRatio
     */
    public resize(size: DOMRect, quality: number = 1.0, pixelRatio: number = 1) {
        this.size = new DOMRect(
            size.x,
            size.y,
            size.width * quality * pixelRatio,
            size.height * quality * pixelRatio,
        );
        this.buffer.setSize(this.size.width, this.size.height);
        this.resized = true;
    }

    /**
     * Очередь сцены
     */
    public getOrder() {
        return 0;
    }

    /**
     * Получение размера для рендера
     * @protected
     */
    protected getSize() {
        return this.size;
    }

    /**
     * Провека что сцену надо перерисовывать
     * @protected
     */
    protected needRepaint() {
        return true;
    }

    /**
     * Получение материала для рендера плейна
     * @protected
     */
    protected getPlaneMaterial(renderTarget: WebGLRenderTarget): Material | null {
        return null;
    }

    /**
     * Подготовка рендер-плейна и камеры
     * @private
     */
    private checkRenderPlane() {
        if (!this.planeMaterial) {
            this.planeMaterial = new MeshBasicMaterial({
                map: this.buffer.texture,
                transparent: true,
                depthTest: false,
            });
        }
        if (!this.plane) {
            const geom = new PlaneBufferGeometry(2, 2);
            this.plane = new Mesh(geom, this.planeMaterial);
        }
        if (!GraphicsScene.planeCamera) {
            GraphicsScene.planeCamera = new OrthographicCamera(-1, 1, 1, -1, -5, 10);
        }
    }
}
