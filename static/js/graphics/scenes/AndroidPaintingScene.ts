import {
    CubicBezierCurve,
    CubicBezierCurve3,
    Euler,
    IUniform,
    Matrix4,
    Quaternion,
    ShaderMaterial,
    Texture,
    Vector2,
    Vector3,
    WebGLRenderer,
    WebGLRenderTarget,
} from 'three';
import { addLoadingStep, advanceLoading, loadingCompleteStore } from '../../store/loading';
import { currentScrollStore } from '../../store/page';
import { StatusText } from '../entities/StatusText';
import { CURRENT_THEME } from '../helpers/LandingTheme';
import { AnnaPreset } from '../presets/splash/AnnaPreset';
import { KiraPreset } from '../presets/splash/KiraPreset';
import { NicolePreset } from '../presets/splash/NicolePreset';
import { NikitaPreset } from '../presets/splash/NikitaPreset';
import { SarahPreset } from '../presets/splash/SarahPreset';
import { SplashPreset } from '../presets/splash/SplashPreset';
import GreyscaleFragmentCode from '../shaders/passes/greyscale.frag.glsl';
import GreyscaleVertexCode from '../shaders/passes/greyscale.vert.glsl';
import { GraphicsScene } from './GraphicsScene';
import { AndroidPaintingPipeline } from './pipelines/AndroidPaintingPipeline';

const ANDROID_PRESETS = [
    NicolePreset,
    NikitaPreset,
    AnnaPreset,
    SarahPreset,
    KiraPreset,
];

/**
 * Нода расположения камеры
 */
interface CameraNode {
    position: Vector3,
    rotation: Quaternion,
    zoom: number,
    greyscale?: number,
    disabled?: number,
}

interface CameraAnimationNode {
    positionCurve: CubicBezierCurve3,
    targetCurve: CubicBezierCurve3,
    zoomCurve: CubicBezierCurve,
    duration: number,
    disabled?: number,
    greyscale?: number,
    lerpFunc?: (value: number) => number
}

function eulerToQuat(x: number, y: number, z: number): Quaternion {
    return new Quaternion().setFromEuler(new Euler(x, y, z, 'YXZ'));
}

/**
 * Сцена с андроидом
 */
export class AndroidPaintingScene extends GraphicsScene {
    /**
     * Внутренние позиции камеры
     * @private
     */
    private static readonly CAMERA_POSITIONS: (CameraNode | CameraAnimationNode)[] = [
        {
            positionCurve: new CubicBezierCurve3(
                new Vector3(0.30, 0.50, 0.1),
                new Vector3(0.25, 0.55, 0),
                new Vector3(-0.20, 0.55, 0),
                new Vector3(-0.30, 0.55, 0.20),
            ),
            targetCurve: new CubicBezierCurve3(
                new Vector3(0, -3, -10),
                new Vector3(0, -2, -10),
                new Vector3(0, 0, -10),
                new Vector3(6, -1.5, -8),
            ),
            zoomCurve: new CubicBezierCurve(
                new Vector2(2.0, 0),
                new Vector2(2.0, 0),
                new Vector2(1.0, 0),
                new Vector2(1.2, 0),
            ),
            lerpFunc: (x: number) => (x < 0.5 ? 4 * (x ** 3) : 1 - ((-2 * x + 2) ** 3) / 2),
            duration: 8000,
        },
        {
            position: new Vector3(-0.30, 0.55, 0.20),
            rotation: eulerToQuat(-0.18, -0.5, 0),
            zoom: 1.5,
            greyscale: 1,
        },
        {
            position: new Vector3(-0.30, 0.45, 0.20),
            rotation: eulerToQuat(0.12, -0.8, 0),
            zoom: 1.8,
            greyscale: 1,
        },
        {
            position: new Vector3(-0.30, 0.55, 0.10),
            rotation: eulerToQuat(-0.2, -1, 0),
            zoom: 2.5,
            greyscale: 1,
        },
        {
            position: new Vector3(-0.00, 0.8, 0.0),
            rotation: eulerToQuat(-1.2, 0.0, 0),
            zoom: 1.5,
            greyscale: 1,
        },
        {
            position: new Vector3(0.45, 0.35, 0.1),
            rotation: eulerToQuat(0.2, 1.1, 0),
            zoom: 1.8,
            greyscale: 1,
        },
        {
            position: new Vector3(-0.20, 0.55, 0.20),
            rotation: eulerToQuat(-0.18, -0.5, 0),
            zoom: 1.5,
            greyscale: 1,
        },
        {
            position: new Vector3(-0.30, 0.55, 0.20),
            rotation: eulerToQuat(-0.25, -0.7, 0),
            zoom: 1,
            greyscale: 1,
        },
    ];

