import {
    CanvasTexture, DoubleSide, LinearFilter, Mesh, MeshBasicMaterial, PlaneBufferGeometry, Scene,
} from 'three';
import { SplashPreset } from '../presets/splash/SplashPreset';

const LINES: (string | ((state: number) => string))[] = [
    'Decoding latent space...',
    'Convolving image tensors...',
    'Performing augmentations...',
    'Clipping gradients...',
    'Extracting quantized points...',
    'Pooling feature maps...',
    'Domain adaptation finished!',
    'Reversing Gaussian noise...',
    (d: number) => `Decoding 2^${Math.ceil(d * 10)}-d latent space...`,

    /*
    'SYSTEM ERROR!',
    'INCOMING TRANSMISSION...',
    'Optimizing resources...',
    'Building KTX2 chunks...',
    'Running RC3 Crunch...',
    'Signal level: -38dB',
    'Sub-chunk disconnect!',
    'System check...',
    'Tasks in queue: 83',
    'Pending pixmaps: 93',
    'Pre-baking pixels...',
    'All systems: OK!',
    'CMOS Voltage: 3.3v',
    'Merging network results...',
    'Extending driver cores...',
    'Unstable connection!',
    'Shifting picture basis...',
    'Gamma computation...',
    (d: number) => `GAN pre-pass: ${Math.ceil(d * 14)}/14`,
    (d: number) => `GAN pass: ${Math.ceil(d * 84)}/84`,
    // (d: number) => `Picture loading: ${Math.ceil(d * 740)}kb`,
    // (d: number) => `CPU Core load: ${Math.floor((d * 3174 % 64) % 6) + 83}%`,
    // (d: number) => `Active frames: ${NeuraGraphicsManager.getFPS()}`,
    'WARNING! Servo error!', */
];

interface LineState {
    time: number,
    timeStep: number,
    index: number,
    offset: number,
    alpha: number,
}

/**
 * Класс для создания 3D-надписей на телевизоре
 */
export class StatusText {
    /**
     * Канвас для отрисовки
     * @private
     */
    private canvas: HTMLCanvasElement;

    private mesh: Mesh;

    private texture: CanvasTexture;

    private geometry: PlaneBufferGeometry;

    private material: MeshBasicMaterial;

    private lineStates: LineState[] = [
        /* {
            time: 1,
            timeStep: 0.1,
            index: -1,
            offset: 0,
            alpha: 0,
        }, */
        {
            time: 1,
            timeStep: 0.1,
            index: -1,
            offset: 348,
            alpha: 0,
        },
        {
            time: 1,
            timeStep: 0.1,
            index: -1,
            offset: 857,
            alpha: 0,
        },
        {
            time: 1,
            timeStep: 0.1,
            index: -1,
            offset: 1715,
            alpha: 0,
        },
    ];

    /**
     * Конструктор
     */
    public constructor() {
        this.canvas = document.createElement('canvas');
        this.canvas.width = 2048;
        this.canvas.height = 32;

        this.texture = new CanvasTexture(this.canvas);
        this.texture.minFilter = LinearFilter;

        this.material = new MeshBasicMaterial({
            map: this.texture,
            side: DoubleSide,
            transparent: true,
        });
        this.geometry = new PlaneBufferGeometry(1, 1);
        this.geometry.translate(0.5, -0.5, 0);
        this.geometry.computeBoundingSphere();
        this.geometry.computeBoundingBox();

        this.mesh = new Mesh(this.geometry, this.material);
        this.mesh.layers.set(SplashPreset.UI_EX_LAYER);
        this.mesh.scale.set(0.807, 0.00885, 1);
        this.mesh.position.set(-0.331, 0.5953, -1.2);
        this.mesh.frustumCulled = false;
    }

    public attach(scene: Scene) {
        scene.add(this.mesh);
    }

    public detach(scene: Scene) {
        scene.remove(this.mesh);
    }

    public update(delta: number) {
        for (let i = 0; i < this.lineStates.length; i++) {
            const t = this.lineStates[i];
            if (t.time === 1) {
                if (t.alpha >= 0) {
                    t.alpha = Math.max(t.alpha - 0.06 * delta, 0.0);
                    if (t.alpha === 0) {
                        // Сброс значений
                        t.time = 0;
                        t.timeStep = 0.01 + Math.random() * 0.08;

                        // Генерация индекса
                        const indices: number[] = [];
                        for (let ig = 0; ig < LINES.length; ig++) indices.push(ig);
                        for (let j = 0; j < this.lineStates.length; j++) {
                            const idx = indices.indexOf(this.lineStates[j].index);
                            if (idx !== -1) {
                                indices.splice(idx, 1);
                            }
                        }
                        t.index = indices[Math.floor(Math.random() * indices.length)];
                    }
                }
            } else if (t.alpha < 1) {
                t.alpha = Math.min(t.alpha + 0.06 * delta, 1.0);
            } else {
                t.time = Math.min(t.time + t.timeStep * delta * 0.1, 1.0);
            }
            this.lineStates[i] = t;
        }
        this.renderTexture();
    }

    private renderTexture() {
        const g = this.canvas.getContext('2d');
        if (g) {
            g.clearRect(0, 0, 2048, 32);
            g.font = '24px Jura';

            for (const s of this.lineStates) {
                let text = LINES[s.index];
                if (text instanceof Function) {
                    text = text(s.time);
                }
                g.fillStyle = `rgba(85, 85, 101, ${s.alpha})`;
                g.fillText(text.toUpperCase(), s.offset, 24);
            }
        }
        this.texture.needsUpdate = true;
    }
}
