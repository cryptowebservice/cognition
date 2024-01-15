import clsx from 'clsx';
import { useState } from 'react';
import lockedModuleImg from '../../../../assets/images/editor/emptyModule.png';
import LockedModule from '../../../../assets/images/editor/shared/locked-module.png';
import { AndroidEditorGroup } from '../../../../configs/AndroidConfigs';
import { useTextDate } from '../../../../hooks/useTextDate';
import { SoundManager } from '../../../../sounds/SoundManager';
import { OutlineDots } from '../../../shared/OutlineDots/OutlineDots';
import { CategoryGlitchTitle } from './CategoryGlitchTitle';

interface CategoryButtonProps {
    config: AndroidEditorGroup,
    right: boolean,
    index: number,
    onSelect: (index: number) => void
    disabled?: boolean;
}

export function CategoryButton({
    config, index, right, onSelect, disabled,
}: CategoryButtonProps) {
    const [hover, setHover] = useState(false);
    const [hint, setHint] = useState(false);
    const date = useTextDate(config.lockedUntil);

    const onHover = (active: boolean) => {
        setHover(active);
        if (active) {
            SoundManager.playHover();
        }
    };

    return (
        <button
            type="button"
            onClick={() => (!date ? onSelect(index) : null)}
            onMouseEnter={() => onHover(!date)}
            onMouseLeave={() => setHover(false)}
            className={clsx('category-button', right && 'right', !!date && 'muted')}
            style={{ pointerEvents: disabled ? 'none' : 'all' }}
        >
            {
                disabled
                    ? <img src={lockedModuleImg} alt="Locked module" />
                    : <img src={!date ? config.levels[index].image : LockedModule} alt={config.name} />
            }
            <OutlineDots
                active={hover}
                flip
                opposite
                noBackground
                activeColor="#ffffff"
                inactiveColor="#555565"
            />

            {
                !!date && (
                    <div className="locked">
                        <svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 23 24">
                            <path d="M5.5 10.9866V6.5c0-1.4587.6321-2.8576 1.7574-3.889C8.3826 1.5794 9.9087 1 11.5 1c1.5913 0 3.1174.5795 4.2426 1.611C16.8679 3.6423 17.5 5.0412 17.5 6.5V11M1 13c0-1.1046.8954-2 2-2h17c1.1046 0 2 .8954 2 2v8c0 1.1046-.8954 2-2 2H3c-1.1046 0-2-.8954-2-2v-8Z" fill="#07070C" />
                            <path d="M5.5 10.9866V6.5c0-1.4587.6321-2.8576 1.7574-3.889C8.3826 1.5794 9.9087 1 11.5 1c1.5913 0 3.1174.5795 4.2426 1.611C16.8679 3.6423 17.5 5.0412 17.5 6.5V11M3 23h17c1.1046 0 2-.8954 2-2v-8c0-1.1046-.8954-2-2-2H3c-1.1046 0-2 .8954-2 2v8c0 1.1046.8954 2 2 2Z" stroke="#fff" />
                        </svg>
                        <span>
                            Unlock date
                            <br />
                            {date}
                        </span>
                    </div>
                )
            }

            <span className="title">
                {disabled ? <CategoryGlitchTitle length={config.name.length} /> : config.name}
            </span>
            {
                !disabled && (
                    <>
                        <span className="level">
                            {index}
                            {' '}
                            lvl
                        </span>
                        <div
                            className="hint-icon"
                            onMouseEnter={() => setHint(true)}
                            onMouseLeave={() => setHint(false)}
                        >
                            <svg viewBox="0 0 22 22">
                                <use href="#editor-info-icon" />
                            </svg>
                        </div>
                    </>
                )
            }

            <div className={clsx('hint', hint && 'active')}>
                <div className="big">
                    {config.name}
                </div>
                <div className="content">
                    {config.description}
                </div>
            </div>
        </button>
    );
}
