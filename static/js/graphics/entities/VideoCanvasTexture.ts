import { ClampToEdgeWrapping, LinearFilter, Texture } from 'three';
import { destroyVideo } from '../../helpers/destroyVideo';

export class VideoCanvasTexture {
    private static readonly CANVAS_SIZE = 2048;

    private video: HTMLVideoElement | null = null;

    private image: HTMLImageElement | null = null;

    private canvas: HTMLCanvasElement;

    private texture: Texture | null;

    public constructor(media: HTMLImageElement | HTMLVideoElement) {
        this.canvas = document.createElement('canvas');
        this.canvas.width = VideoCanvasTexture.CANVAS_SIZE;
        this.canvas.height = VideoCanvasTexture.CANVAS_SIZE;
        this.bindMedia(media);

        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '1px';
        this.canvas.style.height = '1px';

        this.texture = new Texture(this.canvas, Texture.DEFAULT_MAPPING, ClampToEdgeWrapping, ClampToEdgeWrapping, LinearFilter, LinearFilter);
        this.texture.generateMipmaps = false;

        this.update();
    }

    public update() {
        const size = VideoCanvasTexture.CANVAS_SIZE;
        const g = this.canvas.getContext('2d')!;
        g.fillStyle = '#000';
        g.fillRect(0, 0, size, size);

        if (this.video) {
            const w = this.video.videoWidth / this.video.videoHeight * size;
            g.drawImage(this.video, size / 2 - w / 2, 0, w, size);
        } else if (this.image) {
            const dw = size * (this.image.naturalWidth / this.image.naturalHeight);
            g.drawImage(this.image, size / 2 - dw / 2, 0, dw, size);
        }

        if (this.texture) {
            this.texture.needsUpdate = true;
        }
    }

    public getTexture() {
        return this.texture;
    }

    public destroy(destroyTexture: boolean = false) {
        console.debug('Video destroyed');
        this.canvas.remove();
        if (destroyTexture) {
            if (this.texture) {
                this.texture.dispose();
            }
            this.texture = null;
        }

        if (this.image) {
            this.image.remove();
        }
        if (this.video) {
            destroyVideo(this.video);
        }
    }

    public bindMedia(media?: HTMLImageElement | HTMLVideoElement) {
        if (media instanceof HTMLVideoElement) {
            this.video = media;
            this.video.width = this.video.videoWidth;
            this.video.height = this.video.videoHeight;
            this.image = null;
        } else if (media instanceof HTMLImageElement) {
            this.image = media;
            this.video = null;
        }
    }
}
