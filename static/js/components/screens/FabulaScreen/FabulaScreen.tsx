import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { PopupOverlay } from '../../../enums/PopupOverlay';
import { useInterval } from '../../../hooks/useInterval';
import { setCurrentOverlay } from '../../../store/page';
import { Button } from '../../shared/Button/Button';
import './FabulaScreen.scss';

export function FabulaScreen() {
    const [number, setNumber] = useState(0);
    const [numberBot, setNumberBot] = useState(0);
    const [animate, setAnimate] = useState(true);

    useEffect(() => {
        const time = animate ? 1000 : 2500;
        const t = setTimeout(() => {
            setAnimate(!animate);
        }, time);

        let raf = 0;
        if (animate) {
            const animFunc = () => {
                raf = requestAnimationFrame(animFunc);
                const topNumber = Math.floor(Math.random() * 824) + 39;
                const bottomNumber = (12 * topNumber) - 364;

                setNumber(topNumber);
                setNumberBot(bottomNumber);
            };
            animFunc();
        }

        return () => {
            cancelAnimationFrame(raf);
            clearTimeout(t);
        };
    }, [animate]);

    useInterval(() => {
        setAnimate(!animate);
    }, animate ? 1000 : 2500);

    return (
        <section id="fabula-screen">
            <div className="columns">
                <div className="left">
                    <div className="title">
                        Story
                    </div>
                    <p>
                        In the mid-19th century, art equaled the word elitism and inaccessibility - the average artist
                        spent 1000 hours of work and 10 years of special education
                        to create one work.
                    </p>
                    <div className="button-wrap">
                        <Button onClick={() => setCurrentOverlay(PopupOverlay.Story)}>
                            read more
                        </Button>
                    </div>
                </div>

                <div className={clsx('right')}>
                    <div className="types">
                        {/* {rightText[currentSlide].title} */}
                        {number}
                        {' '}
                        years ago one picture
                        <br />
                        per number of people
                    </div>
                    <div className="counter">
                        {/* {rightText[currentSlide].sub} */}
                        {numberBot}
                    </div>
                </div>

                {/* <div className="right"> */}
                {/*    <div className="types"> */}
                {/*        200 years ago one picture */}
                {/*        <br /> */}
                {/*        per number of people */}
                {/*    </div> */}
                {/*    <div className="counter"> */}
                {/*        480 */}
                {/*    </div> */}
                {/* </div> */}
            </div>
        </section>
    );
}
