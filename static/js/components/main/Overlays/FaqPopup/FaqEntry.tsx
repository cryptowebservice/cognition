import clsx from 'clsx';
import {
    MouseEvent, useEffect, useRef, useState,
} from 'react';
import { FaqEntry as Entry } from '../../../../configs/Faq';
import { SoundManager, SoundType } from '../../../../sounds/SoundManager';
import { OutlineDots } from '../../../shared/OutlineDots/OutlineDots';

interface EntryProps {
    entry: Entry,
    active: boolean,
    isOpened: boolean,
    onSelect: () => void
}

export function FaqEntry({
    entry, active, onSelect, isOpened,
}: EntryProps) {
    const blockRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const [initialHeight, setInitialHeight] = useState(0);
    const [contentHeight, setContentHeight] = useState(0);
    const [height, setHeight] = useState(0);

    useEffect(() => {
        if (!blockRef.current || !contentRef.current) return;
        setInitialHeight(blockRef.current.clientHeight);
        setContentHeight(contentRef.current.clientHeight);
    }, [blockRef, contentRef]);

    useEffect(() => {
        setHeight(active ? initialHeight + contentHeight : initialHeight);
    }, [initialHeight, active]);

    const parseWithAccent = (line: string) => {
        const contentArr = line.split('~');
        const content: any[] = [];

        contentArr.forEach((el, i) => {
            if (i % 2 === 0) {
                content.push(el);
            } else {
                content.push(<span>{el}</span>);
            }
        });
        return content;
    };

    const items = [];
    let idx = 0;
    if (Array.isArray(entry.content)) {
        for (const line of entry.content) {
            if (Array.isArray(line)) {
                let subIdx = 0;
                const subItems = line.map((l) => {
                    const pos = l.indexOf(' ');
                    const content = parseWithAccent(l.substring(pos + 1));
                    subIdx++;
                    return (
                        <li key={subIdx}>
                            <span>
                                {`${l.substring(0, pos)} `}
                            </span>
                            {content}
                        </li>
                    );
                });
                items.push(<ul key={idx}>{subItems}</ul>);
                idx++;
            } else {
                if (line.includes('~')) {
                    const content = parseWithAccent(line);
                    items.push(<p key={idx}>{content}</p>);
                } else {
                    items.push(<p key={idx}>{line}</p>);
                }
                idx++;
            }
        }
    } else {
        if (entry.content.includes('~')) {
            const content = parseWithAccent(entry.content);
            items.push(<p key={idx}>{content}</p>);
        } else {
            items.push(<p key={idx}>{entry.content}</p>);
        }

        idx++;
    }

    const onClick = (e: MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        SoundManager.play(SoundType.Button);
        onSelect();
    };

    return (
        <div
            className={clsx('entry', 'clickable', active && 'active')}
            ref={blockRef}
            key={entry.title}
            onClick={onClick}
            style={{
                height: height || 'auto',
            }}
        >
            <div className={clsx('entry__title', (isOpened && !active) ? 'disabled' : '')}>
                {entry.title}
            </div>
            <div className="entry__content">
                <div className="entry__sub" ref={contentRef}>
                    {items}
                </div>
            </div>
            <div className="chevron" />
            <OutlineDots active={active} noBackground />
        </div>
    );
}
