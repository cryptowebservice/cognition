import { useStore } from 'effector-react';
import { useEffect, useState } from 'react';
import { CURRENT_ACCENT } from '../../../graphics/helpers/LandingTheme';
import { useIsMobile } from '../../../hooks/useIsMobile';
import { currentPageStore } from '../../../store/page';
import { OutlineDots } from '../../shared/OutlineDots/OutlineDots';
import { AdanedeLogo } from './AdanedeLogo';
import { BeatingHeart } from './BeatingHeart';
import './TeamScreen.scss';

export function TeamScreen() {
    const [hover, setHover] = useState(false);
    const [logoActive, setLogoActive] = useState(false);
    const currentPage = useStore(currentPageStore);
    const isMobile = useIsMobile();

    useEffect(() => {
        if (currentPage === 5 && !logoActive) {
            const timeout = setTimeout(() => {
                setLogoActive(true);
            }, 1000);
            return () => {
                clearTimeout(timeout);
            };
        }
    }, [currentPage]);

    return (
        <div id="team-screen">
            <div className="title">
                <span>Our team</span>
            </div>
            <a
                className="wrap"
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
                href='https://adanede.com'
                target="_blank"
                rel="noreferrer"
            >
                <OutlineDots active={hover} activeColor={CURRENT_ACCENT()} inactiveColor="#555565" />
                {!isMobile && (
                    <div className="wrap__left">
                        <div className="heart-wrap">
                            <BeatingHeart active={hover} />
                        </div>
                    </div>
                )}
                <div className="wrap__right">
                    <AdanedeLogo active={logoActive} />
                    {false && (
                        <div className="text">
                            A team of young enthusiasts and professionals who have come together to set a new benchmark
                            in a decentralized world
                        </div>
                    )}
                    <div className="link">
                        adanede.com
                    </div>
                </div>
            </a>
        </div>
    );
}
