import clsx from 'clsx';
import { useEffect, useRef } from 'react';
import { Button } from '../../shared/Button/Button';
import './LoginMenu.scss';

interface LoginMenuProps {
    active: boolean,
    onClickOutside: () => void,
}

export function LoginMenu(props: LoginMenuProps) {
    const {
        active, onClickOutside,
    } = props;
    const closeContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!closeContainerRef.current) {
            return;
        }

        const handler = (event: MouseEvent) => {
            if (closeContainerRef.current && !closeContainerRef.current.contains(event.target as Node)) {
                if (onClickOutside) {
                    onClickOutside();
                }
            }
        };

        window.addEventListener('click', handler);
        return () => {
            window.removeEventListener('click', handler);
        };
    }, [closeContainerRef, onClickOutside]);

    return (
        <div id="login-menu" className={clsx(active && 'active')}>
            <div className="title">
                Start
            </div>

            {/* <div className="sub"> */}
            {/*    Login in one of our available wallets or login */}
            {/*    to your personal account. */}
            {/* </div> */}
            <div className="buttons" ref={closeContainerRef}>
                <Button onClick={() => window.open('https://app.neura.adanede.com', '_blank')?.focus()}>DAPP</Button>
                <Button onClick={() => window.open('https://www.alphabot.app/neura-adanede', '_blank')?.focus()}>Apply for wl</Button>
            </div>
        </div>
    );
}
