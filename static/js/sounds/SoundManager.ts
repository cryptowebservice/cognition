/**
 * Типы звуков
 */
import { addLoadingStep, advanceLoading } from '../store/loading';

export enum SoundType {
    Button,
    ButtonHover,
    ButtonHoverExtra,
    ModuleInstall,
    PageScroll,
    Text,
    TextLarge,
}

const SOUND_SOURCES = [
    'button.mp3',
    'button_hover.mp3',
    'button_hover_large.mp3',
    'module.mp3',
    'page.mp3',
    'text.mp3',
    'text_large.mp3',
];

const SOUND_VOLUMES = [
    0.2,
    1,
    1,
    0.5,
    1,
    0.1,
    0.1,
];

const SOUND_RANDOM = [
    0,
    0,
    0,
    0,
    0,
    0,
    0,
];

const MUSIC_SOURCE = 'background.mp3';

/**
 * Контейнер для звукового буффера
 */
interface BufferContainer {
    raw: ArrayBuffer,
    buffer?: AudioBuffer
}

/**
 * Общий звуковой инстанс (играющий в момент звук)
 */
interface AudioInstance {
    source: AudioBufferSourceNode,
    gainNode: GainNode,
}

/**
 * Типизированный ваншот-звук
 */
interface TypedAudioInstance extends AudioInstance {
    type: SoundType,
}

/**
 * Фоновый звук
 */
interface BackgroundInstance extends AudioInstance {
    filterNode: BiquadFilterNode
}

/**
 * Звуковой менеджер
 */
export class SoundManager {
    /**
     * Доступные звуковые буфферы
     * @private
     */
    private static buffers: BufferContainer[] = [];

    /**
     * Буффер для фонового звука
     * @private
     */
    private static backgroundBuffer: BufferContainer | null = null;

    /**
     * Активные звуки
     * @private
     */
    private static sounds: TypedAudioInstance[] = [];

    /**
     * Фоновый звук
     * @private
     */
    private static backgroundMusic: BackgroundInstance | null = null;

    /**
     * Звуковой контекст
     * @private
     */
    private static context: AudioContext | null = null;

    /**
     * Активирован ли звук
     * @private
     */
    private static active: boolean = false;

    /**
     * Флаг "заглушения" высоких частот
     * @private
     */
    private static mutedBackground: boolean = false;

    /**
     * Общая громкость
     * @private
     */
    private static volume: number = 0;

    /**
     * Значение приглушения высоких для фона
     * @private
     */
    private static muteValue: number = 0;

    /**
     * Предзагрузка звуков
     */
    public static async preload() {
        addLoadingStep(SOUND_SOURCES.length + 1);

        // Собираем все доступные сурсы в промис и грузим одной пачкой
        const promises: Promise<ArrayBuffer>[] = [];
        for (let idx = 0; idx < SOUND_SOURCES.length; idx++) {
            promises.push(new Promise((resolve) => {
                fetch(`/sounds/${SOUND_SOURCES[idx]}`)
                    .then((response) => response.arrayBuffer())
                    .then((buffer) => {
                        advanceLoading(1);
                        resolve(buffer);
                    });
            }));
        }
        this.buffers = (await Promise.all(promises)).map((buffer) => ({
            raw: buffer,
        }));

        // Загрузка музыки и шума
        const backgroundPromises: Promise<ArrayBuffer>[] = [];
        for (const path of [MUSIC_SOURCE]) {
            backgroundPromises.push(new Promise((resolve) => {
                fetch(`/sounds/${path}`)
                    .then((response) => response.arrayBuffer())
                    .then((buffer) => {
                        advanceLoading(1);
                        resolve(buffer);
                    });
            }));
        }
        const [
            backgroundBuffer,
        ] = await Promise.all(backgroundPromises);
        this.backgroundBuffer = {
            raw: backgroundBuffer,
        };
    }

    /**
     * Эмит звука ховера по таймауту
     */
    public static playHover() {
        this.play(SoundType.ButtonHover);
        /*
        const t = performance.now();
        if (t - this.hoverTime < 350) {
            // this.play(SoundType.ButtonHoverExtra);
        } else {
            this.play(SoundType.ButtonHover);
        }
        console.log(t - this.hoverTime);
        this.hoverTime = t; */
    }

