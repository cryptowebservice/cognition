import { ClampToEdgeWrapping, NearestFilter, Texture } from 'three';

export class DisplaceCanvasTexture {
    private canvas: HTMLCanvasElement;

    private texture: Texture;

    private size: number;

    private isModule: boolean;

    public constructor(size: number = 512, isModule: boolean = true) {
        this.size = size;
        this.isModule = isModule;
        this.canvas = document.createElement('canvas');
        this.canvas.width = this.size;
        this.canvas.height = this.size;
        this.texture = new Texture(this.canvas, Texture.DEFAULT_MAPPING, ClampToEdgeWrapping, ClampToEdgeWrapping, NearestFilter, NearestFilter);
        this.texture.generateMipmaps = false;
        this.update(1);
    }

    public update(value: number) {
        const g = this.canvas.getContext('2d')!;
        g.fillStyle = `rgba(128, 128, ${value > 0.5 ? 255 : 0})`;
        g.fillRect(0, 0, this.size, this.size);

        const ramp = Math.sin((value + 0.75) * 3.1415926538 * 2.0) * 0.5 + 0.5;

        if (this.isModule) {
            const rects = Math.floor(1 + ramp * 24 * this.size / 512);
            for (let i = 0; i < rects; i++) {
                const dirX = Math.random();
                const dirY = Math.random();
                const mix = Math.random() > 0.2 + value * 0.6 ? 1 : 0;
                const w = Math.floor(Math.random() * 100 + 10);
                const h = Math.floor(Math.random() * 50 + 30);
                const x = Math.floor(Math.random() * this.size - w / 2);
                const y = Math.floor(Math.random() * this.size - h / 2);
                g.fillStyle = `rgb(${Math.floor(dirX * 255)}, ${Math.floor(dirY * 255)}, ${Math.floor(mix * 255)})`;
                g.fillRect(x, y, w, h);
            }
        } else {
            const rects = Math.floor(1 + ramp * 24 * this.size / 256);
            for (let i = 0; i < rects; i++) {
                const dirX = Math.random();
                const dirY = Math.random();
                const mix = Math.random() > 0.2 + value * 0.6 ? 1 : 0;
                const w = Math.floor(Math.random() * 50 + 5);
                const h = Math.floor(Math.random() * 25 + 15);
                const x = Math.floor(Math.random() * this.size - w / 2);
                const y = Math.floor(Math.random() * this.size - h / 2);
                g.fillStyle = `rgb(${Math.floor(dirX * 255)}, ${Math.floor(dirY * 255)}, ${Math.floor(mix * 255)})`;
                g.fillRect(x, y, w, h);
            }
        }

        this.texture.needsUpdate = true;
    }

    public getTexture() {
        return this.texture;
    }

    public destroy(destroyTexture: boolean = false) {
        this.canvas.remove();
        if (destroyTexture) {
            this.texture.dispose();
        }
    }
}
