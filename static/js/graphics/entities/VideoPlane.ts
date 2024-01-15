import {
    Matrix4,
    Mesh,
    OrthographicCamera,
    PlaneBufferGeometry,
    ShaderMaterial,
    Texture,
    Vector2,
    WebGLRenderer,
} from 'three';
import { currentAndroidStore } from '../../store/android';
import { androidModuleSetup } from '../../store/editor';
import MixFragCode from '../shaders/editor/editor_mix.frag.glsl';
import MixVertCode from '../shaders/editor/editor_mix.vert.glsl';
import { DisplaceCanvasTexture } from './DisplaceCanvasTexture';
import { VideoCanvasTexture } from './VideoCanvasTexture';
import { destroyVideo } from '../../helpers/destroyVideo';

const ANDROID_PREFIXES = [
    'nicole/Nicole_',
    'roman/Roman_',
    'anna/Anna_',
    'sarah/Sarah_',
    'kira/Kira_',
];

export class VideoPlane {
    /**
     * Индекс андроида
     * @type {number}
     * @private
     */
    private index: number;

    /**
     * Камера для плейна
     * @type {OrthographicCamera}
     * @private
     */
    private camera: OrthographicCamera;

    /**
     * Плейн с текстурой видео
     * @type {Mesh}
     * @private
     */
    private plane: Mesh;

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
     * Соотношение ширины к высоте
     * @type {number}
     * @private
     */
    private aspect: number;

    /**
     * Текущее видео
     * @type {string}
     * @private
     */
    private activeHash: string;

    /**
     * Видео в загрузке
     * @type {string | null}
     * @private
     */
    private loadingHash: string | null;

    /**
     * Основная видео-текстура
     * @type {VideoCanvasTexture | null}
     * @private
     */
    private canvas: VideoCanvasTexture | null = null;

    /**
     * Предыдущая видео-текстура
     * @type {VideoCanvasTexture | null}
     * @private
     */
    private previousCanvas: VideoCanvasTexture | null = null;

    /**
     * Текстура-дисплейс
     * @type {DisplaceCanvasTexture}
     * @private
     */
    private displaceCanvas: DisplaceCanvasTexture;

    /**
     * Флаг загрузки видео
     * @type {boolean}
     * @private
     */
    private loading: boolean = false;

    /**
     * Временный хеш для цикла
     * @type {string}
     * @private
     */
    private tempHash: string;

    /**
     * Счетчик перехода между текстурами (0-1)
     * @type {number}
     * @private
     */
    private transition: number = 0;

    /**
     * Пропуск кадров для дисплейса
     * @type {number}
     * @private
     */
    private transitionFrameSkip: number = 0;

    /**
     * Композитная матрица для сдвига видео
     * @type {Matrix4}
     * @private
     */
    private transform: Matrix4;

