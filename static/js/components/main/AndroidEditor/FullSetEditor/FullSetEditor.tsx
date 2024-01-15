import clsx from 'clsx';
import { ReactNode } from 'react';
import { AndroidConfig, AndroidEditorGroupLevel } from '../../../../configs/AndroidConfigs';
import '../CategorySelect/CategorySelect.scss';
import { FullSetButton } from './FullSetButton';

interface FullSetEditorProps {
    config: AndroidConfig,
    active: boolean,
    index: number,
    onSelect: (index: number) => void
}

export function FullSetEditor({
    active, config, onSelect, index,
}: FullSetEditorProps) {
    const mapColumn = (items: AndroidEditorGroupLevel[], right: boolean = false): ReactNode[] => items.map((cg, key) => {
        const idx = config.fullSetGroup!.indexOf(cg);

        return (
            <FullSetButton
                level={cg}
                key={key}
                right={right}
                active={index === idx}
                onSelect={() => onSelect(idx)}
            />
        );
    });

    const left : AndroidEditorGroupLevel[] = [];
    const right : AndroidEditorGroupLevel[] = [];

    config.fullSetGroup!.forEach((el, index) => {
        if (index % 2 === 0) {
            right.push(el);
        } else left.push(el);
    });

    return (
        <div id="editor-category-select">
            <div className={clsx('column', 'right', active && 'active')}>
                {mapColumn(right, true)}
            </div>
            <div className={clsx('column', active && 'active')}>
                {mapColumn(left)}
            </div>
        </div>
    );
}
