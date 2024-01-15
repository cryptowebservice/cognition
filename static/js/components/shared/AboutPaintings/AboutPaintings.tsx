import { useEffect, useRef } from 'react';
import styles from './AboutPaintings.module.scss';
import { PaintingsRenderer } from './PaintingsRenderer';

interface AboutProps {
    active: boolean
}

export function AboutPaintings({ active }: AboutProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const renderRef = useRef<PaintingsRenderer | null>(null);

    useEffect(() => {
        if (canvasRef.current) {
            const renderer = new PaintingsRenderer(canvasRef.current!);
            renderRef.current = renderer;
            return () => {
                renderer.destroy();
                renderRef.current = null;
            };
        }
    }, []);

    useEffect(() => {
        renderRef.current?.setEnabled(active);
    }, [active]);

    return (
        <div className={styles.paintings}>
            <canvas ref={canvasRef} className={styles.paintings__canvas} />
        </div>
    );
}
