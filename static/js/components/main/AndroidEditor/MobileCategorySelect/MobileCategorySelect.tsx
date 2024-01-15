import { AndroidConfig, AndroidEditorGroup, AndroidEditorGroupLevel } from '../../../../configs/AndroidConfigs';
import { CategoryButton } from './CategoryButton';
import './CategorySelect.scss';

interface CategorySelectProps {
    config: AndroidConfig,
    onSelect: (index: number) => void,
    state: number[],
    isModule:boolean,
}

export function MobileCategorySelect({
    onSelect, config, state, isModule,
}: CategorySelectProps) {
    return (

        isModule
            ? (
                <>
                    { config.groups.map((cg: AndroidEditorGroup, idx: number) => (
                        <CategoryButton
                            key={cg.name}
                            index={state[idx]}
                            right={false}
                            config={cg}
                            onSelect={() => (cg.disabled ? null : onSelect(idx))}
                            isModule={isModule}
                        />
                    ))}
                </>
            )
            : (
                <>
                    {config.fullSetGroup.map((cg: AndroidEditorGroupLevel, idx: number) => (
                        <CategoryButton
                            key={idx}
                            index={state[idx]}
                            right={false}
                            fullSetConfig={cg}
                            isModule={isModule}
                            onSelect={() => onSelect(idx)}
                        />
                    ))}
                </>
            )

    );
}
