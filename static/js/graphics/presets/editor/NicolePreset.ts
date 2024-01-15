import {
    Material, Mesh, MeshStandardMaterial, Object3D, PointLight, Texture,
} from 'three';
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { TextureLoader } from '../../helpers/TextureLoader';
import { AndroidSurfaceConfig, AndroidSurfaceGroup, EditorPreset } from './EditorPreset';

export class NicolePreset extends EditorPreset {
    /**
     * Путь до пресета
     * @private
     */
    private static readonly PRESET_PATH = 'nicole/';

    /**
     * Модель андроида
     * @private
     */
    private model: GLTF | null = null;

    /**
     * Текстуры для высвобождения
     * @private
     */
    private texturesToRelease: Texture[] = [];

    /**
     * Предзагрузка модели и текстур
     */
    public async preload() {
        // Текстуры тела
        const robotTextures = await TextureLoader.loadCompressedGroup([
            'body_base',
            'body_emissive',
            'body_normal',
            'body_pbr',
            'details_base',
            'details_normal',
            'details_pbr',
        ].map((item) => NicolePreset.TEXTURES_ROOT_PATH + NicolePreset.PRESET_PATH + item), 'png', false);
        this.texturesToRelease.push(...robotTextures);

        // PBR-текстуры робота
        const [
            bodyBaseTex,
            bodyEmissiveTex,
            bodyNormalTex,
            bodyPBRTex,
            detailsBaseTex,
            detailsNormalTex,
            detailsPBRTex,
        ] = robotTextures;
        bodyNormalTex.anisotropy = 8;
        detailsNormalTex.anisotropy = 8;

        // Основной материал робота
        const bodyMaterial = new MeshStandardMaterial({
            map: bodyBaseTex,
            emissiveMap: bodyEmissiveTex,
            normalMap: bodyNormalTex,
            roughnessMap: bodyPBRTex,
            metalnessMap: bodyPBRTex,
            roughness: 0.8,
            metalness: 1.3,
            emissiveIntensity: 2,
            emissive: 0xffffff,
        });

        // Второстепенный материал робота
        const detailsMaterial = new MeshStandardMaterial({
            map: detailsBaseTex,
            normalMap: detailsNormalTex,
            roughnessMap: detailsPBRTex,
            metalnessMap: detailsPBRTex,
            roughness: 0.8,
            metalness: 1.3,
        });

        // Текстуры модулей
        const modulesTextures = await TextureLoader.loadCompressedGroup([
            'onetwo_base',
            'onetwo_emissive',
            'onetwo_normal',
            'onetwo_pbr',
            'three_base',
            'three_emissive',
            'three_normal',
            'three_pbr',
            // 'three_ao'
        ].map((item) => NicolePreset.TEXTURES_ROOT_PATH + NicolePreset.PRESET_PATH + item), 'png', false);
        this.texturesToRelease.push(...modulesTextures);

        const [
            oneTwoBaseTex,
            oneTwoEmissiveTex,
            oneTwoNormalTex,
            oneTwoPBRTex,
            threeBaseTex,
            threeEmissiveTex,
            threeNormalTex,
            threePBRTex,
        ] = modulesTextures;
        oneTwoBaseTex.anisotropy = oneTwoEmissiveTex.anisotropy = oneTwoNormalTex.anisotropy = 8;
        threeBaseTex.anisotropy = threeEmissiveTex.anisotropy = oneTwoNormalTex.anisotropy = 8;

        // Материал первого и второго уровня
        const oneTwoMaterial = new MeshStandardMaterial({
            map: oneTwoBaseTex,
            normalMap: oneTwoNormalTex,
            roughnessMap: oneTwoPBRTex,
            metalnessMap: oneTwoPBRTex,
            emissiveMap: oneTwoEmissiveTex,
            roughness: 0.9,
            metalness: 1,
            emissiveIntensity: 2,
            emissive: 0xffffff,
        });

        // Материал третьего уровня
        const threeMaterial = new MeshStandardMaterial({
            map: threeBaseTex,
            aoMap: threePBRTex,
            normalMap: threeNormalTex,
            roughnessMap: threePBRTex,
            metalnessMap: threePBRTex,
            emissiveMap: threeEmissiveTex,
            roughness: 1,
            metalness: 1.2,
            emissiveIntensity: 2,
            emissive: 0xffffff,
        });

        // Основная модель
        this.model = await (new GLTFLoader()).loadAsync(
            `${EditorPreset.MODELS_ROOT_PATH + NicolePreset.PRESET_PATH}model2.glb`,
        );
        this.model.scene.traverse((mesh) => {
            if (mesh instanceof Mesh) {
                if (mesh.name.toLowerCase().startsWith('main_') || mesh.name === 'Body') {
                    // Материал тела (и хак для очков)
                    const isGlasses = mesh.name === 'main_Glasses';
                    let group = AndroidSurfaceGroup.Main;
                    if (mesh.name !== 'Body') {
                        group = this.detectGroup(mesh.name);
                    }

                    mesh.material = bodyMaterial;
                    this.surfaces.push({
                        name: mesh.name,
                        mesh,
                        material: bodyMaterial,
                        group,
                        levels: isGlasses ? [0] : [0, 1, 2, 3, 4, 5],
                    });
                } else if (mesh.name === 'Small_Details') {
                    // Материал кабелей и деталей
                    mesh.material = detailsMaterial;
                    this.surfaces.push({
                        name: mesh.name,
                        mesh,
                        material: detailsMaterial,
                    });
                } else {
                    let material: Material = oneTwoMaterial;
                    if (mesh.name.includes('tex2_')) {
                        material = threeMaterial;
                    }

                    mesh.material = material;
                    this.surfaces.push({
                        name: mesh.name,
                        mesh,
                        material,
                        group: this.detectGroup(mesh.name),
                        levels: this.detectLevels(mesh.name),
                    });
                    mesh.visible = false;
                }
            }
        });

        // Светильники на голову второго уровня
        const lvl2Head = this.model.scene.getObjectByName('tex1_lvl2_Head');
        if (lvl2Head) {
            const light1 = new PointLight(0x5BFFFF, 1.5, 0.13);
            lvl2Head.add(light1);
            light1.position.set(-0.31, 0.3, -5.36);

            const light2 = new PointLight(0x5BFFFF, 1.5, 0.13);
            lvl2Head.add(light2);
            light2.position.set(0.31, 0.3, -5.36);
        }

        this.model.scene.scale.setScalar(0.32);
    }

