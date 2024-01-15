import { ReactNode, useState } from 'react';
import { SoundManager, SoundType } from '../../../sounds/SoundManager';
import { OutlineDots } from '../OutlineDots/OutlineDots';
import './Button.scss';

interface ButtonProps {
    children: ReactNode,
    onClick?: () => void,
    directContent?: boolean,
    disabled?: boolean,
}

export function Button({
    children, onClick, directContent, disabled,
}: ButtonProps) {
    const [hover, setHover] = useState(false);
    const enter = () => {
        SoundManager.playHover();
        setHover(true);
    };
    const leave = () => {
        setHover(false);
    };
    const click = () => {
        SoundManager.play(SoundType.Button);
        if (onClick) onClick();
    };

    return (
        <button type="button" className="rounded-button" style={disabled ? { pointerEvents: 'none', color: '#555555' } : { pointerEvents: 'auto' }} onMouseEnter={enter} onMouseLeave={leave} onClick={click}>
            <OutlineDots active={hover} />
            {
                directContent ? children : <span>{children}</span>
            }
        </button>
    );
}
