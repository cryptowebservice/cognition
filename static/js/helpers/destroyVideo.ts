export function destroyVideo(video: HTMLVideoElement) {
    video.pause();
    video.removeAttribute('src');
    video.load();
    // video.remove();
}
