import { Texture, TextureLoader as ThreeLoader, WebGLRenderer } from 'three';
import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader';
import { addLoadingStep, advanceLoading } from '../../store/loading';
import { GraphicsManager } from '../managers/GraphicsManager';

/**
 * Класс для загрузки текстур
 */
export class TextureLoader {
    /**
     * Внутренний лоадер
     * @private
     */
    private static loader: ThreeLoader;

    /**
     * Лоадер для сжатых текстур
     * @private
     */
    private static compressedLoader: KTX2Loader;

    /**
     * Есть ли поддержка WASM
     * @private
     */
    private static wasmSupport: boolean;

    /**
     * Загрузка текстуры
     * @param url
     */
    public static loadTexture(url: string): Promise<Texture> {
        if (!this.loader) {
            this.loader = new ThreeLoader();
        }
        return this.loader.loadAsync(url);
    }

    /**
     * Загрузка сжатой текстуры
     * @param baseUrl
     * @param fallbackFormat
     * @param directRenderer
     */
    public static loadCompressed(baseUrl: string, fallbackFormat: string = 'png', directRenderer: WebGLRenderer | null = null): Promise<Texture> {
        const renderer = directRenderer ?? GraphicsManager.getActiveRenderer();
        if (!renderer) {
            throw new Error('Unable to get renderer');
        }
        if (!this.compressedLoader) {
            this.compressedLoader = new KTX2Loader();
            this.wasmSupport = this.isWASMSupported();
            if (this.wasmSupport) {
                this.compressedLoader.setTranscoderPath('/basis/');
                this.compressedLoader.detectSupport(renderer);
            }
        }
        if (this.wasmSupport) {
            return this.compressedLoader.loadAsync(`${baseUrl}.ktx2`).then((tex) => {
                renderer!.initTexture(tex);
                return tex;
            });
        }
        return this.loadTexture(`${baseUrl}.${fallbackFormat}`).then((tex) => {
            tex.flipY = false;
            renderer!.initTexture(tex);
            return tex;
        });
    }

    /**
     * Загрузка группы сжатых текстур
     * @param baseUrls
     * @param fallbackFormat
     * @param updateLoading
     */
    public static loadCompressedGroup(baseUrls: string[], fallbackFormat: string = 'png', updateLoading: boolean = true): Promise<Texture[]> {
        if (updateLoading) {
            addLoadingStep(baseUrls.length);
        }
        const promises: Promise<Texture>[] = [];
        for (const path of baseUrls) {
            promises.push(new Promise<Texture>((resolve) => {
                TextureLoader.loadCompressed(path, fallbackFormat).then((tex) => {
                    if (updateLoading) {
                        advanceLoading(1);
                    }
                    resolve(tex);
                });
            }));
        }
        return Promise.all(promises);
    }

    /**
     * Проверка на поддержку WASM
     * @private
     */
    private static isWASMSupported() {
        try {
            if (typeof WebAssembly === 'object'
                && typeof WebAssembly.instantiate === 'function') {
                const module = new WebAssembly.Module(Uint8Array.of(0x0, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00));
                if (module instanceof WebAssembly.Module) return new WebAssembly.Instance(module) instanceof WebAssembly.Instance;
            }
        } catch (e) {
            console.log('WASM is not supported');
        }
        return false;
    }
}
