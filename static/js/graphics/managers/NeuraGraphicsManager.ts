import { SoundManager } from '../../sounds/SoundManager';
import { androidScreenActiveStore } from '../../store/android';
import { AndroidPaintingScene } from '../scenes/AndroidPaintingScene';
import { EditorScene } from '../scenes/EditorScene';
import { EditorVideoScene } from '../scenes/EditorVideoScene';
import { GraphicsManager } from './GraphicsManager';

/**
 * Менеджер графики для сайта
 */
export class NeuraGraphicsManager extends GraphicsManager {
    /**
     * Глобальный стейт
     * @private
     */
    private static instance: NeuraGraphicsManager;

    /**
     * Первая сцена
     * @private
     */
    private splashScene: AndroidPaintingScene | null = null;

    /**
     * Сцена редактора роботов
     * @private
     */
    private editorScene: EditorScene | EditorVideoScene | null = null;

    /**
     * Обертка конструктора
     * @param canvas
     */
    constructor(canvas: HTMLCanvasElement) {
        super(canvas);
        NeuraGraphicsManager.instance = this;
    }

    /**
     * Создание первоначальных экранов
     * @protected
     */
    protected init(): void {
        // Загрузка сцены сплеша
        if (!this.splashScene) {
            this.splashScene = new AndroidPaintingScene();
            this.splashScene.preloadResources();
            this.addScene(this.splashScene);
        }

        // Загрузка звуковой части
        SoundManager.preload();
    }

    /**
     * Обновление логики
     * @param tween
     * @protected
     */
    protected update(tween: number): void {
        const androidActive = androidScreenActiveStore.getState();
        if (this.splashScene) {
            this.splashScene.active = !androidActive;
        }
        SoundManager.update(tween);
    }

    /**
     * Добавление сцены с роботом
     * @param index
     * @param onPreload
     * @param onTransitionChange
     */
    public enableEditorScene(index: number, onPreload: () => void, onTransitionChange: ((value: number) => void) | null = null) {
        this.editorScene = new EditorVideoScene(index, onTransitionChange);
        this.editorScene.preloadResources().then(() => {
            if (onPreload) onPreload();
        });
        this.addScene(this.editorScene);
    }

    /**
     * Отключение сцены с роботом
     */
    public disableEditorScene() {
        if (this.editorScene) {
            this.removeScene(this.editorScene);
            this.editorScene.disposeScene();
            this.editorScene = null;
        }
    }

    /**
     * Получение инстанса менеджера
     */
    public static getInstance() {
        return this.instance;
    }

    /**
     * Получение сцены редактора
     */
    public static getEditorScene() {
        return this.instance.editorScene;
    }
}
