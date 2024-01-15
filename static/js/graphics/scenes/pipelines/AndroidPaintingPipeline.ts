import {
    AdditiveBlending,
    AmbientLight,
    Blending,
    CanvasTexture,
    Color,
    CubeCamera,
    DirectionalLight,
    IUniform,
    Light,
    LinearFilter,
    LinearMipmapLinearFilter,
    Material,
    Mesh,
    MeshBasicMaterial,
    NormalBlending,
    OrthographicCamera,
    PerspectiveCamera,
    PlaneBufferGeometry,
    PointLight,
    Quaternion,
    RepeatWrapping,
    Scene,
    ShaderMaterial,
    Texture,
    Vector2,
    Vector3,
    WebGLCubeRenderTarget,
    WebGLRenderer,
    WebGLRenderTarget,
} from 'three';
import { isLowPower, isSafari } from '../../../hooks/useIsMobile';
import { CURRENT_THEME } from '../../helpers/LandingTheme';
import { TextureLoader } from '../../helpers/TextureLoader';
import { SplashPreset } from '../../presets/splash/SplashPreset';
import BloomVertexCode from '../../shaders/passes/bloom_compose.vert.glsl';
import BloomFragmentCode from '../../shaders/passes/bloom_compose.frag.glsl';
import BlurFragmentCode from '../../shaders/passes/blur.frag.glsl';
import BlurVertexCode from '../../shaders/passes/blur.vert.glsl';
import DotMatrixFragmentCode from '../../shaders/splash/dotmatrix.frag.glsl';
import DotMatrixVertexCode from '../../shaders/splash/dotmatrix.vert.glsl';
import PaintingFragmentCode from '../../shaders/splash/painting.frag.glsl';
import PaintingVertexCode from '../../shaders/splash/painting.vert.glsl';
import RobotVertexCode from '../../shaders/passes/robot_blur.vert.glsl';
import RobotFragCode from '../../shaders/passes/robot_blur.frag.glsl';

/**
 * Класс, отвечающий за рендер сцены
 */
export class AndroidPaintingPipeline {
    /**
     * Размер буффера блюра
     * @private
     */
    private static readonly BLUR_BUFFER_SCALE = 0.1 * window.devicePixelRatio;

    /**
     * Размер буффера блюра
     * @private
     */
    private static readonly BLUR_PASSES = 5;

    /**
     * Камера для основного рендера
     * @private
     */
    private readonly camera: PerspectiveCamera;

    /**
     * Камера для рендера картин
     * @private
     */
    private readonly paintingCamera: OrthographicCamera;

    /**
     * Камера для одиночного плейн-пасса
     * @private
     */
    private readonly passCamera: OrthographicCamera;

    /**
     * Камера для одиночного плейн-пасса
     * @private
     */
    private readonly reflectCamera: CubeCamera;

    /**
     * Материал для одного прохода
     * @private
     */
    private readonly passMaterial: MeshBasicMaterial;

    /**
     * Меш для прохода
     * @private
     */
    private readonly passMesh: Mesh;

    /**
     * Связанная сцена
     * @private
     */
    private scene: Scene | null = null;

    /**
     * Светильники
     * @private
     */
    private readonly lights: Light[];

    /**
     * Буффер для отрисовки картин
     * @private
     */
    private readonly paintingBuffer: WebGLRenderTarget;

    /**
     * Буффер для отрисовки картин
     * @private
     */
    private readonly paintingAuxBuffer: WebGLRenderTarget;

    /**
     * Буффер для робота
     * @private
     */
    private readonly robotBuffer: WebGLRenderTarget;

    /**
     * Буффер для размытия картин
     * @private
     */
    private readonly bloomBuffer: WebGLRenderTarget;

    /**
     * Вспомогательный буффер для размытия
     * @private
     */
    private readonly bloomAuxBuffer: WebGLRenderTarget;

    /**
     * Буффер для рендера отражений
     * @private
     */
    private readonly reflectionBuffer: WebGLCubeRenderTarget;

    /**
     * Материал экрана
     * @private
     */
    private readonly screenMaterial: ShaderMaterial;

    /**
     * Материал для блюра
     * @private
     */
    private readonly blurMaterial: ShaderMaterial;

    /**
     * Материал для робота
     * @private
     */
    private readonly robotMaterial: ShaderMaterial;

    /**
     * Материал для композита финальной сцены
     * @private
     */
    private readonly bloomOverlayMaterial: ShaderMaterial;

    /**
     * Материал точечной матрицы для картин
     * @private
     */
    private readonly dotMatrixMaterial: ShaderMaterial;

    /**
     * Текстура задника
     * @private
     */
    private backdropTexture: Texture | null = null;

