import {
    DoubleSide,
    LessDepth,
    Material,
    Matrix3,
    Mesh,
    MeshBasicMaterial,
    MeshNormalMaterial,
    MeshStandardMaterial,
    Object3D,
    RepeatWrapping,
    Texture,
} from 'three';
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { TextureLoader } from '../../helpers/TextureLoader';
import { AndroidSurfaceGroup, EditorPreset } from './EditorPreset';

export class NikitaPreset extends EditorPreset {
    /**
     * Путь до пресета
     * @private
     */
    private static readonly PRESET_PATH = 'nikita/';

    private mesh: GLTF | null = null;

    public async preload() {
        const materials: MeshStandardMaterial[] = [];
        const normalMaterial: MeshNormalMaterial[] = [];
        const roughnesses = [
            1.0,
            1.0,
            1.0,
            0.8,
        ];
        const metalnesses = [
            1.0,
            1.0,
            0.8,
            1.2,
        ];
        for (let i = 0; i < 4; i++) {
            // Загрузка основных текстур
            const [
                base,
                normal,
                pbr,
            ] = await TextureLoader.loadCompressedGroup([
                `lvl${i}_base`,
                `lvl${i}_normal`,
                `lvl${i}_pbr`,
            ].map((path) => NikitaPreset.TEXTURES_ROOT_PATH + NikitaPreset.PRESET_PATH + path), 'png', false);

            // Загрузка эмиссива
            let emissive: Texture | null = null;
            if (i === 1) {
                emissive = await TextureLoader.loadCompressed(
                    `${NikitaPreset.TEXTURES_ROOT_PATH
                    + NikitaPreset.PRESET_PATH
                    }lvl${i}_emissive`,
                );
            }

            // Создание материала
            const mat = new MeshStandardMaterial({
                map: base,
                normalMap: normal,
                emissiveMap: emissive,
                metalnessMap: pbr,
                roughnessMap: pbr,
                roughness: roughnesses[i],
                metalness: metalnesses[i],
                emissive: 1,
            });

            if (i === 2) {
                const extraTex = await TextureLoader.loadCompressed(
                    `${NikitaPreset.TEXTURES_ROOT_PATH
                    + NikitaPreset.PRESET_PATH
                    }grid`,
                );
                extraTex.wrapT = extraTex.wrapS = RepeatWrapping;
                extraTex.anisotropy = 4;

                // Страшный костыль - мы врезаемся прямо в MeshStandardMaterial
                // и меняем части его шейдеров на ходу перед компиляцией
                mat.onBeforeCompile = (shader) => {
                    // Хак, чтобы включить второй набор uv
                    (shader as any).defines.USE_AOMAP = '';
                    shader.uniforms = {
                        ...shader.uniforms,
                        map2: {
                            value: extraTex,
                        },
                        uv2Transform: {
                            value: new Matrix3().identity().scale(200, 200),
                        },
                    };

                    // Чтобы не было z-файта - меняем режим теста глубины
                    mat.depthFunc = LessDepth;
                    mat.side = DoubleSide;

                    // Заменяем части шейдера на нужные нам
                    const parts: { [key: string]: string } = {
                        '#include <aomap_fragment>': '', // AO убираем совсем
                        '#include <common>': `
                            #include <common>
                            uniform sampler2D map2;      // Добавляем семплер со второй текстурой
                        `,
                        '#include <map_fragment>': `
                        
                            // Читаем обе текстуры и смешиваем по альфе первой
                            vec4 firstMapColor = texture2D(map, vUv);
                            vec4 secondMapColor = texture2D(map2, vUv2);
                            
                            // Делаем базовый альфатест
                            diffuseColor *= mix(firstMapColor, secondMapColor + 0.5, firstMapColor.a);
                            diffuseColor.a = 1.0;
                            if (firstMapColor.a > 0.0 && secondMapColor.a < 0.2) {
                                discard;
                            }
                            
                        `,
                    };
                    for (const key in parts) {
                        if (key in parts) {
                            shader.fragmentShader = shader.fragmentShader.replace(key, parts[key]);
                        }
                    }
                };

                // mat.alphaTest = 0.2;
                // mat.transparent = true;
                // mat.metalness = 0.7;
                // mat.opacity = 0;
                // mat.color = new Color(0xdddddd);
            }
            materials.push(mat);

            // Материал для нормаль-пасса
            normalMaterial.push(new MeshNormalMaterial({
                normalMap: normal,
            }));
        }

        this.mesh = await new GLTFLoader().loadAsync('/models/editor/nikita/model2.glb');
        console.log(this.mesh);
        console.log(123);

        this.mesh.scene.traverse((entity) => {
            if (entity instanceof Mesh) {
                const { name } = entity;
                if (name.toLowerCase().includes('logo')) {
                    entity.visible = false;
                } else {
                    // Выбор групп меша
                    const
                        group = this.detectGroup(entity.name);
                    const levels = this.detectLevels(entity.name);
                    const matIndex = this.detectTextureGroup(entity.name);

                    let material: Material | null = null;
                    let materialNormal: MeshNormalMaterial | null = null;
                    if (matIndex !== -1) {
                        material = materials[matIndex];
                        materialNormal = normalMaterial[matIndex];
                    } else if (name.toLowerCase().includes('wires')) {
                        material = new MeshBasicMaterial({
                            color: 0xBDEAFD,
                        });
                    }

                    // Создание сурфейса
                    if (material && group !== AndroidSurfaceGroup.Main) {
                        entity.material = material;
                        this.surfaces.push({
                            name: entity.name,
                            mesh: entity as Mesh,
                            material,
                            normalMaterial: materialNormal ?? undefined,
                            levels,
                            group,
                            glass: entity.name.toLowerCase().includes('glass'),
                        });
                    } else {
                        entity.visible = false;
                    }
                }
            }
        });

        this.mesh.scene.scale.setScalar(0.3);
        this.mesh.scene.position.set(0, 0.1, 0);
    }

    public attach(parent: Object3D): void {
        if (this.mesh) {
            parent.add(this.mesh.scene);
        }
    }

    public update(tween: number): void {

    }

    public detach(parent: Object3D): void {
        if (this.mesh) {
            parent.remove(this.mesh.scene);
        }
    }

    public release(): void {

    }
}