    /**
     * Пресет модели
     * @private
     */
    private readonly preset: SplashPreset;

    /**
     * Рендер-пайплайн
     * @private
     */
    private readonly pipeline: AndroidPaintingPipeline;

    /**
     * Текущий индекс камеры
     * @private
     */
    private cameraFrame: number;

    /**
     * Счетчик для покачивания камеры
     * @private
     */
    private cameraSine: number;

    /**
     * Состояние расположения камеры
     * @private
     */
    private cameraState: CameraNode;

    /**
     * Фрейм, который анимируется
     * @type {number}
     * @private
     */
    private animationValues: number[] = Array(AndroidPaintingScene.CAMERA_POSITIONS.length).fill(0);

    /**
     * Материал для ЧБ-прохода
     * @private
     */
    private readonly postMaterial: ShaderMaterial;

    /**
     * Экранные тексты
     * @private
     */
    private readonly screenTexts: StatusText;

    /**
     * Общий конструктор
     */
    constructor() {
        super();
        this.preset = new ANDROID_PRESETS[CURRENT_THEME()]();
        this.pipeline = new AndroidPaintingPipeline();
        this.cameraState = {
            position: new Vector3(),
            rotation: new Quaternion().identity(),
            zoom: 1,
            disabled: 0,
            greyscale: 0,
        };
        this.cameraFrame = 0.01;
        this.cameraSine = 0;
        this.animationValues = this.animationValues.fill(0);
        this.postMaterial = new ShaderMaterial({
            vertexShader: GreyscaleVertexCode,
            fragmentShader: GreyscaleFragmentCode,
            uniforms: {
                map: {
                    value: null,
                } as IUniform<Texture | null>,
                colorAmount: {
                    value: 0.0,
                },
            },
        });
        this.screenTexts = new StatusText();
    }

    /**
     * Загрузка ресурсов
     * @protected
     */
    protected async load() {
        addLoadingStep(8);
        await this.preset.preload();
        await this.pipeline.preload();
        setTimeout(() => {
            advanceLoading(8);
        }, 1000);
    }

    /**
     * Активация экрана
     * @protected
     */
    protected enter() {
        this.handleCameraResize();
        this.preset.attach(this.scene);
        this.pipeline.attach(this.scene);
        this.screenTexts.attach(this.scene);
        this.cameraFrame = -1;
    }

    /**
     * Уход со сцены
     * @protected
     */
    protected leave() {
        this.preset.detach(this.scene);
        this.pipeline.detach();
        this.screenTexts.detach(this.scene);
    }

    /**
     * Обновление логики сцены
     * @param delta
     * @protected
     */
    protected update(delta: number) {
        // Обновление состояния камеры
        const DEBUG_CAMERA = false;
        const targetFrame = currentScrollStore.getState();
        const firstIndex = Math.min(Math.floor(targetFrame), AndroidPaintingScene.CAMERA_POSITIONS.length - 1);
        const secondIndex = Math.min(Math.floor(targetFrame) + 1, AndroidPaintingScene.CAMERA_POSITIONS.length - 1);
        const alpha = targetFrame % 1.0;
        this.cameraFrame = targetFrame;

        // Обновление анимации
        if (loadingCompleteStore.getState()) {
            for (const animIndex of [firstIndex, secondIndex]) {
                const anim = AndroidPaintingScene.CAMERA_POSITIONS[animIndex];
                if ('duration' in anim) {
                    this.animationValues[animIndex] = Math.min(
                        this.animationValues[animIndex] + (delta * 16.666 / anim.duration),
                        1.0,
                    );
                }
            }
        }

        // Интерполяция текущего кадра
        this.cameraState = this.interpolateCamera(
            this.fetchCameraState(firstIndex),
            this.fetchCameraState(secondIndex),
            alpha,
        );

        if (DEBUG_CAMERA) {
            this.cameraState.position = new Vector3(0, 0.45, 0.5);
            this.cameraState.rotation = new Quaternion().identity();
            this.cameraState.zoom = 1;
        }

        // Покачивание камеры
        this.cameraSine = (this.cameraSine + 0.005 * delta * (1.0 - this.cameraState.disabled!)) % (Math.PI * 2);
        const camBob = new Quaternion().setFromEuler(new Euler(
            Math.sin(this.cameraSine * 2.0) * 0.01,
            Math.sin(this.cameraSine) * 0.01,
            0,
            'YXZ',
        ));
        if (DEBUG_CAMERA) {
            camBob.identity();
        }

        // Применение интерполяции к кадру
        this.pipeline.updateCamera(
            this.cameraState.position,
            this.cameraState.rotation.clone().multiply(camBob),
            this.cameraState.zoom,
        );

        // Обновляем пресет (если нужно)
        this.preset.update(delta * (1.0 - this.cameraState.disabled!));
        this.screenTexts.update(delta);
    }