    /**
     * Флаг низкокачественного рендера
     * @private
     */
    private readonly isLowPower: boolean;

    /**
     * Конструктор
     */
    public constructor() {
        this.isLowPower = isLowPower();

        // Камеры
        this.camera = new PerspectiveCamera(50, 1, 0.1, 100);
        this.paintingCamera = new OrthographicCamera(-0.331, 0.476, 0.5953, 0.312, 0, 10);
        this.passCamera = new OrthographicCamera(-1, 1, 1, -1, -1, 5);
        this.paintingCamera.position.set(0, 0, -0.7);

        // Освещение
        const ambient = new AmbientLight(0x07070C);
        const point1 = new PointLight(0xffffff);
        const point2 = new PointLight(0xffffff);
        const point3 = new PointLight(0xffffff);
        const direction = new DirectionalLight(0xffffaa, 0.5);
        const pointPurple = new PointLight(0xA849F3);

        point1.intensity = 0.8;
        point2.intensity = 0.55;
        point3.intensity = 0.5;
        pointPurple.intensity = 0.8;
        point1.position.set(0.5, 1, -0.62);
        point2.position.set(-0.6, 1, 0.6);
        point3.position.set(0.8, 1.4, 0.9);
        pointPurple.position.set(0, 1.5, -2);
        direction.position.set(0, 0, -1);

        ambient.layers.set(SplashPreset.ROBOT_LAYER);
        point1.layers.set(SplashPreset.ROBOT_LAYER);
        point2.layers.set(SplashPreset.ROBOT_LAYER);
        point3.layers.set(SplashPreset.ROBOT_LAYER);
        direction.layers.set(SplashPreset.ROBOT_LAYER);
        pointPurple.layers.set(SplashPreset.ROBOT_LAYER);

        this.lights = [
            ambient,
            point1,
            point2,
            point3,
        ];
        if (this.isLowPower) {
            this.lights.push(direction);
        }
        if (CURRENT_THEME() === 4) {
            this.lights.push(pointPurple);
        }

        // Буфферы
        const qualityMult = this.isLowPower ? 0.5 : 1.0;
        this.paintingAuxBuffer = new WebGLRenderTarget(2048 * qualityMult, 1024 * qualityMult, {
            depthBuffer: false,
            stencilBuffer: false,
        });
        this.paintingBuffer = new WebGLRenderTarget(1024 * qualityMult, 512 * qualityMult, {
            depthBuffer: false,
            stencilBuffer: false,
        });
        this.robotBuffer = new WebGLRenderTarget(100, 100, {
            depthBuffer: true,
            stencilBuffer: false,
        });
        this.bloomBuffer = new WebGLRenderTarget(100, 100, {
            depthBuffer: false,
            stencilBuffer: false,
        });
        this.bloomAuxBuffer = new WebGLRenderTarget(100, 100, {
            depthBuffer: false,
            stencilBuffer: false,
        });
        this.robotBuffer.samples = 4;

        // Материалы
        this.passMaterial = new MeshBasicMaterial({
            depthWrite: false,
            depthTest: false,
            blending: NormalBlending,
            transparent: true,
        });
        this.screenMaterial = new ShaderMaterial({
            vertexShader: PaintingVertexCode,
            fragmentShader: PaintingFragmentCode,
            blending: AdditiveBlending,
            depthTest: false,
            uniforms: {
                tBuffer: {
                    value: this.paintingBuffer.texture,
                },
                tBackdrop: {
                    value: null,
                } as IUniform<Texture | null>,
                vBackdropScale: {
                    value: new Vector2(1, 0.7),
                },
            },
        });

        this.robotMaterial = new ShaderMaterial({
            vertexShader: RobotVertexCode,
            fragmentShader: RobotFragCode,
            depthTest: false,
            depthWrite: false,
            transparent: true,
            uniforms: {
                tDiffuse: {
                    value: this.robotBuffer.texture,
                },
                offset: {
                    value: 0,
                },
                intensity: {
                    value: 0.3,
                },
            },
        });

        this.blurMaterial = new ShaderMaterial({
            vertexShader: BlurVertexCode,
            fragmentShader: BlurFragmentCode,
            depthTest: false,
            uniforms: {
                tDiffuse: {
                    value: this.robotBuffer.texture,
                },
                resolution: {
                    value: new Vector2(1, 1),
                },
                direction: {
                    value: new Vector2(0, 1),
                },
            },
        });
        this.bloomOverlayMaterial = new ShaderMaterial({
            vertexShader: BloomVertexCode,
            fragmentShader: BloomFragmentCode,
            depthTest: false,
            uniforms: {
                tDiffuse: {
                    value: this.bloomBuffer.texture,
                },
            },
        });
        this.dotMatrixMaterial = new ShaderMaterial({
            vertexShader: DotMatrixVertexCode,
            fragmentShader: DotMatrixFragmentCode,
            depthTest: false,
            blending: AdditiveBlending,
            uniforms: {
                tBuffer: {
                    value: this.paintingBuffer.texture,
                },
                tExtra: {
                    value: this.paintingAuxBuffer.texture,
                },
                tMask: {
                    value: AndroidPaintingPipeline.generateDotPattern(),
                },
                tBackdrop: {
                    value: null,
                } as IUniform<Texture | null>,
                vBackdropScale: {
                    value: new Vector2(1, 0.7),
                },
            },
        });

        // Вспомогательный меш
        this.passMesh = new Mesh(new PlaneBufferGeometry(2, 2));
        this.passMesh.layers.enableAll();

        // Отражения
        this.reflectionBuffer = new WebGLCubeRenderTarget(64, {
            depthBuffer: false,
            stencilBuffer: false,
            generateMipmaps: true,
        });
        this.reflectCamera = new CubeCamera(0.1, 10, this.reflectionBuffer);
        this.reflectCamera.position.set(0, 0.5, 0.5);
    }

