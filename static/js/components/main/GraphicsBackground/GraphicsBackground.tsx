import { useEffect, useRef, useState } from 'react';
import { NeuraGraphicsManager } from '../../../graphics/managers/NeuraGraphicsManager';
import './GraphicsBackground.scss';

const SHOW_FPS = false;

export function GraphicsBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const graphicsManagerRef = useRef<NeuraGraphicsManager | null>(null);
    const [fps, setFps] = useState(0);

    // Поднятие нового менеджера при создании канваса
    useEffect(() => {
        if (!canvasRef.current) return;
        graphicsManagerRef.current = new NeuraGraphicsManager(canvasRef.current);
        return () => {
            graphicsManagerRef.current?.dispose();
            graphicsManagerRef.current = null;
        };
    }, [canvasRef]);

    // Получение FPS
    useEffect(() => {
        if (!graphicsManagerRef.current) return;

        const timer = setInterval(() => {
            setFps(NeuraGraphicsManager.getFPS());
        }, 500);
        return () => {
            clearInterval(timer);
        };
    });

    return (
        <div id='graphics-background'>
            <canvas ref={canvasRef} />

            {SHOW_FPS && (
                <div className='fps'>
                    FPS:
                    {' '}
                    {fps}
                </div>
            )}
        </div>
    );
}
