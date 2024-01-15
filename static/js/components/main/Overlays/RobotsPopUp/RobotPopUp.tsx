import React from 'react';
import { usePopupCull } from '../../../../hooks/usePopupCull';
import { PopupOverlay } from '../../../../enums/PopupOverlay';
import { useIsMobile } from '../../../../hooks/useIsMobile';
import { setCurrentOverlay } from '../../../../store/page';
import { ScrollableOverlay } from '../../../shared/ScrollOverlay/ScrollableOverlay';
import './RobotPopUp.scss';
import { ROBOT_TEXT } from './robotText';
import { CURRENT_THEME } from '../../../../graphics/helpers/LandingTheme';

function RobotPopUp() {
    const [needRender, isActive] = usePopupCull(PopupOverlay.AndroidInfo);
    const mobile = useIsMobile();

    // Закрытие
    const handleClose = () => {
        if (!mobile) {
            setCurrentOverlay(PopupOverlay.None);
        }
    };

    return needRender ? (
        <ScrollableOverlay active={isActive} isAndroid>
            <div id="robot-popup" onClick={handleClose}>
                <div className="content">
                    {ROBOT_TEXT[CURRENT_THEME()].map((el, index) => <div className="text" key={index}>{el}</div>)}
                </div>
                <div className="img-space" style={{ width: '100vw', height: '100vh' }} />
            </div>
        </ScrollableOverlay>
    ) : null;
}

export default RobotPopUp;
