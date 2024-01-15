import { isMobile as isMobileLib } from 'is-mobile';
import { useEffect, useState } from 'react';

/**
 * Класс для определения телефона
 */
export class MobileDetect {
    /**
     * Флаг телефона
     * @private
     */
    private static mobileFlag: boolean = false;

    /**
     * Флаг слабого устройства
     * @private
     */
    private static lowPowerFlag: boolean = false;

    /**
     * Флаг для сафари
     * @private
     */
    private static safariFlag: boolean = false;

    /**
     * Флаг проверки
     * @private
     */
    private static isChecked: boolean = false;

    /**
     * Проверка на телефон
     */
    public static isMobile() {
        this.check();
        return this.mobileFlag;
    }

    /**
     * Проверка на слабый телефон
     */
    public static isLowPower() {
        this.check();
        return this.lowPowerFlag;
    }

    /**
     * Проверка на Safari
     */
    public static isSafari() {
        this.check();
        return this.safariFlag;
    }

    /**
     * Проверка всех возможностей
     * @private
     */
    private static check() {
        if (!this.isChecked) {
            // Проверка на телефон через либу
            this.mobileFlag = isMobileLib({
                featureDetect: false,
            });

            if (this.mobileFlag) {
                // Проверка по юзерагенту и разрешению экрана
                if (
                    navigator.userAgent.match(/(android|air)/i)
                    && (window.screen.width <= 400 || window.screen.height <= 400)
                ) {
                    this.lowPowerFlag = true;
                }
            }

            this.safariFlag = !!navigator.userAgent.match(/safari/i);

            this.isChecked = true;
        }
    }
}
const
    isMobile = () => MobileDetect.isMobile(),
    isSafari = () => MobileDetect.isSafari(),
    isLowPower = () => MobileDetect.isLowPower();

function useIsMobile() {
    const [mobile, setMobile] = useState(false);

    useEffect(() => {
        const handler = () => {
            setMobile((window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth) < 1024);
        };
        window.addEventListener('resize', handler);
        handler();

        return () => {
            window.removeEventListener('resize', handler);
        };
    }, []);

    return mobile;
}

export {
    isMobile, useIsMobile, isLowPower, isSafari,
};
