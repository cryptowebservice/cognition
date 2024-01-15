import {
    Mesh, MeshBasicMaterial, MeshStandardMaterial, Scene, Texture,
} from 'three';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
import { AndroidPaintingPipeline } from '../../scenes/pipelines/AndroidPaintingPipeline';
import { TextureLoader } from '../../helpers/TextureLoader';

import alphaMapBigPath from '../../../assets/images/pictures/alphaMapBig.png';
import alphaMapSmallPath from '../../../assets/images/pictures/alphaMapSmall.png';

/**
 * Пресет для сплеша (сцена с роботом)
 */
export abstract class SplashPreset {
    /**
     * Основной путь моделей
     * @protected
     */
    protected static readonly MODELS_ROOT_PATH = '/models/splash/';

    /**
     * Путь до текстур
     * @protected
     */
    protected static readonly TEXTURES_ROOT_PATH = '/textures/splash/';

    /**
     * Индекс слоя для UI-штук (картины, курсор)
     * @protected
     */
    public static readonly UI_EX_LAYER = 4;

    /**
     * Индекс слоя для UI-штук (картины, курсор)
     * @protected
     */
    public static readonly UI_LAYER = 3;

    /**
     * Индекс слоя для плейна экрана
     */
    public static readonly SCREEN_LAYER = 2;

    /**
     * Индекс слоя для меша робота
     */
    public static readonly ROBOT_LAYER = 1;

    /**
     * Все картины
     * @private
     */
    protected paintingMaterials: MeshBasicMaterial[] = [];

    /**
     * Сцена
     * @private
     */
    protected model: GLTF | null = null;

    /**
     * Предзагрузка
     */
    public abstract preload(): Promise<GLTF>;

    /**
     * Добавление в сцену
     * @param scene
     */
    public abstract attach(scene: Scene): void;

    /**
     * Обновление анимации
     * @param tween
     */
    public abstract update(tween: number): void;

    /**
     * Подготовка модели к рендеру
     * @param pipeline
     */
    public abstract prepareForRender(pipeline: AndroidPaintingPipeline): void;

    /**
     * Удаление со сцены
     * @param scene
     */
    public abstract detach(scene: Scene): void;

    /**
     * Перетасовка всех картин
     * @private
     */
    protected shufflePaintings() {
        // Перетасовываем массив с материалами
        for (let i = this.paintingMaterials.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.paintingMaterials[i], this.paintingMaterials[j]] = [this.paintingMaterials[j], this.paintingMaterials[i]];
        }

        // Траверсим меш и ищем картины
        this.model?.scene.traverse(async (mesh) => {
            const alphaSmall = await TextureLoader.loadTexture(alphaMapSmallPath);
            const alphaBig = await TextureLoader.loadTexture(alphaMapBigPath);

            if (mesh instanceof Mesh && mesh.name.includes('Picture')) {
                let index = 0;
                if (mesh.name.startsWith('Picture')) {
                    const rawNumber = mesh.name.replaceAll(/[^0-9]+/igm, '');
                    if (rawNumber === '') {
                        index = 1;
                    } else {
                        index = parseInt(rawNumber) + 1;
                    }
                }
                // Настройки картин
                mesh.material = this.paintingMaterials[index % this.paintingMaterials.length];
                (mesh.material as MeshStandardMaterial).alphaMap = alphaSmall;
                mesh.layers.set(SplashPreset.UI_LAYER);
                mesh.visible = true;
            }

            if (mesh instanceof Mesh && mesh.name.includes('Big_Picture')) {
                (mesh.material as MeshStandardMaterial).alphaMap = alphaBig;
            }
        });
    }

    /**
     * Высвобождение ресурсов
     */
    public release() {
        this.model?.scene.traverse((entity) => {
            if (entity instanceof Mesh) {
                // Высвобождение материала
                if (entity.material) {
                    for (const key of Object.keys(entity.material)) {
                        if (key in entity.material && entity.material[key] instanceof Texture) {
                            entity.material[key].dispose();
                        }
                    }
                }

                // Высвобождение геометрии
                entity.geometry.dispose();
            }
        });
    }
}
