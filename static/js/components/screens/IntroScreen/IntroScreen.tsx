import clsx from 'clsx';
import { useStore } from 'effector-react';
import { useEffect, useState } from 'react';
import { CURRENT_ACCENT } from '../../../graphics/helpers/LandingTheme';
import { loadingCompleteStore, loadingStore, loadingTotalStore } from '../../../store/loading';
import { Button } from '../../shared/Button/Button';
import './IntroScreen.scss';

interface ScreenProps {
    onIndexButton?: () => void
}

export function IntroScreen(props: ScreenProps) {
    const loadingTotal = useStore(loadingTotalStore);
    const loading = useStore(loadingStore);
    const loadingComplete = useStore(loadingCompleteStore);
    const [appear, setAppear] = useState(false);
    // const [titleGlitch, setTitleGlitch] = useState(false);
    // setTimeout(() => {
    //     setTitleGlitch(true);
    // }, 5000);

    const {
        onIndexButton,
    } = props;
    const buttonClick = () => {
        if (onIndexButton) {
            onIndexButton();
        }
    };
    useEffect(() => {
        if (loadingTotal === 0 || loading < loadingTotal || !loadingComplete) {
            return;
        }
        const timeout = setTimeout(() => {
            setAppear(true);
        }, 500);

        return () => {
            if (timeout) {
                clearTimeout(timeout);
            }
        };
    }, [loading, loadingTotal, loadingComplete]);

    const title = 'New Era';

    // Верстка-версточка
    return (
        <section id="intro-screen">
            <div className={clsx('wrapper', !appear && 'hidden')}>
                <div className="pad-top" />
                <div className={clsx('title')}>
                    <div className="lines-top">
                        <div className="lines-top__left">
                            <svg
                                width="392"
                                height="23"
                                viewBox="0 0 392 23"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M247.236 7.52787L247.683 7.75148L247.236 7.52787ZM242.764 16.4721L242.317 16.2485L242.764 16.4721ZM0 21.5H233.82V22.5H0V21.5ZM242.317 16.2485L246.789 7.30426L247.683 7.75148L243.211 16.6957L242.317 16.2485ZM256.18 1.5H360V2.5H256.18V1.5ZM246.789 7.30426C248.567 3.74703 252.203 1.5 256.18 1.5V2.5C252.582 2.5 249.293 4.53303 247.683 7.75148L246.789 7.30426ZM233.82 21.5C237.418 21.5 240.707 19.467 242.317 16.2485L243.211 16.6957C241.433 20.253 237.797 22.5 233.82 22.5V21.5Z"
                                    fill="url(#paint0_linear_1343_32674)"
                                />
                                <rect width="3" height="3" rx="1.5" transform="matrix(-1 0 0 1 383 0.5)" fill="white" />
                                <rect width="3" height="3" rx="1.5" transform="matrix(-1 0 0 1 392 0.5)" fill="white" />
                                <defs>
                                    <linearGradient
                                        id="paint0_linear_1343_32674"
                                        x1="350"
                                        y1="21.9998"
                                        x2="2.00945e-05"
                                        y2="21.9999"
                                        gradientUnits="userSpaceOnUse"
                                    >
                                        <stop stopColor={CURRENT_ACCENT()} />
                                        <stop offset="1" stopColor={CURRENT_ACCENT()} stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                            </svg>
                        </div>
                        <div className="lines-top__right">
                            <svg
                                width="392"
                                height="23"
                                viewBox="0 0 392 23"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M144.764 7.52787L144.317 7.75148L144.764 7.52787ZM149.236 16.4721L149.683 16.2485L149.236 16.4721ZM392 21.5H158.18V22.5H392V21.5ZM149.683 16.2485L145.211 7.30426L144.317 7.75148L148.789 16.6957L149.683 16.2485ZM135.82 1.5H32V2.5H135.82V1.5ZM145.211 7.30426C143.433 3.74703 139.797 1.5 135.82 1.5V2.5C139.418 2.5 142.707 4.53303 144.317 7.75148L145.211 7.30426ZM158.18 21.5C154.582 21.5 151.293 19.467 149.683 16.2485L148.789 16.6957C150.567 20.253 154.203 22.5 158.18 22.5V21.5Z"
                                    fill="url(#paint0_linear_1343_32680)"
                                />
                                <rect x="9" y="0.5" width="3" height="3" rx="1.5" fill="white" />
                                <rect y="0.5" width="3" height="3" rx="1.5" fill="white" />
                                <defs>
                                    <linearGradient
                                        id="paint0_linear_1343_32680"
                                        x1="42"
                                        y1="21.9998"
                                        x2="392"
                                        y2="21.9999"
                                        gradientUnits="userSpaceOnUse"
                                    >
                                        <stop stopColor={CURRENT_ACCENT()} />
                                        <stop offset="1" stopColor={CURRENT_ACCENT()} stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                            </svg>

                        </div>
                    </div>
                    <h1 className={clsx(!appear && 'hidden')}>
                        {/* eslint-disable-next-line array-callback-return */}
                        {/* <GlitchText text={title} active={titleGlitch} onReady={() => console.log(1)} /> */}
                        {title.split('').map((el, index) => <span key={index}>{el}</span>)}
                    </h1>
                    <div className="lines-bottom">
                        <svg
                            width="630"
                            height="23"
                            viewBox="0 0 630 23"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M187.236 15.4721L187.683 15.2485L187.236 15.4721ZM182.764 6.52786L182.317 6.75147L182.764 6.52786ZM0 1.5H173.82V0.5H0V1.5ZM182.317 6.75147L186.789 15.6957L187.683 15.2485L183.211 6.30426L182.317 6.75147ZM196.18 21.5H289V20.5H196.18V21.5ZM186.789 15.6957C188.567 19.253 192.203 21.5 196.18 21.5V20.5C192.582 20.5 189.293 18.467 187.683 15.2485L186.789 15.6957ZM173.82 1.5C177.418 1.5 180.707 3.53302 182.317 6.75147L183.211 6.30426C181.433 2.74702 177.797 0.5 173.82 0.5V1.5Z"
                                fill="url(#paint0_linear_1765_42575)"
                            />
                            <path
                                d="M442.764 15.4721L442.317 15.2485L442.764 15.4721ZM447.236 6.52786L447.683 6.75147L447.236 6.52786ZM630 1.5H456.18V0.5H630V1.5ZM447.683 6.75147L443.211 15.6957L442.317 15.2485L446.789 6.30426L447.683 6.75147ZM433.82 21.5H341V20.5H433.82V21.5ZM443.211 15.6957C441.433 19.253 437.797 21.5 433.82 21.5V20.5C437.418 20.5 440.707 18.467 442.317 15.2485L443.211 15.6957ZM456.18 1.5C452.582 1.5 449.293 3.53302 447.683 6.75147L446.789 6.30426C448.567 2.74702 452.203 0.5 456.18 0.5V1.5Z"
                                fill="url(#paint1_linear_1765_42575)"
                            />
                            <rect
                                x="312"
                                y="22.5"
                                width="3"
                                height="3"
                                rx="1.5"
                                transform="rotate(-180 312 22.5)"
                                fill="white"
                            />
                            <rect
                                x="321"
                                y="22.5"
                                width="3"
                                height="3"
                                rx="1.5"
                                transform="rotate(-180 321 22.5)"
                                fill="white"
                            />
                            <defs>
                                <linearGradient
                                    id="paint0_linear_1765_42575"
                                    x1="280.972"
                                    y1="1.00016"
                                    x2="1.61314e-05"
                                    y2="1.0001"
                                    gradientUnits="userSpaceOnUse"
                                >
                                    <stop stopColor={CURRENT_ACCENT()} />
                                    <stop offset="1" stopColor={CURRENT_ACCENT()} stopOpacity={0} />
                                </linearGradient>
                                <linearGradient
                                    id="paint1_linear_1765_42575"
                                    x1="349.028"
                                    y1="1.00016"
                                    x2="630"
                                    y2="1.0001"
                                    gradientUnits="userSpaceOnUse"
                                >
                                    <stop stopColor={CURRENT_ACCENT()} />
                                    <stop offset="1" stopColor={CURRENT_ACCENT()} stopOpacity={0} />
                                </linearGradient>
                            </defs>
                        </svg>
                    </div>
                </div>
                <div className="sub-text">
                    <p>
                        <span className={clsx(!appear && 'hidden')}>Androids are humanity&apos;s last hope. Their purpose is&nbsp;to&nbsp;define a&nbsp;new era of&nbsp;art.</span>
                    </p>
                    <Button onClick={buttonClick}>
                        OPEN DAPP
                    </Button>
                </div>
            </div>
        </section>
    );
}
