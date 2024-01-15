import clsx from 'clsx';
import { ReactNode } from 'react';
import { AndroidConfig, AndroidEditorGroup } from '../../../../configs/AndroidConfigs';
import { CategoryButton } from './CategoryButton';
import './CategorySelect.scss';

interface CategorySelectProps {
    config: AndroidConfig,
    active: boolean,
    onSelect: (index: number) => void,
    state: number[],
}

export function CategorySelect({
    active, onSelect, config, state,
}: CategorySelectProps) {
    const mapColumn = (items: AndroidEditorGroup[], right: boolean = false): ReactNode[] => items.map((cg) => {
        const idx = config.groups.indexOf(cg);
        return (
            <CategoryButton
                key={cg.name}
                index={state[idx]}
                right={right}
                config={cg}
                onSelect={() => onSelect(idx)}
                disabled={cg.disabled}
            />
        );
    });

    const halfIndex = Math.floor(config.groups.length / 2);
    const left = config.groups.slice(0, halfIndex);
    const right = config.groups.slice(halfIndex);

    return (
        <div id="editor-category-select">
            <div className={clsx('column', active && 'active')}>
                {mapColumn(left)}
            </div>
            <div className={clsx('column', 'right', active && 'active')}>
                {mapColumn(right, true)}
            </div>
        </div>
    );
}
