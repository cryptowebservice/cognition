import clsx from 'clsx';
import { useState } from 'react';
import LockedModule from '../../../../assets/images/editor/shared/locked-module.png';
import { AndroidEditorGroupLevel } from '../../../../configs/AndroidConfigs';
import { useTextDate } from '../../../../hooks/useTextDate';
import { SoundManager } from '../../../../sounds/SoundManager';
import { OutlineDots } from '../../../shared/OutlineDots/OutlineDots';
import { CURRENT_ACCENT } from '../../../../graphics/helpers/LandingTheme';

interface PartButtonProps {
    level: AndroidEditorGroupLevel,
    index: number,
    active: boolean,
    onSelect: () => void,
}

export function PartButton({
    level, index, active, onSelect,
}: PartButtonProps) {
    const [hover, setHover] = useState(false);
    const date = useTextDate(level.lockedUntil);

    const onHover = () => {
        setHover(true);
        SoundManager.playHover();
    };

    return (
        <div className="part-button" onMouseEnter={onHover} onMouseLeave={() => setHover(false)} onClick={() => !active && onSelect()}>
            <img src={!date ? level.image : LockedModule} alt="Level icon" />
            <OutlineDots
                active={hover && !date}
                noBackground
                flip
                inactiveColor={active ? CURRENT_ACCENT() : '#555565'}
                activeColor={active ? CURRENT_ACCENT() : '#ffffff'}
            />
            <div className={clsx('level', hover && 'active')}>
                {index}
                {' '}
                lvl
            </div>
            {
                !date
                    ? (
                        <div className="button-wrap">
                            <button type="button" className={clsx(hover && 'active', active && 'muted')} onClick={() => !active && onSelect()}>
                                { active ? 'Equipped' : 'Equip' }
                            </button>
                        </div>
                    )
                    : (
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

        </div>
    );
}
