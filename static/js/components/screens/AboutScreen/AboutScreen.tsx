import { useStore } from 'effector-react';
import { PopupOverlay } from '../../../enums/PopupOverlay';
import { currentScrollStore, setCurrentOverlay } from '../../../store/page';
import { AboutPaintings } from '../../shared/AboutPaintings/AboutPaintings';
import { Button } from '../../shared/Button/Button';
import './AboutScreen.scss';

export function AboutScreen() {
    const currentScroll = useStore(currentScrollStore);

    const openPopup = () => {
        setCurrentOverlay(PopupOverlay.Manifesto);
    };

    return (
        <section id="about-screen">
            <div className="columns">
                <div className="left">
                    {/* <div className="types"> */}
                    {/*    android types */}
                    {/* </div> */}
                    {/* <div className="counter"> */}
                    {/*    005 */}
                    {/* </div> */}
                    <AboutPaintings active={currentScroll > 0 && currentScroll < 2} />
                </div>
                <div className="right">
                    <div className="title">
                        about
                    </div>
                    <p>
                        Neura is a special approach to the possession
                        of art, the last hope of mankind. Create works using
                        a unique android, upgrade your skills and discover new creative possibilities.
                    </p>
                    <div className="button-wrap">
                        <Button onClick={openPopup}>
                            The manifesto
                        </Button>
                    </div>
                </div>
            </div>

        </section>
    );
}