    /**
     * Вставка модели на сцену
     * @param parent
     */
    public attach(parent: Object3D): void {
        if (this.model) {
            parent.add(this.model.scene);
        }
    }

    /**
     * Обновление логики
     * @param tween
     */
    public update(tween: number): void {

    }

    /**
     * Отсоединение от сцены
     * @param parent
     */
    public detach(parent: Object3D): void {
        if (this.model) {
            parent.remove(this.model.scene);
        }
    }

    /**
     * Высвобождение геометрий и текстур
     */
    public release(): void {
        for (const tex of this.texturesToRelease) {
            tex.dispose();
        }
        for (const config of this.surfaces) {
            config.mesh.geometry.dispose();
        }
    }

    /**
     * Дополнительная настройка видимости модулей
     * @param mask
     * @param config
     * @param visible
     * @protected
     */
    protected handleExtraVisibility(mask: number[], config: AndroidSurfaceConfig, visible: boolean): boolean {
        let min = 2,
            max = 0;
        for (const num of mask) {
            if (num < min) min = num;
            if (num > max) max = num;
        }

        switch (config.name) {
            // Кабеля для первого и второго уровня
            case 'tex1_lvl2_Cables':
                return min === 2 && max === 2;

            case 'tex1_lvl12_Cables':
                return min >= 1 && max < 3;

            default:
                return visible;
        }
    }
}