    /**
     * Конструктор
     * @param {number} index
     */
    public constructor(index: number) {
        this.index = index;
        this.activeHash = '000000';
        this.tempHash = this.activeHash;
        this.loadingHash = null;

        this.onResize();

        this.displaceCanvas = new DisplaceCanvasTexture();

        this.camera = new OrthographicCamera(-0.5, 0.5, 0.5, -0.5, -1, 2);
        this.aspect = 1;
        this.transform = new Matrix4().identity();

        const tempTex = new Texture();
        this.simpleMat = new ShaderMaterial({
            fragmentShader: MixFragCode,
            vertexShader: MixVertCode,
            uniforms: {
                map: {
                    value: tempTex,
                },
                transformMatrix: {
                    value: this.transform,
                },
            },
        });
        this.transitionMat = new ShaderMaterial({
            fragmentShader: MixFragCode,
            vertexShader: MixVertCode,
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
                    value: 1,
                },
                transformMatrix: {
                    value: this.transform,
                },
            },
        });

        const geom = new PlaneBufferGeometry(1, 1);
        this.plane = new Mesh(geom, this.simpleMat);
        this.plane.frustumCulled = false;

        this.onResize = this.onResize.bind(this);
        window.addEventListener('resize', this.onResize);
    }

    /**
     * Изменение положения камеры через матрицу
     * @param {Vector2} offset
     * @param {number} scale
     * @param {number} horizontal
     */
    public changeOffset(offset: Vector2, scale: number, horizontal: number) {
        const mat = new Matrix4().identity();
        mat.multiply(new Matrix4().makeTranslation(-horizontal * this.aspect * 0.25, 0, 0));
        mat.multiply(new Matrix4().makeTranslation(-offset.x, -offset.y * 0.8, 0));
        mat.multiply(new Matrix4().makeScale(scale, scale, scale));
        this.transform = mat;
    }

    /**
     * Обновление логики
     * @param {number} delta
     */
    public update(delta: number) {
        const hash = androidModuleSetup.getState();
        if (hash !== this.tempHash) {
            if ((!this.loading && hash !== this.activeHash) || (this.loading && hash !== this.loadingHash)) {
                if (window.innerWidth < 900) {
                    this.changeImage(hash);
                } else {
                    this.changeVideo(hash);
                }
            }
            this.tempHash = hash;
        }

        if (this.transition > 0) {
            this.transitionFrameSkip -= delta;
            if (this.transitionFrameSkip <= 0) {
                this.displaceCanvas.update(1.0 - this.transition);
                this.transitionFrameSkip = 2;
            }

            this.transition -= 0.03 * delta;
            if (this.transition <= 0) {
                this.transition = 0;
                this.previousCanvas?.destroy(true);
                this.previousCanvas = null;
            }
        }
    }

    /**
     * Рендер
     * @param {WebGLRenderer} renderer
     */
    public render(renderer: WebGLRenderer) {
        if (this.previousCanvas) {
            this.previousCanvas.update();
        }
        if (this.canvas) {
            this.canvas.update();

            if (this.transition > 0 && this.previousCanvas) {
                this.transitionMat.uniforms.map.value = this.previousCanvas.getTexture();
                this.transitionMat.uniforms.mapDest.value = this.canvas.getTexture();
                this.transitionMat.uniforms.blend.value = 1.0 - this.transition;
                this.transitionMat.uniforms.transformMatrix.value = this.transform;
                this.transitionMat.needsUpdate = true;
                this.plane.material = this.transitionMat;
            } else {
                this.simpleMat.uniforms.map.value = this.canvas.getTexture();
                this.simpleMat.uniforms.transformMatrix.value = this.transform;
                this.simpleMat.needsUpdate = true;
                this.plane.material = this.simpleMat;
            }
        }

        renderer.setClearColor(0x0);
        renderer.clearColor();
        renderer.render(this.plane, this.camera);
    }

    /**
     * Изменение аспекта
     * @param {number} aspect
     */
    public updateAspect(aspect: number) {
        this.aspect = aspect;
        this.camera.left = -aspect * 0.5;
        this.camera.right = aspect * 0.5;
        this.camera.updateProjectionMatrix();
    }

    /**
     * Высвобождение ресурсов
     */
    public destroy() {
        this.plane.geometry.dispose();
        this.simpleMat.dispose();
        this.transitionMat.dispose();
        this.displaceCanvas.destroy(true);
        this.canvas?.destroy(true);
        this.previousCanvas?.destroy(true);
        this.loadingHash = '';
    }

    /**
     * Загрузка нового видео через промис
     * @param {string} hash
     * @returns {Promise<void>}
     * @private
     */
    private changeVideo(hash: string) {
        return new Promise<void>((resolve, reject) => {
            this.loadingHash = hash;
            this.loading = true;

            let loadedData = false;
            let loadedMeta = false;
            let suspend = false;
            const video = document.createElement('video');

            const fail = (msg: string) => {
                console.log(msg);
                destroyVideo(video);
                console.debug('Video pre killed 2', msg);
            };
            const complete = (video: HTMLVideoElement) => {
                if (this.loadingHash === hash) {
                    this.changeVideoTag(video);
                    this.activeHash = hash;
                    this.loadingHash = null;
                    this.loading = false;
                }
                resolve();
            };
            const update = () => {
                if (loadedMeta && loadedData && suspend) {
                    complete(video);
                    this.canvas?.bindMedia(video);
                }
            };

            video.addEventListener('loadedmetadata', () => {
                loadedMeta = true;
                update();
            });
            video.addEventListener('loadeddata', () => {
                loadedData = true;
                update();
            });
            video.addEventListener('suspend', () => {
                suspend = true;
                update();
            });
            video.addEventListener('error', () => {
                fail('Failed to load file');
            });
            video.muted = true;
            video.loop = true;
            video.autoplay = true;
            video.controls = false;
            video.playsInline = true;
            video.preload = 'auto';

            video.style.position = 'fixed';
            video.style.top = '0';
            video.style.left = '0';
            video.style.width = '1px';
            video.style.height = '1px';
            video.style.zIndex = '1000';
            document.body.append(video);
            // video.style.opacity = '0.01';

            const src = `/videos/${ANDROID_PREFIXES[currentAndroidStore.getState()]}${hash}.mp4`;
            console.debug(src);
            video.src = src;
        });
    }

    private changeImage(hash: string) {
        return new Promise<void>((resolve, reject) => {
            this.loadingHash = hash;
            this.loading = true;

            const image: HTMLImageElement = document.createElement('img');
            const complete = () => {
                if (this.loadingHash === hash) {
                    this.activeHash = hash;
                    this.changeImageTag(image);
                    this.loadingHash = null;
                    this.loading = false;
                }
                resolve();
            };

            image.addEventListener('load', () => {
                complete();
                this.canvas?.bindMedia(image);
            });

            const fail = (msg: string) => {
                console.log(msg);
                image.removeAttribute('src');
                console.debug('Image pre killed 2', msg);
            };

            image.addEventListener('error', () => {
                fail('Failed to load file');
            });

            image.style.position = 'fixed';
            image.style.top = '0';
            image.style.left = '0';
            image.style.width = '1px';
            image.style.height = '1px';
            image.style.zIndex = '1000';
            document.body.append(image);

            image.src = `/videos/${ANDROID_PREFIXES[currentAndroidStore.getState()]}${hash}.png`;
        });
    }

    /**
     * Изменение видео
     * @param {HTMLVideoElement} video
     * @private
     */
    private changeVideoTag(video: HTMLVideoElement) {
        if (this.canvas) {
            if (this.previousCanvas) {
                this.previousCanvas.destroy(true);
            }
            this.previousCanvas = this.canvas;
            this.transition = 1;
            this.transitionFrameSkip = 2;
            this.displaceCanvas.update(0);
        }
        video.play();
        this.canvas = new VideoCanvasTexture(video);
        this.canvas.update();
    }

    /**
     * Изменение картинки
     * @private
     * @param image
     */
    private changeImageTag(image: HTMLImageElement) {
        if (this.canvas) {
            if (this.previousCanvas) {
                this.previousCanvas.destroy(true);
            }
            this.previousCanvas = this.canvas;
            this.transition = 1;
            this.transitionFrameSkip = 2;
            this.displaceCanvas.update(0);
        }
        this.canvas = new VideoCanvasTexture(image);
        this.canvas.update();
    }

    private onResize() {
        if (window.innerWidth < 900) {
            this.changeImage(this.tempHash !== this.activeHash ? this.tempHash : this.activeHash);
        } else {
            this.changeVideo(this.tempHash !== this.activeHash ? this.tempHash : this.activeHash);
        }
    }
}
