import { PopupOverlay } from '../../../../enums/PopupOverlay';
import { useIsMobile } from '../../../../hooks/useIsMobile';
import { usePopupCull } from '../../../../hooks/usePopupCull';
import { setCurrentOverlay } from '../../../../store/page';
import { ScrollableOverlay } from '../../../shared/ScrollOverlay/ScrollableOverlay';
import { ManifestoLines } from './ManifestoLines';

import './ManifestoPopup.scss';
import { CURRENT_ACCENT } from '../../../../graphics/helpers/LandingTheme';
import CurrentAccentText from '../../../shared/CurrentAccentText/CurrentAccentText';

export function ManifestoPopup() {
    const [needRender, isActive] = usePopupCull(PopupOverlay.Manifesto);
    const mobile = useIsMobile();

    // Закрытие
    const handleClose = () => {
        if (!mobile) {
            setCurrentOverlay(PopupOverlay.None);
        }
    };

    return needRender ? (
        <ScrollableOverlay active={isActive}>
            <div id="manifesto-popup" onClick={handleClose}>
                <div className="manifesto-block">
                    <ManifestoLines />

                    <div className="title">
                        the
                        <br />
                        manifesto
                    </div>
                    <ul>
                        <li>Art is not created only by humans.</li>
                        <li>Art is created only for humans.</li>
                        <li><CurrentAccentText text="Art is limited." /></li>
                        <li>Art cannot be controlled, it is unpredictable.</li>
                        <li>Art should be accessible.</li>
                        <li>Art should be decentralized.</li>
                        <li>Art should be distributed freely.</li>
                    </ul>

                    <ManifestoLines flipped />

                    <div className="chevron-down">
                        <svg width="20" height="10" viewBox="0 0 20 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M19.3322 1.3737C19.5386 1.19025 19.5572 0.874209 19.3737 0.667818C19.1902 0.461427 18.8742 0.442837 18.6678 0.626296L19.3322 1.3737ZM1.33218 0.626295C1.12579 0.442836 0.809755 0.461426 0.626296 0.667817C0.442837 0.874208 0.461427 1.19024 0.667818 1.3737L1.33218 0.626295ZM10.6644 8.40945L10.9965 8.78316L10.6644 8.40945ZM9.33564 8.40945L9.00345 8.78316L9.33564 8.40945ZM18.6678 0.626296L10.3322 8.03575L10.9965 8.78316L19.3322 1.3737L18.6678 0.626296ZM9.66782 8.03575L1.33218 0.626295L0.667818 1.3737L9.00345 8.78316L9.66782 8.03575ZM10.3322 8.03575C10.1427 8.20414 9.85726 8.20414 9.66782 8.03575L9.00345 8.78316C9.57178 9.28834 10.4282 9.28834 10.9965 8.78316L10.3322 8.03575Z"
                                fill={CURRENT_ACCENT()}
                            />
                        </svg>
                    </div>
                </div>
                <div className="content">
                    <h1 className="title">About</h1>
                    <p>
                        In a world where creativity is becoming scarce, a new art form has emerged.
                        Automated Creative Intellectual Androids (A.C.I.A.), produced by the top five tech companies,
                        have taken the art world by storm. Each company model has its unique features,
                        and their neural networks draw paintings based on initial patterns that differ
                        between each android.
                    </p>
                    <p>
                        A set number of initial figures and patterns serve as inspiration for the creations of these androids,
                        and collectors can witness how neural networks interpret these inputs in different ways,
                        resulting in an ever-expanding collection of unique paintings. But there is more to it than that.
                        Holders can upgrade their androids with six modules, each altering the visual style, rarity,
                        drawing techniques and appearance of both the painting and the android itself.
                    </p>
                    <p>
                        Each android type produced by the competing companies has unique features, and their
                        paintings reflect those differences. The main visual differences are in basic color
                        palettes they use before upgrades and the initial patterns. However, the differences
                        between each android go deeper than what can be seen at a first glance.
                    </p>
                    <p>
                        As a holder, your rewards are directly tied to the paintings you end up with.
                        You are invited to embark on a journey full of excitement, collecting and competing in a
                        different way. At this stage you will be forced to make
                        <strong> choices </strong>
                        : from which of companies
                        you want to join to what combination of modules you will get.
                    </p>
                    <p>
                        Here is a true
                        <strong> decentralization </strong>
                        of art and complete freedom of expression. Every owner acts like a node in a global net.
                        The appearance of future art is not determined by the opinion of majority over minority.
                        You have the power to act fully independently, leading your Android to the
                        <strong> style </strong>
                        you want
                        and to your own
                        <strong> understanding </strong>
                        of art.
                    </p>
                    <p>
                        The rules of the universe are clear, but the result is always unpredictable...
                    </p>
                    <p>
                        All the answers are in Neura.
                    </p>
                </div>
            </div>
        </ScrollableOverlay>
    ) : null;
}
