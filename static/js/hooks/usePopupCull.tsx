import { useStore } from 'effector-react';
import { useEffect, useState } from 'react';
import { PopupOverlay } from '../enums/PopupOverlay';
import { currentOverlayStore } from '../store/page';

/**
 * Вычисление отсечения и активности попапа
 * @param popupIndex
 */
export function usePopupCull(popupIndex: PopupOverlay) {
    const popup = useStore(currentOverlayStore);
    const [needRender, setNeedRender] = useState(false);
    const [isActive, setIsActive] = useState(false);

    // Обработка не-рендера попапа, если до этого не показывали
    useEffect(() => {
        let timeout: ReturnType<typeof setTimeout> | null = null;
        if (popup === popupIndex) {
            if (needRender) {
                setIsActive(true);
            } else {
                setNeedRender(true);
                timeout = setTimeout(() => {
                    setIsActive(true);
                }, 10);
            }
        } else {
            setIsActive(false);
        }

        return () => {
            if (timeout) {
                clearTimeout(timeout);
            }
        };
    }, [popup]);

    // Маска рендера и флаг активности
    return [needRender, isActive];
}
