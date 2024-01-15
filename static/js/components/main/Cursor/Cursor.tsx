import clsx from 'clsx';
import { useStore } from 'effector-react';
import { useEffect, useState } from 'react';
import { PopupOverlay } from '../../../enums/PopupOverlay';
import { currentOverlayStore } from '../../../store/page';
import './Cursor.scss';

interface Coords {
    x: number,
    y: number
}

export function Cursor() {
    const [position, setPosition] = useState<Coords>({
        x: -100,
        y: -100,
    });
    const [visible, setVisible] = useState<boolean>(true);
    const [touchDevice, setTouchDevice] = useState(false);
    const [active, setActive] = useState<boolean>(false);
    const currentOverlay = useStore(currentOverlayStore);

    useEffect(() => {
        const isTouch = !window.matchMedia('(pointer: fine)').matches;
        setTouchDevice(touchDevice);
        if (isTouch) {
            return;
        }

        const enterHandler = () => {
            setVisible(true);
        };
        const leaveHandler = () => {
            setVisible(false);
        };
        const moveHandler = (e: MouseEvent) => {
            setPosition({
                x: e.clientX,
                y: e.clientY,
            });
        };
        const mouseOver = (e: MouseEvent) => {
            let act = false;
            if (e.target) {
                if (
                    (e.target as Element).closest('button')
                    || (e.target as Element).closest('a')
                    || (e.target as Element).closest('.clickable')
                ) {
                    act = true;
                }
            }
            setActive(act);
        };

        document.addEventListener('mouseenter', enterHandler);
        document.addEventListener('mousemove', moveHandler);
        document.addEventListener('mouseleave', leaveHandler);
        document.addEventListener('mouseover', mouseOver);
        return () => {
            document.removeEventListener('mouseenter', enterHandler);
            document.removeEventListener('mousemove', moveHandler);
            document.removeEventListener('mouseleave', leaveHandler);
            document.removeEventListener('mouseover', mouseOver);
        };
    }, []);

    useEffect(() => {
        if (currentOverlay !== PopupOverlay.None && !active) {
            document.body.classList.add('cursor-close');
        } else {
            document.body.classList.remove('cursor-close');
        }
    }, [currentOverlay, active]);

    const style = {
        transform: `translate(${position.x}px, ${position.y}px)`,
        opacity: visible ? '1' : '0',
    };
    return !touchDevice
        ? (
            <div
                id="cursor"
                className={clsx(active && 'active', currentOverlay !== PopupOverlay.None && !active && 'center')}
                style={style}
            />
        ) : null;
}
