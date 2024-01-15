import clsx from 'clsx';
import { ReactNode } from 'react';

interface DotsProps {
    page: number,
    totalPages: number,
    onNavigate: (index: number) => void,
}

const PAGE_NAMES = [
    'Main',
    'About',
    'Story',
    'Androids',
    'Roadmap',
    'Team',
    'FAQ',
    'Follow',
];

export function NavigationDots(props: DotsProps) {
    const {
        page, totalPages, onNavigate,
    } = props;

    const items: ReactNode[] = [];
    for (let i = 0; i < totalPages; i++) {
        items.push(<div className="dots__dot" key={i}>
            <button type="button" className={clsx(i === page && 'active')} onClick={() => onNavigate(i)}>
                <span>{PAGE_NAMES[i] ?? ''}</span>
            </button>
        </div>);
    }

    return (
        <div className="dots">
            {items}
        </div>
    );
}
