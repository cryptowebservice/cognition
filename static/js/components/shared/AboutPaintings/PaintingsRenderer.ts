import {
    DoubleSide,
    Matrix4,
    Mesh,
    OrthographicCamera,
    PlaneBufferGeometry,
    ShaderMaterial,
    Texture,
    WebGLRenderer,
} from 'three';
import { DisplaceCanvasTexture } from '../../../graphics/entities/DisplaceCanvasTexture';
import { FrameLoop } from '../../../graphics/helpers/FrameLoop';
import { TextureLoader } from '../../../graphics/helpers/TextureLoader';
import MixFragCode from '../../../graphics/shaders/editor/editor_mix.frag.glsl';
import MixVertCode from '../../../graphics/shaders/editor/editor_mix.vert.glsl';

/**
 * Перемешанные пути до текстур картин
 * @type {string[]}
 */
const TEXTURE_PATHS = Array.from(Array(39).keys()).map((idx) => `/textures/paintings/painting_${idx + 1}`);
for (let i = TEXTURE_PATHS.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [TEXTURE_PATHS[i], TEXTURE_PATHS[j]] = [TEXTURE_PATHS[j], TEXTURE_PATHS[i]];
}

/**
 * Класс для рендера галереи картин
 */
export class PaintingsRenderer {
    /**
     * Время одного слайда в мс
     * @type {number}
     * @private
     */
    private static readonly DISPLAY_TIME = 2000;

    /**
     * Время смены слайдов в мс
     * @type {number}
     * @private
     */
    private static readonly CHANGE_TIME = 750;

    // 450 для анимации без пикселей

    /**
     * Активен ли рендер
     * @type {boolean}
     * @private
     */
    private enabled: boolean;

    /**
     * Рендерер
     * @type {WebGLRenderer}
     * @private
     */
    private renderer: WebGLRenderer;

    /**
     * Целевой канвас
     * @type {HTMLCanvasElement}
     * @private
     */
    private canvas: HTMLCanvasElement;

    /**
     * Обработчик для RAF
     * @type {FrameLoop | null}
     * @private
     */
    private loop: FrameLoop | null = null;

    /**
     * Ортокамера
     * @type {OrthographicCamera}
     * @private
     */
    private readonly camera: OrthographicCamera;

    /**
     * Плейн с текстурой
     * @type {Mesh}
     * @private
     */
    private readonly plane: Mesh;

    /**
     * Материал для обычного прохода
     * @type {ShaderMaterial}
     * @private
     */
    private simpleMat: ShaderMaterial;

    /**
     * Материал для транзишна
     * @type {ShaderMaterial}
     * @private
     */
    private transitionMat: ShaderMaterial;

    /**
     * Канвас с текстурой дисплейса
     * @type {DisplaceCanvasTexture}
     * @private
     */
    private displaceCanvas: DisplaceCanvasTexture;

    /**
     * Кеш загруженных текстур
     * @type {(Texture | null)[]}
     * @private
     */
    private textureCache: (Texture | null)[] = Array(TEXTURE_PATHS.length).fill(null);

    /**
     * Индекс текущей картины
     * @type {number}
     * @private
     */
    private index: number = 0;

    /**
     * Таймер для первоначального проявления
     * @type {number}
     * @private
     */
    private appear: number = 0;

    /**
     * Таймер отображения слайда
     * @type {number}
     * @private
     */
    private displayTimer: number = 0;

    /**
     * Таймер перехода
     * @type {number}
     * @private
     */
    private changeTimer: number = 0;

    /**
     * Счетчик для замедления дисплейса
     * @type {number}
     * @private
     */
    private displaceFrameSkip: number = 0;

    /**
     * Флаг загрузки текстуры
     * @type {boolean}
     * @private
     */
    private loadingTexture: boolean = false;

    /**
     * Конструктор рендера
     * @param {HTMLCanvasElement} canvas
     */
    public constructor(canvas: HTMLCanvasElement) {
        this.enabled = false;
        this.canvas = canvas;
        this.handleFrame = this.handleFrame.bind(this);
        this.resize = this.resize.bind(this);

        this.renderer = new WebGLRenderer({
            canvas,
            antialias: false,
            depth: false,
            stencil: false,
        });
        this.camera = new OrthographicCamera(-0.5, 0.5, -0.5, 0.5, -1, 1);

        this.displaceCanvas = new DisplaceCanvasTexture(256, false);

        const tempTex = new Texture();
        this.simpleMat = new ShaderMaterial({
            fragmentShader: MixFragCode,
            vertexShader: MixVertCode,
            side: DoubleSide,
            defines: {
                TINT: true,
            },
            uniforms: {
                map: {
                    value: tempTex,
                },
                tint: {
                    value: 0,
                },
                transformMatrix: {
                    value: new Matrix4().identity(),
                },
            },
        });
        this.transitionMat = new ShaderMaterial({
            fragmentShader: MixFragCode,
            vertexShader: MixVertCode,
            side: DoubleSide,
            defines: {
                GLITCH: true,
            },
            uniforms: {
                map: {
                    value: tempTex,
                },
                mapDest: {
                    value: tempTex,
                },
                mapDisplace: {
                    value: this.displaceCanvas.getTexture(),
                },
                blend: {
                    value: 0,
                },
                splitPower: {
                    value: 15,
                },
                transformMatrix: {
                    value: new Matrix4().identity(),
                },
            },
        });
        this.plane = new Mesh(new PlaneBufferGeometry(), this.simpleMat);

        this.resize();
        this.fetchTexture(0);
    }

