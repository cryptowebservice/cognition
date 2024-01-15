import clsx from 'clsx';
import { useStore } from 'effector-react';
import { MouseEvent, useEffect, useState } from 'react';
import { blocks } from '../../../../configs/Faq';
import { PopupOverlay } from '../../../../enums/PopupOverlay';
import { useIsMobile } from '../../../../hooks/useIsMobile';
import { usePopupCull } from '../../../../hooks/usePopupCull';
import { SoundManager, SoundType } from '../../../../sounds/SoundManager';
import { faqPageStore, setFaqPage } from '../../../../store/faq';
import { setCurrentOverlay } from '../../../../store/page';
import { ScrollableOverlay } from '../../../shared/ScrollOverlay/ScrollableOverlay';
import { FaqEntry } from './FaqEntry';

import './FaqPopup.scss';
import { ScrollablePills } from './ScrollablePills';

export function FaqPopup() {
    const [needRender, isActive] = usePopupCull(PopupOverlay.FAQ);
    const [activePage, setActivePage] = useState(0);
    const [pageHiding, setPageHiding] = useState(false);
    const [expandedBlock, setExpandedBlock] = useState(-1);
    const mobile = useIsMobile();
    const page = useStore(faqPageStore);

    useEffect(() => {
        if (isActive) {
            setExpandedBlock(-1);
        }
    }, [isActive]);

    useEffect(() => {
        setPageHiding(true);
        setExpandedBlock(-1);
        const tm = setTimeout(() => {
            setActivePage(page);
            setPageHiding(false);
        }, 510);
        return () => {
            clearTimeout(tm);
        };
    }, [page]);

    // Закрытие;
    const handleClose = () => {
        if (!mobile) {
            setCurrentOverlay(PopupOverlay.None);
        }
    };

    const handleButton = (event: MouseEvent<HTMLButtonElement>, index: number) => {
        event.preventDefault();
        event.stopPropagation();
        SoundManager.play(SoundType.Button);
        setFaqPage(index);
    };

    const toggleBlock = (index: number) => {
        setExpandedBlock(index !== expandedBlock ? index : -1);
    };

    return needRender ? (
        <ScrollableOverlay active={isActive}>
            <div id="faq-popup" onClick={handleClose}>
                <div className="wrap">
                    <div className="title">FAQ</div>
                    {
                        mobile ? <ScrollablePills index={page} onIndexChange={(index) => setFaqPage(index)} /> : (
                            <div className="pills">
                                {
                                    blocks.map((block, index) => (
                                        <button
                                            type='button'
                                            className={clsx(page === index && 'active')}
                                            key={block.title}
                                            onClick={(e) => handleButton(e, index)}
                                        >
                                            {block.title}
                                        </button>
                                    ))
                                }
                            </div>
                        )
                    }
                    <div className={clsx('entries', pageHiding && 'hidden')}>
                        {blocks[activePage]
                            .entries
                            .map((entry, key) => (
                                <FaqEntry
                                    key={`${key} ${activePage}`}
                                    entry={entry}
                                    active={expandedBlock === key}
                                    isOpened={expandedBlock !== -1}
                                    onSelect={() => toggleBlock(key)}
                                />
                            ))}
                    </div>
                </div>

            </div>
        </ScrollableOverlay>
    ) : null;
}