    /**
     * Рендер сцены
     * @param renderer
     * @param targetBuffer
     * @protected
     */
    protected render(renderer: WebGLRenderer, targetBuffer: WebGLRenderTarget) {
        this.preset.prepareForRender(this.pipeline);
        this.pipeline.render(renderer, targetBuffer);
    }

    /**
     * Высвобождение моделей
     * @protected
     */
    protected dispose() {
        this.preset.release();
        this.pipeline.release();
    }

    /**
     * Ресайз сцены
     * @param size
     * @param quality
     * @param pixelRatio
     */
    public resize(size: DOMRect, quality: number = 1.0, pixelRatio: number = 1) {
        super.resize(size, quality, pixelRatio);
        this.handleCameraResize();
    }

    /**
     * Обновление размеров камеры
     * @private
     */
    private handleCameraResize() {
        const { width, height } = this.getSize();
        this.pipeline.updateSize(width, height);
    }

    /**
     * Получение стейта камеры
     * @param {number} frameIndex
     * @returns {CameraNode}
     * @private
     */
    private fetchCameraState(frameIndex: number): CameraNode {
        const idx = Math.floor(frameIndex);
        const f = AndroidPaintingScene.CAMERA_POSITIONS[idx];
        if ('duration' in f) {
            const rawValue = this.animationValues[idx];
            const animValue = f.lerpFunc ? f.lerpFunc(rawValue) : rawValue;
            const zoom = f.zoomCurve.getPoint(animValue).x;
            const pos = f.positionCurve.getPoint(animValue);
            const target = f.targetCurve.getPoint(animValue);
            const rot = new Quaternion().setFromRotationMatrix(new Matrix4()
                .lookAt(
                    new Vector3(0, 0, 0),
                    target.clone().sub(pos),
                    new Vector3(0, 1, 0),
                ));
            return {
                position: pos,
                rotation: rot,
                zoom,
                disabled: 0,
                greyscale: 0,
            };
        }
        return f;
    }

    /**
     * Интерполяция двух нод камеры
     * @param {CameraNode} from
     * @param {CameraNode} to
     * @param {number} alpha
     * @private
     */
    private interpolateCamera(from: CameraNode, to: CameraNode, alpha: number): CameraNode {
        const disableFirst = from.disabled ?? 0;
        const disableSecond = to.disabled ?? 0;
        const greyscaleFirst = from.greyscale ?? 0;
        const greyscaleSecond = to.greyscale ?? 0;
        return {
            position: from.position.clone().lerp(to.position, alpha),
            rotation: from.rotation.clone().slerp(to.rotation, alpha),
            zoom: from.zoom + (to.zoom - from.zoom) * alpha,
            disabled: disableFirst + (disableSecond - disableFirst) * alpha,
            greyscale: greyscaleFirst + (greyscaleSecond - greyscaleFirst) * alpha,
        };
    }

    /**
     * Флаг на ререндер
     * @protected
     */
    protected needRepaint(): boolean {
        return this.cameraState.disabled! < 1 || (this.cameraFrame % 1.0) !== 0;
    }

    /**
     * Получение материала для рендера прохода
     * @param renderTarget
     * @protected
     */
    protected getPlaneMaterial(renderTarget: WebGLRenderTarget): ShaderMaterial {
        this.postMaterial.uniforms.map.value = renderTarget.texture;
        this.postMaterial.uniforms.colorAmount.value = 1.0 - this.cameraState.greyscale!;
        return this.postMaterial;
    }
}