    /**
     * Включение-выключение ивент лупа
     * @param {boolean} enabled
     */
    public setEnabled(enabled: boolean) {
        if (this.enabled !== enabled) {
            if (enabled) {
                this.loop = new FrameLoop(this.handleFrame);
                window.addEventListener('resize', this.resize);
                this.resize();
            } else {
                this.loop?.destroy();
                this.loop = null;
                window.removeEventListener('resize', this.resize);
            }
            this.enabled = enabled;
        }
    }

    /**
     * Высвобождение ресурсов
     */
    public destroy() {
        this.loop?.destroy();
        this.loop = null;
        for (const tex of this.textureCache) {
            if (tex) tex.dispose();
        }
        this.simpleMat.dispose();
        this.transitionMat.dispose();
        this.plane.geometry.dispose();
        this.displaceCanvas.destroy(true);
        this.renderer.dispose();
    }

    /**
     * Обработка одного кадра
     * @param {number} delta
     * @private
     */
    private handleFrame(delta: number) {
        this.update(delta);
        this.render();
    }

    /**
     * Изменение размера
     * @private
     */
    private resize() {
        const dpi = window.devicePixelRatio;
        this.canvas.width = this.canvas.clientWidth * dpi;
        this.canvas.height = this.canvas.clientHeight * dpi;
        this.renderer.setSize(this.canvas.width, this.canvas.height, false);
    }

    /**
     * Обновление логики
     * @param {number} delta
     * @private
     */
    private update(delta: number) {
        const next = (this.index + 1) % TEXTURE_PATHS.length;
        if (this.appear < 1) {
            if (this.textureCache[0]) {
                this.appear = Math.min(this.appear + 0.01 * delta, 1);
                if (this.appear === 1) {
                    this.changeTimer = 0;
                    this.displayTimer = PaintingsRenderer.DISPLAY_TIME;
                }
            }
            if (!this.textureCache[1] && !this.loadingTexture) {
                this.fetchTexture(1);
            }
        } else if (this.changeTimer > 0) {
            this.changeTimer = Math.max(this.changeTimer - 16.666 * delta, 0);
            if (this.changeTimer === 0) {
                this.index = next;
                this.displayTimer = PaintingsRenderer.DISPLAY_TIME;
            }

            this.displaceFrameSkip -= delta;
            if (this.displaceFrameSkip <= 0) {
                this.displaceCanvas.update(0.1 + (1.0 - this.changeTimer / PaintingsRenderer.CHANGE_TIME) * 0.9);
                this.displaceFrameSkip = 2;
            }
        } else {
            if (!this.textureCache[next] && !this.loadingTexture) {
                this.fetchTexture(next);
            }

            this.displayTimer = Math.max(this.displayTimer - 16.666 * delta, 0);
            if (this.displayTimer <= 0) {
                this.displayTimer = 0;

                if (this.textureCache[next]) {
                    this.changeTimer = PaintingsRenderer.CHANGE_TIME;
                    this.displaceFrameSkip = 0;
                }
            }
        }
    }

    /**
     * Обновление материалов и отрисовка
     * @private
     */
    private render() {
        const next = (this.index + 1) % TEXTURE_PATHS.length;
        if (this.appear < 1 || this.displayTimer > 0) {
            if (this.textureCache[this.index]) {
                this.simpleMat.uniforms.map.value = this.textureCache[this.index];
            }
            this.simpleMat.uniforms.tint.value = 1.0 - (1.0 - this.appear) ** 3.0;
            this.simpleMat.needsUpdate = true;
            this.plane.material = this.simpleMat;
        } else {
            this.transitionMat.uniforms.map.value = this.textureCache[this.index];
            this.transitionMat.uniforms.mapDest.value = this.textureCache[next];
            this.transitionMat.uniforms.blend.value = 1.0 - this.changeTimer / PaintingsRenderer.CHANGE_TIME;
            this.transitionMat.needsUpdate = true;
            this.plane.material = this.transitionMat;
        }

        this.renderer.setClearColor(0x000000, 0);
        this.renderer.clear();
        this.renderer.render(this.plane, this.camera);
    }

    /**
     * Загрузка текстуры
     * @param {number} index
     * @returns {Promise<void>}
     * @private
     */
    private async fetchTexture(index: number) {
        this.loadingTexture = true;
        this.textureCache[index] = await TextureLoader.loadCompressed(TEXTURE_PATHS[index], 'jpg', this.renderer);
        this.loadingTexture = false;
    }
}
