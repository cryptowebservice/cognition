import {
    AdditiveBlending,
    AnimationMixer,
    DoubleSide,
    LoopOnce,
    Mesh,
    MeshBasicMaterial,
    MeshStandardMaterial,
    Scene,
} from 'three';
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { addLoadingStep, advanceLoading } from '../../../store/loading';
import { TextureLoader } from '../../helpers/TextureLoader';
import { AndroidPaintingPipeline } from '../../scenes/pipelines/AndroidPaintingPipeline';
import { SplashPreset } from './SplashPreset';

/**
 * Пресет с графикой Анны
 */
export class AnnaPreset extends SplashPreset {
    /**
     * Путь до пресета
     * @private
     */
    private static readonly PRESET_PATH = 'anna/';

    /**
     * Миксер
     * @private
     */
    private mixer: AnimationMixer | null = null;

    /**
     * Материал тела
     * @private
     */
    private bodyMaterial: MeshStandardMaterial | null = null;

    /**
     * Добавление в сцену
     */
    public async preload(): Promise<GLTF> {
        const loader = new GLTFLoader();

        // Текстуры картин - берем полный список и мешаем
        const paintingPaths = Array(39).fill(0).map((val, index) => `${SplashPreset.TEXTURES_ROOT_PATH + AnnaPreset.PRESET_PATH}paintings/${index + 1}`);

        // Загрузка текстур
        const paintingTextures = await TextureLoader.loadCompressedGroup(paintingPaths, 'jpg');
        const robotTextures = await TextureLoader.loadCompressedGroup([
            'body_base',
            'body_pbr',
            'cursor_green',
        ].map((item) => SplashPreset.TEXTURES_ROOT_PATH + AnnaPreset.PRESET_PATH + item));

        // PBR-текстуры робота
        const [
            bodyBaseTex,
            bodyPBRTex,
            cursorTex,
        ] = robotTextures;

        // Основной материал робота
        this.bodyMaterial = new MeshStandardMaterial({
            map: bodyBaseTex,
            // normalMap: bodyNormalTex,
            roughnessMap: bodyPBRTex,
            metalnessMap: bodyPBRTex,
            roughness: 0.4,
            metalness: 0.4,
        });

        // Материал курсора
        const cursorMaterial = new MeshBasicMaterial({
            map: cursorTex,
            depthWrite: false,
            depthTest: false,
            blending: AdditiveBlending,
        });

        // Материалы картин
        const basePaintingMaterial = new MeshBasicMaterial({
            transparent: true,
            depthWrite: false,
            blending: AdditiveBlending,
            side: DoubleSide,
        });
        this.paintingMaterials = paintingTextures.map((tex) => {
            const shader = basePaintingMaterial.clone();
            shader.map = tex;
            return shader;
        });

        // Меш
        addLoadingStep(1);
        this.model = await loader.loadAsync(
            `${SplashPreset.MODELS_ROOT_PATH
            + AnnaPreset.PRESET_PATH
            }model.glb`,
        );
        this.model.scene.scale.setScalar(0.1);
        this.model.scene.rotation.set(0, Math.PI, 0);
        this.model.scene.traverse((entity) => {
            if (entity instanceof Mesh) {
                entity.frustumCulled = false;
                switch (entity.name) {
                    // Робот
                    case 'Anna':
                        entity.material = this.bodyMaterial;
                        entity.layers.set(SplashPreset.ROBOT_LAYER);
                        break;

                    // Экран для проекции
                    case 'screen':
                        entity.layers.set(SplashPreset.SCREEN_LAYER);
                        entity.material = new MeshBasicMaterial({
                            wireframe: true,
                            color: 0x00ff00,
                        });
                        break;

                    // Курсоры
                    case 'Cursor_L':
                    case 'Cursor_R':
                        entity.layers.set(SplashPreset.UI_EX_LAYER);
                        entity.material = cursorMaterial;
                        break;

                    // Другие сюрфейсы (картины и прочее)
                    default:
                        // if (!entity.name.includes('Picture')) console.log(entity.name);
                        entity.visible = false;
                }
            }
        });
        advanceLoading(1);

        this.shufflePaintings();

        // Создание миксера
        this.mixer = new AnimationMixer(this.model.scene);
        const clip = this.model.animations.find((clip) => clip.name === 'NicoleAction');
        if (clip) {
            this.mixer
                .clipAction(clip)
                .setDuration(20)
                .setLoop(LoopOnce, 1)
                .play();
        }
        this.mixer.addEventListener('finished', (event) => {
            if (event.action.getClip() === clip) {
                this.shufflePaintings();
                event.action
                    .setLoop(LoopOnce, 1)
                    .stop()
                    .play();
            }
        });

        // Выдача
        return this.model;
    }

    /**
     * Добавление в сцену
     * @param scene
     */
    public attach(scene: Scene) {
        if (this.model) {
            scene.add(this.model.scene);
        }
    }

    /**
     * Обновление анимации
     * @param tween
     */
    public update(tween: number) {
        if (this.mixer) {
            this.mixer.update(tween * 0.020);
        }
    }

    /**
     * Подготовка к рендеру
     * @param pipeline
     */
    public prepareForRender(pipeline: AndroidPaintingPipeline) {
        const envTex = pipeline.getEnvMap();
        if (this.bodyMaterial) {
            this.bodyMaterial.envMap = envTex;
            this.bodyMaterial.envMapIntensity = 17;
        }
    }

    /**
     * Удаление со сцены
     * @param scene
     */
    public detach(scene: Scene) {
        if (this.model) {
            scene.remove(this.model?.scene);
        }
    }
}