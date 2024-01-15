import {
    MathUtils, Vector2, Vector3, WebGLRenderer, WebGLRenderTarget,
} from 'three';
import configs from '../../configs/AndroidConfigs';
import { setAndroidModuleSetup } from '../../store/editor';
import { VideoPlane } from '../entities/VideoPlane';
import { GraphicsScene } from './GraphicsScene';

/**
 * Сцена с редактором андроидов
 */
export class EditorVideoScene extends GraphicsScene {
    /**
     * Оригинальная позиция камеры
     * @private
     */
    private readonly CAMERA_ORIGIN = new Vector3(0, 1.7, 1.3);

    /**
     * Функция для обработки транзишна
     * @private
     */
    private readonly onTransition: ((value: number) => void) | null;

    /**
     * Выбранный андроид
     * @private
     */
    private readonly androidIndex: number;

    /**
     * Переменная для вращения робота
     * @private
     */
    private rotateValue: number = 0;

    /**
     * Группа, куда зуммировать
     * @private
     */
    private currentGroup: number = 0;

    /**
     * Множитель для перехода к группе
     * @private
     */
    private currentGroupDelta: number = 0;

    /**
     * Флаг для перемещения камеры
     * @private
     */
    private currentGroupActive: boolean = false;

    /**
     * Плейн для отрисовки видео
     * @type {VideoPlane}
     * @private
     */
    private video: VideoPlane;

    /**
     * Конструктор
     * @param index
     * @param onTransition
     */
    constructor(index: number, onTransition: ((value: number) => void) | null) {
        super();
        this.androidIndex = index;
        this.onTransition = onTransition;
        this.video = new VideoPlane(index);
    }

    /**
     * Установка уровней андройда
     * @param levels
     */
    public setModules(...levels: number[]) {
        setAndroidModuleSetup(levels.join('').slice(0, 6));
    }

    /**
     * Включение подъезда камеры
     * @param groupIndex
     */
    public setModuleView(groupIndex: number) {
        this.currentGroupActive = true;
        this.currentGroup = groupIndex;
    }

    /**
     * Отключение камеры на общий план
     */
    public setOverallView() {
        this.currentGroupActive = false;
    }

    /**
     * Загрузка ресурсов пресета
     * @protected
     */
    protected async load() {
        return Promise.resolve();
    }

    /**
     * Вхождение на экран
     * @protected
     */
    protected enter(): void {

    }

    /**
     * Рендер сцены
     * @param renderer
     * @param targetBuffer
     * @protected
     */
    protected render(renderer: WebGLRenderer, targetBuffer: WebGLRenderTarget): void {
        this.video.render(renderer);
    }

    /**
     * Обновление сцены
     * @param delta
     * @protected
     */
    protected update(delta: number): void {
        // Изменение текущего перехода
        const modifier = 0.013 * delta;
        const prev = this.currentGroupDelta;
        if (this.currentGroupActive) {
            this.currentGroupDelta = Math.min(this.currentGroupDelta + modifier, 1.0);
        } else {
            this.currentGroupDelta = Math.max(this.currentGroupDelta - modifier, 0.0);
        }
        const alpha = this.currentGroupDelta < 0.5
            ? 8 * (this.currentGroupDelta ** 4)
            : 1 - (-2 * this.currentGroupDelta + 2) ** 4 / 2;
        if (this.currentGroupDelta !== prev && this.onTransition) {
            this.onTransition(this.currentGroupDelta);
        }

        let camPos = new Vector2(0, 0);
        let camZoom = 1;
        if (configs[this.androidIndex] && configs[this.androidIndex].groups[this.currentGroup]) {
            camPos = configs[this.androidIndex].groups[this.currentGroup].cameraVideo ?? new Vector2(0, 0);
            camZoom = configs[this.androidIndex].groups[this.currentGroup].cameraZoomVideo ?? 1.3;
        }

        this.video.changeOffset(
            new Vector2(0, 0).lerp(camPos, alpha),
            MathUtils.lerp(1, camZoom, alpha),
            alpha,
        );
        this.video.update(delta);

        // Оставить для полноценного видео-контейнера
        // const original = androidVideoCamera.getState();
        // if (!original.position.equals(camPos) || original.zoom !== camZoom || original.shift !== alpha) {
        //     setAndroidVideoCamera({
        //         position: camPos,
        //         zoom: camZoom,
        //         shift: alpha,
        //     });
        // }
    }

    /**
     * Уход со сцены
     * @protected
     */
    protected leave(): void {
        this.video.destroy();
    }

    /**
     * Высвобождение ресурсов
     * @protected
     */
    protected dispose(): void {

    }

    /**
     * Ресайз сцены
     * @param size
     * @param quality
     * @param pixelRatio
     */
    public resize(size: DOMRect, quality: number = 1.0, pixelRatio: number = 1) {
        super.resize(size, quality, pixelRatio);
        this.video.updateAspect(size.width / size.height);
    }
}
