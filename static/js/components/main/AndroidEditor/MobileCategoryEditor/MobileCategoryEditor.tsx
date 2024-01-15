import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { AndroidConfig } from '../../../../configs/AndroidConfigs';
import './MobileCategoryEditor.scss';

interface CategoryEditorProps {
    active: boolean,
    cg: AndroidConfig,
    prevGroup: number,
    index: number,
    isModule : boolean,
    onSelect: (index: number) => void
}

export function MobileCategoryEditor({
    active, cg, index, onSelect, prevGroup, isModule,
}: CategoryEditorProps) {
    const [currentIndex, setCurrentIndex] = useState(index);
    const group = cg.groups[prevGroup];

    useEffect(() => {
        setCurrentIndex(index);
    }, [index]);

    const selectModule = (idx: number) => {
        if (idx !== index) {
            setCurrentIndex(idx);
            const level = group.levels[idx];
            if (!level.lockedUntil) {
                onSelect(idx);
            }
        }
    };
    const decreaseModule = () => {
        if (currentIndex > 0) {
            selectModule(currentIndex - 1);
        }
    };
    const increaseModule = () => {
        if (currentIndex < group.levels.length - 1) {
            selectModule(currentIndex + 1);
        }
    };

    if (!group) {
        return null;
    }
    const cellStatus = isModule
        ? Array(group.levels.length - 1).fill(false).map((item, idx) => currentIndex > idx)
        : Array(cg.fullSetGroup.length - 1).fill(false).map((item, idx) => currentIndex > idx);

    return (
        <div id="mobile-category-editor" className={clsx(active && 'active')}>
            <button
                type="button"
                className={clsx('minus', currentIndex === 0 && 'disabled')}
                onClick={decreaseModule}
            >
                <em />
            </button>
            {
                cellStatus.map((itemActive, idx) => (
                    <button
                        key={idx}
                        type="button"
                        className={clsx('level', itemActive && 'active')}
                        onClick={() => selectModule(idx + 1)}
                    >
                        <em />
                    </button>
                ))
            }
            <button
                type="button"
                className={clsx('plus', currentIndex === group.levels.length - 1 && 'disabled')}
                onClick={increaseModule}
            >
                <em />
            </button>
        </div>
    );
}
