import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { AndroidEditorGroup } from '../../../../configs/AndroidConfigs';

import './CategoryEditor.scss';
import { PartButton } from './PartButton';

interface CategoryEditorProps {
    active: boolean,
    group: AndroidEditorGroup,
    index: number,
    onSelect: (index: number) => void
}

export function CategoryEditor({
    active, group, index, onSelect,
}: CategoryEditorProps) {
    const [currentIndex, setCurrentIndex] = useState(index);

    useEffect(() => {
        setCurrentIndex(index);
    }, [index]);

    const selectModule = (idx: number) => {
        if (idx !== index) {
            const level = group.levels[idx];
            if (!level.lockedUntil) {
                setCurrentIndex(idx);
                onSelect(idx);
            }
        }
    };

    return (
        <div id="android-category-edit" className={clsx(active && 'active')}>
            {
                group.levels.map((config, key) => (
                    <PartButton
                        key={key}
                        index={key}
                        active={key === currentIndex}
                        level={config}
                        onSelect={() => selectModule(key)}
                    />
                ))
            }
        </div>
    );
}