    /**
     * Догрузка ресурсов
     */
    public async preload() {
        this.backdropTexture = await TextureLoader.loadCompressed('/textures/splash/shared/frame');
        this.screenMaterial.uniforms.tBackdrop.value = this.backdropTexture;
        this.dotMatrixMaterial.uniforms.tBackdrop.value = this.backdropTexture;
    }

    /**
     * Привязка к сцене
     * @param scene
     */
    public attach(scene: Scene) {
        if (this.scene) {
            this.detach();
        }
        this.scene = scene;
        this.scene.add(...this.lights);
    }

    /**
     * Отвязка от сцены
     */
    public detach() {
        if (this.scene) {
            this.scene.remove(...this.lights);
        }
    }

    /**
     * Высвобождение ресурсов
     */
    public release() {

    }

    /**
     * Рендер пайплайна
     * @param renderer
     * @param finalBuffer
     */
    public render(renderer: WebGLRenderer, finalBuffer: WebGLRenderTarget) {
        const DEBUG_RT = false;
        if (this.scene) {
            const oldColor = new Color();
            renderer.autoClear = false;
            renderer.getClearColor(oldColor);
            renderer.setClearColor(0x000000, 0);

            if (DEBUG_RT) {
                this.paintingCamera.layers.enableAll();
                this.paintingCamera.position.set(0, 0, 1);
                renderer.setRenderTarget(finalBuffer);
                renderer.setClearColor(0x000000, 0);
                renderer.clearColor();
                renderer.render(this.scene, this.paintingCamera);
                return;
            }

            // Рендер вспомогательных контролов картин в начальный буффер
            this.paintingCamera.layers.set(SplashPreset.UI_EX_LAYER);
            renderer.setRenderTarget(this.paintingAuxBuffer);
            renderer.clearColor();
            renderer.render(this.scene, this.paintingCamera);

            // Рендер картин
            this.paintingCamera.layers.set(SplashPreset.UI_LAYER);
            renderer.setRenderTarget(this.paintingBuffer);
            renderer.clearColor();
            renderer.render(this.scene, this.paintingCamera);

            // Рендер кубмапы для робота
            if (!this.isLowPower) {
                renderer.autoClear = true;
                this.scene.overrideMaterial = this.screenMaterial;
                this.reflectCamera.layers.set(SplashPreset.SCREEN_LAYER);
                this.reflectCamera.update(renderer, this.scene);
                this.scene.overrideMaterial = null;
                renderer.autoClear = false;
            }

            // Рендер робота в отдельный буффер
            this.camera.layers.set(SplashPreset.ROBOT_LAYER);
            renderer.setRenderTarget(this.robotBuffer);
            renderer.clear();
            renderer.render(this.scene, this.camera);

            // Рендер композита для блума
            for (let i = 0; i < (this.isLowPower ? AndroidPaintingPipeline.BLUR_PASSES / 2 : AndroidPaintingPipeline.BLUR_PASSES); i++) {
                // Первый фрейм - основной композит во второй буффер
                if (i === 0) {
                    renderer.setRenderTarget(this.bloomBuffer);
                    renderer.clear();

                    // Рендер картин - обычный проход
                    this.scene.overrideMaterial = this.screenMaterial;
                    this.camera.layers.set(SplashPreset.SCREEN_LAYER);
                    renderer.render(this.scene, this.camera);
                    this.scene.overrideMaterial = null;

                    // Рендер робота - в черном цвете
                    this.passMaterial.map = this.robotBuffer.texture;
                    this.passMaterial.color.set(0x000000);
                    this.quadPass(renderer, this.passMaterial);
                    this.passMaterial.color.set(0xffffff);
                }

                // Настройка шейдера
                this.blurMaterial.uniforms.resolution.value.set(this.bloomBuffer.width, this.bloomBuffer.height);

                // Первый блюр - горизонтальный
                this.blurMaterial.uniforms.direction.value.set(1, 0);
                this.blurMaterial.uniforms.tDiffuse.value = this.bloomBuffer.texture;
                renderer.setRenderTarget(this.bloomAuxBuffer);
                renderer.clear();
                this.quadPass(renderer, this.blurMaterial);

                // Второй блюр - вертикальный
                this.blurMaterial.uniforms.direction.value.set(0, 1);
                this.blurMaterial.uniforms.tDiffuse.value = this.bloomAuxBuffer.texture;
                renderer.setRenderTarget(this.bloomBuffer);
                renderer.setClearColor(0x000000);
                renderer.setClearAlpha(0);
                renderer.clear();
                this.quadPass(renderer, this.blurMaterial);
            }

            // =======================================
            // Финальная композиция всех слоев
            // =======================================
            renderer.setRenderTarget(finalBuffer);
            renderer.setClearColor(0x07070C);
            renderer.clear();

            // Рендер картин
            this.scene.overrideMaterial = this.dotMatrixMaterial;
            this.camera.layers.set(SplashPreset.SCREEN_LAYER);
            renderer.render(this.scene, this.camera);
            this.scene.overrideMaterial = null;

            // Рендер робота

            this.robotMaterial.uniforms.tDiffuse.value = this.robotBuffer.texture;
            this.robotMaterial.uniforms.offset.value = (this.robotMaterial.uniforms.offset.value + 0.1) % 2.0;

            // this.passMaterial.map = this.robotBuffer.texture;

            this.quadPass(renderer, this.robotMaterial);

            // Рендер освещения
            this.quadPass(renderer, this.bloomOverlayMaterial, AdditiveBlending);

            // Сброс
            renderer.setClearColor(oldColor);
            renderer.autoClear = true;
        }
    }

