import { useEffect, useRef } from 'react';
import { CURRENT_ACCENT } from '../../../graphics/helpers/LandingTheme';

/**
 * Параметры компонента
 */
interface DotsProps {
    active?: boolean,
    noBackground?: boolean,
    flip?: boolean
    opposite?: boolean,
    inactiveColor?: string,
    activeColor?: string,
}

/**
 * Экземпляр обводки
 */
interface DotEntry {
    width: number,
    height: number,
    state: number,
    active: boolean,
    noBackground: boolean,
    flip: boolean,
    opposite: boolean,
    inactiveColor?: string,
    activeColor?: string,
    canvas: HTMLCanvasElement,
    needRedraw?: boolean
}

/**
 * Рендерер для обводки
 */
class OutlineRenderer {
    /**
     * Связанные экземпляры
     * @private
     */
    private static entries: DotEntry[] = [];

    /**
     * Внутренний таймер для перерисовки
     * @private
     */
    private static rafHandle: number = 0;

    /**
     * Предыдущее значение таймштампа
     * @private
     */
    private static rafPrevTime: number = 0;

    /**
     * Добавление новой записи
     * @param entry
     */
    public static add(entry: DotEntry) {
        if (!this.entries.includes(entry)) {
            this.entries.push(entry);

            if (!this.rafHandle) {
                this.intervalUpdate = this.intervalUpdate.bind(this);
                this.rafPrevTime = performance.now();
                this.intervalUpdate(this.rafPrevTime);
            }
        }
    }

    /**
     * Удаление компонента
     * @param entry
     */
    public static remove(entry: DotEntry) {
        if (this.entries.includes(entry)) {
            this.entries.splice(this.entries.indexOf(entry), 1);

            if (this.entries.length === 0 && this.rafHandle) {
                cancelAnimationFrame(this.rafHandle);
                this.rafHandle = 0;
            }
        }
    }

    /**
     * Апдейт логики
     * @private
     */
    private static intervalUpdate(deltaTimeRaw: number) {
        this.rafHandle = requestAnimationFrame(this.intervalUpdate);
        const delta = (deltaTimeRaw - this.rafPrevTime) / 16.666;
        this.rafPrevTime = deltaTimeRaw;

        for (const en of this.entries) {
            const rect = en.canvas.getBoundingClientRect();
            const newVal = en.active
                ? Math.min(1, en.state + 0.03 * delta)
                : Math.max(0, en.state - 0.03 * delta);
            const needRepaint = newVal !== en.state
                || en.needRedraw
                || rect.width !== en.width
                || rect.height !== en.height;
            en.state = newVal;
            en.width = rect.width;
            en.height = rect.height;
            if (needRepaint) {
                this.renderEntry(en, rect);
                en.needRedraw = false;
            }
        }
    }

