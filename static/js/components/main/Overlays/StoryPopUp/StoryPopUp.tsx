import { PopupOverlay } from '../../../../enums/PopupOverlay';
import { useIsMobile } from '../../../../hooks/useIsMobile';
import { usePopupCull } from '../../../../hooks/usePopupCull';
import { setCurrentOverlay } from '../../../../store/page';
import { ScrollableOverlay } from '../../../shared/ScrollOverlay/ScrollableOverlay';
import '../ManifestoPopup/ManifestoPopup.scss';

export function StoryPopUp() {
    const [needRender, isActive] = usePopupCull(PopupOverlay.Story);
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
                <div className="content">
                    <h1 className="title">Story</h1>

                    <p>
                        For the last 30 years art has become increasingly simple in terms of realization
                        and secondary in terms of novelty. In the mid-19th century, art equaled the word
                        elitism and inaccessibility. The average artist spent 1000 hours of work and 10 years
                        of special education to create one work. In 2020, it took 80 hours and 3 years of
                        education to create a work.

                    </p>
                    <p>
                        Art is becoming easier and therefore more accessible:
                    </p>
                    <ul>
                        <li>
                            200 years ago 1 painting per 480 people in developed countries;
                        </li>
                        <li>
                            100 years ago per 300 people;
                        </li>
                        <li>
                            today - 53.
                        </li>
                    </ul>
                    <p>
                        Technology seeks to reduce the human cost of art to zero,
                        replacing labor with the work of a machine. In the beginning it was just generative art,
                        but now we stand on the threshold of the next step - the art of neural networks. At the same
                        time with the growth of the population and the standard of living of the whole world people think
                        less and less about basic needs, so art has become one of the priorities in life.
                    </p>
                    <p>
                        In 2044 art will be decentralized and no one will consider the word art as something unavailable.
                        A small number of people will be able to own the artists and determine what all art will look
                        like together with each of their actions. The rest will have the opportunity to buy these works
                        in unlimited quantities and become owners of world art.
                    </p>
                    <p>
                        These artists will be a new kind of android, the Automated Creative Intellectual Androids
                        (A.C.I.A.). They are developed and created by five major companies fighting for
                        market share in the Neura universe.
                    </p>
                    <p>
                        Today Neura is art. Tomorrow, art is Neura.
                    </p>
                </div>
            </div>
        </ScrollableOverlay>
    ) : null;
}