    /**
     * Обновление расположения камеры
     * @param position
     * @param rotation
     * @param zoom
     */
    public updateCamera(position: Vector3, rotation: Quaternion, zoom: number) {
        this.camera.position.copy(position);
        this.camera.quaternion.copy(rotation);
        if (this.camera.zoom !== zoom) {
            this.camera.zoom = zoom;
            this.camera.updateProjectionMatrix();
        }
    }

    /**
     * Ресайз фреймбуфферов и окна
     * @param width
     * @param height
     */
    public updateSize(width: number, height: number) {
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        const robotBufferMult = this.isLowPower ? 0.75 : 1.0;
        const blurBufferMult = AndroidPaintingPipeline.BLUR_BUFFER_SCALE * (this.isLowPower ? 0.25 : 1.0);

        this.robotBuffer.setSize(width * robotBufferMult, height * robotBufferMult);
        this.bloomBuffer.setSize(width * blurBufferMult, height * blurBufferMult);
        this.bloomAuxBuffer.setSize(width * blurBufferMult, height * blurBufferMult);
        this.robotBuffer.samples = !isSafari() && !isLowPower() ? 4 : 0;
    }

    /**
     * Текстура с отражениями сцены
     */
    public getEnvMap() {
        if (this.isLowPower) {
            return null;
        }
        return this.reflectionBuffer.texture;
    }

    /**
     * Рендер одного прохода
     * @param renderer
     * @param material
     * @param blending
     * @private
     */
    private quadPass(renderer: WebGLRenderer, material: Material, blending: Blending = NormalBlending) {
        material.blending = blending;
        this.passMesh.material = material;
        renderer.render(this.passMesh, this.passCamera);
    }

    /**
     * Создание текстуры паттерна точек
     * @private
     */
    private static generateDotPattern() {
        const canvas = document.createElement('canvas');
        canvas.width = 32;
        canvas.height = 32;

        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.fillStyle = '#444';
            ctx.fillRect(0, 0, 32, 32);
            ctx.fillStyle = '#fff';
            ctx.beginPath();
            ctx.moveTo(16, 16);
            ctx.arc(16, 16, 12, 0, Math.PI * 2);
            ctx.fill();
        }

        const tex = new CanvasTexture(canvas);
        tex.wrapS = RepeatWrapping;
        tex.wrapT = RepeatWrapping;
        tex.minFilter = LinearMipmapLinearFilter;
        tex.magFilter = LinearFilter;
        return tex;
    }
}
