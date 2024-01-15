import {
    Material, Mesh, MeshBasicMaterial, MeshNormalMaterial, Object3D,
} from 'three';

/**
 * Максимальное количество модулей
 */
const MAX_ANDROID_MODULES = 7;

/**
 * Список групп для модулей
 */
export enum AndroidSurfaceGroup {
    Head,
    Neck,
    Vision,
    Body,
    Shoulders,
    Hands,
    Torso,

    Main,
}

/**
 * Интерфейс для настроек меша
 */
export interface AndroidSurfaceConfig {
    name: string,
    mesh: Mesh,
    material: Material,
    levels?: number[],
    group?: AndroidSurfaceGroup,
    active?: boolean,

    glass?: boolean,
    normalMaterial?: MeshNormalMaterial,
}

/**
 * Маска для поиска группы
 */
const GROUP_NAMES = [
    ['head'],
    ['vision', 'glasses'],
    ['neck'],
    ['shoulder'],
    ['body'],
    ['hand', 'arm'],
    ['tors', 'chest'],
];

/**
 * Пресет для редактора
 */
export abstract class EditorPreset {
    /**
     * Основной путь моделей
     * @protected
     */
    protected static readonly MODELS_ROOT_PATH = '/models/editor/';

    /**
     * Путь до текстур
     * @protected
     */
    protected static readonly TEXTURES_ROOT_PATH = '/textures/editor/';

    /**
     * Все связанные конфиги сюрфейсов
     * @protected
     */
    protected readonly surfaces: AndroidSurfaceConfig[] = [];

    /**
     * Нужен ли рендер стекла
     * @private
     */
    private glassNeeded: boolean = false;

    /**
     * Материал для выбранных сюрфейсов
     * @private
     */
    private readonly selectedMaterial: MeshBasicMaterial = new MeshBasicMaterial({
        color: 0xff0000,
    });

    /**
     * Материал для отключенных сюрфейсов
     * @private
     */
    private readonly unselectedMaterial: MeshBasicMaterial = new MeshBasicMaterial({
        color: 0x000000,
    });

    /**
     * Материал для выбранных сюрфейсов
     * @private
     */
    private readonly selectedGlassMaterial: MeshBasicMaterial = new MeshBasicMaterial({
        color: 0xffff00,
    });

    /**
     * Материал для отключенных сюрфейсов
     * @private
     */
    private readonly unselectedGlassMaterial: MeshBasicMaterial = new MeshBasicMaterial({
        color: 0x00ff00,
    });

    /**
     * Включение-отключение материалов для рендера маски
     * @param enable
     * @param group
     */
    public prepareMask(enable: boolean, group: number = 0) {
        for (const config of this.surfaces) {
            config.mesh.visible = !!config.active && (enable || !config.glass);
            if (enable) {
                // Проход для выделения выбранных модулей
                const selectedMat = config.glass ? this.selectedGlassMaterial : this.selectedMaterial;
                const unselectedMat = config.glass ? this.unselectedGlassMaterial : this.unselectedMaterial;

                config.mesh.material = config.group !== undefined && config.group === group
                    ? selectedMat
                    : unselectedMat;
            } else {
                // Обычный проход - ставим все материалы
                config.mesh.material = config.material;
            }
        }
    }

    /**
     * Включение мешей для пасса стекла
     */
    public prepareGlassPass(normals: boolean) {
        for (const surf of this.surfaces) {
            surf.mesh.visible = false;
            if (surf.active && surf.glass) {
                const mat = normals
                    ? surf.normalMaterial
                    : surf.material;
                if (mat) {
                    surf.mesh.visible = true;
                    surf.mesh.material = mat;
                }
            }
        }
    }

    /**
     * Определение уровня модуля по названию
     * @param name
     * @protected
     */
    protected detectLevels(name: string): number[] {
        const levels: number[] = [];
        const matchRaw = /lvl([0-5]{1,3})_/gi.exec(name);
        if (matchRaw) {
            const indices = matchRaw[1].split('').map((val) => +val);
            for (const idx of indices) {
                if (!levels.includes(idx)) levels.push(idx);
            }
        }
        return levels;
    }

    /**
     * Определение связанной группы
     * @param name
     * @protected
     */
    protected detectGroup(name: string): AndroidSurfaceGroup {
        let g = AndroidSurfaceGroup.Main;
        for (let idx = 0; idx < GROUP_NAMES.length; idx++) {
            for (const gn of GROUP_NAMES[idx]) {
                if (name.toLowerCase().includes(gn)) {
                    g = idx;
                    break;
                }
            }
            if (g !== AndroidSurfaceGroup.Main) {
                break;
            }
        }
        return g;
    }

    /**
     * Определение текстурного уровня
     * @param name
     * @protected
     */
    protected detectTextureGroup(name: string): number {
        const matchRaw = /tex([0-5])_/gi.exec(name);
        if (matchRaw) {
            return parseInt(matchRaw[1]);
        }
        return -1;
    }

    /**
     * Смена уровней модулей
     * @param levels
     */
    public setLevels(...levels: number[]) {
        // Сбор индексов уровней
        const lv: number[] = Array(MAX_ANDROID_MODULES).fill(0);
        for (let i = 0; i < Math.min(levels.length, lv.length); i++) {
            lv[i] = levels[i];
        }

        // Применение видимости
        for (const config of this.surfaces) {
            let active = false;
            if (config.group !== undefined && config.levels !== undefined && config.group !== AndroidSurfaceGroup.Main) {
                active = config.levels.includes(lv[config.group]);
            } else {
                active = true;
            }
            config.active = this.handleExtraVisibility(lv, config, active);
        }

        // Проверка на стекло
        this.checkForGlass();
    }

    /**
     * Проверка на стекло
     */
    public isGlassNeeded() {
        return this.glassNeeded;
    }

    /**
     * Предзагрузка
     */
    public abstract preload(): Promise<void>;

    /**
     * Добавление в сцену
     * @param parent
     */
    public abstract attach(parent: Object3D): void;

    /**
     * Обновление анимации
     * @param tween
     */
    public abstract update(tween: number): void;

    /**
     * Удаление со сцены
     * @param parent
     */
    public abstract detach(parent: Object3D): void;

    /**
     * Высвобождение ресурсов
     */
    public abstract release(): void;

    /**
     * Дополнительная обработка видимости
     * @param mask
     * @param config
     * @param visible
     * @protected
     */
    protected handleExtraVisibility(mask: number[], config: AndroidSurfaceConfig, visible: boolean): boolean {
        return visible;
    }

    /**
     * Проверка на стекло
     * @private
     */
    private checkForGlass() {
        this.glassNeeded = false;
        for (const surf of this.surfaces) {
            if (surf.active && surf.glass) {
                this.glassNeeded = true;
                break;
            }
        }
    }
}