    /**
     * Отрисовка одного блока
     * @param entry
     * @param rect
     * @private
     */
    private static renderEntry(entry: DotEntry, rect: DOMRectReadOnly) {
        const g = entry.canvas.getContext('2d');
        if (rect && g) {
            const dpi = window.devicePixelRatio;
            const width = Math.round(rect.width) * dpi;
            const height = Math.round(rect.height) * dpi;
            entry.canvas.width = width;
            entry.canvas.height = height;
            const d = this.easeValue(entry.state);
            const pad = 5 * dpi;
            const rad = 4 * dpi;
            const sw = width - pad * 2;
            const sh = height - pad * 2;

            g.resetTransform();
            g.clearRect(0, 0, width, height);
            g.translate(pad, pad);

            // Первый - фоновый оверлей
            if (!entry.noBackground) {
                g.beginPath();
                g.moveTo(rad, 0);
                g.lineTo(sw - rad, 0);
                g.quadraticCurveTo(sw, 0, sw, rad);
                g.lineTo(sw, sh - rad);
                g.quadraticCurveTo(sw, sh, sw - rad, sh);
                g.lineTo(rad, sh);
                g.quadraticCurveTo(0, sh, 0, sh - rad);
                g.lineTo(0, rad);
                g.quadraticCurveTo(0, 0, rad, 0);
                g.fillStyle = 'rgba(7, 7, 12, 0.6)';
                g.fill();
            }

            // Второй - две отбивки
            const posFrom = 27 * dpi;
            const pointRadius = 2 * dpi;
            const pointPad = 8 * dpi;
            const baseColor = this.lerpColor(
                entry.inactiveColor ?? '#555565',
                entry.activeColor ?? CURRENT_ACCENT(),
                d,
            );
            // g.lineWidth = 0.5;
            g.translate(0.5, 0.5);

            if (entry.flip) {
                const posTo = sh - 27 * dpi;
                const lowerPos = !entry.opposite
                    ? posFrom + (posTo - posFrom) * d
                    : posTo + (posFrom - posTo) * d;
                const upperPos = sh - lowerPos;

                g.strokeStyle = baseColor;
                g.beginPath();
                g.moveTo(0, lowerPos - pointPad);
                g.lineTo(0, rad);
                g.quadraticCurveTo(0, 0, rad, 0);
                g.lineTo(sw - rad, 0);
                g.quadraticCurveTo(sw, 0, sw, rad);
                g.lineTo(sw, upperPos - pointPad);
                g.stroke();

                g.beginPath();
                g.moveTo(sw, upperPos + pointPad);
                g.lineTo(sw, sh - rad);
                g.quadraticCurveTo(sw, sh, sw - rad, sh);
                g.lineTo(rad, sh);
                g.quadraticCurveTo(0, sh, 0, sh - rad);
                g.lineTo(0, lowerPos + pointPad);
                g.stroke();

                // И две сферы
                g.fillStyle = baseColor;
                g.beginPath();
                g.arc(0, lowerPos, pointRadius, 0, 2 * Math.PI);
                g.fill();
                g.beginPath();
                g.arc(sw, upperPos, pointRadius, 0, 2 * Math.PI);
                g.fill();
            } else {
                const posTo = sw - 27 * dpi;
                const lowerPos = !entry.opposite
                    ? posFrom + (posTo - posFrom) * d
                    : posTo + (posFrom - posTo) * d;
                const upperPos = sw - lowerPos;

                g.strokeStyle = baseColor;
                g.beginPath();
                g.moveTo(upperPos + pointPad, 0);
                g.lineTo(sw - rad, 0);
                g.quadraticCurveTo(sw, 0, sw, rad);
                g.lineTo(sw, sh - rad);
                g.quadraticCurveTo(sw, sh, sw - rad, sh);
                g.lineTo(lowerPos + pointPad, sh);
                g.stroke();

                g.beginPath();
                g.moveTo(lowerPos - pointPad, sh);
                g.lineTo(rad, sh);
                g.quadraticCurveTo(0, sh, 0, sh - rad);
                g.lineTo(0, rad);
                g.quadraticCurveTo(0, 0, rad, 0);
                g.lineTo(upperPos - pointPad, 0);
                g.stroke();

                // И две сферы
                g.fillStyle = baseColor;
                g.beginPath();
                g.arc(upperPos, 0, pointRadius, 0, 2 * Math.PI);
                g.fill();
                g.beginPath();
                g.arc(lowerPos, sh, pointRadius, 0, 2 * Math.PI);
                g.fill();
            }
        }
    }

    /**
     * Сглаживание значения по кривой Безье
     * @param x
     * @private
     */
    private static easeValue(x: number): number {
        return x < 0.5 ? 16 * x * x * x * x * x : 1 - (-2 * x + 2) ** 5 / 2;
    }

    /**
     * Линейная интерполяция двух цветов
     * @param a
     * @param b
     * @param amount
     * @private
     */
    private static lerpColor(a: string, b: string, amount: number) {
        const ah = parseInt(a.replace(/#/g, ''), 16);
        const ar = ah >> 16; const ag = (ah >> 8) & 0xff; const ab = ah & 0xff;
        const bh = parseInt(b.replace(/#/g, ''), 16);
        const br = bh >> 16; const bg = (bh >> 8) & 0xff; const bb = bh & 0xff;
        const rr = ar + amount * (br - ar);
        const rg = ag + amount * (bg - ag);
        const rb = ab + amount * (bb - ab);
        return `#${((1 << 24) + (rr << 16) + (rg << 8) + rb | 0).toString(16).slice(1)}`;
    }
}

/**
 * Компонент обводки с точками
 * @param active
 * @param noBackground
 * @param flip
 * @param opposite
 * @param inactiveColor
 * @param activeColor
 * @constructor
 */
export function OutlineDots({
    active, noBackground, flip, opposite, inactiveColor, activeColor,
}: DotsProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const entryRef = useRef<DotEntry | null>(null);

    useEffect(() => {
        if (entryRef.current) {
            OutlineRenderer.remove(entryRef.current);
            entryRef.current = null;
        }
        if (!canvasRef.current) return;
        entryRef.current = {
            width: 1,
            height: 1,
            canvas: canvasRef.current,
            state: 0.1,
            active: !!active,
            noBackground: !!noBackground,
            flip: !!flip,
            opposite: !!opposite,
            inactiveColor,
            activeColor,
        };
        OutlineRenderer.add(entryRef.current);

        return () => {
            if (entryRef.current) {
                OutlineRenderer.remove(entryRef.current);
                entryRef.current = null;
            }
        };
    }, [canvasRef]);

    useEffect(() => {
        const ent = entryRef.current;
        if (ent) {
            ent.active = !!active;
            ent.opposite = !!opposite;
            ent.activeColor = activeColor;
            ent.inactiveColor = inactiveColor;
            ent.needRedraw = true;
        }
    }, [active, opposite, inactiveColor, activeColor]);

    return <canvas ref={canvasRef} />;
}
