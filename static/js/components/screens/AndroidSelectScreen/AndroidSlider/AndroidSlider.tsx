import {
    Children, ReactNode, useEffect, useRef, useState,
} from 'react';
import { SoundManager, SoundType } from '../../../../sounds/SoundManager';
import './AndroidSlider.scss';

interface SliderProps {
    children: ReactNode,
    handleActiveSlide: (index: number) => void,
    handleSelect: (index: number) => void,
}

export function AndroidSlider({ children, handleActiveSlide, handleSelect }: SliderProps) {
    const [activeSlide, setActiveSlide] = useState(0);
    const touchRef = useRef<number>(-1);
    const touchPosRef = useRef<number>(0);
    const touchVerticalPosRef = useRef<number>(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const slideClickSizeHalf = 188 / 2;
    const childs = Children.toArray(children);

    // Здесь можно было бы юзануть useSwipeGesture, но важно отловить клик,
    // если мы вообще не скроллили, а просто тапнули
    useEffect(() => {
        if (!containerRef.current) return;

        const touchStart = (ev: TouchEvent) => {
            if (touchRef.current === -1) {
                if (ev.touches.length > 0) {
                    touchRef.current = ev.touches[0].identifier;
                    touchPosRef.current = ev.touches[0].clientX;
                    touchVerticalPosRef.current = ev.touches[0].clientY;
                }
            }
        };
        const touchMove = (ev: TouchEvent) => {
            for (const tid in ev.changedTouches) {
                if (tid in ev.changedTouches) {
                    const touch = ev.changedTouches[tid];
                    if (touch.identifier === touchRef.current) {
                        const shiftX = touch.clientX - touchPosRef.current;
                        const shiftY = touch.clientY - touchVerticalPosRef.current;

                        if (Math.abs(shiftX) > 10 && Math.abs(shiftX) > Math.abs(shiftY)) {
                            setActiveSlide((prevSlide) => Math.min(Math.max(prevSlide - Math.sign(shiftX), 0), childs.length - 1));
                            touchRef.current = -1;
                            touchPosRef.current = -1;
                            SoundManager.play(SoundType.ButtonHover);
                        }
                        break;
                    }
                }
            }
        };
        const touchEnd = (ev: TouchEvent) => {
            for (const tid in ev.changedTouches) {
                if (tid in ev.changedTouches) {
                    const touch = ev.changedTouches[tid];
                    if (touch.identifier === touchRef.current) {
                        const shiftX = touch.clientX - touchPosRef.current;
                        const shiftY = touch.clientY - touchVerticalPosRef.current;

                        if (Math.abs(shiftX) >= Math.abs(shiftY)) {
                            if (Math.abs(touch.clientX - (window.innerWidth / 2.0)) < slideClickSizeHalf) {
                                SoundManager.play(SoundType.Button);
                                handleSelect(activeSlide);
                            } else if (touch.clientX - (window.innerWidth / 2.0) < 0) {
                                setActiveSlide((prevState) => Math.max(prevState - 1, 0));
                                SoundManager.play(SoundType.ButtonHover);
                            } else {
                                setActiveSlide((prevState) => Math.min(prevState + 1, childs.length - 1));
                                SoundManager.play(SoundType.ButtonHover);
                            }
                        }

                        touchRef.current = -1;
                        touchPosRef.current = -1;
                        break;
                    }
                }
            }
        };

        // Бинд ивентов
        const wrap = containerRef.current;
        wrap.addEventListener('touchstart', touchStart);
        wrap.addEventListener('touchmove', touchMove);
        wrap.addEventListener('touchend', touchEnd);
        wrap.addEventListener('touchcancel', touchEnd);

        // Отвязка ивентов
        return () => {
            wrap.removeEventListener('touchstart', touchStart);
            wrap.removeEventListener('touchmove', touchMove);
            wrap.removeEventListener('touchend', touchEnd);
            wrap.removeEventListener('touchcancel', touchEnd);
        };
    }, [activeSlide, containerRef, children]);

    useEffect(() => {
        handleActiveSlide(activeSlide);
    }, [activeSlide]);

    const wrapStyle = {
        transform: `translateX(calc(var(--slide-size) * ${-activeSlide}))`,

    };
    return (
        <div className="android-slider" ref={containerRef}>
            <div className="android-slider__frame">
                <div className="android-slider__wrapper" style={wrapStyle}>
                    {childs}
                </div>
            </div>
        </div>
    );
}