    /**
     * Эмит звука
     * @param sound
     */
    public static async play(sound: SoundType) {
        // Если саундсистема неактивна - просто пропускаем
        if (!this.active || !this.context) return;

        // Если предзагруженного буффера нет - его надо создать
        if (!this.buffers[sound].buffer) {
            this.buffers[sound].buffer = await this.context.decodeAudioData(this.buffers[sound].raw);
        }

        // Создаем сурс и ноду громкости
        const source = this.context.createBufferSource();
        const gain = this.context.createGain();
        source.buffer = this.buffers[sound].buffer!;
        gain.gain.value = 1;
        source.connect(gain);
        gain.connect(this.context.destination);

        // Если у звука есть разброс высоты - применяем
        if (SOUND_RANDOM[sound]) {
            source.playbackRate.value = 1.0 - SOUND_RANDOM[sound] * 0.5 + Math.random() * SOUND_RANDOM[sound];
        }

        // Создание ноды
        const entry: TypedAudioInstance = {
            type: sound,
            gainNode: gain,
            source,
        };
        source.onended = () => {
            const idx = this.sounds.indexOf(entry);
            if (idx !== -1) {
                this.sounds.splice(idx, 1);
            }
        };
        source.start();
        this.sounds.push(entry);
    }

    /**
     * Установка активности
     * @param active
     */
    public static setActive(active: boolean) {
        this.active = active;
        if (active && !this.context) {
            this.context = new AudioContext();
        }
    }

    /**
     * Флаг заглушения высоких
     * @param active
     */
    public static setBackgroundMuted(active: boolean) {
        this.mutedBackground = active;
    }

    /**
     * Обновление общей громкости
     * @param delta
     */
    public static update(delta: number) {
        // Обновление общей громкости
        const volumeChange = 0.03 * delta;
        if (this.active) {
            this.volume = Math.min(this.volume + volumeChange, 1.0);

            // Обработка добротности лоупасса
            const muteChange = 0.03 * delta;
            if (this.mutedBackground) {
                this.muteValue = Math.min(this.muteValue + muteChange, 1);
            } else {
                this.muteValue = Math.max(this.muteValue - muteChange, 0);
            }
        } else {
            this.volume = Math.max(this.volume - volumeChange, 0.0);
        }

        // Обновление основного фонового звука
        if (this.volume > 0) {
            if (!this.backgroundMusic) {
                // Создание нод
                const source = this.context!.createBufferSource();
                const gain = this.context!.createGain();
                const filter = this.context!.createBiquadFilter();

                // Отстройка источника
                source.loop = true;

                // Отстройка гейна
                gain.gain.value = 0;

                // Отстройка лоупасса
                filter.type = 'lowpass';
                filter.Q.value = 0.05;
                filter.frequency.value = 200;

                // Линковка нод
                source.connect(filter);
                filter.connect(gain);
                gain.connect(this.context!.destination);
                this.backgroundMusic = {
                    source,
                    filterNode: filter,
                    gainNode: gain,
                };

                // Старт звука
                if (!this.backgroundBuffer!.buffer) {
                    this.context!.decodeAudioData(this.backgroundBuffer!.raw, (data) => {
                        this.backgroundBuffer!.buffer = data;
                        this.backgroundMusic!.source.buffer = data;
                        this.backgroundMusic!.source.start();
                    });
                } else {
                    this.backgroundMusic!.source.buffer = this.backgroundBuffer!.buffer;
                    this.backgroundMusic!.source.start();
                }
            }

            // Апдейт логики источника
            this.backgroundMusic!.gainNode.gain.value = this.volume * (0.6 - this.muteValue * 0.2);
            this.backgroundMusic!.source.playbackRate.value = 1.0 + this.muteValue * 0.05;
            this.backgroundMusic!.filterNode.frequency.value = 3000 - this.muteValue * 2500;
        } else if (this.backgroundMusic) {
            this.backgroundMusic.source.stop();
            this.backgroundMusic = null;
        }

        // Обновление активных звуков
        for (const entry of this.sounds) {
            entry.gainNode.gain.value = SOUND_VOLUMES[entry.type] * this.volume;
        }
    }
}
