import { useStore } from 'effector-react';
import React from 'react';
import { PopupOverlay } from '../../../../enums/PopupOverlay';
import { CURRENT_THEME } from '../../../../graphics/helpers/LandingTheme';
import { useIsMobile } from '../../../../hooks/useIsMobile';
import { usePopupCull } from '../../../../hooks/usePopupCull';
import { setCurrentOverlay } from '../../../../store/page';
import { $selectedModuleStore } from '../../../../store/selectedModule';
import { ScrollableOverlay } from '../../../shared/ScrollOverlay/ScrollableOverlay';
import './ModulePopUp.scss';
import { MODULE_TEXT } from './moduleText';

function RobotPopUp() {
    const [needRender, isActive] = usePopupCull(PopupOverlay.ModuleInfo);
    const moduleIndex = useStore($selectedModuleStore);
    const mobile = useIsMobile();

    // Закрытие
    const handleClose = () => {
        if (!mobile) {
            setCurrentOverlay(PopupOverlay.None);
        }
    };

    return needRender ? (
        <ScrollableOverlay active={isActive}>
            <div id="module-popup" onClick={handleClose}>
                <div className="content">
                    {moduleIndex !== -1 && (MODULE_TEXT[CURRENT_THEME()] ?? MODULE_TEXT[0])[moduleIndex].map((el, index) => <div className="text" key={index}>{el}</div>)}
                </div>
            </div>
        </ScrollableOverlay>
    ) : null;
}

export default RobotPopUp;
