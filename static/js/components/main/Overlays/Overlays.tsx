import { FaqPopup } from './FaqPopup/FaqPopup';
import { ManifestoPopup } from './ManifestoPopup/ManifestoPopup';
import RobotPopUp from './RobotsPopUp/RobotPopUp';
import { PrivacyPopup } from './PrivacyPopup/PrivacyPopup';
import { TermsPopup } from './TermsPopup/TermsPopup';
import { StoryPopUp } from './StoryPopUp/StoryPopUp';
import ModulePopUp from './ModulePopUp/ModulePopUp';

export function Overlays() {
    return (
        <>
            <ManifestoPopup />
            <FaqPopup />
            <RobotPopUp />
            <ModulePopUp />
            <PrivacyPopup />
            <TermsPopup />
            <StoryPopUp />
        </>
    );
}
