import clsx from 'clsx';
import { useRef, useState } from 'react';
import { blocks } from '../../../../configs/Faq';
import { SoundManager, SoundType } from '../../../../sounds/SoundManager';

interface PillsProps {
    index: number,
    onIndexChange: (index: number) => void;
}

export function ScrollablePills({ index, onIndexChange }: PillsProps) {
    const [prevIndex, setPrevIndex] = useState(-1);
    const [direction, setDirection] = useState(0);
    const [animate, setAnimate] = useState(true);
    const [key, setKey] = useState(0);
    const lastTimeRef = useRef<number>(0);

    const scrollIndex = (direction: number) => {
        const time = performance.now();
        if (time - lastTimeRef.current < 500) {
            return;
        }
        lastTimeRef.current = time;

        let newIndex = (index + 1) % blocks.length;
        if (direction < 0) {
            newIndex = index - 1;
            if (newIndex < 0) {
                newIndex = blocks.length - 1;
            }
        }
        setDirection(direction);
        setPrevIndex(index);
        onIndexChange(newIndex);
        setKey(Math.random());
        setAnimate(false);
        SoundManager.play(SoundType.Button);
        SoundManager.play(SoundType.ButtonHover);

        setTimeout(() => {
            setAnimate(true);
        }, 5);
    };

    return (
        <div className="scroll-pills" key={key}>
            <div className={clsx(
                'item',
                !animate && (direction > 0 ? 'right' : 'left'),
            )}
            >
                {blocks[index].title}
            </div>
            {
                prevIndex !== -1 && (
                    <div className={clsx(
                        'item',
                        animate && (direction > 0 ? 'left' : 'right'),
                    )}
                    >
                        {blocks[prevIndex].title}
                    </div>
                )
            }
            <div className="arrow left" onClick={() => scrollIndex(-1)} />
            <div className="arrow right" onClick={() => scrollIndex(1)} />
        </div>
    );
}
